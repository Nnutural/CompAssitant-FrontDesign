import { Tag } from '@/app/components/PageShell';

import type { TaskItem, TeamMember } from '../types';
import { getMemberLoad, isOverdue } from '../utils';

export function MemberWorkloadCard({
  member,
  tasks,
  onShowTasks,
}: {
  member: TeamMember;
  tasks: TaskItem[];
  onShowTasks: (memberId: string) => void;
}) {
  const load = getMemberLoad(member, tasks);
  const percent = member.capacityHoursPerWeek ? Math.round((load / member.capacityHoursPerWeek) * 100) : 0;
  const assigned = tasks.filter((task) => task.assigneeId === member.id && !task.archived);
  const overdue = assigned.filter(isOverdue).length;

  return (
    <button onClick={() => onShowTasks(member.id)} className={`rounded-xl border p-4 text-left shadow-sm ${percent > 100 ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue-600 text-sm font-semibold text-white">{member.avatarText}</div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{member.name}</h3>
            <p className="mt-0.5 text-xs text-slate-500">{member.role}</p>
          </div>
        </div>
        {percent > 100 && <Tag tone="red">超载</Tag>}
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>负载</span>
          <span>{load}/{member.capacityHoursPerWeek}h · {percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${percent > 100 ? 'bg-red-500' : 'bg-brand-blue-600'}`} style={{ width: `${Math.min(100, percent)}%` }} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Tag tone="blue">{assigned.length} 项任务</Tag>
        {overdue > 0 && <Tag tone="red">{overdue} 项逾期</Tag>}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {member.skillTags.map((tag) => <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{tag}</span>)}
      </div>
    </button>
  );
}
