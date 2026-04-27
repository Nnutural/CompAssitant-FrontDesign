import { useState, type Dispatch } from 'react';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Card, Tag } from '@/app/components/PageShell';

import type { TaskWorkbenchAction } from '../store';
import type { TaskWorkbench } from '../types';
import {
  getMemberLoad,
  getMemberName,
  isOverdue,
  taskStatusLabels,
  toneForStatus,
} from '../utils';
import { MemberWorkloadCard } from './MemberWorkloadCard';

export function TeamCollabView({
  workbench,
  dispatch,
  onOpenTask,
}: {
  workbench: TaskWorkbench;
  dispatch: Dispatch<TaskWorkbenchAction>;
  onOpenTask: (taskId: string) => void;
}) {
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const tasks = workbench.tasks.filter((task) => !task.archived && (memberFilter === 'all' || task.assigneeId === memberFilter || task.collaboratorIds.includes(memberFilter)));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {workbench.teamMembers.map((member) => (
          <MemberWorkloadCard key={member.id} member={member} tasks={workbench.tasks} onShowTasks={setMemberFilter} />
        ))}
      </div>
      <Card
        title="任务分工矩阵"
        subtitle="快速调整负责人、查看协作者和负载风险"
        right={
          <select value={memberFilter} onChange={(event) => setMemberFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
            <option value="all">全部成员</option>
            {workbench.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-[840px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="py-3 text-left font-normal">任务</th>
                <th className="text-left font-normal">主负责人</th>
                <th className="text-left font-normal">协作者</th>
                <th className="text-left font-normal">截止日期</th>
                <th className="text-left font-normal">状态</th>
                <th className="text-left font-normal">负载风险</th>
                <th className="text-right font-normal">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => {
                const assignee = workbench.teamMembers.find((member) => member.id === task.assigneeId);
                const load = assignee ? getMemberLoad(assignee, workbench.tasks) : 0;
                const percent = assignee ? Math.round((load / assignee.capacityHoursPerWeek) * 100) : 0;
                return (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3 font-medium text-slate-900">{task.title}</td>
                    <td>
                      <select
                        value={task.assigneeId}
                        onChange={(event) => {
                          dispatch({ type: 'assignTask', taskId: task.id, assigneeId: event.target.value });
                          toast.success('负责人已更新');
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                      >
                        {workbench.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                      </select>
                    </td>
                    <td className="text-slate-500">{task.collaboratorIds.map((id) => getMemberName(workbench.teamMembers, id)).join('、') || '无'}</td>
                    <td className="text-slate-500">{task.dueDate}</td>
                    <td><Tag tone={toneForStatus(task.status)}>{taskStatusLabels[task.status]}</Tag></td>
                    <td>
                      {percent > 100 ? <Tag tone="red">负载过高</Tag> : isOverdue(task) ? <Tag tone="red">逾期</Tag> : <Tag tone="green">正常</Tag>}
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <select
                          onChange={(event) => {
                            if (!event.target.value) return;
                            dispatch({ type: 'addCollaborator', taskId: task.id, memberId: event.target.value });
                            toast.success('负责人已更新');
                            event.target.value = '';
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                        >
                          <option value="">添加协作者</option>
                          {workbench.teamMembers.filter((member) => !task.collaboratorIds.includes(member.id) && member.id !== task.assigneeId).map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                        </select>
                        <button onClick={() => onOpenTask(task.id)} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100" title="查看任务"><Eye className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
