import type { TaskImportPayload, TaskItem } from './types';
import { addDays, parseTagInput } from './utils';

export const TASK_INBOX_KEY = 'tasks-inbox-demo';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function pushTaskImport(payload: TaskImportPayload): void {
  if (typeof window === 'undefined') return;
  const current = readTaskImports();
  window.localStorage.setItem(TASK_INBOX_KEY, JSON.stringify([...current, payload]));
}

export function readTaskImports(): TaskImportPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(TASK_INBOX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TaskImportPayload[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearTaskImports(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TASK_INBOX_KEY);
}

export function normalizeImportedTask(payload: TaskImportPayload): TaskItem {
  const now = new Date().toISOString();
  const tags = Array.isArray(payload.tags) ? payload.tags : parseTagInput(String(payload.tags ?? ''));

  return {
    id: createId('task-imported'),
    title: payload.title,
    description: payload.description,
    status: 'todo',
    priority: payload.priority,
    module: payload.module,
    sourceLabel: payload.sourceLabel,
    sourcePath: payload.sourcePath,
    assigneeId: 'member-chen',
    collaboratorIds: [],
    startDate: new Date().toISOString().slice(0, 10),
    dueDate: payload.dueDate ?? addDays(3),
    estimateHours: 2,
    spentHours: 0,
    tags,
    evidenceIds: [],
    dependencyIds: [],
    relatedObjectId: payload.relatedObjectId,
    comments: [],
    createdAt: now,
    updatedAt: now,
    archived: false,
  };
}
