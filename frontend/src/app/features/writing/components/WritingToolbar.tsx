import { Download, RotateCcw, Save, Sparkles } from 'lucide-react';
import type { WritingProject } from '../types';

export function WritingToolbar({
  project,
  quickLoading,
  onQuickGenerate,
  onSave,
  onExport,
  onReset,
}: {
  project: WritingProject;
  quickLoading: boolean;
  onQuickGenerate: () => void;
  onSave: () => void;
  onExport: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="hidden rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 xl:inline-flex">
        当前项目 · {project.progress}%
      </span>
      <button
        type="button"
        onClick={onQuickGenerate}
        disabled={quickLoading}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-sm text-white hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {quickLoading ? '快速生成中...' : '快速生成'}
      </button>
      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <Save className="h-3.5 w-3.5" />
        保存
      </button>
      <button
        type="button"
        onClick={onExport}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <Download className="h-3.5 w-3.5" />
        导出 Markdown
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        重置演示
      </button>
    </div>
  );
}
