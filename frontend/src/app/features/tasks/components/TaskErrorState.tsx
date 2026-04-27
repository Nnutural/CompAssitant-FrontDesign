import { AlertTriangle, RefreshCcw } from 'lucide-react';

export function TaskErrorState({
  title = '任务数据加载失败',
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <h3 className="text-sm font-semibold text-red-900">{title}</h3>
            <p className="mt-1 text-sm text-red-700">{description}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <RefreshCcw className="h-4 w-4" />
            重试
          </button>
        )}
      </div>
    </div>
  );
}
