import { Sparkles } from 'lucide-react';
import type { ChatAgent } from '../types';

export function PromptStarters({
  agent,
  disabled,
  compact,
  onSend,
}: {
  agent: ChatAgent;
  disabled?: boolean;
  compact?: boolean;
  onSend: (question: string) => void;
}) {
  return (
    <section className={compact ? 'space-y-2' : 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm'}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-blue-600" />
        <h3 className="text-sm font-semibold text-slate-900">推荐问题</h3>
      </div>
      <div className="mt-3 space-y-2">
        {agent.starterQuestions.map((question) => (
          <button
            key={question}
            type="button"
            disabled={disabled}
            onClick={() => onSend(question)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs leading-relaxed text-slate-700 transition-colors hover:border-brand-blue-600/40 hover:bg-brand-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {question}
          </button>
        ))}
      </div>
    </section>
  );
}
