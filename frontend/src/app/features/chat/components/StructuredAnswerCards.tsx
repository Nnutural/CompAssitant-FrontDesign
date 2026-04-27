import { AlertTriangle, CheckSquare, FileSearch, GitCompare, Lightbulb, Timer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StructuredAnswerCard } from '../types';

const iconMap: Record<StructuredAnswerCard['type'], LucideIcon> = {
  suggestion: Lightbulb,
  evidence: FileSearch,
  todo: CheckSquare,
  comparison: GitCompare,
  timeline: Timer,
  risk: AlertTriangle,
};

const labelMap: Record<StructuredAnswerCard['type'], string> = {
  suggestion: '建议',
  evidence: '证据',
  todo: '行动',
  comparison: '对比',
  timeline: '时间线',
  risk: '风险',
};

export function StructuredAnswerCards({ cards }: { cards: StructuredAnswerCard[] }) {
  if (!cards.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center text-sm text-slate-400">
        暂无结构化结果
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">结构化结果</h3>
        <p className="mt-0.5 text-xs text-slate-500">从当前回答提取的展示卡片</p>
      </header>
      <div className="space-y-3 p-4">
        {cards.map((card) => {
          const Icon = iconMap[card.type];
          return (
            <article key={card.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-blue-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{card.title}</h4>
                    <span className="rounded-md bg-white px-2 py-0.5 text-xs text-slate-500">{labelMap[card.type]}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{card.content}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {card.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-white px-2 py-0.5 text-xs text-slate-500">
                        {tag}
                      </span>
                    ))}
                    <span className="ml-auto text-xs font-medium text-brand-blue-600">{card.score} 分</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
