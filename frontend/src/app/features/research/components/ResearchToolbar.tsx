import { GitCompare, RefreshCw, Search } from 'lucide-react';

import type { SortKey } from '../types';
import { directions } from '../utils';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'match', label: '匹配度' },
  { value: 'deadline', label: '截止时间' },
  { value: 'updated', label: '更新时间' },
  { value: 'citation', label: '引用量' },
  { value: 'hot', label: '热度' },
];

export function ResearchToolbar({
  query,
  direction,
  sort,
  onQueryChange,
  onDirectionChange,
  onSortChange,
  onRefresh,
  onOpenCompare,
}: {
  query: string;
  direction: string;
  sort: SortKey;
  onQueryChange: (value: string) => void;
  onDirectionChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
  onRefresh: () => void;
  onOpenCompare: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="搜索标题、来源、关键词"
          className="w-56 pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003399]/20"
        />
      </div>
      <select
        value={direction}
        onChange={(event) => onDirectionChange(event.target.value)}
        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
      >
        {directions.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as SortKey)}
        className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
      >
        {sortOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
      >
        <RefreshCw className="w-4 h-4" />
        刷新
      </button>
      <button
        onClick={onOpenCompare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#003399] text-white rounded-lg hover:bg-[#002a80]"
      >
        <GitCompare className="w-4 h-4" />
        对比收藏
      </button>
    </div>
  );
}
