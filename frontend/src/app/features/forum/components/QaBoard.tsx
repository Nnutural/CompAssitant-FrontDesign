import type { Dispatch } from 'react';
import { useState } from 'react';
import { Bookmark, HelpCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '../../../components/PageShell';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import type { ForumAction } from '../store';
import type { ForumWorkspace } from '../types';
import { filterQuestions, formatDateTime, parseTags } from '../utils';
import { ForumEmptyState } from './ForumEmptyState';
import { QuestionDetailDrawer } from './QuestionDetailDrawer';

const qaFilters = ['全部', '待解决', '已解决', '我的收藏'] as const;

export function QaBoard({
  workspace,
  dispatch,
}: {
  workspace: ForumWorkspace;
  dispatch: Dispatch<ForumAction>;
}) {
  const [filter, setFilter] = useState<(typeof qaFilters)[number]>('全部');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const questions = filterQuestions(workspace.questions, filter);
  const selectedQuestion = workspace.questions.find((question) => question.id === selectedQuestionId);

  const askQuestion = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('请填写问题标题和正文');
      return;
    }
    dispatch({
      type: 'addQuestion',
      title: title.trim(),
      content: content.trim(),
      tags: parseTags(tags),
    });
    setTitle('');
    setContent('');
    setTags('');
    setOpen(false);
    toast.success('问题已发布');
  };

  const openQuestion = (questionId: string) => {
    dispatch({ type: 'viewQuestion', questionId });
    setSelectedQuestionId(questionId);
  };

  return (
    <div className="space-y-4">
      <Card title="问答筛选" subtitle="按解决状态和我的收藏快速定位问题">
        <div className="flex flex-wrap items-center gap-2">
          {qaFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-lg px-3 py-2 text-sm ${
                filter === item ? 'bg-brand-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            <Plus className="h-4 w-4" />
            提问
          </button>
        </div>
      </Card>

      {questions.length === 0 ? (
        <ForumEmptyState title="暂无匹配问题" description="切换筛选条件，或发布新的技术问题。" />
      ) : (
        <div className="space-y-3">
          {questions.map((question) => (
            <Card key={question.id}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone={question.status === '已解决' ? 'green' : 'amber'}>{question.status}</Tag>
                    <span className="text-xs text-slate-400">{formatDateTime(question.createdAt)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openQuestion(question.id)}
                    className="mt-2 block text-left text-base font-semibold text-slate-900 hover:text-brand-blue-600"
                  >
                    {question.title}
                  </button>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{question.content}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <Tag key={tag} tone="blue">
                        {tag}
                      </Tag>
                    ))}
                    <span className="text-xs text-slate-400">@{question.authorName}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <HelpCircle className="h-3.5 w-3.5" />
                    {question.answerCount} 回答 · {question.viewCount} 浏览
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        dispatch({ type: 'toggleQuestionFavorite', questionId: question.id });
                        toast.success(question.favorited ? '已取消收藏' : '已收藏问题');
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                        question.favorited ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                      {question.favorited ? '已收藏' : '收藏'}
                    </button>
                    <button
                      type="button"
                      onClick={() => openQuestion(question.id)}
                      className="rounded-lg bg-brand-blue-50 px-2.5 py-1.5 text-xs text-brand-blue-600 hover:bg-brand-blue-100"
                    >
                      查看详情
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <QuestionDetailDrawer
        question={selectedQuestion}
        dispatch={dispatch}
        onClose={() => setSelectedQuestionId(undefined)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>发布问题</DialogTitle>
            <DialogDescription>问题、回答和采纳状态会保存在本地演示工作台中。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="问题标题"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="标签，用逗号分隔"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={6}
              placeholder="补充环境、已尝试方案和期望获得的帮助"
              className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={askQuestion}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
            >
              <Plus className="h-4 w-4" />
              发布问题
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
