import type { Dispatch } from 'react';
import { Search, SlidersHorizontal, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../../../components/PageShell';
import { FORUM_TAGS } from '../mockData';
import type { ForumBoard, ForumPost, ForumWorkspace } from '../types';
import type { ForumAction } from '../store';
import { filterPosts } from '../utils';
import { ForumEmptyState } from './ForumEmptyState';
import { PostCard } from './PostCard';

const SORT_OPTIONS = [
  { value: 'latest', label: '最新' },
  { value: 'hot', label: '最热' },
  { value: 'replies', label: '回复最多' },
  { value: 'views', label: '浏览最多' },
  { value: 'essence', label: '精华优先' },
] as const;

export function PostList({
  board,
  workspace,
  dispatch,
  onOpenPost,
  tagOptions = [...FORUM_TAGS],
  sidebar = true,
  topicId,
  title = '帖子列表',
}: {
  board: ForumBoard;
  workspace: ForumWorkspace;
  dispatch: Dispatch<ForumAction>;
  onOpenPost: (postId: string) => void;
  tagOptions?: string[];
  sidebar?: boolean;
  topicId?: string;
  title?: string;
}) {
  const effectiveTag = tagOptions.includes(workspace.selectedTag) ? workspace.selectedTag : '全部';
  const posts = filterPosts(workspace.posts, {
    board,
    query: workspace.searchQuery,
    selectedTag: effectiveTag,
    sortBy: workspace.sortBy,
    topicId,
  });
  const hotTags = FORUM_TAGS.filter((tag) => tag !== '全部').slice(0, 8);
  const activeUsers = [...workspace.users].sort((left, right) => right.postCount - left.postCount).slice(0, 5);

  const openPost = (post: ForumPost) => {
    dispatch({ type: 'viewPost', postId: post.id });
    onOpenPost(post.id);
  };

  const list = (
    <div className="space-y-3">
      <Card title={title} subtitle={`${posts.length} 条结果，可按关键词、标签和热度排序`}>
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={workspace.searchQuery}
              onChange={(event) => dispatch({ type: 'setSearchQuery', query: event.target.value })}
              placeholder="搜索标题、正文、作者或标签"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
          </label>
          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <select
              value={effectiveTag}
              onChange={(event) => dispatch({ type: 'setSelectedTag', tag: event.target.value })}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            >
              {tagOptions.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
          <select
            value={workspace.sortBy}
            onChange={(event) => dispatch({ type: 'setSortBy', sortBy: event.target.value as ForumWorkspace['sortBy'] })}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {posts.length === 0 ? (
        <ForumEmptyState title="没有找到匹配帖子" description="试试清空关键词，或切换标签、排序方式。" />
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpen={() => openPost(post)}
            onLike={() => {
              dispatch({ type: 'togglePostLike', postId: post.id });
              toast.success(post.liked ? '已取消点赞' : '已点赞');
            }}
            onFavorite={() => {
              dispatch({ type: 'togglePostFavorite', postId: post.id });
              toast.success(post.favorited ? '已取消收藏' : '已收藏');
            }}
          />
        ))
      )}
    </div>
  );

  if (!sidebar) return list;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
      {list}
      <aside className="space-y-4">
        <Card title="热门板块" subtitle="点击后按标签筛选">
          <ul className="space-y-2 text-sm">
            {hotTags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'setSelectedTag', tag })}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${
                    effectiveTag === tag
                      ? 'bg-brand-blue-50 text-brand-blue-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-brand-blue-600'
                  }`}
                >
                  <span>#{tag}</span>
                  <TrendingUp className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="活跃用户" subtitle="点击后搜索该作者">
          <ul className="space-y-2">
            {activeUsers.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'setSearchQuery', query: user.name })}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-slate-50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {user.avatarText}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{user.name}</p>
                    <p className="truncate text-xs text-slate-400">{user.postCount} 帖 · {user.reputation} 声望</p>
                  </div>
                  <Users className="h-3.5 w-3.5 text-slate-300" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </aside>
    </div>
  );
}
