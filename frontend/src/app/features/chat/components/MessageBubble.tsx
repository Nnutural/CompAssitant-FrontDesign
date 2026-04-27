import { Bot, User } from 'lucide-react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatAgent, ChatMessage } from '../types';
import { AnswerToolbar } from './AnswerToolbar';
import { ChatErrorState } from './ChatErrorState';
import { ChatLoadingState } from './ChatLoadingState';

const markdownComponents: Components = {
  p: ({ children }) => <p className="my-1 first:mt-0 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="mb-2 mt-3 text-lg font-semibold text-slate-950 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 mt-3 text-base font-semibold text-slate-950 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-1 mt-2 text-sm font-semibold text-slate-950 first:mt-0">{children}</h3>,
  ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
  em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-brand-blue-600/40 pl-3 text-slate-600">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-brand-blue-600 underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const value = String(children);
    const isBlock = Boolean(className) || value.includes('\n');
    return (
      <code
        className={
          isBlock
            ? 'block overflow-x-auto rounded-md bg-slate-900 px-3 py-2 text-xs leading-relaxed text-slate-100'
            : 'rounded bg-slate-200/70 px-1.5 py-0.5 text-[0.85em] text-slate-900'
        }
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-md bg-slate-900 p-0">{children}</pre>,
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-md border border-slate-200">
      <table className="min-w-full border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-100 text-slate-700">{children}</thead>,
  th: ({ children }) => <th className="border-b border-slate-200 px-3 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-t border-slate-100 px-3 py-2 align-top">{children}</td>,
};

function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents} skipHtml>
      {content}
    </ReactMarkdown>
  );
}

export function MessageBubble({
  message,
  agent,
  isGenerating,
  onRetry,
  onRegenerate,
  onToggleFavorite,
  onHelpful,
  onInsertToWriting,
  onAddToTask,
}: {
  message: ChatMessage;
  agent: ChatAgent;
  isGenerating: boolean;
  onRetry: () => void;
  onRegenerate: () => void;
  onToggleFavorite: () => void;
  onHelpful: (helpful: boolean) => void;
  onInsertToWriting: () => void;
  onAddToTask: () => void;
}) {
  const isUser = message.role === 'user';
  const assistantDone = message.role === 'assistant' && ['done', 'stopped'].includes(message.status);

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50"
          style={{ color: agent.color }}
        >
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={`max-w-[min(760px,88%)] rounded-xl px-3 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-brand-blue-600 text-white'
            : 'border border-slate-100 bg-white text-slate-800'
        }`}
      >
        {isUser && <p className="whitespace-pre-wrap">{message.content}</p>}
        {!isUser && message.status === 'generating' && <ChatLoadingState />}
        {!isUser && message.status === 'error' && <ChatErrorState message={message.content} onRetry={onRetry} />}
        {!isUser && message.status === 'stopped' && (
          <p className="whitespace-pre-wrap text-slate-600">{message.content || '已停止生成，可重新生成。'}</p>
        )}
        {!isUser && message.status === 'done' && <MarkdownMessage content={message.content} />}
        {assistantDone && (
          <AnswerToolbar
            message={message}
            disabled={isGenerating}
            onRegenerate={onRegenerate}
            onToggleFavorite={onToggleFavorite}
            onHelpful={onHelpful}
            onInsertToWriting={onInsertToWriting}
            onAddToTask={onAddToTask}
          />
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200">
          <User className="h-4 w-4 text-slate-600" />
        </div>
      )}
    </div>
  );
}
