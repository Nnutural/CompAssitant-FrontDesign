import { useMemo, useState, type Dispatch } from 'react';
import { Bot, Eye, FilePlus2, Flame, Globe2, Star } from 'lucide-react';
import { toast } from 'sonner';

import { Card, Tag } from '@/app/components/PageShell';

import type { WorkspaceAction } from '../store';
import type { InsightItem, InsightType, WorkspaceDashboard } from '../types';
import { buildInsightPrompt, pushWorkspaceTaskImport } from '../utils';
import { InsightDetailDrawer } from './InsightDetailDrawer';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';

type InsightSort = 'heat' | 'published' | 'reliability';

const tagOptions: Record<Exclude<InsightType, 'policy'>, string[]> = {
  industry: ['AI 安全', '零信任', '供应链', '云安全', '工控安全', '市场趋势'],
  social: ['数据泄露', 'AI 诈骗', '高校赛事', '社会治理', '个人信息保护'],
};

const iconMap = {
  industry: Flame,
  social: Globe2,
};

export function InsightFeed({
  dashboard,
  type,
  dispatch,
  onNavigate,
}: {
  dashboard: WorkspaceDashboard;
  type: Exclude<InsightType, 'policy'>;
  dispatch: Dispatch<WorkspaceAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  const [tag, setTag] = useState('全部');
  const [sort, setSort] = useState<InsightSort>('heat');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const Icon = iconMap[type];

  const items = useMemo(() => {
    return dashboard.insights
      .filter((item) => item.type === type)
      .filter((item) => tag === '全部' || item.tags.includes(tag))
      .sort((a, b) => {
        if (sort === 'published') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        if (sort === 'reliability') return b.reliability - a.reliability;
        return b.heatScore - a.heatScore;
      });
  }, [dashboard.insights, sort, tag, type]);

  const selected = dashboard.insights.find((item) => item.id === selectedId) ?? null;

  const toggleFavorite = (item: InsightItem) => {
    dispatch({ type: 'toggleInsightFavorite', insightId: item.id });
    toast.success(item.favorited ? '已取消收藏热点' : '已收藏热点');
  };

  const addInsightTask = (item: InsightItem) => {
    const priority = item.heatScore >= 90 ? 'high' : item.heatScore >= 80 ? 'medium' : 'low';
    pushWorkspaceTaskImport({
      title: item.title,
      description: item.summary,
      module: item.relatedModules[0] ?? 'chat',
      sourceLabel: type === 'industry' ? '行业热点' : '社会热点',
      sourcePath: `/chat?tab=hot&query=${encodeURIComponent(buildInsightPrompt(item))}`,
      priority,
      tags: item.tags,
      relatedObjectId: item.id,
    });
    toast.success('已加入计划任务');
  };

  return (
    <>
      <Card
        title={type === 'industry' ? '行业热点' : '社会热点'}
        subtitle={type === 'industry' ? '安全产业、厂商动向、市场趋势与威胁情报' : '网安相关社会事件、舆情案例与教育动态'}
        right={
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as InsightSort)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
          >
            <option value="heat">热度</option>
            <option value="published">发布时间</option>
            <option value="reliability">可信度</option>
          </select>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {['全部', ...tagOptions[type]].map((item) => (
            <button
              key={item}
              onClick={() => setTag(item)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                tag === item
                  ? 'bg-brand-blue-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <WorkspaceEmptyState title="暂无热点" description="当前标签下没有演示热点。" />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((itemTag) => (
                        <Tag key={itemTag} tone="blue">{itemTag}</Tag>
                      ))}
                      {item.favorited && <Tag tone="amber">已收藏</Tag>}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-6 text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>热度 {item.heatScore}</span>
                      <span>可信度 {item.reliability}%</span>
                      <span>{item.source}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedId(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        详情
                      </button>
                      <button
                        onClick={() => toggleFavorite(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <Star className={`h-3.5 w-3.5 ${item.favorited ? 'fill-amber-400 text-amber-500' : ''}`} />
                        {item.favorited ? '取消收藏' : '收藏'}
                      </button>
                      <button
                        onClick={() => onNavigate(`/chat?tab=hot&query=${encodeURIComponent(buildInsightPrompt(item))}`, '已加入问答分析，并携带热点上下文')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        问答分析
                      </button>
                      <button
                        onClick={() => onNavigate(`/writing?tab=editor&quote=${encodeURIComponent(item.title)}`, '已引用到写作，并携带热点摘要')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <FilePlus2 className="h-3.5 w-3.5" />
                        引用
                      </button>
                      <button
                        onClick={() => addInsightTask(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-blue-700"
                      >
                        加任务
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Card>

      <InsightDetailDrawer
        item={selected}
        onClose={() => setSelectedId(null)}
        onToggleFavorite={toggleFavorite}
        onNavigate={onNavigate}
      />
    </>
  );
}
