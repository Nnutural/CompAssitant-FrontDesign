import { Archive, ArrowRight, Copy, Download, Eye, FileText, FolderArchive, Presentation, Code2, Award, Star, Trash2 } from 'lucide-react';
import { useMemo, useState, type Dispatch, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import type { ProfileAction } from '../store';
import { defaultAssetFilters } from '../store';
import type { AssetFilters, ProfileAsset, ProfileWorkspace } from '../types';
import {
  activeAssets,
  assetStatusLabels,
  assetStatusTones,
  assetTypeLabels,
  buildAssetMarkdown,
  computeProfileStats,
  downloadTextFile,
  filterAndSortAssets,
  formatDateTime,
  sourceModulesFromAssets,
} from '../utils';
import { AssetPreviewDrawer } from './AssetPreviewDrawer';
import { AssetVersionDrawer } from './AssetVersionDrawer';
import { ProfileEmptyState } from './ProfileEmptyState';

export function AssetVaultPanel({
  workspace,
  dispatch,
  onNavigate,
}: {
  workspace: ProfileWorkspace;
  dispatch: Dispatch<ProfileAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  const assets = activeAssets(workspace);
  const [filters, setFilters] = useState<AssetFilters>(defaultAssetFilters);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [versionAsset, setVersionAsset] = useState<ProfileAsset | null>(null);
  const stats = computeProfileStats(workspace);
  const sourceModules = sourceModulesFromAssets(assets);

  const filteredAssets = useMemo(() => filterAndSortAssets(assets, filters), [assets, filters]);
  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) ?? null;

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <StatCard label="文档资产" value={stats.documentCount} icon={FileText} />
          <StatCard label="演示资产" value={stats.slidesCount} icon={Presentation} />
          <StatCard label="代码资产" value={stats.codeCount} icon={Code2} />
          <StatCard label="证明材料" value={stats.proofCount} icon={Award} />
          <StatCard label="收藏资产" value={stats.favoriteCount} icon={Star} />
          <StatCard label="归档资产" value={stats.archivedCount} icon={FolderArchive} />
        </div>

        <Card title="个人资产库" subtitle="搜索、筛选、排序并管理个人沉淀资产">
          <AssetToolbar
            filters={filters}
            onChange={setFilters}
            sourceModules={sourceModules}
          />

          {filteredAssets.length === 0 ? (
            <ProfileEmptyState title="暂无匹配资产" description="调整搜索或筛选条件后再试。" />
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-500">
                    <th className="py-3 text-left font-normal">资产</th>
                    <th className="text-left font-normal">类型</th>
                    <th className="text-left font-normal">来源</th>
                    <th className="text-left font-normal">状态</th>
                    <th className="text-left font-normal">更新时间</th>
                    <th className="text-right font-normal">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50">
                      <td className="py-3 pr-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-slate-900">{asset.title}</span>
                              {asset.favorited && <Star className="h-4 w-4 fill-amber-400 text-amber-500" />}
                            </div>
                            <p className="mt-1 line-clamp-1 text-xs text-slate-500">{asset.summary}</p>
                          </div>
                        </div>
                      </td>
                      <td><Tag tone="blue">{assetTypeLabels[asset.type]}</Tag></td>
                      <td className="text-slate-500">{asset.sourceModule}</td>
                      <td><Tag tone={assetStatusTones[asset.status]}>{assetStatusLabels[asset.status]}</Tag></td>
                      <td className="text-slate-500">{formatDateTime(asset.updatedAt)}</td>
                      <td>
                        <AssetRowActions
                          asset={asset}
                          dispatch={dispatch}
                          onPreview={() => {
                            setSelectedAssetId(asset.id);
                            toast.success('已打开资产预览');
                          }}
                          onNavigate={onNavigate}
                          onShowVersions={() => {
                            setVersionAsset(asset);
                            toast.success('已打开版本历史');
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <AssetPreviewDrawer
        asset={selectedAsset}
        dispatch={dispatch}
        onClose={() => setSelectedAssetId(null)}
        onNavigate={onNavigate}
        onShowVersions={setVersionAsset}
      />
      <AssetVersionDrawer asset={versionAsset} onClose={() => setVersionAsset(null)} />
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FileText;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
      </div>
    </Card>
  );
}

function AssetToolbar({
  filters,
  onChange,
  sourceModules,
}: {
  filters: AssetFilters;
  onChange: (filters: AssetFilters) => void;
  sourceModules: string[];
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(4,minmax(120px,160px))]">
      <input
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="搜索标题、标签、来源模块"
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
      />
      <select value={filters.type} onChange={(event) => onChange({ ...filters, type: event.target.value as AssetFilters['type'] })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
        <option value="all">全部类型</option>
        <option value="document">文档</option>
        <option value="slides">演示</option>
        <option value="code">代码</option>
        <option value="proof">证明</option>
      </select>
      <select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value as AssetFilters['status'] })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
        <option value="all">全部状态</option>
        <option value="draft">草稿</option>
        <option value="reviewing">审核中</option>
        <option value="completed">已完成</option>
        <option value="archived">已归档</option>
      </select>
      <select value={filters.sourceModule} onChange={(event) => onChange({ ...filters, sourceModule: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
        <option value="all">全部来源</option>
        {sourceModules.map((module) => <option key={module} value={module}>{module}</option>)}
      </select>
      <select value={filters.sort} onChange={(event) => onChange({ ...filters, sort: event.target.value as AssetFilters['sort'] })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
        <option value="updated">最近更新</option>
        <option value="created">创建时间</option>
        <option value="type">类型</option>
        <option value="status">状态</option>
      </select>
      <div className="flex flex-wrap gap-2 lg:col-span-5">
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
          <input type="checkbox" checked={filters.onlyFavorites} onChange={(event) => onChange({ ...filters, onlyFavorites: event.target.checked })} />
          仅看收藏
        </label>
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600">
          <input type="checkbox" checked={filters.includeArchived} onChange={(event) => onChange({ ...filters, includeArchived: event.target.checked })} />
          包含归档
        </label>
      </div>
    </div>
  );
}

export function AssetRowActions({
  asset,
  dispatch,
  onPreview,
  onNavigate,
  onShowVersions,
}: {
  asset: ProfileAsset;
  dispatch: Dispatch<ProfileAction>;
  onPreview: () => void;
  onNavigate: (path: string, message: string) => void;
  onShowVersions: () => void;
}) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${asset.sourcePath}&asset=${asset.id}`);
      toast.success('已复制链接');
    } catch {
      toast.error('复制失败，请检查浏览器权限');
    }
  };

  return (
    <div className="flex justify-end gap-1.5">
      <IconButton title="预览" onClick={onPreview}><Eye className="h-4 w-4" /></IconButton>
      <IconButton title="继续编辑" onClick={() => onNavigate(asset.sourcePath, '已跳转到来源模块（演示上下文）')}><ArrowRight className="h-4 w-4" /></IconButton>
      <IconButton title="复制链接" onClick={copyLink}><Copy className="h-4 w-4" /></IconButton>
      <IconButton
        title="导出 Markdown"
        onClick={() => {
          downloadTextFile(`${asset.title}.md`, buildAssetMarkdown(asset));
          toast.success('已导出 Markdown');
        }}
      >
        <Download className="h-4 w-4" />
      </IconButton>
      <IconButton
        title={asset.favorited ? '取消收藏' : '收藏'}
        onClick={() => {
          dispatch({ type: 'toggleAssetFavorite', assetId: asset.id });
          toast.success(asset.favorited ? '已取消收藏资产' : '已收藏资产');
        }}
      >
        <Star className={`h-4 w-4 ${asset.favorited ? 'fill-amber-400 text-amber-500' : ''}`} />
      </IconButton>
      <IconButton title="版本历史" onClick={onShowVersions}><Archive className="h-4 w-4" /></IconButton>
      <IconButton
        title={asset.archived ? '取消归档' : '归档'}
        onClick={() => {
          dispatch({ type: 'toggleAssetArchive', assetId: asset.id });
          toast.success(asset.archived ? '资产已恢复' : '资产已归档');
        }}
      >
        <FolderArchive className="h-4 w-4" />
      </IconButton>
      <IconButton
        title="删除"
        danger
        onClick={() => {
          if (!window.confirm(`确认删除“${asset.title}”？这是演示删除，会从当前资产列表隐藏。`)) return;
          dispatch({ type: 'deleteAsset', assetId: asset.id });
          toast.success('资产已删除');
        }}
      >
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </div>
  );
}

function IconButton({
  title,
  onClick,
  children,
  danger,
}: {
  title: string;
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg border p-1.5 transition-colors ${
        danger
          ? 'border-red-100 text-red-500 hover:bg-red-50'
          : 'border-slate-200 text-slate-500 hover:bg-slate-100'
      }`}
    >
      {children}
    </button>
  );
}
