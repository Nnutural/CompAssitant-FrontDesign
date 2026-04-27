import { useState } from 'react';
import type { ReactNode } from 'react';

import type { TaskFormValues, TaskItem, TaskWorkbench } from '../types';
import { taskModuleLabels, taskPriorityLabels, taskStatusLabels, toTagInput, todayIso } from '../utils';

function valuesFromTask(task: TaskItem | undefined, workbench: TaskWorkbench, defaults?: Partial<TaskFormValues>): TaskFormValues {
  return {
    title: task?.title ?? defaults?.title ?? '',
    description: task?.description ?? defaults?.description ?? '',
    status: task?.status ?? defaults?.status ?? 'todo',
    priority: task?.priority ?? defaults?.priority ?? 'medium',
    module: task?.module ?? defaults?.module ?? 'manual',
    sourceLabel: task?.sourceLabel ?? defaults?.sourceLabel ?? '手动创建',
    sourcePath: task?.sourcePath ?? defaults?.sourcePath ?? '/tasks?tab=list',
    assigneeId: task?.assigneeId ?? defaults?.assigneeId ?? workbench.teamMembers[0]?.id ?? '',
    collaboratorIds: task?.collaboratorIds ?? defaults?.collaboratorIds ?? [],
    startDate: task?.startDate ?? defaults?.startDate ?? todayIso(),
    dueDate: task?.dueDate ?? defaults?.dueDate ?? todayIso(),
    estimateHours: task?.estimateHours ?? defaults?.estimateHours ?? 2,
    spentHours: task?.spentHours ?? defaults?.spentHours ?? 0,
    tags: task ? toTagInput(task.tags) : (defaults?.tags ?? ''),
    milestoneId: task?.milestoneId ?? defaults?.milestoneId ?? '',
  };
}

export function TaskForm({
  workbench,
  task,
  defaults,
  onSubmit,
  onCancel,
  submitLabel = '保存任务',
}: {
  workbench: TaskWorkbench;
  task?: TaskItem;
  defaults?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<TaskFormValues>(() => valuesFromTask(task, workbench, defaults));

  const setValue = <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!values.title.trim()) return;
        onSubmit(values);
      }}
    >
      <div>
        <label className="text-xs font-medium text-slate-500">标题</label>
        <input
          value={values.title}
          onChange={(event) => setValue('title', event.target.value)}
          className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-400"
          placeholder="例如：完成计划书 3.2 节写作"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">描述</label>
        <textarea
          value={values.description}
          onChange={(event) => setValue('description', event.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          placeholder="补充任务背景、交付物和验收标准"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="状态">
          <select value={values.status} onChange={(event) => setValue('status', event.target.value as TaskFormValues['status'])} className="form-select">
            {Object.entries(taskStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>
        <Field label="优先级">
          <select value={values.priority} onChange={(event) => setValue('priority', event.target.value as TaskFormValues['priority'])} className="form-select">
            {Object.entries(taskPriorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>
        <Field label="来源模块">
          <select value={values.module} onChange={(event) => setValue('module', event.target.value as TaskFormValues['module'])} className="form-select">
            {Object.entries(taskModuleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </Field>
        <Field label="负责人">
          <select value={values.assigneeId} onChange={(event) => setValue('assigneeId', event.target.value)} className="form-select">
            {workbench.teamMembers.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
        </Field>
        <Field label="开始日期">
          <input type="date" value={values.startDate} onChange={(event) => setValue('startDate', event.target.value)} className="form-select" />
        </Field>
        <Field label="截止日期">
          <input type="date" value={values.dueDate} onChange={(event) => setValue('dueDate', event.target.value)} className="form-select" />
        </Field>
        <Field label="预计工时">
          <input type="number" min={0.5} step={0.5} value={values.estimateHours} onChange={(event) => setValue('estimateHours', Number(event.target.value))} className="form-select" />
        </Field>
        <Field label="已投入工时">
          <input type="number" min={0} step={0.5} value={values.spentHours} onChange={(event) => setValue('spentHours', Number(event.target.value))} className="form-select" />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="来源标签">
          <input value={values.sourceLabel} onChange={(event) => setValue('sourceLabel', event.target.value)} className="form-select" />
        </Field>
        <Field label="来源路径">
          <input value={values.sourcePath} onChange={(event) => setValue('sourcePath', event.target.value)} className="form-select" />
        </Field>
      </div>
      <Field label="协作者">
        <div className="flex flex-wrap gap-2">
          {workbench.teamMembers.map((member) => {
            const checked = values.collaboratorIds.includes(member.id);
            return (
              <label key={member.id} className={`rounded-lg border px-3 py-1.5 text-xs ${checked ? 'border-brand-blue-300 bg-brand-blue-50 text-brand-blue-700' : 'border-slate-200 text-slate-600'}`}>
                <input
                  type="checkbox"
                  className="mr-1.5"
                  checked={checked}
                  onChange={() => {
                    setValue(
                      'collaboratorIds',
                      checked ? values.collaboratorIds.filter((id) => id !== member.id) : [...values.collaboratorIds, member.id],
                    );
                  }}
                />
                {member.name}
              </label>
            );
          })}
        </div>
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="里程碑">
          <select value={values.milestoneId} onChange={(event) => setValue('milestoneId', event.target.value)} className="form-select">
            <option value="">不关联</option>
            {workbench.milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.title}</option>)}
          </select>
        </Field>
        <Field label="标签">
          <input value={values.tags} onChange={(event) => setValue('tags', event.target.value)} className="form-select" placeholder="用逗号分隔" />
        </Field>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
            取消
          </button>
        )}
        <button type="submit" className="rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="mt-1 [&_.form-select]:h-10 [&_.form-select]:w-full [&_.form-select]:rounded-lg [&_.form-select]:border [&_.form-select]:border-slate-200 [&_.form-select]:bg-white [&_.form-select]:px-3 [&_.form-select]:text-sm [&_.form-select]:text-slate-700 [&_.form-select]:outline-none [&_.form-select:focus]:border-brand-blue-400">
        {children}
      </div>
    </label>
  );
}
