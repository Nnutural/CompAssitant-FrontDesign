import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText } from 'lucide-react';
import type { WritingProject } from '../types';
import { formatDateTime, getActiveTopic } from '../utils';

const statusText: Record<WritingProject['autosaveStatus'], string> = {
  saved: '已保存',
  saving: '保存中',
  unsaved: '未保存',
  error: '保存失败',
};

export function WritingProjectBar({
  project,
  currentLabel,
  onPrev,
  onNext,
}: {
  project: WritingProject;
  currentLabel: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const activeTopic = getActiveTopic(project);
  const statusClass =
    project.autosaveStatus === 'error'
      ? 'text-red-600 bg-red-50'
      : project.autosaveStatus === 'unsaved'
        ? 'text-amber-700 bg-amber-50'
        : 'text-emerald-700 bg-emerald-50';

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <FileText className="h-4 w-4 text-brand-blue-600" />
            <h2 className="truncate text-sm font-semibold text-slate-900">{project.name}</h2>
            <span className={`rounded-md px-2 py-0.5 text-xs ${statusClass}`}>
              {statusText[project.autosaveStatus]}
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">
            当前选题：{activeTopic?.title ?? '尚未选择'} · 当前阶段：{currentLabel} · 最近保存：{formatDateTime(project.savedAt)}
          </p>
        </div>

        <div className="flex min-w-[260px] items-center gap-3">
          <div className="min-w-[150px] flex-1">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>完成度</span>
              <span className="font-medium text-slate-700">{project.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-blue-600" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              title="上一步"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              title="下一步"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <Clock3 className="h-4 w-4 text-slate-300" />
        </div>
      </div>
    </section>
  );
}
