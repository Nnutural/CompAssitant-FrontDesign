import { useState } from 'react';
import type { Dispatch } from 'react';
import { Compass, FlaskConical, PlusCircle, Sparkles, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { generateDirectionPlans } from '../api';
import type { CareerAction } from '../store';
import type { CareerWorkbench, JobPosting } from '../types';
import { getLatestResumeReview, getSelectedJob, learningCompletionRate } from '../utils';
import { CareerLoadingState } from './CareerLoadingState';

const iconByType = {
  科研路线: FlaskConical,
  工业路线: Target,
  复合路线: Compass,
};

export function CareerDirectionPlanner({
  workbench,
  jobs,
  dispatch,
}: {
  workbench: CareerWorkbench;
  jobs: JobPosting[];
  dispatch: Dispatch<CareerAction>;
}) {
  const [generating, setGenerating] = useState(false);
  const selectedJob = getSelectedJob(workbench, jobs);
  const latestReview = getLatestResumeReview(workbench, selectedJob?.id);
  const completion = learningCompletionRate(workbench.learningPath);

  const regenerate = async () => {
    setGenerating(true);
    const plans = await generateDirectionPlans(workbench, jobs);
    dispatch({ type: 'setDirectionPlans', plans });
    setGenerating(false);
    toast.success('已重新生成发展规划');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-brand-blue-600">规划上下文</p>
            <h2 className="mt-1 text-base font-semibold text-slate-900">
              {selectedJob?.title ?? '目标岗位'} · 学习完成率 {completion}%
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              简历匹配率 {latestReview?.matchRate ?? '未分析'} · 收藏公司 {workbench.favoriteCompanies.length} 家
            </p>
          </div>
          <button
            type="button"
            onClick={regenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700 disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? '生成中...' : '重新生成规划'}
          </button>
        </div>
      </Card>

      {generating && <CareerLoadingState label="正在基于岗位、技能和简历生成路线规划..." />}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {workbench.directionPlans.map((plan) => {
          const Icon = iconByType[plan.type];
          return (
            <article key={plan.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="blue">{plan.type}</Tag>
                    <Tag tone="green">适配 {Math.round(plan.fitScore)}%</Tag>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-900">{plan.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.summary}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <ListBlock title="发展路径" items={plan.milestones} />
                <ListBlock title="近期行动" items={plan.nextActions} />
                <ListBlock title="风险提醒" items={plan.risks} />
              </div>

              <button
                type="button"
                onClick={() => toast.success('已加入计划任务（演示）')}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <PlusCircle className="h-4 w-4" />
                加入计划任务
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <ul className="mt-2 space-y-1 text-xs leading-relaxed text-slate-600">
        {items.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </div>
  );
}
