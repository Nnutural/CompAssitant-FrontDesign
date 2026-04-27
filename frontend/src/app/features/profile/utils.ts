import type {
  AssetFilters,
  ProfileAsset,
  ProfileAssetStatus,
  ProfileAssetType,
  ProfileStats,
  ProfileWorkspace,
  SubmitChecklist,
  SubmitChecklistItem,
} from './types';

export const assetTypeLabels: Record<ProfileAssetType, string> = {
  document: '文档',
  slides: '演示',
  code: '代码',
  proof: '证明',
};

export const assetStatusLabels: Record<ProfileAssetStatus, string> = {
  draft: '草稿',
  reviewing: '审核中',
  completed: '已完成',
  archived: '已归档',
};

export const assetStatusTones: Record<ProfileAssetStatus, 'default' | 'blue' | 'green' | 'amber'> = {
  draft: 'default',
  reviewing: 'amber',
  completed: 'green',
  archived: 'default',
};

export const checklistStatusLabels: Record<SubmitChecklistItem['status'], string> = {
  ready: '已准备',
  missing: '缺失',
  reviewing: '准备中',
};

export const checklistStatusTones: Record<SubmitChecklistItem['status'], 'green' | 'red' | 'amber'> = {
  ready: 'green',
  missing: 'red',
  reviewing: 'amber',
};

export const autosaveLabels: Record<ProfileWorkspace['autosaveStatus'], string> = {
  saved: '已保存',
  saving: '保存中',
  unsaved: '未保存',
  error: '保存失败',
};

export function formatDateTime(value?: string): string {
  if (!value) return '暂无记录';
  return new Date(value).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(value?: string): string {
  if (!value) return '暂无日期';
  return new Date(value).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function activeAssets(workspace: ProfileWorkspace): ProfileAsset[] {
  return workspace.assets
    .filter((asset) => !workspace.deletedAssetIds.includes(asset.id))
    .map((asset) => ({
      ...asset,
      favorited: workspace.favoriteAssetIds.includes(asset.id),
      archived: workspace.archivedAssetIds.includes(asset.id),
      status: workspace.archivedAssetIds.includes(asset.id) ? 'archived' : asset.status,
    }));
}

export function calculateChecklistCompletionRate(items: SubmitChecklistItem[]): number {
  if (items.length === 0) return 0;
  const ready = items.filter((item) => item.status === 'ready').length;
  return Math.round((ready / items.length) * 100);
}

export function getChecklistMissingItems(checklist: SubmitChecklist): SubmitChecklistItem[] {
  return checklist.items.filter((item) => item.requirement === '必交' && item.status !== 'ready');
}

export function computeProfileStats(workspace: ProfileWorkspace): ProfileStats {
  const assets = activeAssets(workspace);
  const completenessSignals = [
    Boolean(workspace.user.displayName),
    Boolean(workspace.user.school),
    Boolean(workspace.user.college),
    Boolean(workspace.user.major),
    Boolean(workspace.user.grade),
    Boolean(workspace.user.goals),
    Boolean(workspace.user.weeklyHours),
    workspace.user.tags.length >= 5,
    workspace.capabilities.length >= 6,
    workspace.notificationSettings.some((setting) => setting.enabled),
  ];
  const profileCompleteness = Math.round(
    (completenessSignals.filter(Boolean).length / completenessSignals.length) * 100,
  );

  return {
    profileCompleteness,
    assetCount: assets.filter((asset) => !asset.archived).length,
    documentCount: assets.filter((asset) => asset.type === 'document' && !asset.archived).length,
    slidesCount: assets.filter((asset) => asset.type === 'slides' && !asset.archived).length,
    codeCount: assets.filter((asset) => asset.type === 'code' && !asset.archived).length,
    proofCount: assets.filter((asset) => asset.type === 'proof' && !asset.archived).length,
    favoriteCount: assets.filter((asset) => asset.favorited).length,
    archivedCount: assets.filter((asset) => asset.archived).length,
    notificationEnabledCount: workspace.notificationSettings.filter((setting) => setting.enabled).length,
  };
}

export function filterAndSortAssets(assets: ProfileAsset[], filters: AssetFilters): ProfileAsset[] {
  const query = filters.query.trim().toLowerCase();
  return assets
    .filter((asset) => filters.type === 'all' || asset.type === filters.type)
    .filter((asset) => filters.status === 'all' || asset.status === filters.status)
    .filter((asset) => !filters.sourceModule || filters.sourceModule === 'all' || asset.sourceModule === filters.sourceModule)
    .filter((asset) => !filters.onlyFavorites || asset.favorited)
    .filter((asset) => filters.includeArchived || !asset.archived)
    .filter((asset) => {
      if (!query) return true;
      const haystack = [asset.title, asset.sourceModule, asset.summary, asset.tags.join(' ')]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => {
      if (filters.sort === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filters.sort === 'type') return assetTypeLabels[a.type].localeCompare(assetTypeLabels[b.type], 'zh-CN');
      if (filters.sort === 'status') return assetStatusLabels[a.status].localeCompare(assetStatusLabels[b.status], 'zh-CN');
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

export function sourceModulesFromAssets(assets: ProfileAsset[]): string[] {
  return Array.from(new Set(assets.map((asset) => asset.sourceModule))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function buildAssetMarkdown(asset: ProfileAsset): string {
  const metadata = Object.entries(asset.metadata)
    .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join('、') : String(value)}`)
    .join('\n');

  return [
    `# ${asset.title}`,
    '',
    `- 类型：${assetTypeLabels[asset.type]} / ${asset.format}`,
    `- 来源：${asset.sourceModule}`,
    `- 路径：${asset.sourcePath}`,
    `- 状态：${assetStatusLabels[asset.status]}`,
    `- 版本：${asset.version}`,
    `- 更新时间：${formatDateTime(asset.updatedAt)}`,
    `- 标签：${asset.tags.join('、')}`,
    '',
    '## 摘要',
    asset.summary,
    '',
    '## 内容预览',
    asset.contentPreview,
    '',
    '## 元数据',
    metadata || '- 暂无',
  ].join('\n');
}

export function buildChecklistMarkdown(checklist: SubmitChecklist, assets: ProfileAsset[]): string {
  const rows = checklist.items.map((item) => {
    const asset = assets.find((candidate) => candidate.id === item.boundAssetId);
    return `- [${item.status === 'ready' ? 'x' : ' '}] ${item.title}（${item.requirement} / ${checklistStatusLabels[item.status]}）${asset ? `：${asset.title}` : ''}${item.note ? `；备注：${item.note}` : ''}`;
  });

  return [
    `# ${checklist.name}提交清单`,
    '',
    `- 场景：${checklist.scenario}`,
    `- 截止日期：${formatDate(checklist.deadline)}`,
    `- 完成率：${calculateChecklistCompletionRate(checklist.items)}%`,
    '',
    '## 材料项',
    ...rows,
    '',
    '## 提交记录',
    ...(checklist.submitHistory.length
      ? checklist.submitHistory.map((item) => `- ${formatDateTime(item.createdAt)}：${item.summary}`)
      : ['- 暂无提交记录']),
  ].join('\n');
}

export function downloadTextFile(fileName: string, content: string, type = 'text/markdown;charset=utf-8'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(fileName: string, data: unknown): void {
  downloadTextFile(fileName, JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
}

export function createDemoId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
