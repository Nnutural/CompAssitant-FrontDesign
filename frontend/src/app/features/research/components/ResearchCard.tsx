import {
  Bell,
  Bookmark,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Eye,
  GitCompare,
  Lightbulb,
  MapPin,
  Plus,
  Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card, Tag } from '@/app/components/PageShell';

import type { FundItem, InnovationItem, LabItem, NewsItem, PaperItem, PatentItem, ResearchItem, ResearchItemType } from '../types';
import { getItemSummary, getItemTitle, isLatest, supportsCompare, supportsFavorite, supportsSubscription } from '../utils';

function ActionButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md transition-colors ${
        active ? 'bg-[#003399]/10 text-[#003399]' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1 text-xs text-slate-500">{children}</span>;
}

export function ResearchCard({
  itemType,
  item,
  onOpen,
  onFavorite,
  onSubscribe,
  onCompare,
  onRead,
  onReadingList,
  onPlan,
}: {
  itemType: ResearchItemType;
  item: ResearchItem;
  onOpen: () => void;
  onFavorite: () => void;
  onSubscribe: () => void;
  onCompare: () => void;
  onRead: () => void;
  onReadingList: () => void;
  onPlan: () => void;
}) {
  const title = getItemTitle(item);
  const tags = 'tags' in item ? item.tags : 'topics' in item ? item.topics : [item.direction];

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              {isLatest(item.updated_at) && <Tag tone="blue">最新</Tag>}
              {'read' in item && item.read && <Tag tone="green">已读</Tag>}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">{getItemSummary(item)}</p>
          </div>
          {'match_score' in item && (
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold text-[#003399]">{item.match_score}%</p>
              <p className="text-xs text-slate-400">匹配度</p>
            </div>
          )}
          {'growth' in item && (
            <div className="text-right shrink-0">
              <p className="text-lg font-semibold text-[#003399]">+{item.growth}%</p>
              <p className="text-xs text-slate-400">{item.window}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {itemType === 'fund' && <FundMeta item={item as FundItem} />}
          {itemType === 'news' && <NewsMeta item={item as NewsItem} />}
          {itemType === 'innovation' && <InnovationMeta item={item as InnovationItem} />}
          {itemType === 'paper' && <PaperMeta item={item as PaperItem} />}
          {itemType === 'patent' && <PatentMeta item={item as PatentItem} />}
          {itemType === 'lab' && <LabMeta item={item as LabItem} />}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-1">
            <ActionButton icon={Eye} label="详情" onClick={onOpen} />
            {supportsFavorite(itemType) && (
              <ActionButton icon={Star} label="收藏" active={'favorited' in item && item.favorited} onClick={onFavorite} />
            )}
            {supportsSubscription(itemType) && (
              <ActionButton icon={Bell} label="订阅" active={'subscribed' in item && item.subscribed} onClick={onSubscribe} />
            )}
            {supportsCompare(itemType) && (
              <ActionButton icon={GitCompare} label="对比" active={'compared' in item && item.compared} onClick={onCompare} />
            )}
            {itemType === 'news' && (
              <ActionButton icon={CheckCircle2} label="已读" active={(item as NewsItem).read} onClick={onRead} />
            )}
            {itemType === 'paper' && (
              <ActionButton icon={Bookmark} label="阅读清单" active={(item as PaperItem).in_reading_list} onClick={onReadingList} />
            )}
          </div>
          {(itemType === 'innovation' || itemType === 'lab') && (
            <button
              onClick={onPlan}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#003399] bg-[#003399]/10 rounded-md"
            >
              <Plus className="w-3.5 h-3.5" />
              加入计划
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

function FundMeta({ item }: { item: FundItem }) {
  return (
    <>
      <Meta>{item.source}</Meta>
      <Meta>{item.level}</Meta>
      <Meta>{item.amount}</Meta>
      <Meta><CalendarDays className="w-3.5 h-3.5" />{item.deadline}</Meta>
      <Meta>更新 {item.updated_at}</Meta>
    </>
  );
}

function NewsMeta({ item }: { item: NewsItem }) {
  return (
    <>
      <Meta>{item.source_type}</Meta>
      <Meta>{item.source}</Meta>
      <Meta><CalendarDays className="w-3.5 h-3.5" />{item.published_at}</Meta>
      <Meta>更新 {item.updated_at}</Meta>
    </>
  );
}

function InnovationMeta({ item }: { item: InnovationItem }) {
  return (
    <>
      <Meta><Lightbulb className="w-3.5 h-3.5" />{item.direction}</Meta>
      <Meta>工程难度 {item.engineering_difficulty}</Meta>
      <Meta>学术价值 {item.academic_value}</Meta>
    </>
  );
}

function PaperMeta({ item }: { item: PaperItem }) {
  return (
    <>
      <Meta><BookOpen className="w-3.5 h-3.5" />{item.venue} {item.year}</Meta>
      <Meta>引用 {item.citation_count}</Meta>
      <Meta>{item.authors.slice(0, 2).join(', ')}</Meta>
    </>
  );
}

function PatentMeta({ item }: { item: PatentItem }) {
  return (
    <>
      <Meta>{item.patent_no}</Meta>
      <Meta>{item.status}</Meta>
      <Meta>{item.applicant}</Meta>
      <Meta>{item.direction}</Meta>
    </>
  );
}

function LabMeta({ item }: { item: LabItem }) {
  return (
    <>
      <Meta><MapPin className="w-3.5 h-3.5" />{item.region}</Meta>
      <Meta>{item.institution}</Meta>
      <Meta>{item.mentor}</Meta>
      <Meta><CalendarDays className="w-3.5 h-3.5" />{item.deadline}</Meta>
    </>
  );
}
