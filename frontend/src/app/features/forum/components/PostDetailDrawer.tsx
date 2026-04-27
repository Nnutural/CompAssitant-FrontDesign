import type { Dispatch, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Bookmark, Eye, Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Tag } from '../../../components/PageShell';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import type { ForumPost } from '../types';
import type { ForumAction } from '../store';
import { formatFullDateTime } from '../utils';

export function PostDetailDrawer({
  post,
  dispatch,
  onClose,
}: {
  post?: ForumPost;
  dispatch: Dispatch<ForumAction>;
  onClose: () => void;
}) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment('');
  }, [post?.id]);

  const submitComment = () => {
    if (!post || !comment.trim()) {
      toast.error('请输入评论内容');
      return;
    }
    dispatch({ type: 'addPostComment', postId: post.id, content: comment.trim() });
    setComment('');
    toast.success('评论已发布');
  };

  return (
    <Sheet open={Boolean(post)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:max-w-2xl">
        {post && (
          <>
            <SheetHeader className="border-b border-slate-100 p-5">
              <SheetTitle className="pr-8 text-xl leading-7 text-slate-900">{post.title}</SheetTitle>
              <SheetDescription>
                {post.authorName} · {formatFullDateTime(post.createdAt)}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                {post.pinned && <Tag tone="red">置顶</Tag>}
                {post.essence && <Tag tone="amber">精华</Tag>}
                {post.tags.map((tag) => (
                  <Tag key={tag} tone="blue">
                    证据标签：{tag}
                  </Tag>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 sm:grid-cols-4">
                <Metric icon={<Eye className="h-4 w-4" />} label="浏览" value={post.viewCount} />
                <Metric icon={<Heart className="h-4 w-4" />} label="点赞" value={post.likeCount} />
                <Metric icon={<Bookmark className="h-4 w-4" />} label="收藏" value={post.favoriteCount} />
                <Metric icon={<MessageCircle className="h-4 w-4" />} label="评论" value={post.replyCount} />
              </div>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {post.content}
              </article>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'togglePostLike', postId: post.id });
                    toast.success(post.liked ? '已取消点赞' : '已点赞');
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm ${
                    post.liked ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Heart className="h-4 w-4" />
                  {post.liked ? '已点赞' : '点赞'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'togglePostFavorite', postId: post.id });
                    toast.success(post.favorited ? '已取消收藏' : '已收藏');
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm ${
                    post.favorited ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  {post.favorited ? '已收藏' : '收藏'}
                </button>
              </div>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">评论</h3>
                  <span className="text-xs text-slate-400">{post.comments.length} 条</span>
                </div>
                <div className="space-y-3">
                  {post.comments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                      暂无评论，发布第一条讨论。
                    </div>
                  ) : (
                    post.comments.map((item) => (
                      <div key={item.id} className="rounded-xl border border-slate-100 bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-slate-800">{item.authorName}</span>
                          <span className="text-xs text-slate-400">{formatFullDateTime(item.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.content}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={3}
                    placeholder="写下你的补充、复盘或问题..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={submitComment}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
                    >
                      <Send className="h-4 w-4" />
                      发布评论
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
      {icon}
      <span>{label}</span>
      <span className="ml-auto font-semibold text-slate-900">{value}</span>
    </div>
  );
}
