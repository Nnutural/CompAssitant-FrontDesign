import { useState } from 'react';
import type { Dispatch } from 'react';
import { CheckCircle2, Clock, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { generateLearningPath } from '../api';
import type { CareerAction } from '../store';
import type { CareerWorkbench, JobPosting, LearningPace } from '../types';
import { computeSkillGaps, getSelectedJob, learningCompletionRate } from '../utils';
import { CareerEmptyState } from './CareerEmptyState';
import { CareerLoadingState } from './CareerLoadingState';

export function LearningPathPlanner({
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
  const completion = learningCompletionRate(workbench.learningPath);
  const gaps = computeSkillGaps(workbench, selectedJob);

  if (!selectedJob) {
    return <CareerEmptyState title="请先选择目标岗位" description="学习路径会根据目标岗位和技能差距生成。" />;
  }

  const generatePath = async () => {
    setGenerating(true);
    const path = await generateLearningPath(gaps, selectedJob, workbench.learningPace);
    dispatch({ type: 'setLearningPath', path });
    setGenerating(false);
    toast.success('已生成学习路径');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-brand-blue-600">路径目标</p>
            <h2 className="mt-1 text-base font-semibold text-slate-900">{selectedJob.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              完成率 {completion}% · 当前节奏 {workbench.learningPace}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={workbench.learningPace}
              onChange={(event) => dispatch({ type: 'setLearningPace', pace: event.target.value as LearningPace })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="紧凑">紧凑</option>
              <option value="标准">标准</option>
              <option value="宽松">宽松</option>
            </select>
            <button
              type="button"
              onClick={generatePath}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700 disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? '生成中...' : '一键生成路径'}
            </button>
            <button
              type="button"
              onClick={() => toast.success('学习进度已进入自动保存队列')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Save className="h-4 w-4" />
              保存进度
            </button>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-blue-600" style={{ width: `${completion}%` }} />
        </div>
      </Card>

      {generating && <CareerLoadingState label="正在生成 30/60/90/180 天路径..." />}

      {workbench.learningPath.length === 0 ? (
        <CareerEmptyState title="暂无学习路径" description="点击一键生成路径，系统会根据技能差距生成阶段计划。" />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {workbench.learningPath.map((milestone) => (
            <article key={milestone.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone="blue">{milestone.phase}</Tag>
                    <Tag tone={milestone.completed ? 'green' : 'default'}>
                      {milestone.completed ? '已完成' : '进行中'}
                    </Tag>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{milestone.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{milestone.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'toggleMilestone', milestoneId: milestone.id });
                    toast.success(milestone.completed ? '已取消完成状态' : '已标记完成');
                  }}
                  className={`rounded-lg p-2 ${
                    milestone.completed ? 'bg-emerald-50 text-emerald-600' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  title={milestone.completed ? '取消完成' : '标记完成'}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoList title="任务" items={milestone.tasks} />
                <InfoList title="资源" items={milestone.resources} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {milestone.dueText}
                {milestone.relatedSkills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
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
