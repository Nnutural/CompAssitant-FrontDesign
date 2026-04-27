import type { Dispatch } from 'react';
import { Search } from 'lucide-react';

import type { TaskWorkbenchAction } from '../store';
import type { TaskWorkbench } from '../types';
import { taskModuleLabels, taskPriorityLabels, taskStatusLabels } from '../utils';

export function TaskToolbar({
  workbench,
  dispatch,
}: {
  workbench: TaskWorkbench;
  dispatch: Dispatch<TaskWorkbenchAction>;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.3fr)_repeat(5,minmax(120px,1fr))]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={workbench.filters.query}
            onChange={(event) => dispatch({ type: 'setFilters', filters: { query: event.target.value } })}
            placeholder="搜索标题、描述、标签、来源"
            className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-brand-blue-400"
          />
        </label>
        <select
          value={workbench.filters.status}
          onChange={(event) => dispatch({ type: 'setFilters', filters: { status: event.target.value as TaskWorkbench['filters']['status'] } })}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
        >
          <option value="all">全部状态</option>
          {Object.entries(taskStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select
          value={workbench.filters.priority}
          onChange={(event) => dispatch({ type: 'setFilters', filters: { priority: event.target.value as TaskWorkbench['filters']['priority'] } })}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
        >
          <option value="all">全部优先级</option>
          {Object.entries(taskPriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select
          value={workbench.filters.module}
          onChange={(event) => dispatch({ type: 'setFilters', filters: { module: event.target.value as TaskWorkbench['filters']['module'] } })}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
        >
          <option value="all">全部来源</option>
          {Object.entries(taskModuleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select
          value={workbench.filters.assigneeId}
          onChange={(event) => dispatch({ type: 'setFilters', filters: { assigneeId: event.target.value } })}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
        >
          <option value="all">全部负责人</option>
          {workbench.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
        </select>
        <select
          value={workbench.filters.milestoneId}
          onChange={(event) => dispatch({ type: 'setFilters', filters: { milestoneId: event.target.value } })}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
        >
          <option value="all">全部里程碑</option>
          {workbench.milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.title}</option>)}
        </select>
      </div>
    </div>
  );
}
