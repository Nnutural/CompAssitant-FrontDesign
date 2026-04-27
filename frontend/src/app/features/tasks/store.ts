import { useCallback, useEffect, useReducer } from 'react';

import { simulateTaskSave } from './api';
import { createDefaultTaskWorkbench, defaultFilters, TASKS_STORAGE_KEY } from './mockData';
import type {
  AutosaveStatus,
  Milestone,
  TaskActivity,
  TaskActivityType,
  TaskComment,
  TaskFilters,
  TaskFormValues,
  TaskItem,
  TaskStatus,
  TaskWorkbench,
} from './types';
import { parseTagInput, taskStatusOrder, todayIso } from './utils';

export type TaskWorkbenchAction =
  | { type: 'replaceWorkbench'; workbench: TaskWorkbench }
  | { type: 'setAutosaveStatus'; status: AutosaveStatus; savedAt?: string }
  | { type: 'setFilters'; filters: Partial<TaskFilters> }
  | { type: 'setCurrentMonth'; month: string }
  | { type: 'setSelectedDate'; date?: string }
  | { type: 'setSelectedTask'; taskId?: string }
  | { type: 'addTask'; task: TaskItem; actor?: string }
  | { type: 'importTasks'; tasks: TaskItem[] }
  | { type: 'updateTask'; taskId: string; patch: Partial<TaskItem>; activity?: string }
  | { type: 'deleteTask'; taskId: string }
  | { type: 'setTaskStatus'; taskId: string; status: TaskStatus }
  | { type: 'completeTask'; taskId: string; done: boolean }
  | { type: 'postponeTask'; taskId: string; days: number }
  | { type: 'assignTask'; taskId: string; assigneeId: string }
  | { type: 'addCollaborator'; taskId: string; memberId: string }
  | { type: 'addComment'; taskId: string; comment: TaskComment }
  | { type: 'bulkUpdate'; taskIds: string[]; patch: Partial<TaskItem>; activity: string }
  | { type: 'bulkDelete'; taskIds: string[] }
  | { type: 'addMilestone'; milestone: Milestone }
  | { type: 'updateMilestone'; milestoneId: string; patch: Partial<Milestone> };

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createActivity(taskId: string, type: TaskActivityType, content: string, actor = '陈同学'): TaskActivity {
  return {
    id: createId('activity'),
    taskId,
    type,
    actor,
    content,
    createdAt: new Date().toISOString(),
  };
}

function deriveOrder(tasks: TaskItem[]): Record<TaskStatus, string[]> {
  return taskStatusOrder.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status && !task.archived).map((task) => task.id);
    return acc;
  }, {} as Record<TaskStatus, string[]>);
}

function refreshTeamMembers(workbench: TaskWorkbench): TaskWorkbench {
  const teamMembers = workbench.teamMembers.map((member) => {
    const assigned = workbench.tasks.filter((task) => task.assigneeId === member.id && task.status !== 'done' && !task.archived);
    return {
      ...member,
      assignedTaskIds: assigned.map((task) => task.id),
      currentLoadHours: assigned.reduce((sum, task) => sum + task.estimateHours, 0),
    };
  });
  return {
    ...workbench,
    teamMembers,
    taskOrderByStatus: deriveOrder(workbench.tasks),
  };
}

function touchTask(task: TaskItem, patch: Partial<TaskItem>): TaskItem {
  const nextStatus = patch.status ?? task.status;
  return {
    ...task,
    ...patch,
    updatedAt: new Date().toISOString(),
    completedAt: nextStatus === 'done' ? (patch.completedAt ?? task.completedAt ?? new Date().toISOString()) : undefined,
  };
}

function markDirty(workbench: TaskWorkbench): TaskWorkbench {
  return refreshTeamMembers({
    ...workbench,
    autosaveStatus: 'unsaved',
    updatedAt: new Date().toISOString(),
  });
}

export function createTaskFromForm(values: TaskFormValues): TaskItem {
  const now = new Date().toISOString();
  return {
    id: createId('task'),
    title: values.title.trim(),
    description: values.description.trim(),
    status: values.status,
    priority: values.priority,
    module: values.module,
    sourceLabel: values.sourceLabel.trim() || '手动创建',
    sourcePath: values.sourcePath.trim() || '/tasks?tab=list',
    assigneeId: values.assigneeId,
    collaboratorIds: values.collaboratorIds,
    startDate: values.startDate || todayIso(),
    dueDate: values.dueDate || todayIso(),
    estimateHours: Number(values.estimateHours) || 1,
    spentHours: Number(values.spentHours) || 0,
    tags: parseTagInput(values.tags),
    milestoneId: values.milestoneId || undefined,
    evidenceIds: [],
    dependencyIds: [],
    comments: [],
    createdAt: now,
    updatedAt: now,
    completedAt: values.status === 'done' ? now : undefined,
    archived: false,
  };
}

function reducer(workbench: TaskWorkbench, action: TaskWorkbenchAction): TaskWorkbench {
  switch (action.type) {
    case 'replaceWorkbench':
      return action.workbench;
    case 'setAutosaveStatus':
      return { ...workbench, autosaveStatus: action.status, savedAt: action.savedAt ?? workbench.savedAt };
    case 'setFilters':
      return { ...workbench, filters: { ...workbench.filters, ...action.filters } };
    case 'setCurrentMonth':
      return markDirty({ ...workbench, currentMonth: action.month });
    case 'setSelectedDate':
      return { ...workbench, selectedDate: action.date };
    case 'setSelectedTask':
      return { ...workbench, selectedTaskId: action.taskId };
    case 'addTask':
      return markDirty({
        ...workbench,
        tasks: [action.task, ...workbench.tasks],
        selectedTaskId: action.task.id,
        activities: [createActivity(action.task.id, 'created', `创建任务：${action.task.title}`, action.actor), ...workbench.activities],
      });
    case 'importTasks': {
      const imported = action.tasks.filter((task) => {
        const marker = task.relatedObjectId ?? task.id;
        return !workbench.importedTaskIds.includes(marker) && !workbench.tasks.some((item) => item.relatedObjectId && item.relatedObjectId === marker);
      });
      if (imported.length === 0) return workbench;
      return markDirty({
        ...workbench,
        tasks: [...imported, ...workbench.tasks],
        importedTaskIds: [...workbench.importedTaskIds, ...imported.map((task) => task.relatedObjectId ?? task.id)],
        activities: [
          ...imported.map((task) => createActivity(task.id, 'imported', `导入跨模块任务：${task.title}`, '系统')),
          ...workbench.activities,
        ],
      });
    }
    case 'updateTask':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => (task.id === action.taskId ? touchTask(task, action.patch) : task)),
        activities: action.activity ? [createActivity(action.taskId, 'updated', action.activity), ...workbench.activities] : workbench.activities,
      });
    case 'deleteTask':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => (task.id === action.taskId ? touchTask(task, { archived: true }) : task)),
        activities: [createActivity(action.taskId, 'updated', '删除任务'), ...workbench.activities],
      });
    case 'setTaskStatus':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => (task.id === action.taskId ? touchTask(task, { status: action.status }) : task)),
        activities: [createActivity(action.taskId, 'status_changed', `任务状态更新为 ${action.status}`), ...workbench.activities],
      });
    case 'completeTask':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => (task.id === action.taskId ? touchTask(task, { status: action.done ? 'done' : 'todo' }) : task)),
        activities: [createActivity(action.taskId, action.done ? 'completed' : 'status_changed', action.done ? '任务已完成' : '任务已恢复'), ...workbench.activities],
      });
    case 'postponeTask': {
      const tasks = workbench.tasks.map((task) => {
        if (task.id !== action.taskId) return task;
        const next = new Date(`${task.dueDate}T00:00:00`);
        next.setDate(next.getDate() + action.days);
        return touchTask(task, { dueDate: next.toISOString().slice(0, 10) });
      });
      return markDirty({
        ...workbench,
        tasks,
        activities: [createActivity(action.taskId, 'rescheduled', `任务已延期 ${action.days} 天`), ...workbench.activities],
      });
    }
    case 'assignTask':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => (task.id === action.taskId ? touchTask(task, { assigneeId: action.assigneeId }) : task)),
        activities: [createActivity(action.taskId, 'assigned', '负责人已更新'), ...workbench.activities],
      });
    case 'addCollaborator':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => {
          if (task.id !== action.taskId || task.collaboratorIds.includes(action.memberId)) return task;
          return touchTask(task, { collaboratorIds: [...task.collaboratorIds, action.memberId] });
        }),
        activities: [createActivity(action.taskId, 'assigned', '协作者已更新'), ...workbench.activities],
      });
    case 'addComment':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => (task.id === action.taskId ? touchTask(task, { comments: [...task.comments, action.comment] }) : task)),
        activities: [createActivity(action.taskId, 'commented', action.comment.content, action.comment.author), ...workbench.activities],
      });
    case 'bulkUpdate':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => (action.taskIds.includes(task.id) ? touchTask(task, action.patch) : task)),
        activities: [
          ...action.taskIds.map((taskId) => createActivity(taskId, 'updated', action.activity)),
          ...workbench.activities,
        ],
      });
    case 'bulkDelete':
      return markDirty({
        ...workbench,
        tasks: workbench.tasks.map((task) => (action.taskIds.includes(task.id) ? touchTask(task, { archived: true }) : task)),
        activities: [
          ...action.taskIds.map((taskId) => createActivity(taskId, 'updated', '批量删除任务')),
          ...workbench.activities,
        ],
      });
    case 'addMilestone':
      return markDirty({ ...workbench, milestones: [action.milestone, ...workbench.milestones] });
    case 'updateMilestone':
      return markDirty({
        ...workbench,
        milestones: workbench.milestones.map((milestone) => (milestone.id === action.milestoneId ? { ...milestone, ...action.patch } : milestone)),
      });
    default:
      return workbench;
  }
}

function normalizeWorkbench(parsed: Partial<TaskWorkbench>, defaults: TaskWorkbench): TaskWorkbench {
  const tasks = parsed.tasks?.length ? parsed.tasks : defaults.tasks;
  const workbench: TaskWorkbench = {
    ...defaults,
    ...parsed,
    tasks: tasks.map((task) => ({
      ...task,
      comments: task.comments ?? [],
      collaboratorIds: task.collaboratorIds ?? [],
      evidenceIds: task.evidenceIds ?? [],
      dependencyIds: task.dependencyIds ?? [],
      archived: Boolean(task.archived),
    })),
    milestones: parsed.milestones?.length ? parsed.milestones : defaults.milestones,
    teamMembers: parsed.teamMembers?.length ? parsed.teamMembers : defaults.teamMembers,
    activities: parsed.activities ?? defaults.activities,
    filters: { ...defaultFilters, ...parsed.filters },
    boardColumnOrder: parsed.boardColumnOrder ?? defaults.boardColumnOrder,
    taskOrderByStatus: parsed.taskOrderByStatus ?? deriveOrder(tasks),
    importedTaskIds: parsed.importedTaskIds ?? [],
    currentMonth: parsed.currentMonth ?? defaults.currentMonth,
    autosaveStatus: 'saved',
  };
  return refreshTeamMembers(workbench);
}

function loadInitialWorkbench(): TaskWorkbench {
  const defaults = createDefaultTaskWorkbench();
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return defaults;
    return normalizeWorkbench(JSON.parse(raw) as Partial<TaskWorkbench>, defaults);
  } catch {
    return defaults;
  }
}

function persistWorkbench(workbench: TaskWorkbench, savedAt: string) {
  const snapshot: TaskWorkbench = {
    ...workbench,
    autosaveStatus: 'saved',
    savedAt,
    updatedAt: savedAt,
  };
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(snapshot));
}

export function useTaskWorkbench() {
  const [workbench, dispatch] = useReducer(reducer, undefined, loadInitialWorkbench);

  useEffect(() => {
    if (workbench.autosaveStatus !== 'unsaved') return undefined;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'setAutosaveStatus', status: 'saving' });
      simulateTaskSave()
        .then(({ savedAt }) => {
          persistWorkbench(workbench, savedAt);
          dispatch({ type: 'setAutosaveStatus', status: 'saved', savedAt });
        })
        .catch(() => {
          dispatch({ type: 'setAutosaveStatus', status: 'error' });
        });
    }, 650);
    return () => window.clearTimeout(timer);
  }, [workbench]);

  const saveNow = useCallback(() => {
    dispatch({ type: 'setAutosaveStatus', status: 'saving' });
    try {
      const savedAt = new Date().toISOString();
      persistWorkbench(workbench, savedAt);
      dispatch({ type: 'setAutosaveStatus', status: 'saved', savedAt });
      return true;
    } catch {
      dispatch({ type: 'setAutosaveStatus', status: 'error' });
      return false;
    }
  }, [workbench]);

  const resetDemo = useCallback(() => {
    const next = createDefaultTaskWorkbench();
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next));
    dispatch({ type: 'replaceWorkbench', workbench: next });
  }, []);

  return { workbench, dispatch, saveNow, resetDemo };
}
