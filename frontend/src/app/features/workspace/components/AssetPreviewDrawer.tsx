import type { Dispatch } from 'react';
import { ArrowRight, Copy, Download, Star, X } from 'lucide-react';
import { toast } from 'sonner';

import { Tag } from '@/app/components/PageShell';

import type { WorkspaceAction } from '../store';
import type { RecentAsset } from '../types';
import { assetStatusLabels, assetTypeLabels, buildAssetMarkdown, moduleLabels } from '../utils';

function downloadMarkdown(asset: RecentAsset) {
  const blob = new Blob([buildAssetMarkdown(asset)], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${asset.title}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

export function AssetPreviewDrawer({
  asset,
  onClose,
  dispatch,
  onNavigate,
}: {
  asset: RecentAsset | null;
  onClose: () => void;
  dispatch: Dispatch<WorkspaceAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  if (!asset) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${asset.targetPath}&asset=${asset.id}`);
      toast.success('已复制链接');
    } catch {
      toast.error('复制失败，请检查浏览器权限');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[500px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Tag tone="blue">{assetTypeLabels[asset.type]}</Tag>
              <Tag>{assetStatusLabels[asset.status]}</Tag>
            </div>
            <h2 className="mt-2 text-base font-semibold text-slate-900">{asset.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">摘要</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{asset.summary}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">内容预览</h3>
            <div className="mt-2 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {asset.contentPreview}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-white p-3">
              <p className="text-xs text-slate-500">来源模块</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{moduleLabels[asset.module]}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-white p-3">
              <p className="text-xs text-slate-500">继续编辑路径</p>
              <p className="mt-1 truncate text-sm font-medium text-slate-900">{asset.targetPath}</p>
            </div>
          </section>
        </div>

        <footer className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-2">
          <button
            onClick={() => onNavigate(asset.targetPath, '已跳转继续编辑，并携带资产上下文')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            继续编辑
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={copyLink}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Copy className="h-4 w-4" />
            复制链接
          </button>
          <button
            onClick={() => {
              downloadMarkdown(asset);
              toast.success('已导出 Markdown');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            导出 Markdown
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'toggleAssetFavorite', assetId: asset.id });
              toast.success(asset.favorited ? '已取消收藏资产' : '已收藏资产');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Star className={`h-4 w-4 ${asset.favorited ? 'fill-amber-400 text-amber-500' : ''}`} />
            {asset.favorited ? '取消收藏' : '收藏'}
          </button>
        </footer>
      </aside>
    </>
  );
}
