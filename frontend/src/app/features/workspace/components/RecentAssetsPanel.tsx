import { useMemo, useState, type Dispatch } from 'react';
import { ArrowRight, Copy, Download, Eye, FileText, Star } from 'lucide-react';
import { toast } from 'sonner';

import { Card, Tag } from '@/app/components/PageShell';

import type { WorkspaceAction } from '../store';
import type { AssetType, RecentAsset, WorkspaceDashboard } from '../types';
import {
  assetStatusLabels,
  assetTypeLabels,
  buildAssetMarkdown,
  moduleLabels,
} from '../utils';
import { AssetPreviewDrawer } from './AssetPreviewDrawer';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';

type AssetFilter = 'all' | AssetType;
type AssetSort = 'updated' | 'type' | 'status';

const filters: { key: AssetFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'document', label: '文档' },
  { key: 'ppt', label: 'PPT' },
  { key: 'report', label: '报告' },
  { key: 'canvas', label: '画布' },
  { key: 'note', label: '笔记' },
];

function downloadMarkdown(asset: RecentAsset) {
  const blob = new Blob([buildAssetMarkdown(asset)], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${asset.title}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

export function RecentAssetsPanel({
  dashboard,
  dispatch,
  onNavigate,
}: {
  dashboard: WorkspaceDashboard;
  dispatch: Dispatch<WorkspaceAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  const [filter, setFilter] = useState<AssetFilter>('all');
  const [sort, setSort] = useState<AssetSort>('updated');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const assets = useMemo(() => {
    return dashboard.recentAssets
      .filter((asset) => filter === 'all' || asset.type === filter)
      .sort((a, b) => {
        if (sort === 'type') return assetTypeLabels[a.type].localeCompare(assetTypeLabels[b.type], 'zh-CN');
        if (sort === 'status') return assetStatusLabels[a.status].localeCompare(assetStatusLabels[b.status], 'zh-CN');
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [dashboard.recentAssets, filter, sort]);

  const selectedAsset = dashboard.recentAssets.find((asset) => asset.id === selectedAssetId) ?? null;

  const copyLink = async (asset: RecentAsset) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${asset.targetPath}&asset=${asset.id}`);
      toast.success('已复制链接');
    } catch {
      toast.error('复制失败，请检查浏览器权限');
    }
  };

  return (
    <>
      <Card
        title="最近生成物"
        subtitle="筛选、预览、导出或跳转到对应模块继续编辑"
        right={
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as AssetSort)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
          >
            <option value="updated">最近更新</option>
            <option value="type">类型</option>
            <option value="status">状态</option>
          </select>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                filter === item.key
                  ? 'bg-brand-blue-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {assets.length === 0 ? (
          <WorkspaceEmptyState title="暂无生成物" description="当前筛选条件下没有资产。" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[780px] w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="py-3 text-left font-normal">标题</th>
                  <th className="text-left font-normal">类型</th>
                  <th className="text-left font-normal">模块</th>
                  <th className="text-left font-normal">更新时间</th>
                  <th className="text-left font-normal">状态</th>
                  <th className="text-right font-normal">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="font-medium text-slate-900">{asset.title}</span>
                        {asset.favorited && <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-500" />}
                      </div>
                    </td>
                    <td><Tag tone="blue">{assetTypeLabels[asset.type]}</Tag></td>
                    <td className="text-slate-500">{moduleLabels[asset.module]}</td>
                    <td className="text-slate-500">{new Date(asset.updatedAt).toLocaleString('zh-CN')}</td>
                    <td><Tag>{assetStatusLabels[asset.status]}</Tag></td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedAssetId(asset.id);
                            toast.success('已打开资产预览');
                          }}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                          title="打开预览"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onNavigate(asset.targetPath, '已跳转继续编辑，并携带资产上下文')}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                          title="继续编辑"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => copyLink(asset)}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                          title="复制链接"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            downloadMarkdown(asset);
                            toast.success('已导出 Markdown');
                          }}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                          title="导出 Markdown"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            dispatch({ type: 'toggleAssetFavorite', assetId: asset.id });
                            toast.success(asset.favorited ? '已取消收藏资产' : '已收藏资产');
                          }}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100"
                          title={asset.favorited ? '取消收藏' : '收藏'}
                        >
                          <Star className={`h-4 w-4 ${asset.favorited ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AssetPreviewDrawer
        asset={selectedAsset}
        onClose={() => setSelectedAssetId(null)}
        dispatch={dispatch}
        onNavigate={onNavigate}
      />
    </>
  );
}
