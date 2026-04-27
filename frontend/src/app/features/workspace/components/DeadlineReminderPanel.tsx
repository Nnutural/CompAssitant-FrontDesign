import { useMemo, useState, type Dispatch } from 'react';
import { ArrowRight, CalendarClock, CalendarPlus, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Card, Tag } from '@/app/components/PageShell';

import type { WorkspaceAction } from '../store';
import type { DeadlineReminder, WorkspaceDashboard } from '../types';
import {
  deadlineStatusLabels,
  formatShortDate,
  moduleLabels,
  pushWorkspaceTaskImport,
  toneForUrgency,
  urgencyLabels,
  urgencyRank,
} from '../utils';
import { DeadlineDetailDrawer } from './DeadlineDetailDrawer';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';

type DeadlineFilter = 'all' | 'urgent' | 'week' | 'month' | 'ignored' | 'handled';
type DeadlineSort = 'date' | 'urgency' | 'module';

const filters: { key: DeadlineFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'urgent', label: '紧急' },
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'ignored', label: '已忽略' },
  { key: 'handled', label: '已处理' },
];

function matchFilter(item: DeadlineReminder, filter: DeadlineFilter) {
  if (filter === 'urgent') return item.status === 'active' && (item.urgency === 'critical' || item.urgency === 'high');
  if (filter === 'week') return item.status === 'active' && item.daysLeft <= 7;
  if (filter === 'month') return item.status === 'active' && item.daysLeft <= 30;
  if (filter === 'ignored') return item.status === 'ignored';
  if (filter === 'handled') return item.status === 'handled';
  return true;
}

export function DeadlineReminderPanel({
  dashboard,
  dispatch,
  onNavigate,
}: {
  dashboard: WorkspaceDashboard;
  dispatch: Dispatch<WorkspaceAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  const [filter, setFilter] = useState<DeadlineFilter>('all');
  const [sort, setSort] = useState<DeadlineSort>('date');
  const [selected, setSelected] = useState<DeadlineReminder | null>(null);

  const items = useMemo(() => {
    return dashboard.deadlines
      .filter((item) => matchFilter(item, filter))
      .sort((a, b) => {
        if (sort === 'urgency') return urgencyRank[b.urgency] - urgencyRank[a.urgency];
        if (sort === 'module') return moduleLabels[a.module].localeCompare(moduleLabels[b.module], 'zh-CN');
        return a.daysLeft - b.daysLeft;
      });
  }, [dashboard.deadlines, filter, sort]);

  const addTask = (deadline: DeadlineReminder) => {
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
  };

  const setStatus = (deadline: DeadlineReminder, status: DeadlineReminder['status']) => {
    dispatch({ type: 'setDeadlineStatus', deadlineId: deadline.id, status });
    toast.success(status === 'ignored' ? '已忽略提醒' : '已标记处理');
  };

  return (
    <>
      <Card
        title="截止提醒"
        subtitle="可按紧急程度、截止范围和处理状态筛选"
        right={
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as DeadlineSort)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
          >
            <option value="date">截止时间</option>
            <option value="urgency">紧急程度</option>
            <option value="module">模块</option>
          </select>
        }
      >
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

        {items.length === 0 ? (
          <WorkspaceEmptyState title="暂无提醒" description="当前筛选条件下没有截止提醒。" />
        ) : (
          <div className="space-y-3">
            {items.map((deadline) => (
              <article
                key={deadline.id}
                className={`rounded-xl border p-4 ${
                  deadline.status === 'active' && deadline.daysLeft <= 7
                    ? 'border-red-100 bg-red-50/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-900">{deadline.title}</h3>
                      <Tag tone={toneForUrgency(deadline.urgency)}>{urgencyLabels[deadline.urgency]}</Tag>
                      <Tag>{deadlineStatusLabels[deadline.status]}</Tag>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>截止 {formatShortDate(deadline.date)}</span>
                      <span>{deadline.daysLeft} 天</span>
                      <span>{moduleLabels[deadline.module]}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{deadline.description}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                    <button
                      onClick={() => setSelected(deadline)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      详情
                    </button>
                    <button
                      onClick={() => addTask(deadline)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      <CalendarPlus className="h-3.5 w-3.5" />
                      加任务
                    </button>
                    <button
                      onClick={() => setStatus(deadline, 'ignored')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      <EyeOff className="h-3.5 w-3.5" />
                      忽略
                    </button>
                    <button
                      onClick={() => setStatus(deadline, 'handled')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      处理
                    </button>
                    <button
                      onClick={() => onNavigate(deadline.targetPath, '已跳转原模块，并携带提醒上下文')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-blue-700"
                    >
                      跳转
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <DeadlineDetailDrawer
        deadline={selected}
        onClose={() => setSelected(null)}
        dispatch={dispatch}
        onNavigate={onNavigate}
      />
    </>
  );
}
