import { MessageSquarePlus, Pencil, Pin, PinOff, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ChatAgent, ChatSession } from '../types';
import { formatDateTime } from '../utils';

export function SessionList({
  agent,
  sessions,
  activeSessionId,
  onCreate,
  onSelect,
  onRename,
  onDelete,
  onTogglePin,
}: {
  agent: ChatAgent;
  sessions: ChatSession[];
  activeSessionId?: string;
  onCreate: () => void;
  onSelect: (sessionId: string) => void;
  onRename: (sessionId: string, title: string) => void;
  onDelete: (sessionId: string) => void;
  onTogglePin: (sessionId: string) => void;
}) {
  const handleRename = (session: ChatSession) => {
    const next = window.prompt('重命名会话', session.title);
    if (!next || next.trim() === session.title) return;
    onRename(session.id, next.trim());
  };

  const handleDelete = (session: ChatSession) => {
    if (!window.confirm(`确定删除会话「${session.title}」吗？`)) return;
    onDelete(session.id);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">最近会话</h3>
          <p className="mt-0.5 text-xs text-slate-500">{agent.name} · {sessions.length} 个会话</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue-600 text-white hover:bg-brand-blue-700"
          title="新建会话"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </button>
      </header>
      {sessions.length ? (
        <div className="max-h-[360px] space-y-1 overflow-y-auto p-2">
          {sessions.map((session) => {
            const active = session.id === activeSessionId;
            const lastMessage = session.messages[session.messages.length - 1];
            return (
              <article
                key={session.id}
                className={`group rounded-lg border px-3 py-2 transition-colors ${
                  active ? 'border-brand-blue-600/30 bg-brand-blue-50' : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <button type="button" onClick={() => onSelect(session.id)} className="w-full text-left">
                  <div className="flex items-center gap-2">
                    {session.pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-brand-blue-600" />}
                    <h4 className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">{session.title}</h4>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {lastMessage?.content || '尚未开始对话'}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{formatDateTime(session.updatedAt)}</p>
                </button>
                <div className="mt-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  <IconButton title={session.pinned ? '取消置顶' : '置顶'} onClick={() => onTogglePin(session.id)}>
                    {session.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                  </IconButton>
                  <IconButton title="重命名" onClick={() => handleRename(session)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </IconButton>
                  <IconButton title="删除" onClick={() => handleDelete(session)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center">
          <p className="text-sm text-slate-500">当前智能体暂无会话</p>
          <button
            type="button"
            onClick={onCreate}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <MessageSquarePlus className="h-4 w-4" />
            新建会话
          </button>
        </div>
      )}
    </section>
  );
}

function IconButton({ title, onClick, children }: { title: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white hover:text-slate-700"
    >
      {children}
    </button>
  );
}
