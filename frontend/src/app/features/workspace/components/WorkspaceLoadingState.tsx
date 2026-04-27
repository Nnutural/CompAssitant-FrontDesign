import { Loader2 } from 'lucide-react';

export function WorkspaceLoadingState({ text = '加载演示数据中...' }: { text?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <Loader2 className="mx-auto h-7 w-7 animate-spin text-brand-blue-600" />
      <p className="mt-3 text-sm text-slate-500">{text}</p>
    </div>
  );
}
