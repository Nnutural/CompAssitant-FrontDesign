import { Inbox } from 'lucide-react';

export function WorkspaceEmptyState({
  title = '暂无数据',
  description = '当前筛选条件下没有可展示内容。',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <Inbox className="mx-auto h-8 w-8 text-slate-300" />
      <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
