import { useMemo, useState, type Dispatch } from 'react';
import { ArrowRight, Bot, CalendarPlus, Clock3, Eye, Sparkles, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Card, Tag } from '@/app/components/PageShell';

import type { WorkspaceAction } from '../store';
import type { RecommendedAction, WorkspaceDashboard } from '../types';
import {
  actionStatusLabels,
  moduleLabels,
  priorityLabels,
  priorityRank,
  toneForPriority,
} from '../utils';
import { ActionDetailDrawer } from './ActionDetailDrawer';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';

type ActionFilter = 'active' | 'all' | 'started' | 'postponed' | 'dismissed';

const filters: { key: ActionFilter; label: string }[] = [
  { key: 'active', label: '待处理' },
  { key: 'all', label: '全部' },
  { key: 'started', label: '已开始' },
  { key: 'postponed', label: '稍后' },
  { key: 'dismissed', label: '已关闭' },
];

function filterAction(action: RecommendedAction, filter: ActionFilter) {
  if (filter === 'all') return true;
  return action.status === filter;
}

export function RecommendedActionsPanel({
  dashboard,
  dispatch,
  onNavigate,
}: {
  dashboard: WorkspaceDashboard;
  dispatch: Dispatch<WorkspaceAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  const [filter, setFilter] = useState<ActionFilter>('active');
  const [selected, setSelected] = useState<RecommendedAction | null>(null);

  const actions = useMemo(
    () =>
      dashboard.recommendedActions
        .filter((action) => filterAction(action, filter))
        .sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]),
    [dashboard.recommendedActions, filter],
  );

  const startAction = (action: RecommendedAction) => {
    dispatch({ type: 'setActionStatus', actionId: action.id, status: 'started' });
    toast.success('已开始推荐行动');
    onNavigate(action.targetPath, '已跳转目标模块，并携带推荐行动上下文');
  };

  const postponeAction = (action: RecommendedAction) => {
    dispatch({ type: 'setActionStatus', actionId: action.id, status: 'postponed' });
    toast.success('已稍后处理');
  };

  const dismissAction = (action: RecommendedAction) => {
    dispatch({ type: 'setActionStatus', actionId: action.id, status: 'dismissed' });
    toast.success('已关闭推荐');
  };

  return (
    <>
      <Card title="推荐行动" subtitle="基于任务、资产、数据新鲜度与热点生成的下一步建议">
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                filter === item.key
                  ? 'bg-brand-blue-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {actions.length === 0 ? (
          <WorkspaceEmptyState title="暂无推荐行动" description="当前筛选条件下没有推荐行动。" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {actions.map((action) => (
              <article key={action.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Tag tone={toneForPriority(action.priority)}>{priorityLabels[action.priority]}</Tag>
                      <Tag>{moduleLabels[action.module]}</Tag>
                      <Tag>{actionStatusLabels[action.status]}</Tag>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-6 text-slate-900">{action.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{action.why}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {action.estimateMinutes} 分钟
                      </span>
                      <span>{action.expectedOutput}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelected(action)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        为什么推荐
                      </button>
                      <button
                        onClick={() => startAction(action)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-blue-700"
                      >
                        开始
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => postponeAction(action)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        稍后
                      </button>
                      <button
                        onClick={() => {
                          dispatch({ type: 'addTaskFromAction', actionId: action.id });
                          toast.success('已加入计划任务');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <CalendarPlus className="h-3.5 w-3.5" />
                        加任务
                      </button>
                      <button
                        onClick={() => onNavigate(`/chat?tab=topic&query=${encodeURIComponent(action.aiPrompt)}`, '已发起智能问答，并携带推荐问题')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        问答
                      </button>
                      <button
                        onClick={() => dismissAction(action)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <ActionDetailDrawer
        action={selected}
        onClose={() => setSelected(null)}
        dispatch={dispatch}
        onNavigate={onNavigate}
      />
    </>
  );
}
