import { Inbox, Plus } from 'lucide-react';

export function TaskEmptyState({
  title = '暂无任务',
  description = '当前条件下没有可展示的任务。',
  onCreate,
}: {
  title?: string;
  description?: string;
  onCreate?: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <Inbox className="mx-auto h-8 w-8 text-slate-300" />
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {onCreate && (
        <button
          onClick={onCreate}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
        >
          <Plus className="h-4 w-4" />
          新建任务
        </button>
      )}
    </div>
  );
}
