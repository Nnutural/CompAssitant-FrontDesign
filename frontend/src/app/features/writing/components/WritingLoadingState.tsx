import { Loader2 } from 'lucide-react';

export function WritingLoadingState({ label = 'AI 正在生成内容...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-brand-blue-100 bg-brand-blue-50 px-4 py-3 text-sm text-brand-blue-700">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
