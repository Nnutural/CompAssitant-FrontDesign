import type { ReactNode } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Clock3, Heart, MessageCircle, Repeat, UserPlus, Users } from 'lucide-react';
import type { ForumWorkspace } from '../types';
import { autosaveLabel, autosaveTone, computeForumStats, formatFullDateTime } from '../utils';

export function ForumWorkbenchBar({
  workspace,
  currentLabel,
  onPrev,
  onNext,
}: {
  workspace: ForumWorkspace;
  currentLabel: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  const stats = computeForumStats(workspace);
  const activeTopic = workspace.topics.find((topic) => topic.id === workspace.activeTopicId);

  return (
    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="上一个板块"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="下一个板块"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400">当前板块</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">{currentLabel}</span>
              {activeTopic && (
                <span className="rounded-md bg-brand-blue-50 px-2 py-0.5 text-xs text-brand-blue-600">
                  话题：{activeTopic.title}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 sm:flex sm:flex-wrap sm:items-center">
          <Metric icon={<Heart className="h-3.5 w-3.5" />} label="点赞" value={stats.likes} />
          <Metric icon={<Bookmark className="h-3.5 w-3.5" />} label="收藏" value={stats.favorites} />
          <Metric icon={<MessageCircle className="h-3.5 w-3.5" />} label="评论" value={stats.comments} />
          <Metric icon={<Users className="h-3.5 w-3.5" />} label="报名" value={stats.registrations} />
          <Metric icon={<UserPlus className="h-3.5 w-3.5" />} label="组队" value={stats.teamApplications} />
          <Metric icon={<Repeat className="h-3.5 w-3.5" />} label="交换" value={stats.exchanges} />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-md px-2 py-1 ${autosaveTone(workspace.autosaveStatus)}`}>
            {autosaveLabel(workspace.autosaveStatus)}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            最近保存 {formatFullDateTime(workspace.savedAt)}
          </span>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <span className="inline-flex items-center justify-between gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 sm:justify-start">
      <span className="inline-flex items-center gap-1 text-slate-500">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-slate-900">{value}</span>
    </span>
  );
}
