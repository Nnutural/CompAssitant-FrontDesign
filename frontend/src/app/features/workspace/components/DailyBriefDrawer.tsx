import { AlertTriangle, CheckCircle2, Database, Sparkles, X, type LucideIcon } from 'lucide-react';

import { Tag } from '@/app/components/PageShell';

import type { DailyBrief } from '../types';
import { formatToday } from '../utils';

function ListBlock({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: LucideIcon;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-blue-600" />
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DailyBriefDrawer({
  brief,
  open,
  onClose,
}: {
  brief: DailyBrief;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[480px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <Tag tone="blue">今日简报</Tag>
            <h2 className="mt-2 text-base font-semibold text-slate-900">{formatToday(new Date(brief.date))}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section className="rounded-xl border border-brand-blue-100 bg-brand-blue-50 p-4">
            <h3 className="text-sm font-semibold text-brand-blue-900">当天摘要</h3>
            <p className="mt-2 text-sm leading-6 text-brand-blue-800">{brief.summary}</p>
          </section>
          <ListBlock title="关键任务" items={brief.keyTasks} icon={CheckCircle2} />
          <ListBlock title="紧急截止" items={brief.urgentDeadlines} icon={AlertTriangle} />
          <ListBlock title="推荐行动" items={brief.recommendedActions} icon={Sparkles} />
          <ListBlock title="数据提醒" items={brief.dataWarnings} icon={Database} />
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">风险提醒</h3>
            <ul className="space-y-2">
              {brief.risks.map((risk) => (
                <li key={risk} className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  {risk}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
}
