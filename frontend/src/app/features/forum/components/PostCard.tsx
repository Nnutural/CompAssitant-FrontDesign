import { Bookmark, Eye, Heart, MessageCircle, Pin, Sparkles } from 'lucide-react';
import { Tag } from '../../../components/PageShell';
import type { ForumPost } from '../types';
import { formatDateTime } from '../utils';

export function PostCard({
  post,
  onOpen,
  onLike,
  onFavorite,
}: {
  post: ForumPost;
  onOpen: () => void;
  onLike: () => void;
  onFavorite: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onOpen();
      }}
      className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-blue-200 hover:shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {post.pinned && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-xs text-red-600">
                <Pin className="h-3 w-3" />
                置顶
              </span>
            )}
            {post.essence && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                <Sparkles className="h-3 w-3" />
                精华
              </span>
            )}
            <span className="text-xs text-slate-400">{formatDateTime(post.createdAt)}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-brand-blue-600">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} tone="blue">
                {tag}
              </Tag>
            ))}
            <span className="text-xs text-slate-400">@{post.authorName}</span>
          </div>
        </div>
        <div className="grid min-w-[148px] grid-cols-3 gap-2 text-xs text-slate-500 sm:text-right">
          <span className="inline-flex items-center gap-1 sm:justify-end">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.replyCount}
          </span>
          <span className="inline-flex items-center gap-1 sm:justify-end">
            <Eye className="h-3.5 w-3.5" />
            {post.viewCount}
          </span>
          <span className="inline-flex items-center gap-1 sm:justify-end">
            <Heart className="h-3.5 w-3.5" />
            {post.likeCount}
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onLike();
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
            post.liked ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="h-3.5 w-3.5" />
          {post.liked ? '已点赞' : '点赞'}
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
            post.favorited ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="h-3.5 w-3.5" />
          {post.favorited ? '已收藏' : '收藏'}
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-50 px-2.5 py-1.5 text-xs text-brand-blue-600 hover:bg-brand-blue-100"
        >
          查看详情
        </button>
      </div>
    </article>
  );
}
