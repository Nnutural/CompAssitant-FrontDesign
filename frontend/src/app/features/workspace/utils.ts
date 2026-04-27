import type {
  ActionStatus,
  AssetStatus,
  AssetType,
  AutosaveStatus,
  DataSourceHealth,
  DeadlineStatus,
  DeadlineUrgency,
  InsightItem,
  Priority,
  RecentAsset,
  WorkspaceDashboard,
  WorkspaceModule,
} from './types';
import { pushTaskImport } from '@/app/features/tasks/taskBridge';
import type { TaskImportPayload, TaskModule } from '@/app/features/tasks/types';

export const moduleLabels: Record<WorkspaceModule, string> = {
  writing: '选题写作',
  research: '科研创新',
  careers: '就业招聘',
  forum: '交流论坛',
  chat: '智能问答',
  tasks: '计划任务',
  practice: '实战进阶',
  profile: '个人中心',
};

export const priorityLabels: Record<Priority, string> = {
  high: '高优',
  medium: '中优',
  low: '低优',
};

export const priorityRank: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const urgencyLabels: Record<DeadlineUrgency, string> = {
  critical: '极紧急',
  high: '紧急',
  medium: '本月',
  low: '关注',
};

export const urgencyRank: Record<DeadlineUrgency, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const deadlineStatusLabels: Record<DeadlineStatus, string> = {
  active: '待处理',
  ignored: '已忽略',
  handled: '已处理',
};

export const actionStatusLabels: Record<ActionStatus, string> = {
  active: '待处理',
  started: '已开始',
  postponed: '稍后处理',
  dismissed: '已关闭',
  done: '已完成',
};

export const assetTypeLabels: Record<AssetType, string> = {
  document: '文档',
  ppt: 'PPT',
  report: '报告',
  canvas: '画布',
  code: '代码',
  note: '笔记',
};

export const assetStatusLabels: Record<AssetStatus, string> = {
  draft: '草稿',
  reviewing: '评审中',
  completed: '已完成',
};

export const dataSourceStatusLabels: Record<DataSourceHealth, string> = {
  fresh: '新鲜',
  warning: '需关注',
  outdated: '已过期',
  failed: '同步失败',
  syncing: '同步中',
};

export const autosaveLabels: Record<AutosaveStatus, string> = {
  saved: '已保存',
  saving: '保存中',
  unsaved: '未保存',
  error: '保存失败',
};

export function formatToday(date = new Date()): string {
  return new Intl.DateTimeFormat('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function getDashboardStats(dashboard: WorkspaceDashboard) {
  const unfinishedTasks = dashboard.tasks.filter((task) => !task.completed);
  const highPriorityTasks = unfinishedTasks.filter((task) => task.priority === 'high');
  const activeDeadlines = dashboard.deadlines.filter((deadline) => deadline.status === 'active');
  const activeActions = dashboard.recommendedActions.filter((action) => action.status === 'active');
  const completedTasks = dashboard.tasks.filter((task) => task.completed);
  const progress = dashboard.tasks.length
    ? Math.round((completedTasks.length / dashboard.tasks.length) * 100)
    : 0;

  return {
    unfinishedTaskCount: unfinishedTasks.length,
    highPriorityTaskCount: highPriorityTasks.length,
    activeDeadlineCount: activeDeadlines.length,
    activeActionCount: activeActions.length,
    completedTaskCount: completedTasks.length,
    progress,
    assetCount: dashboard.recentAssets.length,
    favoriteAssetCount: dashboard.favoriteAssetIds.length,
  };
}

export function getWeeklyRhythm(dashboard: WorkspaceDashboard) {
  const stats = getDashboardStats(dashboard);
  const activeDeadlines = dashboard.deadlines.filter((deadline) => deadline.status === 'active');
  const urgentPressure = Math.min(
    35,
    activeDeadlines.reduce((sum, deadline) => {
      if (deadline.daysLeft <= 3) return sum + 12;
      if (deadline.daysLeft <= 7) return sum + 8;
      if (deadline.daysLeft <= 30) return sum + 4;
      return sum + 1;
    }, 0),
  );
  const todayFocus = Math.max(8, Math.min(100, stats.progress + urgentPressure));

  return [
    { label: '周一', value: Math.min(100, 66 + stats.completedTaskCount * 4) },
    { label: '周二', value: Math.min(100, 58 + stats.progress / 3) },
    { label: '周三', value: Math.min(100, 70 + stats.highPriorityTaskCount * 3) },
    { label: '今日', value: Math.round(todayFocus) },
    { label: '周五', value: Math.max(12, 62 - urgentPressure + stats.completedTaskCount * 3) },
  ];
}

export function firstHighPriorityTask(dashboard: WorkspaceDashboard) {
  return dashboard.tasks.find((task) => !task.completed && task.priority === 'high')
    ?? dashboard.tasks.find((task) => !task.completed);
}

export function isDemoUrl(url: string): boolean {
  return !url || url.includes('example.com') || url.startsWith('#');
}

export function toneForPriority(priority: Priority): 'red' | 'amber' | 'blue' {
  if (priority === 'high') return 'red';
  if (priority === 'medium') return 'amber';
  return 'blue';
}

export function toneForUrgency(urgency: DeadlineUrgency): 'red' | 'amber' | 'blue' {
  if (urgency === 'critical' || urgency === 'high') return 'red';
  if (urgency === 'medium') return 'amber';
  return 'blue';
}

export function toneForDataSource(status: DataSourceHealth): 'green' | 'amber' | 'red' | 'blue' {
  if (status === 'fresh') return 'green';
  if (status === 'warning' || status === 'outdated') return 'amber';
  if (status === 'failed') return 'red';
  return 'blue';
}

export function buildAssetMarkdown(asset: RecentAsset): string {
  return [
    `# ${asset.title}`,
    '',
    `类型：${assetTypeLabels[asset.type]}`,
    `状态：${assetStatusLabels[asset.status]}`,
    `来源模块：${moduleLabels[asset.module]}`,
    '',
    '## 摘要',
    asset.summary,
    '',
    '## 内容预览',
    asset.contentPreview,
  ].join('\n');
}

export function buildInsightPrompt(item: InsightItem): string {
  if (item.type === 'policy') {
    return `请从网络空间安全学生项目角度解读政策：${item.title}。关注适用场景、合规要点、可引用表述和项目答辩风险。`;
  }
  return `请从网络空间安全学生项目角度分析热点：${item.title}。关注影响范围、可引用证据、可转化的选题/计划书素材和行动建议。`;
}

export function nextFreshnessScore(current: number): number {
  return Math.max(88, Math.min(100, current + 8 + Math.floor(Math.random() * 5)));
}

export function mergeUnique(values: string[], value: string): string[] {
  return values.includes(value) ? values : [...values, value];
}

export function removeValue(values: string[], value: string): string[] {
  return values.filter((item) => item !== value);
}

function mapWorkspaceModule(module: WorkspaceModule): TaskModule {
  if (module === 'tasks') return 'workspace';
  return module;
}

export function pushWorkspaceTaskImport(input: {
  title: string;
  description: string;
  module: WorkspaceModule;
  sourceLabel: string;
  sourcePath: string;
  priority: Priority;
  dueDate?: string;
  tags?: string[];
  relatedObjectId?: string;
}) {
  const payload: TaskImportPayload = {
    title: input.title,
    description: input.description,
    module: mapWorkspaceModule(input.module),
    sourceLabel: input.sourceLabel,
    sourcePath: input.sourcePath,
    priority: input.priority,
    dueDate: input.dueDate,
    tags: input.tags ?? ['总览导入'],
    relatedObjectId: input.relatedObjectId,
  };
  pushTaskImport(payload);
}
