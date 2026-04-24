import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export function StateBlock({
  state,
  message,
  onRetry,
}: {
  state: 'loading' | 'error' | 'empty';
  message: string;
  onRetry?: () => void;
}) {
  const Icon = state === 'loading' ? Loader2 : AlertCircle;
  return (
    <div className="py-16 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg bg-white">
      <Icon className={`w-5 h-5 mx-auto mb-2 text-slate-400 ${state === 'loading' ? 'animate-spin' : ''}`} />
      <p>{message}</p>
      {state === 'error' && onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#003399] bg-[#003399]/10 rounded-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重试
        </button>
      )}
    </div>
  );
}
