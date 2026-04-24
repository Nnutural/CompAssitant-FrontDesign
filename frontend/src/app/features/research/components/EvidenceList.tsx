import { ExternalLink } from 'lucide-react';

import type { EvidenceSource } from '../types';

export function EvidenceList({ sources }: { sources: EvidenceSource[] }) {
  if (!sources.length) {
    return <p className="text-sm text-slate-400">暂无证据来源</p>;
  }

  return (
    <div className="space-y-2">
      {sources.map((source) => (
        <a
          key={`${source.title}-${source.url}`}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="block rounded-lg border border-slate-200 p-3 hover:border-[#003399]/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{source.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {source.source_type} · 更新 {source.updated_at}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </a>
      ))}
    </div>
  );
}
