import type { Dispatch } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Card, Tag } from '@/app/components/PageShell';

import type { TaskWorkbenchAction } from '../store';
import type { TaskWorkbench } from '../types';
import { getMonthGrid, isDueSoon, isOverdue, monthIso, shiftMonth } from '../utils';
import { DayTaskDrawer } from './DayTaskDrawer';

export function CalendarView({
  workbench,
  dispatch,
  onOpenTask,
  onCreateTask,
  onNavigate,
}: {
  workbench: TaskWorkbench;
  dispatch: Dispatch<TaskWorkbenchAction>;
  onOpenTask: (taskId: string) => void;
  onCreateTask: (date?: string) => void;
  onNavigate: (path: string, message: string) => void;
}) {
  const days = getMonthGrid(workbench.currentMonth);
  const selectedTasks = workbench.tasks.filter((task) => !task.archived && task.dueDate === workbench.selectedDate);

  return (
    <>
      <Card
        title={`${workbench.currentMonth} · 截止日历`}
        subtitle="真实月份视图，日期格展示任务落点、临期和逾期风险"
        right={
          <div className="flex gap-2">
            <button onClick={() => dispatch({ type: 'setCurrentMonth', month: shiftMonth(workbench.currentMonth, -1) })} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50" title="上个月"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => dispatch({ type: 'setCurrentMonth', month: monthIso() })} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">今天</button>
            <button onClick={() => dispatch({ type: 'setCurrentMonth', month: shiftMonth(workbench.currentMonth, 1) })} className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50" title="下个月"><ChevronRight className="h-4 w-4" /></button>
          </div>
        }
      >
        <div className="grid grid-cols-7 gap-2 text-center">
          {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
            <div key={day} className="py-1 text-xs text-slate-400">{day}</div>
          ))}
          {days.map((date) => {
            const tasks = workbench.tasks.filter((task) => !task.archived && task.dueDate === date);
            const inMonth = date.startsWith(workbench.currentMonth);
            const risky = tasks.some(isOverdue);
            const soon = tasks.some(isDueSoon);
            return (
              <button
                key={date}
                onClick={() => dispatch({ type: 'setSelectedDate', date })}
                className={`min-h-[96px] rounded-xl border p-2 text-left transition-colors ${
                  risky ? 'border-red-200 bg-red-50' : soon ? 'border-amber-200 bg-amber-50' : tasks.length ? 'border-brand-blue-200 bg-brand-blue-50' : 'border-slate-100 bg-white'
                } ${inMonth ? '' : 'opacity-45'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">{Number(date.slice(-2))}</span>
                  {tasks.length > 0 && <Tag tone={risky ? 'red' : soon ? 'amber' : 'blue'}>{tasks.length}</Tag>}
                </div>
                <div className="mt-2 space-y-1">
                  {tasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="truncate rounded bg-white/70 px-1.5 py-0.5 text-[11px] text-slate-700">{task.title}</div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </Card>
      <DayTaskDrawer
        date={workbench.selectedDate}
        tasks={selectedTasks}
        workbench={workbench}
        dispatch={dispatch}
        onClose={() => dispatch({ type: 'setSelectedDate', date: undefined })}
        onOpenTask={onOpenTask}
        onCreateTask={onCreateTask}
        onNavigate={onNavigate}
      />
    </>
  );
}
