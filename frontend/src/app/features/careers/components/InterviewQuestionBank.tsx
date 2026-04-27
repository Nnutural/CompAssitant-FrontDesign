import { useMemo, useState } from 'react';
import type { Dispatch } from 'react';
import { BookOpenCheck, ChevronDown, ChevronUp, Heart, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import type { CareerAction } from '../store';
import type { CareerWorkbench, InterviewDifficulty, InterviewQuestion, JobDirection, JobPosting } from '../types';
import { JOB_DIRECTIONS } from '../types';
import { applyInterviewProgress, getSelectedJob, interviewStats } from '../utils';
import { CareerEmptyState } from './CareerEmptyState';

type DirectionFilter = 'target' | 'all' | JobDirection;
type StatusFilter = 'all' | 'mastered' | 'reviewing' | 'favorite';

export function InterviewQuestionBank({
  workbench,
  jobs,
  questions,
  dispatch,
}: {
  workbench: CareerWorkbench;
  jobs: JobPosting[];
  questions: InterviewQuestion[];
  dispatch: Dispatch<CareerAction>;
}) {
  const selectedJob = getSelectedJob(workbench, jobs);
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('target');
  const [difficulty, setDifficulty] = useState<'全部' | InterviewDifficulty>('全部');
  const [topic, setTopic] = useState('全部');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const withProgress = questions.map((question) => applyInterviewProgress(question, workbench));
  const stats = interviewStats(workbench, questions);
  const topics = Array.from(new Set(withProgress.map((question) => question.topic)));

  const filtered = useMemo(() => {
    return withProgress.filter((question) => {
      const directionMatch =
        directionFilter === 'all' ||
        (directionFilter === 'target' && selectedJob ? question.direction === selectedJob.direction : false) ||
        question.direction === directionFilter;
      const difficultyMatch = difficulty === '全部' || question.difficulty === difficulty;
      const topicMatch = topic === '全部' || question.topic === topic;
      const statusMatch =
        status === 'all' ||
        (status === 'mastered' && question.mastered) ||
        (status === 'reviewing' && !question.mastered) ||
        (status === 'favorite' && question.favorited);
      return directionMatch && difficultyMatch && topicMatch && statusMatch;
    });
  }, [difficulty, directionFilter, selectedJob, status, topic, withProgress]);

  const toggleExpanded = (questionId: string) => {
    setExpandedIds((ids) => (ids.includes(questionId) ? ids.filter((id) => id !== questionId) : [...ids, questionId]));
  };

  const randomPick = () => {
    if (filtered.length === 0) {
      toast.error('当前筛选下没有题目');
      return;
    }
    const question = filtered[Math.floor(Math.random() * filtered.length)];
    setExpandedIds((ids) => Array.from(new Set([question.id, ...ids])));
    toast.success(`已抽取题目：${question.topic}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_150px_150px_150px_auto]">
          <select
            value={directionFilter}
            onChange={(event) => setDirectionFilter(event.target.value as DirectionFilter)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="target">跟随目标岗位</option>
            <option value="all">全部方向</option>
            {JOB_DIRECTIONS.map((direction) => (
              <option key={direction} value={direction}>
                {direction}
              </option>
            ))}
          </select>
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as '全部' | InterviewDifficulty)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="全部">全部难度</option>
            {['基础', '进阶', '实战', '系统设计', '科研'].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="全部">全部主题</option>
            {topics.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="all">全部状态</option>
            <option value="mastered">已掌握</option>
            <option value="reviewing">待复习</option>
            <option value="favorite">已收藏</option>
          </select>
          <button
            type="button"
            onClick={randomPick}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700"
          >
            <Shuffle className="h-4 w-4" />
            随机抽题
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="已掌握" value={stats.mastered} />
        <Stat label="待复习" value={stats.reviewing} />
        <Stat label="收藏题" value={stats.favorited} />
      </div>

      {filtered.length === 0 ? (
        <CareerEmptyState title="暂无匹配题目" description="调整方向、难度、主题或掌握状态后再试。" />
      ) : (
        <div className="space-y-3">
          {filtered.map((question) => {
            const expanded = expandedIds.includes(question.id);
            return (
              <article key={question.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Tag tone="blue">{question.direction}</Tag>
                      <Tag>{question.difficulty}</Tag>
                      <Tag tone={question.mastered ? 'green' : 'amber'}>
                        {question.mastered ? '已掌握' : '待复习'}
                      </Tag>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold leading-snug text-slate-900">{question.question}</h3>
                    <p className="mt-1 text-xs text-slate-500">{question.topic}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'toggleQuestionFavorite', questionId: question.id });
                      toast.success(question.favorited ? '已取消收藏' : '已收藏题目');
                    }}
                    className={`rounded-lg p-2 ${question.favorited ? 'text-rose-500' : 'text-slate-400 hover:bg-slate-50'}`}
                    title={question.favorited ? '取消收藏' : '收藏题目'}
                  >
                    <Heart className={question.favorited ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {question.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                {expanded && (
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                      <p className="mb-1 text-xs font-medium text-slate-500">参考答案</p>
                      {question.answer}
                    </div>
                    <div className="rounded-lg bg-brand-blue-50 p-3 text-sm leading-relaxed text-brand-blue-700">
                      <p className="mb-1 text-xs font-medium text-brand-blue-700">答题策略</p>
                      {question.strategy}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(question.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {expanded ? '收起答案' : '展开答案'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'toggleQuestionMastered', questionId: question.id });
                      toast.success(question.mastered ? '已标记为待复习' : '已标记掌握');
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-brand-blue-600 px-3 py-2 text-xs text-white hover:bg-brand-blue-700"
                  >
                    <BookOpenCheck className="h-3.5 w-3.5" />
                    {question.mastered ? '标记待复习' : '标记已掌握'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}
