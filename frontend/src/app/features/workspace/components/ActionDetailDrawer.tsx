import type { Dispatch } from 'react';
import { ArrowRight, Bot, CalendarPlus, Clock3, X } from 'lucide-react';
import { toast } from 'sonner';

import { Tag } from '@/app/components/PageShell';

import type { WorkspaceAction } from '../store';
import type { RecommendedAction } from '../types';
import { actionStatusLabels, moduleLabels, priorityLabels, toneForPriority } from '../utils';

export function ActionDetailDrawer({
  action,
  onClose,
  dispatch,
  onNavigate,
}: {
  action: RecommendedAction | null;
  onClose: () => void;
  dispatch: Dispatch<WorkspaceAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  if (!action) return null;

  const startAction = () => {
    dispatch({ type: 'setActionStatus', actionId: action.id, status: 'started' });
    toast.success('已开始推荐行动');
    onNavigate(action.targetPath, '已跳转目标模块，并携带推荐行动上下文');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[480px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex flex-wrap gap-2">
              <Tag tone={toneForPriority(action.priority)}>{priorityLabels[action.priority]}</Tag>
              <Tag>{actionStatusLabels[action.status]}</Tag>
            </div>
            <h2 className="mt-2 text-base font-semibold text-slate-900">{action.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">为什么推荐</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{action.why}</p>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">目标模块</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{moduleLabels[action.module]}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">预计耗时</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-slate-900">
                <Clock3 className="h-4 w-4 text-slate-400" />
                {action.estimateMinutes} 分钟
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">预计收益</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{action.benefit}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">风险提示</h3>
            <p className="mt-2 rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm leading-6 text-amber-800">
              {action.risk}
            </p>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">关联证据</h3>
            <div className="flex flex-wrap gap-2">
              {action.evidenceIds.map((id) => (
                <Tag key={id} tone="blue">{id}</Tag>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">预期产出</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{action.expectedOutput}</p>
          </section>
        </div>

        <footer className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-2">
          <button
            onClick={startAction}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            开始执行
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              dispatch({ type: 'addTaskFromAction', actionId: action.id });
              toast.success('已加入计划任务');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <CalendarPlus className="h-4 w-4" />
            加入任务
          </button>
          <button
            onClick={() => onNavigate(`/chat?tab=topic&query=${encodeURIComponent(action.aiPrompt)}`, '已发起智能问答，并携带推荐问题')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Bot className="h-4 w-4" />
            智能问答
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            关闭详情
          </button>
        </footer>
      </aside>
    </>
  );
}
