import type {
  AutosaveStatus,
  Milestone,
  MilestoneStatus,
  RiskLevel,
  TaskFilters,
  TaskItem,
  TaskModule,
  TaskPriority,
  TaskSortKey,
  TaskStatus,
  TeamMember,
} from './types';

export const taskStatusOrder: TaskStatus[] = ['todo', 'doing', 'review', 'done'];

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: '待办',
  doing: '进行中',
  review: '评审',
  done: '已完成',
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
};

export const taskModuleLabels: Record<TaskModule, string> = {
  workspace: '总览',
  writing: '选题写作',
  research: '科研创新',
  careers: '就业招聘',
  forum: '交流论坛',
  chat: '智能问答',
  practice: '实战进阶',
  profile: '个人中心',
  manual: '手动创建',
};

export const milestoneStatusLabels: Record<MilestoneStatus, string> = {
  not_started: '未开始',
  in_progress: '推进中',
  at_risk: '有风险',
  completed: '已完成',
};

export const riskLevelLabels: Record<RiskLevel, string> = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
};

export const autosaveLabels: Record<AutosaveStatus, string> = {
  saved: '已保存',
  saving: '保存中',
  unsaved: '未保存',
  error: '保存失败',
};

export const priorityRank: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function toneForStatus(status: TaskStatus): 'default' | 'blue' | 'amber' | 'green' {
  if (status === 'doing') return 'blue';
  if (status === 'review') return 'amber';
  if (status === 'done') return 'green';
  return 'default';
}

export function toneForPriority(priority: TaskPriority): 'red' | 'amber' | 'blue' {
  if (priority === 'high') return 'red';
  if (priority === 'medium') return 'amber';
  return 'blue';
}

export function toneForRisk(risk: RiskLevel): 'red' | 'amber' | 'green' {
  if (risk === 'high') return 'red';
  if (risk === 'medium') return 'amber';
  return 'green';
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthIso(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function addDays(days: number, base = new Date()): string {
  const next = new Date(base);
  next.setDate(next.getDate() + days);
  return next.toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  const left = new Date(`${a}T00:00:00`).getTime();
  const right = new Date(`${b}T00:00:00`).getTime();
  return Math.round((right - left) / 86400000);
}

export function isTaskDone(task: TaskItem): boolean {
  return task.status === 'done' || Boolean(task.completedAt);
}

export function isOverdue(task: TaskItem): boolean {
  return !isTaskDone(task) && daysBetween(todayIso(), task.dueDate) < 0;
}

export function isDueSoon(task: TaskItem): boolean {
  const days = daysBetween(todayIso(), task.dueDate);
  return !isTaskDone(task) && days >= 0 && days <= 3;
}

export function getNextStatus(status: TaskStatus): TaskStatus {
  const index = taskStatusOrder.indexOf(status);
  return taskStatusOrder[Math.min(taskStatusOrder.length - 1, index + 1)];
}

export function getPreviousStatus(status: TaskStatus): TaskStatus {
  const index = taskStatusOrder.indexOf(status);
  return taskStatusOrder[Math.max(0, index - 1)];
}

export function getTaskProgress(task: TaskItem): number {
  if (task.status === 'done') return 100;
  if (task.status === 'review') return 78;
  if (task.status === 'doing') return Math.max(35, Math.min(75, Math.round((task.spentHours / Math.max(task.estimateHours, 1)) * 100)));
  return 12;
}

export function getMilestoneProgress(milestone: Milestone, tasks: TaskItem[]): number {
  const related = tasks.filter((task) => task.milestoneId === milestone.id && !task.archived);
  if (related.length === 0) return 0;
  const done = related.filter((task) => task.status === 'done').length;
  return Math.round((done / related.length) * 100);
}

export function getMemberLoad(member: TeamMember, tasks: TaskItem[]): number {
  return tasks
    .filter((task) => task.assigneeId === member.id && task.status !== 'done' && !task.archived)
    .reduce((sum, task) => sum + task.estimateHours, 0);
}

export function getTaskStats(tasks: TaskItem[], teamMembers: TeamMember[]) {
  const active = tasks.filter((task) => !task.archived);
  const todo = active.filter((task) => task.status === 'todo').length;
  const doing = active.filter((task) => task.status === 'doing').length;
  const review = active.filter((task) => task.status === 'review').length;
  const done = active.filter((task) => task.status === 'done').length;
  const overdue = active.filter(isOverdue).length;
  const dueSoon = active.filter(isDueSoon).length;
  const totalCapacity = teamMembers.reduce((sum, member) => sum + member.capacityHoursPerWeek, 0);
  const totalLoad = teamMembers.reduce((sum, member) => sum + getMemberLoad(member, active), 0);

  return {
    total: active.length,
    todo,
    doing,
    review,
    done,
    overdue,
    dueSoon,
    teamLoadPercent: totalCapacity ? Math.round((totalLoad / totalCapacity) * 100) : 0,
  };
}

export function filterTasks(tasks: TaskItem[], filters: TaskFilters): TaskItem[] {
  const query = filters.query.trim().toLowerCase();
  return tasks.filter((task) => {
    if (!filters.showArchived && task.archived) return false;
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.module !== 'all' && task.module !== filters.module) return false;
    if (filters.assigneeId !== 'all' && task.assigneeId !== filters.assigneeId) return false;
    if (filters.milestoneId !== 'all' && task.milestoneId !== filters.milestoneId) return false;
    if (filters.dateRange === 'overdue' && !isOverdue(task)) return false;
    if (filters.dateRange === 'soon' && !isDueSoon(task)) return false;
    if (filters.dateRange === 'this_week') {
      const days = daysBetween(todayIso(), task.dueDate);
      if (days < 0 || days > 7) return false;
    }
    if (!query) return true;
    return [
      task.title,
      task.description,
      task.sourceLabel,
      taskModuleLabels[task.module],
      ...task.tags,
    ].some((value) => value.toLowerCase().includes(query));
  });
}

export function sortTasks(tasks: TaskItem[], sortKey: TaskSortKey, teamMembers: TeamMember[]): TaskItem[] {
  const members = new Map(teamMembers.map((member) => [member.id, member.name]));
  return [...tasks].sort((a, b) => {
    if (sortKey === 'priority') return priorityRank[b.priority] - priorityRank[a.priority];
    if (sortKey === 'updatedAt') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sortKey === 'assignee') return (members.get(a.assigneeId) ?? '').localeCompare(members.get(b.assigneeId) ?? '', 'zh-CN');
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function getMonthGrid(month: string): string[] {
  const [year, monthIndex] = month.split('-').map(Number);
  const first = new Date(year, monthIndex - 1, 1);
  const startDay = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - startDay);
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
}

export function shiftMonth(month: string, delta: number): string {
  const [year, monthIndex] = month.split('-').map(Number);
  return monthIso(new Date(year, monthIndex - 1 + delta, 1));
}

export function getMemberName(teamMembers: TeamMember[], id: string): string {
  return teamMembers.find((member) => member.id === id)?.name ?? '未分配';
}

export function buildTaskLink(taskId: string): string {
  return `${window.location.origin}/tasks?tab=list&task=${taskId}`;
}

export function toTagInput(tags: string[]): string {
  return tags.join('，');
}

export function parseTagInput(value: string): string[] {
  return value
    .split(/[,，\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}
