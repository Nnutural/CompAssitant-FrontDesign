import { ExternalLink, FileText, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import type { ChatCitation } from '../types';
import { isMockUrl } from '../utils';

const typeLabel: Record<ChatCitation['type'], string> = {
  paper: '论文',
  policy: '政策',
  competition: '竞赛',
  news: '新闻',
  project: '项目',
  internal: '内部',
};

export function CitationPanel({ citations }: { citations: ChatCitation[] }) {
  const handleOpen = (citation: ChatCitation) => {
    if (isMockUrl(citation.url)) {
      toast.info('当前为演示来源，后续可接入真实检索');
      return;
    }
    window.open(citation.url, '_blank', 'noopener,noreferrer');
  };

  if (!citations.length) {
    return (
      <section className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center text-sm text-slate-400">
        当前回答暂无引用来源
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">引用来源</h3>
        <p className="mt-0.5 text-xs text-slate-500">mock 来源仅用于展示引用面板</p>
      </header>
      <div className="space-y-3 p-4">
        {citations.map((citation) => (
          <article key={citation.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {typeLabel[citation.type]}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    {citation.reliability}%
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-semibold text-slate-900">{citation.title}</h4>
                <p className="mt-1 text-xs text-slate-500">{citation.source}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{citation.excerpt}</p>
                <button
                  type="button"
                  onClick={() => handleOpen(citation)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  打开来源
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
