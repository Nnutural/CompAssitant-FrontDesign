import { Bookmark, Check, Clipboard, Download, FilePlus2, RotateCcw, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import type { ChatMessage } from '../types';
import { downloadTextFile } from '../utils';

export function AnswerToolbar({
  message,
  disabled,
  onRegenerate,
  onToggleFavorite,
  onHelpful,
  onInsertToWriting,
  onAddToTask,
}: {
  message: ChatMessage;
  disabled?: boolean;
  onRegenerate: () => void;
  onToggleFavorite: () => void;
  onHelpful: (helpful: boolean) => void;
  onInsertToWriting: () => void;
  onAddToTask: () => void;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      toast.success('已复制回答');
    } catch {
      toast.error('复制失败，请检查浏览器权限');
    }
  };

  const handleExport = () => {
    try {
      downloadTextFile(`answer-${message.id}.md`, message.content);
      toast.success('已导出 Markdown');
    } catch {
      toast.error('导出失败');
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2">
      <ToolButton title="复制回答" onClick={handleCopy} disabled={disabled}>
        <Clipboard className="h-3.5 w-3.5" />
        复制
      </ToolButton>
      <ToolButton title="重新生成" onClick={onRegenerate} disabled={disabled}>
        <RotateCcw className="h-3.5 w-3.5" />
        重生成
      </ToolButton>
      <ToolButton title={message.favorited ? '取消收藏' : '收藏回答'} onClick={onToggleFavorite} disabled={disabled}>
        {message.favorited ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        {message.favorited ? '已收藏' : '收藏'}
      </ToolButton>
      <ToolButton title="标记有帮助" onClick={() => onHelpful(true)} disabled={disabled}>
        <ThumbsUp className="h-3.5 w-3.5" />
        有帮助
      </ToolButton>
      <ToolButton title="标记无帮助" onClick={() => onHelpful(false)} disabled={disabled}>
        <ThumbsDown className="h-3.5 w-3.5" />
        无帮助
      </ToolButton>
      <ToolButton title="导出为 Markdown" onClick={handleExport} disabled={disabled}>
        <Download className="h-3.5 w-3.5" />
        导出
      </ToolButton>
      <ToolButton title="加入写作素材库" onClick={onInsertToWriting} disabled={disabled}>
        <FilePlus2 className="h-3.5 w-3.5" />
        写作素材
      </ToolButton>
      <ToolButton title="加入计划任务" onClick={onAddToTask} disabled={disabled}>
        <Check className="h-3.5 w-3.5" />
        计划任务
      </ToolButton>
    </div>
  );
}

function ToolButton({
  title,
  disabled,
  onClick,
  children,
}: {
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
