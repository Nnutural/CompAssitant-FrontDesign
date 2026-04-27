import { useState, type Dispatch } from 'react';
import { ArrowRight, CheckCircle2, Copy, RotateCcw, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Tag } from '@/app/components/PageShell';

import type { TaskWorkbenchAction } from '../store';
import type { TaskComment, TaskFormValues, TaskItem, TaskWorkbench } from '../types';
import {
  buildTaskLink,
  getMemberName,
  parseTagInput,
  taskModuleLabels,
  taskPriorityLabels,
  taskStatusLabels,
  toneForPriority,
  toneForStatus,
} from '../utils';
import { TaskActivityFeed } from './TaskActivityFeed';
import { TaskForm } from './TaskForm';

export function TaskDrawer({
  task,
  workbench,
  dispatch,
  onClose,
  onNavigate,
}: {
  task: TaskItem | null;
  workbench: TaskWorkbench;
  dispatch: Dispatch<TaskWorkbenchAction>;
  onClose: () => void;
  onNavigate: (path: string, message: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState('');

  if (!task) return null;

  const milestone = workbench.milestones.find((item) => item.id === task.milestoneId);
  const activities = workbench.activities.filter((activity) => activity.taskId === task.id).slice(0, 12);

  const updateFromForm = (values: TaskFormValues) => {
    const patch: Partial<TaskItem> = {
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      module: values.module,
      sourceLabel: values.sourceLabel,
      sourcePath: values.sourcePath,
      assigneeId: values.assigneeId,
      collaboratorIds: values.collaboratorIds,
      startDate: values.startDate,
      dueDate: values.dueDate,
      estimateHours: values.estimateHours,
      spentHours: values.spentHours,
      tags: parseTagInput(values.tags),
      milestoneId: values.milestoneId || undefined,
    };
    dispatch({ type: 'updateTask', taskId: task.id, patch, activity: '任务已保存' });
    setEditing(false);
    toast.success('任务已保存');
  };

  const addComment = () => {
    if (!comment.trim()) return;
    const next: TaskComment = {
      id: `comment-${Date.now()}`,
      author: '陈同学',
      content: comment.trim(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'addComment', taskId: task.id, comment: next });
    setComment('');
    toast.success('评论已添加');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(buildTaskLink(task.id));
      toast.success('已复制链接');
    } catch {
      toast.error('复制失败，请检查浏览器权限');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[540px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Tag tone={toneForStatus(task.status)}>{taskStatusLabels[task.status]}</Tag>
              <Tag tone={toneForPriority(task.priority)}>{taskPriorityLabels[task.priority]}</Tag>
              <Tag tone="blue">{taskModuleLabels[task.module]}</Tag>
            </div>
            <h2 className="mt-2 text-base font-semibold text-slate-900">{task.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {editing ? (
            <TaskForm
              workbench={workbench}
              task={task}
              onSubmit={updateFromForm}
              onCancel={() => setEditing(false)}
              submitLabel="保存修改"
            />
          ) : (
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-slate-900">任务说明</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
              </section>

              <section className="grid gap-3 sm:grid-cols-2">
                <Info label="负责人" value={getMemberName(workbench.teamMembers, task.assigneeId)} />
                <Info label="协作者" value={task.collaboratorIds.map((id) => getMemberName(workbench.teamMembers, id)).join('、') || '无'} />
                <Info label="起止日期" value={`${task.startDate} 至 ${task.dueDate}`} />
                <Info label="工时" value={`${task.spentHours}/${task.estimateHours} 小时`} />
                <Info label="来源" value={`${task.sourceLabel} · ${task.sourcePath}`} />
                <Info label="里程碑" value={milestone?.title ?? '未关联'} />
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.length ? task.tags.map((tag) => <Tag key={tag}>{tag}</Tag>) : <span className="text-sm text-slate-400">暂无标签</span>}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">评论</h3>
                <div className="space-y-2">
                  {task.comments.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-sm text-slate-700">{item.content}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.author} · {new Date(item.createdAt).toLocaleString('zh-CN')}</p>
                    </div>
                  ))}
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
                    placeholder="添加评论或同步记录"
                  />
                  <button onClick={addComment} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    添加评论
                  </button>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">活动流</h3>
                <TaskActivityFeed activities={activities} />
              </section>
            </div>
          )}
        </div>

        {!editing && (
          <footer className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-3">
            <button onClick={() => setEditing(true)} className="rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700">
              编辑任务
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'completeTask', taskId: task.id, done: task.status !== 'done' });
                toast.success(task.status === 'done' ? '任务已恢复' : '任务已完成');
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              {task.status === 'done' ? <RotateCcw className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              {task.status === 'done' ? '恢复' : '完成'}
            </button>
            {[1, 3, 7].map((days) => (
              <button
                key={days}
                onClick={() => {
                  dispatch({ type: 'postponeTask', taskId: task.id, days });
                  toast.success(`已延期 ${days} 天`);
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                延期 {days} 天
              </button>
            ))}
            <button onClick={copyLink} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <Copy className="h-4 w-4" />
              复制链接
            </button>
            <button onClick={() => onNavigate(task.sourcePath, '已跳转源模块')} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <ArrowRight className="h-4 w-4" />
              源模块
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'deleteTask', taskId: task.id });
                toast.success('任务已删除');
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              删除
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
