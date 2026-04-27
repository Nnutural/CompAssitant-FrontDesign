import { FileText, RefreshCcw, Save, Send } from 'lucide-react';

export function ForumToolbar({
  draftsCount,
  onOpenComposer,
  onOpenDrafts,
  onSave,
  onReset,
}: {
  draftsCount: number;
  onOpenComposer: () => void;
  onOpenDrafts: () => void;
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={onOpenComposer}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-700"
      >
        <Send className="h-4 w-4" />
        发布帖子
      </button>
      <button
        type="button"
        onClick={onOpenDrafts}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <FileText className="h-4 w-4" />
        我的草稿
        {draftsCount > 0 && (
          <span className="rounded-full bg-brand-blue-50 px-1.5 text-xs text-brand-blue-600">{draftsCount}</span>
        )}
      </button>
      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <Save className="h-4 w-4" />
        保存
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <RefreshCcw className="h-4 w-4" />
        重置演示
      </button>
    </div>
  );
}
