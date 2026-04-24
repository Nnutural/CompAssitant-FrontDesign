import { ExternalLink, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { Tag } from '@/app/components/PageShell';

import type { DetailResponse, FundItem, InnovationItem, LabItem, NewsItem, PaperItem, PatentItem } from '../types';
import { getItemTitle, typeLabel } from '../utils';
import { EvidenceList } from './EvidenceList';

export function ResearchDetailDrawer({
  detail,
  onClose,
}: {
  detail: DetailResponse | null;
  onClose: () => void;
}) {
  if (!detail) return null;

  const item = detail.item;
  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 w-[440px] max-w-[92vw] bg-white z-50 shadow-2xl flex flex-col">
        <header className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <Tag tone="blue">{typeLabel(detail.item_type)}</Tag>
            <h2 className="text-sm font-semibold text-slate-900 mt-1 line-clamp-1">{getItemTitle(item)}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {detail.item_type === 'fund' && <FundDetail item={item as FundItem} />}
          {detail.item_type === 'news' && <NewsDetail item={item as NewsItem} />}
          {detail.item_type === 'innovation' && <InnovationDetail item={item as InnovationItem} />}
          {detail.item_type === 'paper' && <PaperDetail item={item as PaperItem} />}
          {detail.item_type === 'patent' && <PatentDetail item={item as PatentItem} />}
          {detail.item_type === 'lab' && <LabDetail item={item as LabItem} />}

          <section>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">证据来源</h3>
            <EvidenceList sources={item.evidence_sources} />
          </section>
        </div>
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900 mb-2">{title}</h3>
      {children}
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="text-sm text-slate-600">· {item}</li>
      ))}
    </ul>
  );
}

function LinkButton({ href, label }: { href: string | null; label: string }) {
  if (!href) return <span className="text-sm text-slate-400">暂无{label}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-[#003399] hover:underline"
    >
      {label}
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

function FundDetail({ item }: { item: FundItem }) {
  return (
    <>
      <Section title="项目摘要"><p className="text-sm text-slate-600">{item.summary}</p></Section>
      <Section title="申请条件"><List items={item.requirements} /></Section>
      <Section title="推荐理由"><p className="text-sm text-slate-600">{item.recommendation_reason}</p></Section>
      <Section title="关键信息">
        <p className="text-sm text-slate-600">{item.source} · {item.level} · {item.amount} · 截止 {item.deadline}</p>
      </Section>
    </>
  );
}

function NewsDetail({ item }: { item: NewsItem }) {
  return (
    <>
      <Section title="摘要"><p className="text-sm text-slate-600">{item.summary}</p></Section>
      <Section title="来源"><p className="text-sm text-slate-600">{item.source_type} · {item.source} · {item.published_at}</p></Section>
      <LinkButton href={item.url} label="原文链接" />
    </>
  );
}

function InnovationDetail({ item }: { item: InnovationItem }) {
  return (
    <>
      <Section title="趋势摘要"><p className="text-sm text-slate-600">{item.summary}</p></Section>
      <Section title="代表论文"><List items={item.representative_papers} /></Section>
      <Section title="代表团队"><List items={item.representative_teams} /></Section>
      <Section title="推荐理由"><p className="text-sm text-slate-600">{item.recommendation_reason}</p></Section>
    </>
  );
}

function PaperDetail({ item }: { item: PaperItem }) {
  return (
    <>
      <Section title="摘要"><p className="text-sm text-slate-600">{item.abstract}</p></Section>
      <Section title="精读导读"><p className="text-sm text-slate-600">{item.reading_guide}</p></Section>
      <Section title="作者"><p className="text-sm text-slate-600">{item.authors.join(', ')}</p></Section>
      <div className="flex gap-4">
        <LinkButton href={item.doi_url} label="DOI" />
        <LinkButton href={item.pdf_url} label="PDF" />
      </div>
    </>
  );
}

function PatentDetail({ item }: { item: PatentItem }) {
  return (
    <>
      <Section title="摘要"><p className="text-sm text-slate-600">{item.abstract}</p></Section>
      <Section title="相似专利提示"><p className="text-sm text-slate-600">{item.similarity_hint}</p></Section>
      <Section title="法律状态时间线">
        <div className="space-y-2">
          {item.legal_timeline.map((entry) => (
            <div key={`${entry.date}-${entry.status}`} className="border-l-2 border-[#003399]/20 pl-3">
              <p className="text-sm font-medium text-slate-800">{entry.date} · {entry.status}</p>
              <p className="text-xs text-slate-500">{entry.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function LabDetail({ item }: { item: LabItem }) {
  return (
    <>
      <Section title="申请要求"><List items={item.requirements} /></Section>
      <Section title="合作案例"><List items={item.cooperation_cases} /></Section>
      <Section title="数据集/代码"><List items={item.datasets_or_code_links} /></Section>
      <Section title="联系信息"><p className="text-sm text-slate-600">{item.mentor} · {item.contact}</p></Section>
    </>
  );
}
