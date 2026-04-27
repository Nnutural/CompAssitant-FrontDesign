import { useState, type Dispatch } from 'react';
import { Flag, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Card, Tag } from '@/app/components/PageShell';

import type { TaskWorkbenchAction } from '../store';
import type { Milestone, RiskLevel, TaskWorkbench } from '../types';
import {
  getMemberName,
  getMilestoneProgress,
  milestoneStatusLabels,
  riskLevelLabels,
  toneForRisk,
} from '../utils';

export function MilestoneView({
  workbench,
  dispatch,
  onOpenTask,
}: {
  workbench: TaskWorkbench;
  dispatch: Dispatch<TaskWorkbenchAction>;
  onOpenTask: (taskId: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ title: '', targetDate: new Date().toISOString().slice(0, 10), ownerId: workbench.teamMembers[0]?.id ?? '', riskLevel: 'medium' as RiskLevel });

  const createMilestone = () => {
    if (!draft.title.trim()) return;
    const milestone: Milestone = {
      id: `ms-${Date.now()}`,
      title: draft.title.trim(),
      description: '演示中新建的里程碑，可继续关联任务和交付物。',
      targetDate: draft.targetDate,
      status: 'not_started',
      relatedTaskIds: [],
      deliverables: ['待补充交付物'],
      riskLevel: draft.riskLevel,
      ownerId: draft.ownerId,
    };
    dispatch({ type: 'addMilestone', milestone });
    setCreating(false);
    setDraft({ ...draft, title: '' });
    toast.success('里程碑已更新');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setCreating(!creating)} className="inline-flex items-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700">
          <Plus className="h-4 w-4" />
          新建里程碑
        </button>
      </div>
      {creating && (
        <Card title="新建里程碑">
          <div className="grid gap-3 md:grid-cols-4">
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="里程碑标题" className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
            <input type="date" value={draft.targetDate} onChange={(event) => setDraft({ ...draft, targetDate: event.target.value })} className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
            <select value={draft.ownerId} onChange={(event) => setDraft({ ...draft, ownerId: event.target.value })} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
              {workbench.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
            <button onClick={createMilestone} className="rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700">保存</button>
          </div>
        </Card>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {workbench.milestones.map((milestone) => {
          const related = workbench.tasks.filter((task) => task.milestoneId === milestone.id && !task.archived);
          const done = related.filter((task) => task.status === 'done').length;
          const remaining = related.length - done;
          const progress = getMilestoneProgress(milestone, workbench.tasks);
          const risky = milestone.riskLevel === 'high' || (remaining > 0 && new Date(milestone.targetDate).getTime() < Date.now() + 3 * 86400000);
          return (
            <Card key={milestone.id} className={risky ? 'border-amber-200 bg-amber-50/40' : ''}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Tag tone={toneForRisk(milestone.riskLevel)}>{riskLevelLabels[milestone.riskLevel]}</Tag>
                      <Tag>{milestoneStatusLabels[milestone.status]}</Tag>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">{milestone.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{milestone.description}</p>
                  </div>
                  <Flag className="h-5 w-5 shrink-0 text-brand-blue-600" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>完成率</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-brand-blue-600" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="目标日期" value={milestone.targetDate} />
                  <Info label="负责人" value={getMemberName(workbench.teamMembers, milestone.ownerId)} />
                  <Info label="关联任务" value={`${related.length} 项`} />
                  <Info label="剩余任务" value={`${remaining} 项`} />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">交付物</p>
                  <div className="flex flex-wrap gap-2">
                    {milestone.deliverables.map((item) => <Tag key={item} tone="blue">{item}</Tag>)}
                  </div>
                </div>
                <div className="space-y-2">
                  {related.slice(0, 4).map((task) => (
                    <button key={task.id} onClick={() => onOpenTask(task.id)} className="flex w-full items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50">
                      <span className="min-w-0 truncate text-slate-700">{task.title}</span>
                      <Tag>{task.status}</Tag>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    onChange={(event) => {
                      if (!event.target.value) return;
                      dispatch({ type: 'updateTask', taskId: event.target.value, patch: { milestoneId: milestone.id }, activity: `任务加入里程碑：${milestone.title}` });
                      toast.success('里程碑已更新');
                      event.target.value = '';
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
                  >
                    <option value="">将任务加入里程碑</option>
                    {workbench.tasks.filter((task) => !task.archived && task.milestoneId !== milestone.id).map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}
                  </select>
                  <button
                    onClick={() => {
                      dispatch({ type: 'updateMilestone', milestoneId: milestone.id, patch: { status: 'completed', riskLevel: 'low' } });
                      toast.success('里程碑已更新');
                    }}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    标记完成
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
