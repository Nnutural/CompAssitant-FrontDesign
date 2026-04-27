import type { Dispatch } from 'react';
import { ArrowRight, CheckCircle2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import { Tag } from '@/app/components/PageShell';

import type { TaskWorkbenchAction } from '../store';
import type { TaskItem, TaskWorkbench } from '../types';
import { getMemberName, isDueSoon, isOverdue, taskStatusLabels } from '../utils';
import { TaskEmptyState } from './TaskEmptyState';

export function DayTaskDrawer({
  date,
  tasks,
  workbench,
  dispatch,
  onClose,
  onOpenTask,
  onCreateTask,
  onNavigate,
}: {
  date?: string;
  tasks: TaskItem[];
  workbench: TaskWorkbench;
  dispatch: Dispatch<TaskWorkbenchAction>;
  onClose: () => void;
  onOpenTask: (taskId: string) => void;
  onCreateTask: (date: string) => void;
  onNavigate: (path: string, message: string) => void;
}) {
  if (!date) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[430px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <p className="text-xs text-slate-500">截止日期</p>
            <h2 className="text-base font-semibold text-slate-900">{date}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">
          {tasks.length === 0 ? (
            <TaskEmptyState title="当天暂无任务" description="可以直接从当前日期新建截止任务。" onCreate={() => onCreateTask(date)} />
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <article key={task.id} className={`rounded-xl border p-3 ${isOverdue(task) ? 'border-red-100 bg-red-50' : isDueSoon(task) ? 'border-amber-100 bg-amber-50' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">{getMemberName(workbench.teamMembers, task.assigneeId)} · {taskStatusLabels[task.status]}</p>
                    </div>
                    <Tag>{task.sourceLabel}</Tag>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => onOpenTask(task.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">详情</button>
                    <button
                      onClick={() => {
                        dispatch({ type: 'completeTask', taskId: task.id, done: task.status !== 'done' });
                        toast.success(task.status === 'done' ? '任务已恢复' : '任务已完成');
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {task.status === 'done' ? '恢复' : '完成'}
                    </button>
                    <button onClick={() => onNavigate(task.sourcePath, '已跳转源模块')} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-blue-700">
                      跳转
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        <footer className="border-t border-slate-200 p-4">
          <button onClick={() => onCreateTask(date)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700">
            <Plus className="h-4 w-4" />
            新建该日期截止的任务
          </button>
        </footer>
      </aside>
    </>
  );
}
