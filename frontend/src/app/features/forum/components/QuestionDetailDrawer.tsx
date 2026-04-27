import type { Dispatch, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Bookmark, CheckCircle2, Eye, Heart, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Tag } from '../../../components/PageShell';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import type { ForumAction } from '../store';
import type { QaQuestion } from '../types';
import { formatFullDateTime } from '../utils';

export function QuestionDetailDrawer({
  question,
  dispatch,
  onClose,
}: {
  question?: QaQuestion;
  dispatch: Dispatch<ForumAction>;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setAnswer('');
  }, [question?.id]);

  const submitAnswer = () => {
    if (!question || !answer.trim()) {
      toast.error('请输入回答内容');
      return;
    }
    dispatch({ type: 'addAnswer', questionId: question.id, content: answer.trim() });
    setAnswer('');
    toast.success('回答已提交');
  };

  return (
    <Sheet open={Boolean(question)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:max-w-2xl">
        {question && (
          <>
            <SheetHeader className="border-b border-slate-100 p-5">
              <SheetTitle className="pr-8 text-xl leading-7 text-slate-900">{question.title}</SheetTitle>
              <SheetDescription>
                {question.authorName} · {formatFullDateTime(question.createdAt)}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <Tag tone={question.status === '已解决' ? 'green' : 'amber'}>{question.status}</Tag>
                {question.tags.map((tag) => (
                  <Tag key={tag} tone="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
              <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
                <Metric icon={<Eye className="h-4 w-4" />} label="浏览" value={question.viewCount} />
                <Metric icon={<MessageCircle className="h-4 w-4" />} label="回答" value={question.answerCount} />
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'toggleQuestionFavorite', questionId: question.id });
                    toast.success(question.favorited ? '已取消收藏' : '已收藏问题');
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 ${
                    question.favorited ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  {question.favorited ? '已收藏' : '收藏问题'}
                </button>
              </div>

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">问题正文</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{question.content}</p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">答案</h3>
                  <span className="text-xs text-slate-400">{question.answers.length} 条</span>
                </div>
                {question.answers.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
                    暂无回答，提交第一条建议。
                  </div>
                ) : (
                  <div className="space-y-3">
                    {question.answers.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-4 ${
                          item.accepted ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{item.authorName}</span>
                            {item.accepted && <Tag tone="green">已采纳</Tag>}
                          </div>
                          <span className="text-xs text-slate-400">{formatFullDateTime(item.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{item.content}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              dispatch({ type: 'toggleAnswerLike', questionId: question.id, answerId: item.id });
                              toast.success(item.liked ? '已取消点赞' : '已点赞答案');
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                              item.liked ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Heart className="h-3.5 w-3.5" />
                            {item.likeCount}
                          </button>
                          {question.status === '待解决' && (
                            <button
                              type="button"
                              onClick={() => {
                                dispatch({ type: 'acceptAnswer', questionId: question.id, answerId: item.id });
                                toast.success('已采纳答案');
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-700 hover:bg-emerald-100"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              采纳答案
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-3">
                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  rows={4}
                  placeholder="写下你的排错思路、参考资料或路线建议..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={submitAnswer}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
                  >
                    <Send className="h-4 w-4" />
                    提交回答
                  </button>
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
