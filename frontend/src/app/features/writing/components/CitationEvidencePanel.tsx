import { useMemo, useState } from 'react';
import { Clipboard, ExternalLink, Search, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import type { WritingAction } from '../store';
import type { EvidenceType, WritingEvidence, WritingProject } from '../types';
import { copyText, formatEvidenceCitation, getCurrentSection } from '../utils';
import { WritingEmptyState } from './WritingEmptyState';

export function CitationEvidencePanel({
  project,
  dispatch,
}: {
  project: WritingProject;
  dispatch: React.Dispatch<WritingAction>;
}) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | EvidenceType>('all');
  const [style, setStyle] = useState<'gbt' | 'apa'>('gbt');
  const currentSection = getCurrentSection(project);

  const types = useMemo(
    () => Array.from(new Set(project.evidences.map((evidence) => evidence.type))),
    [project.evidences],
  );

  const evidences = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return project.evidences
      .filter((evidence) => {
        const text = `${evidence.title} ${evidence.source} ${evidence.excerpt}`.toLowerCase();
        return (!lowered || text.includes(lowered)) && (typeFilter === 'all' || evidence.type === typeFilter);
      })
      .sort((a, b) => b.reliability - a.reliability || b.year - a.year);
  }, [project.evidences, query, typeFilter]);

  const copyCitation = async (evidence: WritingEvidence) => {
    try {
      await copyText(formatEvidenceCitation(evidence, style));
      toast.success('引用已复制');
    } catch {
      toast.error('复制失败，请重试');
    }
  };

  const insertCitation = (evidence: WritingEvidence) => {
    if (!currentSection) {
      toast.error('请先创建文档章节');
      return;
    }
    dispatch({
      type: 'appendToCurrentSection',
      text: `[引用] ${formatEvidenceCitation(evidence, style)}`,
      evidenceId: evidence.id,
    });
    toast.success('已插入当前章节');
  };

  const markUsed = (evidence: WritingEvidence) => {
    if (!currentSection) {
      dispatch({ type: 'updateEvidence', evidenceId: evidence.id, patch: { selected: true } });
      toast.success('已标记为已引用');
      return;
    }
    const usedInSections = evidence.usedInSections.includes(currentSection.id)
      ? evidence.usedInSections
      : [...evidence.usedInSections, currentSection.id];
    dispatch({ type: 'updateEvidence', evidenceId: evidence.id, patch: { selected: true, usedInSections } });
    toast.success('已标记为已引用');
  };

  const openSource = (evidence: WritingEvidence) => {
    if (evidence.url.includes('example.com')) {
      toast.info('演示数据来源：该链接不会跳转真实网页');
      return;
    }
    window.open(evidence.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-blue-400"
              placeholder="搜索证据标题、来源或摘要"
            />
          </label>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as 'all' | EvidenceType)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="all">全部类型</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value as 'gbt' | 'apa')}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="gbt">GB/T 7714 简化版</option>
            <option value="apa">APA 简化版</option>
          </select>
        </div>
      </Card>

      {evidences.length === 0 ? (
        <WritingEmptyState title="暂无引用结果" description="调整关键词或类型筛选后再试。" />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {evidences.map((evidence) => (
            <article key={evidence.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="blue">{evidence.type}</Tag>
                    <Tag tone={evidence.usedInSections.length > 0 || evidence.selected ? 'green' : 'default'}>
                      {evidence.usedInSections.length > 0 || evidence.selected ? '已引用' : `${evidence.year}`}
                    </Tag>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-snug text-slate-900">{evidence.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{evidence.source}</p>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={`${evidence.id}-${index}`}
                      className={`h-3.5 w-3.5 ${
                        index < evidence.reliability ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{evidence.excerpt}</p>
              <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                {formatEvidenceCitation(evidence, style)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
                <button
                  type="button"
                  onClick={() => copyCitation(evidence)}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Clipboard className="h-3.5 w-3.5" />
                  复制引用
                </button>
                <button
                  type="button"
                  onClick={() => insertCitation(evidence)}
                  className="rounded-lg bg-brand-blue-600 px-3 py-2 text-xs text-white hover:bg-brand-blue-700"
                >
                  插入正文
                </button>
                <button
                  type="button"
                  onClick={() => markUsed(evidence)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  标记已引用
                </button>
                <button
                  type="button"
                  onClick={() => openSource(evidence)}
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  查看来源
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
