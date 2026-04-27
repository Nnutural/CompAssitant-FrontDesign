import type { Dispatch } from 'react';
import { useState } from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../../../components/PageShell';
import { generatePostSummary } from '../api';
import { EXPERIENCE_TAGS } from '../mockData';
import type { ForumAction } from '../store';
import type { ForumWorkspace } from '../types';
import { PostList } from './PostList';

export function ExperienceBoard({
  workspace,
  dispatch,
  onOpenPost,
}: {
  workspace: ForumWorkspace;
  dispatch: Dispatch<ForumAction>;
  onOpenPost: (postId: string) => void;
}) {
  const [loadingId, setLoadingId] = useState<string>();
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const expPosts = workspace.posts.filter((post) => post.board === 'exp');

  const handleSummary = async (postId: string) => {
    const post = expPosts.find((item) => item.id === postId);
    if (!post) return;
    setLoadingId(postId);
    const summary = await generatePostSummary(post);
    setSummaries((current) => ({ ...current, [postId]: summary }));
    setLoadingId(undefined);
    toast.success('摘要已生成');
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <PostList
        board="exp"
        workspace={workspace}
        dispatch={dispatch}
        onOpenPost={onOpenPost}
        tagOptions={[...EXPERIENCE_TAGS]}
        sidebar={false}
        title="经验分享文章"
      />
      <aside className="space-y-4">
        <Card title="经验摘要" subtitle="模拟 600-900ms 摘要生成">
          <div className="space-y-3">
            {expPosts.map((post) => (
              <div key={post.id} className="rounded-xl border border-slate-200 p-3">
                <p className="line-clamp-2 text-sm font-medium text-slate-900">{post.title}</p>
                {summaries[post.id] && (
                  <p className="mt-2 text-xs leading-5 text-slate-500">{summaries[post.id]}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={loadingId === post.id}
                    onClick={() => handleSummary(post.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-50 px-2.5 py-1.5 text-xs text-brand-blue-600 hover:bg-brand-blue-100 disabled:opacity-60"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {loadingId === post.id ? '生成中...' : '生成摘要'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'togglePostFavorite', postId: post.id });
                      toast.success(post.favorited ? '已移出收藏夹' : '已加入收藏夹');
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                      post.favorited ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {post.favorited ? '已收藏' : '加入收藏夹'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}
