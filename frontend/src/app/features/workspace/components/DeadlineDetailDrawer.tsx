import { ArrowRight, CalendarPlus, CheckCircle2, EyeOff, X } from 'lucide-react';
import type { Dispatch } from 'react';
import { toast } from 'sonner';

import { Tag } from '@/app/components/PageShell';

import type { DeadlineReminder } from '../types';
import type { WorkspaceAction } from '../store';
import { deadlineStatusLabels, moduleLabels, pushWorkspaceTaskImport, toneForUrgency, urgencyLabels } from '../utils';

export function DeadlineDetailDrawer({
  deadline,
  onClose,
  dispatch,
  onNavigate,
}: {
  deadline: DeadlineReminder | null;
  onClose: () => void;
  dispatch: Dispatch<WorkspaceAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  if (!deadline) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[460px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Tag tone={toneForUrgency(deadline.urgency)}>{urgencyLabels[deadline.urgency]}</Tag>
              <Tag>{deadlineStatusLabels[deadline.status]}</Tag>
            </div>
            <h2 className="mt-2 text-base font-semibold text-slate-900">{deadline.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">提醒背景</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{deadline.description}</p>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">截止日期</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{deadline.date}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">剩余时间</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{deadline.daysLeft} 天</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">来源模块</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{moduleLabels[deadline.module]}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">模块路径</p>
              <p className="mt-1 truncate text-sm font-medium text-slate-900">{deadline.targetPath}</p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">建议处理动作</h3>
            <ul className="space-y-2">
              {deadline.actions.map((action) => (
                <li key={action} className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600">
                  {action}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">关联证据</h3>
            <div className="flex flex-wrap gap-2">
              {deadline.evidenceIds.map((id) => (
                <Tag key={id} tone="blue">{id}</Tag>
              ))}
            </div>
          </section>
        </div>

        <footer className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-2">
          <button
            onClick={() => {
              dispatch({ type: 'addTaskFromDeadline', deadlineId: deadline.id });
              pushWorkspaceTaskImport({
                title: `处理提醒：${deadline.title}`,
                description: deadline.description,
                module: deadline.module,
                sourceLabel: '截止提醒',
                sourcePath: deadline.targetPath,
                priority: deadline.urgency === 'critical' || deadline.urgency === 'high' ? 'high' : 'medium',
                dueDate: deadline.date,
                tags: ['截止提醒'],
                relatedObjectId: deadline.id,
              });
              toast.success('已加入计划任务');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <CalendarPlus className="h-4 w-4" />
            加入任务
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'setDeadlineStatus', deadlineId: deadline.id, status: 'ignored' });
              toast.success('已忽略提醒');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <EyeOff className="h-4 w-4" />
            忽略
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'setDeadlineStatus', deadlineId: deadline.id, status: 'handled' });
              toast.success('已标记处理');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            标记处理
          </button>
          <button
            onClick={() => onNavigate(deadline.targetPath, '已跳转原模块，并携带提醒上下文')}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            跳转模块
            <ArrowRight className="h-4 w-4" />
          </button>
        </footer>
      </aside>
    </>
  );
}
