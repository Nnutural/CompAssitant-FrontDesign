import type { Dispatch } from 'react';
import { Flame, MessageSquare, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '../../../components/PageShell';
import type { ForumAction } from '../store';
import type { ForumTopic, ForumWorkspace } from '../types';
import { PostList } from './PostList';

export function TopicBoard({
  workspace,
  dispatch,
  onOpenPost,
  onComposeForTopic,
}: {
  workspace: ForumWorkspace;
  dispatch: Dispatch<ForumAction>;
  onOpenPost: (postId: string) => void;
  onComposeForTopic: (topic: ForumTopic) => void;
}) {
  const activeTopic = workspace.topics.find((topic) => topic.id === workspace.activeTopicId);
  const ranking = [...workspace.topics].sort((left, right) => right.heatScore - left.heatScore);

  const enterTopic = (topic: ForumTopic) => {
    dispatch({ type: 'setActiveTopic', topicId: topic.id });
    dispatch({ type: 'setSearchQuery', query: '' });
    dispatch({ type: 'setSelectedTag', tag: '全部' });
    toast.success(`已进入话题：${topic.title}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="grid gap-4 md:grid-cols-2">
          {workspace.topics.map((topic) => (
            <Card key={topic.id} className={workspace.activeTopicId === topic.id ? 'border-brand-blue-200' : ''}>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{topic.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{topic.summary}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-2 py-1 text-center">
                    <p className="text-xs text-slate-400">热度</p>
                    <p className="text-sm font-semibold text-slate-900">{topic.heatScore}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topic.tags.map((tag) => (
                    <Tag key={tag} tone="blue">
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {topic.discussionCount} 条讨论
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'toggleTopicFollow', topicId: topic.id });
                      toast.success(topic.followed ? '已取消关注话题' : '已关注话题');
                    }}
                    className={`ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                      topic.followed ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {topic.followed ? '已关注' : '关注'}
                  </button>
                  <button
                    type="button"
                    onClick={() => enterTopic(topic)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-50 px-2.5 py-1.5 text-xs text-brand-blue-600 hover:bg-brand-blue-100"
                  >
                    进入话题
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <aside className="space-y-4">
          <Card title="热度榜" subtitle="点击进入话题">
            <ol className="space-y-2">
              {ranking.map((topic, index) => (
                <li key={topic.id}>
                  <button
                    type="button"
                    onClick={() => enterTopic(topic)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-50 text-xs font-semibold text-amber-700">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{topic.title}</p>
                      <p className="text-xs text-slate-400">{topic.discussionCount} 讨论</p>
                    </div>
                    <Flame className="h-4 w-4 text-amber-500" />
                  </button>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>

      {activeTopic && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-900">话题帖子：{activeTopic.title}</p>
              <p className="text-xs text-slate-500">查看相关帖子，也可以直接发起该话题下的新讨论。</p>
            </div>
            <button
              type="button"
              onClick={() => onComposeForTopic(activeTopic)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
            >
              <Plus className="h-4 w-4" />
              发起话题帖
            </button>
          </div>
          <PostList
            board="security"
            workspace={workspace}
            dispatch={dispatch}
            onOpenPost={onOpenPost}
            sidebar={false}
            topicId={activeTopic.id}
            title={`${activeTopic.title} 相关讨论`}
          />
        </div>
      )}
    </div>
  );
}
