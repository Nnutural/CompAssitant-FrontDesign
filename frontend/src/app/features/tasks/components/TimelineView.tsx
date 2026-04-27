import { useMemo, useState } from 'react';

import { Card, Tag } from '@/app/components/PageShell';

import type { TaskWorkbench } from '../types';
import { getMemberName, getTaskProgress, isDueSoon, isOverdue, taskModuleLabels } from '../utils';

type Scale = 'week' | 'month';

export function TimelineView({
  workbench,
  onOpenTask,
}: {
  workbench: TaskWorkbench;
  onOpenTask: (taskId: string) => void;
}) {
  const [scale, setScale] = useState<Scale>('month');
  const [assignee, setAssignee] = useState('all');
  const [milestone, setMilestone] = useState('all');
  const [module, setModule] = useState('all');

  const tasks = useMemo(() => {
    return workbench.tasks
      .filter((task) => !task.archived)
      .filter((task) => assignee === 'all' || task.assigneeId === assignee)
      .filter((task) => milestone === 'all' || task.milestoneId === milestone)
      .filter((task) => module === 'all' || task.module === module)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [assignee, milestone, module, workbench.tasks]);

  const range = useMemo(() => {
    const dates = tasks.flatMap((task) => [task.startDate, task.dueDate]);
    const start = dates.length ? new Date(`${dates.sort()[0]}T00:00:00`) : new Date();
    const end = dates.length ? new Date(`${dates.sort()[dates.length - 1]}T00:00:00`) : new Date();
    start.setDate(start.getDate() - (scale === 'week' ? 2 : 7));
    end.setDate(end.getDate() + (scale === 'week' ? 5 : 14));
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    return { start, end, totalDays };
  }, [scale, tasks]);

  return (
    <Card
      title="时间线规划"
      subtitle="按任务真实起止日期生成 CSS 甘特条，可按负责人、里程碑和来源筛选"
      right={
        <select value={scale} onChange={(event) => setScale(event.target.value as Scale)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
          <option value="week">周</option>
          <option value="month">月</option>
        </select>
      }
    >
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <select value={assignee} onChange={(event) => setAssignee(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
          <option value="all">全部负责人</option>
          {workbench.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
        </select>
        <select value={milestone} onChange={(event) => setMilestone(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
          <option value="all">全部里程碑</option>
          {workbench.milestones.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <select value={module} onChange={(event) => setModule(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700">
          <option value="all">全部来源</option>
          {Object.entries(taskModuleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px] space-y-3">
          <div className="flex justify-between border-b border-slate-100 pb-2 text-xs text-slate-400">
            <span>{range.start.toISOString().slice(0, 10)}</span>
            <span>{range.end.toISOString().slice(0, 10)}</span>
          </div>
          {workbench.milestones.map((item) => {
            const left = Math.max(0, Math.min(100, ((new Date(`${item.targetDate}T00:00:00`).getTime() - range.start.getTime()) / (range.totalDays * 86400000)) * 100));
            return (
              <div key={item.id} className="relative h-4">
                <div className="absolute top-0 h-4 w-px bg-amber-400" style={{ left: `${left}%` }} />
                <span className="absolute top-0 rounded bg-amber-50 px-1.5 text-[10px] text-amber-700" style={{ left: `${Math.min(92, left)}%` }}>{item.title}</span>
              </div>
            );
          })}
          {tasks.map((task) => {
            const start = new Date(`${task.startDate}T00:00:00`).getTime();
            const end = new Date(`${task.dueDate}T00:00:00`).getTime();
            const left = Math.max(0, Math.min(96, ((start - range.start.getTime()) / (range.totalDays * 86400000)) * 100));
            const width = Math.max(4, Math.min(100 - left, ((end - start + 86400000) / (range.totalDays * 86400000)) * 100));
            const risky = isOverdue(task) || isDueSoon(task);
            return (
              <button key={task.id} onClick={() => onOpenTask(task.id)} className="grid w-full grid-cols-[220px_minmax(0,1fr)] items-center gap-4 rounded-lg p-2 text-left hover:bg-slate-50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{task.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{getMemberName(workbench.teamMembers, task.assigneeId)} · {task.startDate} 至 {task.dueDate}</p>
                </div>
                <div className="relative h-8 rounded-full bg-slate-100">
                  <div
                    className={`absolute top-1 h-6 rounded-full ${risky ? 'bg-amber-500' : 'bg-brand-blue-600'}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                  <span className="absolute right-2 top-1.5 text-xs text-slate-500">{getTaskProgress(task)}%</span>
                </div>
              </button>
            );
          })}
          {tasks.length === 0 && <div className="py-10 text-center text-sm text-slate-400">当前筛选下没有任务</div>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Tag tone="amber">临期/逾期高亮</Tag>
        <Tag tone="blue">点击时间条查看详情</Tag>
      </div>
    </Card>
  );
}
