import { useState } from 'react';
import type { Dispatch } from 'react';
import { ListPlus, Sparkles, Target } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { generateLearningPath, generateSkillSuggestions } from '../api';
import type { CareerAction } from '../store';
import type { CareerWorkbench, JobPosting } from '../types';
import { computeSkillGaps, getSelectedJob } from '../utils';
import { CareerEmptyState } from './CareerEmptyState';
import { CareerLoadingState } from './CareerLoadingState';

const priorityTone = {
  high: 'red',
  medium: 'amber',
  low: 'green',
} as const;

const priorityText = {
  high: '高优先级',
  medium: '中优先级',
  low: '已接近',
};

export function SkillGapPanel({
  workbench,
  jobs,
  dispatch,
}: {
  workbench: CareerWorkbench;
  jobs: JobPosting[];
  dispatch: Dispatch<CareerAction>;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [addingPath, setAddingPath] = useState(false);
  const selectedJob = getSelectedJob(workbench, jobs);
  const gaps = computeSkillGaps(workbench, selectedJob);

  if (!selectedJob) {
    return <CareerEmptyState title="请先选择目标岗位" description="技能差距会根据目标岗位要求自动计算。" />;
  }

  const runSuggestions = async () => {
    setLoadingSuggestions(true);
    const next = await generateSkillSuggestions(gaps, selectedJob);
    setSuggestions(next);
    setLoadingSuggestions(false);
    toast.success('已生成补强建议');
  };

  const addToPath = async () => {
    setAddingPath(true);
    const path = await generateLearningPath(gaps, selectedJob, workbench.learningPace);
    dispatch({ type: 'setLearningPath', path });
    setAddingPath(false);
    toast.success('已加入学习路径');
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
      <Card
        title="你的技能 vs 目标岗位要求"
        subtitle={`${selectedJob.title} · ${selectedJob.companyName}`}
        right={<Tag tone="blue">差距项 {gaps.filter((gap) => gap.gap > 0).length}</Tag>}
      >
        <div className="space-y-4">
          {gaps.map((gap) => {
            const skill = workbench.userSkills.find((item) => item.id === gap.skillId);
            if (!skill) return null;
            return (
              <section key={gap.skillId} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{gap.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{gap.suggestion}</p>
                  </div>
                  <Tag tone={priorityTone[gap.priority]}>{priorityText[gap.priority]}</Tag>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px]">
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-slate-500">
                      <span>当前 {skill.level}%</span>
                      <span>要求 {gap.required}%</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-slate-100">
                      <div className="absolute h-full rounded-full bg-brand-blue-600" style={{ width: `${skill.level}%` }} />
                      <div className="absolute top-0 h-2 border-r-2 border-red-500" style={{ left: `${gap.required}%` }} />
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skill.level}
                    onChange={(event) =>
                      dispatch({ type: 'setUserSkillLevel', skillId: skill.id, level: Number(event.target.value) })
                    }
                    className="w-full accent-brand-blue-600"
                  />
                </div>
              </section>
            );
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <Card title="补强建议" subtitle="基于高优先级差距模拟生成">
          <div className="space-y-3">
            <button
              type="button"
              onClick={runSuggestions}
              disabled={loadingSuggestions}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700 disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" />
              {loadingSuggestions ? '生成中...' : '生成补强建议'}
            </button>
            {loadingSuggestions && <CareerLoadingState label="正在计算技能补强建议..." />}
            {suggestions.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-500">
                点击生成后，这里会输出 3-5 条可执行建议。
              </p>
            ) : (
              <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
                {suggestions.map((item) => (
                  <li key={item} className="rounded-lg border border-slate-200 p-3">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card title="写入学习路径">
          <div className="space-y-3">
            <div className="flex items-start gap-2 rounded-lg bg-brand-blue-50 p-3 text-sm leading-relaxed text-brand-blue-700">
              <Target className="mt-0.5 h-4 w-4 shrink-0" />
              <span>将高优先级技能写入 30/60/90/180 天计划，并在学习路径中继续打卡。</span>
            </div>
            <button
              type="button"
              onClick={addToPath}
              disabled={addingPath}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-70"
            >
              <ListPlus className="h-4 w-4" />
              {addingPath ? '写入中...' : '加入学习路径'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
