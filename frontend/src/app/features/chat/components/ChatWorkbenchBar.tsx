import { Bookmark, Clock3, MessageCircle, Pin, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ChatAgent, ChatSession, ChatWorkspace } from '../types';
import { autosaveLabel, autosaveTone, formatDateTime } from '../utils';

export function ChatWorkbenchBar({
  workspace,
  agent,
  session,
}: {
  workspace: ChatWorkspace;
  agent: ChatAgent;
  session?: ChatSession;
}) {
  const agentSessions = workspace.sessions.filter((item) => item.agentId === agent.id);
  const messageCount = agentSessions.reduce((count, item) => count + item.messages.length, 0);
  const pinnedCount = agentSessions.filter((item) => item.pinned).length;
  const favoriteCount = workspace.favoriteMessageIds.length;

  return (
    <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: agent.color }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-slate-900">当前智能体：{agent.name}</h2>
              <span className={`rounded-md px-2 py-0.5 text-xs ${autosaveTone(workspace.autosaveStatus)}`}>
                {autosaveLabel(workspace.autosaveStatus)}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {session ? `当前会话：${session.title}` : '当前没有会话'} · 最近保存 {formatDateTime(workspace.savedAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 sm:flex sm:flex-wrap">
          <Metric icon={<MessageCircle className="h-3.5 w-3.5" />} label="消息" value={messageCount} />
          <Metric icon={<Bookmark className="h-3.5 w-3.5" />} label="收藏" value={favoriteCount} />
          <Metric icon={<Pin className="h-3.5 w-3.5" />} label="置顶" value={pinnedCount} />
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            {workspace.generatingSessionId ? '生成中' : '空闲'}
          </span>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <span className="inline-flex items-center justify-between gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 sm:justify-start">
      <span className="inline-flex items-center gap-1 text-slate-500">
        {icon}
        {label}
      </span>
      <span className="font-semibold text-slate-900">{value}</span>
    </span>
  );
}
