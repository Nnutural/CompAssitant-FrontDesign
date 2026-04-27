import type { Dispatch } from 'react';

import { Card, Tag } from '@/app/components/PageShell';

import type { TaskWorkbenchAction } from '../store';
import type { Milestone, TaskItem, TaskStatus, TeamMember } from '../types';
import { taskStatusLabels, toneForStatus } from '../utils';
import { TaskCard } from './TaskCard';

export function BoardColumn({
  status,
  tasks,
  teamMembers,
  milestones,
  dispatch,
  onOpenTask,
}: {
  status: TaskStatus;
  tasks: TaskItem[];
  teamMembers: TeamMember[];
  milestones: Milestone[];
  dispatch: Dispatch<TaskWorkbenchAction>;
  onOpenTask: (taskId: string) => void;
}) {
  return (
    <Card title={`${taskStatusLabels[status]} · ${tasks.length}`} right={<Tag tone={toneForStatus(status)}>列</Tag>}>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            teamMembers={teamMembers}
            milestone={milestones.find((milestone) => milestone.id === task.milestoneId)}
            dispatch={dispatch}
            onOpen={onOpenTask}
          />
        ))}
        {tasks.length === 0 && <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">暂无任务</p>}
      </div>
    </Card>
  );
}
