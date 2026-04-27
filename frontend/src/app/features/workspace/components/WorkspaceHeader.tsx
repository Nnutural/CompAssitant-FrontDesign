import { ArrowRight, CalendarDays, FileText } from 'lucide-react';

import type { WorkspaceDashboard } from '../types';
import { formatToday, getDashboardStats } from '../utils';

export function WorkspaceHeader({
  dashboard,
  onOpenBrief,
  onStartWork,
}: {
  dashboard: WorkspaceDashboard;
  onOpenBrief: () => void;
  onStartWork: () => void;
}) {
  const stats = getDashboardStats(dashboard);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4 text-brand-blue-600" />
            <span>{formatToday()}</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">演示工作台在线</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            早上好，{dashboard.userName}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            今日还有 <span className="font-semibold text-slate-900">{stats.unfinishedTaskCount}</span> 项任务、
            <span className="font-semibold text-slate-900">{stats.activeDeadlineCount}</span> 条截止提醒和
            <span className="font-semibold text-slate-900">{stats.activeActionCount}</span> 条推荐行动待处理。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenBrief}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FileText className="h-4 w-4" />
            查看今日简报
          </button>
          <button
            onClick={onStartWork}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            开始工作
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
