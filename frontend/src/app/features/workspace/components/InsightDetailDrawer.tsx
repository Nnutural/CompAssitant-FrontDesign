import { ArrowRight, Bot, ExternalLink, FilePlus2, Star, X } from 'lucide-react';
import { toast } from 'sonner';

import { Tag } from '@/app/components/PageShell';

import type { InsightItem } from '../types';
import { buildInsightPrompt, isDemoUrl, moduleLabels, pushWorkspaceTaskImport } from '../utils';

export function InsightDetailDrawer({
  item,
  onClose,
  onToggleFavorite,
  onNavigate,
}: {
  item: InsightItem | null;
  onClose: () => void;
  onToggleFavorite: (item: InsightItem) => void;
  onNavigate: (path: string, message: string) => void;
}) {
  if (!item) return null;

  const openSource = () => {
    if (isDemoUrl(item.sourceUrl)) {
      toast.info('当前为演示来源，后续可接入真实数据源');
      return;
    }
    window.open(item.sourceUrl, '_blank', 'noopener,noreferrer');
  };
  const chatTab = item.type === 'policy' ? 'policy' : 'hot';
  const chatMessage = item.type === 'policy' ? '已生成政策解读，并携带政策上下文' : '已加入问答分析，并携带热点上下文';
  const chatLabel = item.type === 'policy' ? '政策解读' : '问答分析';
  const addToTaskInbox = () => {
    const priority = item.heatScore >= 90 ? 'high' : item.heatScore >= 80 ? 'medium' : 'low';
    const sourceLabel = item.type === 'policy' ? '国家政策' : item.type === 'industry' ? '行业热点' : '社会热点';
    pushWorkspaceTaskImport({
      title: item.title,
      description: item.summary,
      module: item.relatedModules[0] ?? 'chat',
      sourceLabel,
      sourcePath: `/chat?tab=${chatTab}&query=${encodeURIComponent(buildInsightPrompt(item))}`,
      priority,
      tags: item.tags,
      relatedObjectId: item.id,
    });
    toast.success('已加入计划任务');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[500px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag) => (
                <Tag key={tag} tone="blue">{tag}</Tag>
              ))}
            </div>
            <h2 className="mt-2 text-base font-semibold text-slate-900">{item.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">摘要</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">热度</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{item.heatScore}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">可信度</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{item.reliability}%</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">发布时间</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{item.publishedAt}</p>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">来源</h3>
            <button
              onClick={openSource}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand-blue-600 hover:underline"
            >
              {item.source}
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">影响分析</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              该条目可联动 {item.relatedModules.map((module) => moduleLabels[module]).join('、')}，
              适合沉淀为选题背景、政策解读、岗位分析或计划任务素材。
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">建议动作</h3>
            <ul className="space-y-2">
              {item.suggestedActions.map((action) => (
                <li key={action} className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600">
                  {action}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-2">
          <button
            onClick={() => onToggleFavorite(item)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Star className={`h-4 w-4 ${item.favorited ? 'fill-amber-400 text-amber-500' : ''}`} />
            {item.favorited ? '取消收藏' : '收藏'}
          </button>
          <button
            onClick={() => onNavigate(`/chat?tab=${chatTab}&query=${encodeURIComponent(buildInsightPrompt(item))}`, chatMessage)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Bot className="h-4 w-4" />
            {chatLabel}
          </button>
          <button
            onClick={() => onNavigate(`/writing?tab=editor&quote=${encodeURIComponent(item.title)}`, '已引用到写作，并携带热点摘要')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <FilePlus2 className="h-4 w-4" />
            引用到写作
          </button>
          <button
            onClick={addToTaskInbox}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            加入任务
            <ArrowRight className="h-4 w-4" />
          </button>
        </footer>
      </aside>
    </>
  );
}
