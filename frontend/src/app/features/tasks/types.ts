export type AutosaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export type TaskStatus = 'todo' | 'doing' | 'review' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskModule =
  | 'workspace'
  | 'writing'
  | 'research'
  | 'careers'
  | 'forum'
  | 'chat'
  | 'practice'
  | 'profile'
  | 'manual';

export type MilestoneStatus = 'not_started' | 'in_progress' | 'at_risk' | 'completed';
export type RiskLevel = 'low' | 'medium' | 'high';
export type TaskActivityType =
  | 'created'
  | 'updated'
  | 'completed'
  | 'commented'
  | 'assigned'
  | 'rescheduled'
  | 'status_changed'
  | 'imported';

export type TaskComment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  module: TaskModule;
  sourceLabel: string;
  sourcePath: string;
  assigneeId: string;
  collaboratorIds: string[];
  startDate: string;
  dueDate: string;
  estimateHours: number;
  spentHours: number;
  tags: string[];
  milestoneId?: string;
  evidenceIds: string[];
  dependencyIds: string[];
  relatedObjectId?: string;
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archived: boolean;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: MilestoneStatus;
  relatedTaskIds: string[];
  deliverables: string[];
  riskLevel: RiskLevel;
  ownerId: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  capacityHoursPerWeek: number;
  skillTags: string[];
  currentLoadHours: number;
  assignedTaskIds: string[];
};

export type TaskActivity = {
  id: string;
  taskId: string;
  type: TaskActivityType;
  actor: string;
  content: string;
  createdAt: string;
};

export type TaskFilters = {
  query: string;
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  module: 'all' | TaskModule;
  assigneeId: 'all' | string;
  milestoneId: 'all' | string;
  dateRange: 'all' | 'overdue' | 'soon' | 'this_week';
  showArchived: boolean;
};

export type TaskImportPayload = {
  title: string;
  description: string;
  module: TaskModule;
  sourceLabel: string;
  sourcePath: string;
  priority: TaskPriority;
  dueDate?: string;
  tags: string[];
  relatedObjectId?: string;
};

export type TaskSortKey = 'dueDate' | 'priority' | 'updatedAt' | 'assignee';

export type TaskWorkbench = {
  id: string;
  tasks: TaskItem[];
  milestones: Milestone[];
  teamMembers: TeamMember[];
  activities: TaskActivity[];
  filters: TaskFilters;
  selectedTaskId?: string;
  selectedDate?: string;
  currentMonth: string;
  boardColumnOrder: TaskStatus[];
  taskOrderByStatus: Record<TaskStatus, string[]>;
  importedTaskIds: string[];
  autosaveStatus: AutosaveStatus;
  savedAt: string;
  updatedAt: string;
};

export type TaskFormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  module: TaskModule;
  sourceLabel: string;
  sourcePath: string;
  assigneeId: string;
  collaboratorIds: string[];
  startDate: string;
  dueDate: string;
  estimateHours: number;
  spentHours: number;
  tags: string;
  milestoneId: string;
};
