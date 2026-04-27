import { Compass, Flame, FlaskConical, Lightbulb, PenLine, ShieldCheck, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChatAgent, ChatAgentId, ChatSession } from '../types';

const iconMap: Record<ChatAgent['iconName'], LucideIcon> = {
  Lightbulb,
  FlaskConical,
  Trophy,
  ShieldCheck,
  Flame,
  PenLine,
  Compass,
};

export function AgentSidebar({
  agents,
  sessions,
  activeAgentId,
  onSelectAgent,
}: {
  agents: ChatAgent[];
  sessions: ChatSession[];
  activeAgentId: ChatAgentId;
  onSelectAgent: (agentId: ChatAgentId) => void;
}) {
  const sessionCounts = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.agentId] = (acc[session.agentId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-900">智能体</h3>
        <p className="mt-0.5 text-xs text-slate-500">每个智能体保留独立会话</p>
      </div>
      <div className="space-y-1">
        {agents.map((agent) => {
          const Icon = iconMap[agent.iconName];
          const active = agent.id === activeAgentId;
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => onSelectAgent(agent.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                active
                  ? 'bg-brand-blue-50 text-brand-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: active ? agent.color : '#f1f5f9', color: active ? '#ffffff' : agent.color }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{agent.name}</span>
                <span className="block truncate text-xs text-slate-400">{agent.capabilities[0]}</span>
              </span>
              <span className="rounded-md bg-white px-1.5 py-0.5 text-xs text-slate-400">
                {sessionCounts[agent.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
