import { useState, type Dispatch } from 'react';
import { ArrowRight, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, Tag } from '@/app/components/PageShell';

import type { TaskWorkbenchAction } from '../store';
import type { TaskItem, TaskSortKey, TaskStatus, TaskWorkbench } from '../types';
import {
  filterTasks,
  getMemberName,
  sortTasks,
  taskModuleLabels,
  taskPriorityLabels,
  taskStatusLabels,
  toneForPriority,
  toneForStatus,
} from '../utils';
import { TaskEmptyState } from './TaskEmptyState';

export function ListView({
  workbench,
  dispatch,
  onOpenTask,
  onCreateTask,
  onNavigate,
}: {
  workbench: TaskWorkbench;
  dispatch: Dispatch<TaskWorkbenchAction>;
  onOpenTask: (taskId: string) => void;
  onCreateTask: () => void;
  onNavigate: (path: string, message: string) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<TaskSortKey>('dueDate');
  const tasks = sortTasks(filterTasks(workbench.tasks, workbench.filters), sortKey, workbench.teamMembers);

  const toggleSelected = (taskId: string) => {
    setSelectedIds((current) => (current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId]));
  };

  const batch = (patch: Partial<TaskItem>, message: string) => {
    if (selectedIds.length === 0) return;
    dispatch({ type: 'bulkUpdate', taskIds: selectedIds, patch, activity: message });
    setSelectedIds([]);
    toast.success(message);
  };

  return (
    <Card
      title="清单管理"
      subtitle="搜索、筛选、排序、批量操作与快速编辑都作用于统一任务池"
      right={
        <select value={sortKey} onChange={(event) => setSortKey(event.target.value as TaskSortKey)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600">
          <option value="dueDate">截止时间</option>
          <option value="priority">优先级</option>
          <option value="updatedAt">更新时间</option>
          <option value="assignee">负责人</option>
        </select>
      }
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => batch({ status: 'done' }, '批量完成任务')} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">批量完成</button>
        <select
          onChange={(event) => {
            if (!event.target.value) return;
            batch({ status: event.target.value as TaskStatus }, '批量更新状态');
            event.target.value = '';
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
        >
          <option value="">批量改状态</option>
          {Object.entries(taskStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select
          onChange={(event) => {
            if (!event.target.value) return;
            batch({ assigneeId: event.target.value }, '批量更新负责人');
            event.target.value = '';
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
        >
          <option value="">批量改负责人</option>
          {workbench.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
        </select>
        <button
          onClick={() => {
            if (selectedIds.length === 0) return;
            dispatch({ type: 'bulkDelete', taskIds: selectedIds });
            setSelectedIds([]);
            toast.success('批量删除任务');
          }}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
        >
          批量删除
        </button>
      </div>

      {tasks.length === 0 ? (
        <TaskEmptyState onCreate={onCreateTask} />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="py-3 text-left font-normal">任务</th>
                <th className="text-left font-normal">来源</th>
                <th className="text-left font-normal">优先级</th>
                <th className="text-left font-normal">负责人</th>
                <th className="text-left font-normal">截止</th>
                <th className="text-left font-normal">里程碑</th>
                <th className="text-left font-normal">状态</th>
                <th className="text-right font-normal">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tasks.map((task) => {
                const milestone = workbench.milestones.find((item) => item.id === task.milestoneId);
                return (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="py-3 pr-3">
                      <label className="flex items-start gap-3">
                        <input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => toggleSelected(task.id)} className="mt-1 h-4 w-4 rounded border-slate-300" />
                        <input
                          type="checkbox"
                          checked={task.status === 'done'}
                          onChange={() => {
                            dispatch({ type: 'completeTask', taskId: task.id, done: task.status !== 'done' });
                            toast.success(task.status === 'done' ? '任务已恢复' : '任务已完成');
                          }}
                          className="mt-1 h-4 w-4 rounded border-slate-300"
                        />
                        <div>
                          <p className={`font-medium ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</p>
                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">{task.description}</p>
                        </div>
                      </label>
                    </td>
                    <td className="text-slate-500">{taskModuleLabels[task.module]} · {task.sourceLabel}</td>
                    <td><Tag tone={toneForPriority(task.priority)}>{taskPriorityLabels[task.priority]}</Tag></td>
                    <td>
                      <select value={task.assigneeId} onChange={(event) => {
                        dispatch({ type: 'assignTask', taskId: task.id, assigneeId: event.target.value });
                        toast.success('负责人已更新');
                      }} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
                        {workbench.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
                      </select>
                    </td>
                    <td className="text-slate-500">{task.dueDate}</td>
                    <td className="text-slate-500">{milestone?.title ?? '未关联'}</td>
                    <td>
                      <select value={task.status} onChange={(event) => {
                        dispatch({ type: 'setTaskStatus', taskId: task.id, status: event.target.value as TaskStatus });
                        toast.success('任务状态已更新');
                      }} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
                        {Object.entries(taskStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                      <div className="mt-1"><Tag tone={toneForStatus(task.status)}>{taskStatusLabels[task.status]}</Tag></div>
                    </td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onOpenTask(task.id)} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100" title="查看详情"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => {
                          dispatch({ type: 'postponeTask', taskId: task.id, days: 1 });
                          toast.success('已延期');
                        }} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-500 hover:bg-slate-100">延期</button>
                        <button onClick={() => onNavigate(task.sourcePath, '已跳转源模块')} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100" title="跳转源模块"><ArrowRight className="h-4 w-4" /></button>
                        <button onClick={() => {
                          dispatch({ type: 'deleteTask', taskId: task.id });
                          toast.success('任务已删除');
                        }} className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50" title="删除"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-slate-400">已选择 {selectedIds.length} 项；负责人显示如 {getMemberName(workbench.teamMembers, workbench.teamMembers[0]?.id ?? '')}</p>
    </Card>
  );
}
