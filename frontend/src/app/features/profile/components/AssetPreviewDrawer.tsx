import { Archive, ArrowRight, Copy, Download, History, Star, Trash2, X } from 'lucide-react';
import { type Dispatch } from 'react';
import { toast } from 'sonner';
import { Tag } from '@/app/components/PageShell';
import type { ProfileAction } from '../store';
import type { ProfileAsset } from '../types';
import { assetStatusLabels, assetStatusTones, assetTypeLabels, buildAssetMarkdown, downloadTextFile, formatDateTime } from '../utils';

export function AssetPreviewDrawer({
  asset,
  dispatch,
  onClose,
  onNavigate,
  onShowVersions,
}: {
  asset: ProfileAsset | null;
  dispatch: Dispatch<ProfileAction>;
  onClose: () => void;
  onNavigate: (path: string, message: string) => void;
  onShowVersions: (asset: ProfileAsset) => void;
}) {
  if (!asset) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${asset.sourcePath}&asset=${asset.id}`);
      toast.success('已复制链接');
    } catch {
      toast.error('复制失败，请检查浏览器权限');
    }
  };

  const deleteAsset = () => {
    if (!window.confirm(`确认删除“${asset.title}”？这是演示删除，会从当前资产列表隐藏。`)) return;
    dispatch({ type: 'deleteAsset', assetId: asset.id });
    toast.success('资产已删除');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[560px] max-w-[96vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Tag tone="blue">{assetTypeLabels[asset.type]}</Tag>
              <Tag tone={assetStatusTones[asset.status]}>{assetStatusLabels[asset.status]}</Tag>
              <Tag>{asset.format}</Tag>
              {asset.favorited && <Tag tone="amber">已收藏</Tag>}
            </div>
            <h2 className="mt-2 break-words text-base font-semibold text-slate-900">{asset.title}</h2>
            <p className="mt-1 text-xs text-slate-500">{asset.sourceModule} · {formatDateTime(asset.updatedAt)}</p>
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

          <section>
            <h3 className="text-sm font-semibold text-slate-900">标签</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {asset.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            {[
              ['版本', asset.version],
              ['来源模块', asset.sourceModule],
              ['继续编辑路径', asset.sourcePath],
              ['创建时间', formatDateTime(asset.createdAt)],
            ].map(([key, value]) => (
              <div key={key} className="rounded-lg border border-slate-100 bg-white p-3">
                <p className="text-xs text-slate-500">{key}</p>
                <p className="mt-1 break-words text-sm font-medium text-slate-900">{value}</p>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">元数据</h3>
            <dl className="mt-2 grid gap-2 sm:grid-cols-2">
              {Object.entries(asset.metadata).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-50 px-3 py-2">
                  <dt className="text-xs text-slate-500">{key}</dt>
                  <dd className="mt-1 break-words text-sm text-slate-800">
                    {Array.isArray(value) ? value.join('、') : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <footer className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-2">
          <button
            onClick={() => onNavigate(asset.sourcePath, '已跳转到来源模块（演示上下文）')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            <ArrowRight className="h-4 w-4" />
            继续编辑
          </button>
          <button onClick={copyLink} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            <Copy className="h-4 w-4" />
            复制链接
          </button>
          <button
            onClick={() => {
              downloadTextFile(`${asset.title}.md`, buildAssetMarkdown(asset));
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
          <button
            onClick={() => {
              onShowVersions(asset);
              toast.success('已打开版本历史');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <History className="h-4 w-4" />
            查看版本
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'toggleAssetArchive', assetId: asset.id });
              toast.success(asset.archived ? '资产已恢复' : '资产已归档');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Archive className="h-4 w-4" />
            {asset.archived ? '取消归档' : '归档'}
          </button>
          <button
            onClick={deleteAsset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-50 sm:col-span-2"
          >
            <Trash2 className="h-4 w-4" />
            删除资产
          </button>
        </footer>
      </aside>
    </>
  );
}
