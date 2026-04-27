import { AlertTriangle, CheckCircle2, Clock3, Save, Users } from 'lucide-react';

import { Card, Tag } from '@/app/components/PageShell';

import type { TaskWorkbench } from '../types';
import { autosaveLabels, getTaskStats } from '../utils';

const saveTone: Record<TaskWorkbench['autosaveStatus'], 'green' | 'blue' | 'amber' | 'red'> = {
  saved: 'green',
  saving: 'blue',
  unsaved: 'amber',
  error: 'red',
};

export function TaskWorkbenchBar({ workbench }: { workbench: TaskWorkbench }) {
  const stats = getTaskStats(workbench.tasks, workbench.teamMembers);
  const items = [
    { label: '任务总数', value: stats.total, sub: `已完成 ${stats.done}`, icon: CheckCircle2 },
    { label: '待办任务', value: stats.todo, sub: `进行中 ${stats.doing} / 评审 ${stats.review}`, icon: Clock3 },
    { label: '临期/逾期', value: `${stats.dueSoon}/${stats.overdue}`, sub: '3 天内 / 已逾期', icon: AlertTriangle },
    { label: '团队负载', value: `${stats.teamLoadPercent}%`, sub: '按预计工时计算', icon: Users },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-1 text-xs text-slate-400">{item.sub}</p>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
              <item.icon className="h-4 w-4" />
            </div>
          </div>
        </Card>
      ))}
      <Card className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">保存状态</p>
            <div className="mt-2">
              <Tag tone={saveTone[workbench.autosaveStatus]}>{autosaveLabels[workbench.autosaveStatus]}</Tag>
            </div>
            <p className="mt-2 truncate text-xs text-slate-400">
              {workbench.savedAt ? new Date(workbench.savedAt).toLocaleString('zh-CN') : '等待首次保存'}
            </p>
          </div>
          <Save className="h-5 w-5 shrink-0 text-slate-300" />
        </div>
      </Card>
    </div>
  );
}
