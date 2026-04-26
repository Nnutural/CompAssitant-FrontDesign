import { useMemo, useState } from 'react';
import { Eye, Filter, Heart, Search, SlidersHorizontal, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import type { WritingAction } from '../store';
import type { TopicIdea, WritingProject } from '../types';
import { WritingEmptyState } from './WritingEmptyState';
import { TopicCompareDrawer } from './TopicCompareDrawer';

type SortKey = 'match' | 'innovation' | 'feasibility' | 'latest';

export function TopicCardPool({
  project,
  dispatch,
}: {
  project: WritingProject;
  dispatch: React.Dispatch<WritingAction>;
}) {
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('match');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailTopic, setDetailTopic] = useState<TopicIdea | undefined>();

  const directions = useMemo(
    () => Array.from(new Set(project.topics.map((topic) => topic.direction))),
    [project.topics],
  );
  const comparedTopics = project.topics.filter((topic) => topic.compared);

  const filteredTopics = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    const matched = project.topics.filter((topic) => {
      const text = `${topic.title} ${topic.direction} ${topic.tags.join(' ')}`.toLowerCase();
      return (!lowered || text.includes(lowered)) && (direction === 'all' || topic.direction === direction);
    });
    return matched.sort((a, b) => {
      if (sortKey === 'innovation') return b.innovationScore - a.innovationScore;
      if (sortKey === 'feasibility') return b.feasibilityScore - a.feasibilityScore;
      if (sortKey === 'latest') return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      return b.matchScore - a.matchScore;
    });
  }, [direction, project.topics, query, sortKey]);

  const toggleFavorite = (topic: TopicIdea) => {
    dispatch({ type: 'updateTopic', topicId: topic.id, patch: { favorited: !topic.favorited } });
    toast.success(topic.favorited ? '已取消收藏' : '已收藏选题');
  };

  const toggleCompare = (topic: TopicIdea) => {
    dispatch({ type: 'updateTopic', topicId: topic.id, patch: { compared: !topic.compared } });
    toast.success(topic.compared ? '已移出对比' : '已加入对比');
  };

  const setActive = (topic: TopicIdea) => {
    dispatch({ type: 'setActiveTopic', topicId: topic.id });
    toast.success('已设为当前选题');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-blue-400"
              placeholder="搜索标题、方向或标签"
            />
          </label>
          <label className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={direction}
              onChange={(event) => setDirection(event.target.value)}
              className="w-full appearance-none rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-blue-400"
            >
              <option value="all">全部方向</option>
              {directions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="w-full appearance-none rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-blue-400"
            >
              <option value="match">匹配度</option>
              <option value="innovation">创新性</option>
              <option value="feasibility">可行性</option>
              <option value="latest">最新生成</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg bg-brand-blue-600 px-4 py-2 text-sm text-white hover:bg-brand-blue-700"
          >
            打开对比（{comparedTopics.length}）
          </button>
        </div>
      </Card>

      {filteredTopics.length === 0 ? (
        <WritingEmptyState title="暂无匹配选题" description="可返回选题推演生成新的候选选题，或调整搜索与筛选条件。" />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="grid gap-4 xl:col-span-2 xl:grid-cols-2">
            {filteredTopics.map((topic) => (
              <article
                key={topic.id}
                className={`rounded-xl border bg-white p-4 shadow-sm ${
                  topic.id === project.activeTopicId ? 'border-brand-blue-300 ring-2 ring-brand-blue-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone="blue">{topic.direction}</Tag>
                      {topic.id === project.activeTopicId && <Tag tone="green">当前选题</Tag>}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">{topic.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(topic)}
                    className={`rounded-lg p-2 ${topic.favorited ? 'text-rose-500' : 'text-slate-400 hover:bg-slate-50'}`}
                    title={topic.favorited ? '取消收藏' : '收藏'}
                  >
                    <Heart className={topic.favorited ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                  </button>
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{topic.summary}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <Score label="匹配" value={topic.matchScore} />
                  <Score label="创新" value={topic.innovationScore} />
                  <Score label="可行" value={topic.feasibilityScore} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {topic.tags.slice(0, 4).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActive(topic)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    设为当前
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompare(topic)}
                    className={`rounded-lg px-3 py-2 text-xs ${
                      topic.compared
                        ? 'bg-brand-blue-600 text-white'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {topic.compared ? '移出对比' : '加入对比'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailTopic(topic)}
                    className="col-span-2 inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    查看详情
                  </button>
                </div>
              </article>
            ))}
          </div>

          <Card title="选题详情" subtitle="查看推荐理由和证据上下文">
            {detailTopic ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold leading-snug text-slate-900">{detailTopic.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{detailTopic.summary}</p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">目标赛道：</span>
                    {detailTopic.targetCompetition}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">数据可得性：</span>
                    {detailTopic.dataAvailability}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">推荐理由：</span>
                    {detailTopic.recommendedReason}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    证据关联
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-500">
                    {detailTopic.evidenceIds.map((id) => (
                      <li key={id}>{project.evidences.find((evidence) => evidence.id === id)?.title ?? id}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-slate-500">点击任意选题的“查看详情”，这里会展示完整说明。</p>
            )}
          </Card>
        </div>
      )}

      <TopicCompareDrawer
        open={drawerOpen}
        topics={comparedTopics}
        onClose={() => setDrawerOpen(false)}
        onRemove={(topicId) => dispatch({ type: 'updateTopic', topicId, patch: { compared: false } })}
      />
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
