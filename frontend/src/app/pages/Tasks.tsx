import { useEffect, useState, type ReactNode } from 'react';
import { Download, Plus, RotateCcw, Save, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageShell } from '@/app/components/PageShell';
import { BoardView } from '@/app/features/tasks/components/BoardView';
import { CalendarView } from '@/app/features/tasks/components/CalendarView';
import { ListView } from '@/app/features/tasks/components/ListView';
import { MilestoneView } from '@/app/features/tasks/components/MilestoneView';
import { TaskDrawer } from '@/app/features/tasks/components/TaskDrawer';
import { TaskForm } from '@/app/features/tasks/components/TaskForm';
import { TaskLoadingState } from '@/app/features/tasks/components/TaskLoadingState';
import { TaskToolbar } from '@/app/features/tasks/components/TaskToolbar';
import { TaskWorkbenchBar } from '@/app/features/tasks/components/TaskWorkbenchBar';
import { TeamCollabView } from '@/app/features/tasks/components/TeamCollabView';
import { TimelineView } from '@/app/features/tasks/components/TimelineView';
import { simulateTaskImport } from '@/app/features/tasks/api';
import { createTaskFromForm, useTaskWorkbench } from '@/app/features/tasks/store';
import { clearTaskImports, normalizeImportedTask, readTaskImports } from '@/app/features/tasks/taskBridge';
import type { TaskFormValues } from '@/app/features/tasks/types';

function ToolbarButton({
  children,
  icon: Icon,
  onClick,
  tone = 'default',
  disabled,
}: {
  children: string;
  icon: LucideIcon;
  onClick: () => void;
  tone?: 'default' | 'primary' | 'danger';
  disabled?: boolean;
}) {
  const className =
    tone === 'primary'
      ? 'bg-brand-blue-600 text-white hover:bg-brand-blue-700'
      : tone === 'danger'
        ? 'border border-red-200 bg-white text-red-700 hover:bg-red-50'
        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

export function Tasks() {
  const navigate = useNavigate();
  const { workbench, dispatch, saveNow, resetDemo } = useTaskWorkbench();
  const [creating, setCreating] = useState(false);
  const [createDefaults, setCreateDefaults] = useState<Partial<TaskFormValues> | undefined>();
  const [importing, setImporting] = useState(false);

  const selectedTask = workbench.tasks.find((task) => task.id === workbench.selectedTaskId) ?? null;

  const openTask = (taskId: string) => dispatch({ type: 'setSelectedTask', taskId });
  const closeTask = () => dispatch({ type: 'setSelectedTask', taskId: undefined });
  const goToPath = (path: string, message: string) => {
    navigate(path);
    toast.success(message);
  };

  const openCreate = (dueDate?: string) => {
    setCreateDefaults(dueDate ? { dueDate, startDate: dueDate } : undefined);
    setCreating(true);
  };

  const createTask = (values: TaskFormValues) => {
    const task = createTaskFromForm(values);
    dispatch({ type: 'addTask', task });
    setCreating(false);
    setCreateDefaults(undefined);
    toast.success('任务已创建');
  };

  const importInbox = async (silent = false) => {
    const inbox = readTaskImports();
    if (inbox.length === 0) {
      if (!silent) toast.info('暂无跨模块任务可导入');
      return;
    }
    setImporting(true);
    await simulateTaskImport();
    const tasks = inbox.map(normalizeImportedTask);
    dispatch({ type: 'importTasks', tasks });
    clearTaskImports();
    setImporting(false);
    toast.success(`已导入 ${tasks.length} 条跨模块任务`);
  };

  useEffect(() => {
    importInbox(true);
  }, []);

  const saveTasks = () => {
    const ok = saveNow();
    if (ok) toast.success('任务已保存');
    else toast.error('保存失败');
  };

  const resetTasks = () => {
    resetDemo();
    toast.success('已重置演示数据');
  };

  const renderTaskShell = (content: ReactNode) => (
    <div className="space-y-5">
      <TaskWorkbenchBar workbench={workbench} />
      <TaskToolbar workbench={workbench} dispatch={dispatch} />
      {importing && <TaskLoadingState text="正在导入跨模块任务..." />}
      {content}
    </div>
  );

  return (
    <>
      <PageShell
        title="计划任务"
        subtitle="统一任务工作台 · 任务池驱动清单、看板、时间线、里程碑、日历与协作分工"
        defaultTab="board"
        actions={
          <div className="flex max-w-[520px] flex-wrap justify-end gap-2">
            <ToolbarButton icon={Plus} onClick={() => openCreate()} tone="primary">新建任务</ToolbarButton>
            <ToolbarButton icon={Download} onClick={() => importInbox()} disabled={importing}>导入跨模块任务</ToolbarButton>
            <ToolbarButton icon={Save} onClick={saveTasks}>保存</ToolbarButton>
            <ToolbarButton icon={RotateCcw} onClick={resetTasks} tone="danger">重置演示</ToolbarButton>
          </div>
        }
        tabs={[
          {
            key: 'board',
            label: '看板视图',
            description: '按待办、进行中、评审和完成四列流转任务，状态变化会同步到所有视图',
            render: () => renderTaskShell(<BoardView workbench={workbench} dispatch={dispatch} onOpenTask={openTask} />),
          },
          {
            key: 'timeline',
            label: '时间线',
            description: '按任务真实起止日期展示项目节奏，支持负责人、里程碑和来源筛选',
            render: () => renderTaskShell(<TimelineView workbench={workbench} onOpenTask={openTask} />),
          },
          {
            key: 'list',
            label: '清单管理',
            description: '搜索、筛选、排序、勾选完成、批量操作和快速编辑',
            render: () =>
              renderTaskShell(
                <ListView
                  workbench={workbench}
                  dispatch={dispatch}
                  onOpenTask={openTask}
                  onCreateTask={() => openCreate()}
                  onNavigate={goToPath}
                />,
              ),
          },
          {
            key: 'milestone',
            label: '里程碑',
            description: '从关联任务自动计算完成率、风险和剩余任务',
            render: () => renderTaskShell(<MilestoneView workbench={workbench} dispatch={dispatch} onOpenTask={openTask} />),
          },
          {
            key: 'calendar',
            label: '截止日历',
            description: '真实月历视图，支持月份切换、日期详情和从日期新建任务',
            render: () =>
              renderTaskShell(
                <CalendarView
                  workbench={workbench}
                  dispatch={dispatch}
                  onOpenTask={openTask}
                  onCreateTask={openCreate}
                  onNavigate={goToPath}
                />,
              ),
          },
          {
            key: 'team',
            label: '协作分工',
            description: '展示成员负载、负责/支持矩阵、逾期风险和快速调整负责人',
            render: () => renderTaskShell(<TeamCollabView workbench={workbench} dispatch={dispatch} onOpenTask={openTask} />),
          },
        ]}
      />

      {creating && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setCreating(false)} />
          <aside className="fixed inset-y-0 right-0 z-50 flex w-[540px] max-w-[94vw] flex-col bg-white shadow-2xl">
            <header className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">新建任务</h2>
              <p className="mt-1 text-sm text-slate-500">创建后会同步进入清单、看板、时间线、日历、里程碑和协作分工。</p>
            </header>
            <div className="flex-1 overflow-y-auto p-5">
              <TaskForm
                workbench={workbench}
                defaults={createDefaults}
                onSubmit={createTask}
                onCancel={() => setCreating(false)}
                submitLabel="创建任务"
              />
            </div>
          </aside>
        </>
      )}

      <TaskDrawer
        task={selectedTask}
        workbench={workbench}
        dispatch={dispatch}
        onClose={closeTask}
        onNavigate={goToPath}
      />
    </>
  );
}
