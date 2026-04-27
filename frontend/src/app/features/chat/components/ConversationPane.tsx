import { useEffect, useRef } from 'react';
import { Bot, Briefcase, Database, Link2 } from 'lucide-react';
import type { ChatAgent, ChatMessage, ChatSession } from '../types';
import { formatDateTime } from '../utils';
import { ChatComposer } from './ChatComposer';
import { ChatEmptyState } from './ChatEmptyState';
import { MessageBubble } from './MessageBubble';

export function ConversationPane({
  agent,
  session,
  draft,
  isGenerating,
  onCreateSession,
  onDraftChange,
  onSend,
  onStop,
  onRetry,
  onRegenerate,
  onToggleFavorite,
  onHelpful,
  onInsertToWriting,
  onAddToTask,
  onMockLink,
}: {
  agent: ChatAgent;
  session?: ChatSession;
  draft: string;
  isGenerating: boolean;
  onCreateSession: () => void;
  onDraftChange: (value: string) => void;
  onSend: (question?: string) => void;
  onStop: () => void;
  onRetry: (message: ChatMessage) => void;
  onRegenerate: (message: ChatMessage) => void;
  onToggleFavorite: (messageId: string) => void;
  onHelpful: (messageId: string, helpful: boolean) => void;
  onInsertToWriting: () => void;
  onAddToTask: () => void;
  onMockLink: (kind: 'research' | 'career' | 'forum') => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [session?.messages.length, isGenerating]);

  return (
    <section className="flex min-h-[620px] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:max-h-[calc(100vh-17rem)]">
      <header className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: agent.color }}>
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-slate-900">{session?.title ?? agent.name}</h3>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">在线</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {session ? `最近更新 ${formatDateTime(session.updatedAt)} · ${session.messages.length} 条消息` : agent.description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onMockLink('research')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            <Database className="h-3.5 w-3.5" />
            关联科研数据
          </button>
          <button
            type="button"
            onClick={() => onMockLink('career')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            <Briefcase className="h-3.5 w-3.5" />
            关联就业岗位
          </button>
          <button
            type="button"
            onClick={() => onMockLink('forum')}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
          >
            <Link2 className="h-3.5 w-3.5" />
            引用论坛讨论
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4">
        {!session || !session.messages.length ? (
          <ChatEmptyState
            agent={agent}
            disabled={isGenerating}
            onCreateSession={onCreateSession}
            onSendStarter={onSend}
          />
        ) : (
          session.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              agent={agent}
              isGenerating={isGenerating}
              onRetry={() => onRetry(message)}
              onRegenerate={() => onRegenerate(message)}
              onToggleFavorite={() => onToggleFavorite(message.id)}
              onHelpful={(helpful) => onHelpful(message.id, helpful)}
              onInsertToWriting={onInsertToWriting}
              onAddToTask={onAddToTask}
            />
          ))
        )}
      </div>

      <ChatComposer
        value={draft}
        placeholder={`向${agent.name}提问...`}
        disabled={!session}
        isGenerating={isGenerating}
        onChange={onDraftChange}
        onSend={() => onSend()}
        onStop={onStop}
      />
    </section>
  );
}
