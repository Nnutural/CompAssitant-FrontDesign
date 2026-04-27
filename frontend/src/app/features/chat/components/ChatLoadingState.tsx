import { Loader2 } from 'lucide-react';

export function ChatLoadingState({ text = '正在分析问题...' }: { text?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-500">
      <Loader2 className="h-4 w-4 animate-spin text-brand-blue-600" />
      <span>{text}</span>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
      </span>
    </div>
  );
}
