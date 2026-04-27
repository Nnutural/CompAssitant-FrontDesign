import type { Dispatch } from 'react';

import type { TaskWorkbenchAction } from '../store';
import type { TaskWorkbench } from '../types';
import { filterTasks } from '../utils';
import { BoardColumn } from './BoardColumn';

export function BoardView({
  workbench,
  dispatch,
  onOpenTask,
}: {
  workbench: TaskWorkbench;
  dispatch: Dispatch<TaskWorkbenchAction>;
  onOpenTask: (taskId: string) => void;
}) {
  const visible = filterTasks(workbench.tasks, workbench.filters);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {workbench.boardColumnOrder.map((status) => (
        <BoardColumn
          key={status}
          status={status}
          tasks={visible.filter((task) => task.status === status)}
          teamMembers={workbench.teamMembers}
          milestones={workbench.milestones}
          dispatch={dispatch}
          onOpenTask={onOpenTask}
        />
      ))}
    </div>
  );
}
