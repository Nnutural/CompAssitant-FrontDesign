import type { Dispatch } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { Tag } from '@/app/components/PageShell';

import type { TaskWorkbenchAction } from '../store';
import type { Milestone, TaskItem, TeamMember } from '../types';
import {
  getMemberName,
  getNextStatus,
  getPreviousStatus,
  taskModuleLabels,
  taskPriorityLabels,
  toneForPriority,
} from '../utils';

export function TaskCard({
  task,
  teamMembers,
  milestone,
  dispatch,
  onOpen,
}: {
  task: TaskItem;
  teamMembers: TeamMember[];
  milestone?: Milestone;
  dispatch: Dispatch<TaskWorkbenchAction>;
  onOpen: (taskId: string) => void;
}) {
  const next = getNextStatus(task.status);
  const prev = getPreviousStatus(task.status);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <button onClick={() => onOpen(task.id)} className="block w-full text-left">
        <div className="flex flex-wrap gap-2">
          <Tag tone={toneForPriority(task.priority)}>{taskPriorityLabels[task.priority]}</Tag>
          <Tag tone="blue">{taskModuleLabels[task.module]}</Tag>
        </div>
        <h4 className="mt-2 text-sm font-semibold leading-6 text-slate-900">{task.title}</h4>
        <div className="mt-2 space-y-1 text-xs text-slate-500">
          <p>负责人：{getMemberName(teamMembers, task.assigneeId)}</p>
          <p>截止：{task.dueDate}</p>
          {milestone && <p>里程碑：{milestone.title}</p>}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
              {tag}
            </span>
          ))}
        </div>
      </button>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          disabled={prev === task.status}
          onClick={() => {
            dispatch({ type: 'setTaskStatus', taskId: task.id, status: prev });
            toast.success('任务状态已更新');
          }}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
          title="移至上一阶段"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'completeTask', taskId: task.id, done: task.status !== 'done' });
            toast.success(task.status === 'done' ? '任务已恢复' : '任务已完成');
          }}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
          title={task.status === 'done' ? '恢复任务' : '标记完成'}
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
        <button
          disabled={next === task.status}
          onClick={() => {
            dispatch({ type: 'setTaskStatus', taskId: task.id, status: next });
            toast.success('任务状态已更新');
          }}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
          title="移至下一阶段"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
