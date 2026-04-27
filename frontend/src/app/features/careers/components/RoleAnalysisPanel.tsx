import type { Dispatch } from 'react';
import { BarChart3, Building2, MapPin, TrendingUp } from 'lucide-react';
import { Card, Tag } from '@/app/components/PageShell';
import type { CareerAction } from '../store';
import type { CareerWorkbench, JobPosting } from '../types';
import { JOB_DIRECTIONS } from '../types';
import { createRoleAnalysis, getSelectedJob } from '../utils';
import { CareerEmptyState } from './CareerEmptyState';

export function RoleAnalysisPanel({
  workbench,
  jobs,
  dispatch,
}: {
  workbench: CareerWorkbench;
  jobs: JobPosting[];
  dispatch: Dispatch<CareerAction>;
}) {
  const selectedJob = getSelectedJob(workbench, jobs);
  const directionJob =
    workbench.selectedDirection === '全部'
      ? selectedJob
      : jobs.find((job) => job.direction === workbench.selectedDirection) ?? selectedJob;
  const analysis = createRoleAnalysis(directionJob, jobs);

  if (!analysis) {
    return <CareerEmptyState title="暂无岗位分析" description="请先在招聘速递中选择一个目标岗位。" />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-brand-blue-600">当前分析对象</p>
            <h2 className="mt-1 text-base font-semibold text-slate-900">
              {directionJob?.title ?? analysis.title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {directionJob ? `${directionJob.companyName} · ${directionJob.city} · ${directionJob.salaryText}` : analysis.updateHint}
            </p>
          </div>
          <select
            value={workbench.selectedDirection}
            onChange={(event) =>
              dispatch({ type: 'setSelectedDirection', direction: event.target.value as CareerWorkbench['selectedDirection'] })
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="全部">跟随目标岗位</option>
            {JOB_DIRECTIONS.map((direction) => (
              <option key={direction} value={direction}>
                {direction}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card title="岗位方向需求分布" subtitle={analysis.updateHint}>
          <BarList rows={analysis.demandDistribution} />
        </Card>

        <Card title="薪资与热度" subtitle="模拟聚合近 30 天岗位信息">
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={TrendingUp} label="薪资区间" value={analysis.salaryRange} />
            <Stat icon={BarChart3} label="岗位方向" value={analysis.direction} />
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
            当前方向对项目经历和关键词表达较敏感，简历需要同时覆盖核心技能、具体场景和量化结果。
          </div>
        </Card>

        <Card title="城市热度" subtitle="按城市岗位热度估算">
          <BarList rows={analysis.cityHeat.map((item) => ({ label: item.city, value: Math.round(item.value) }))} />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <Card title="核心技能矩阵" subtitle="目标岗位变化后自动同步">
          <div className="flex flex-wrap gap-2">
            {analysis.coreSkills.map((skill) => (
              <Tag key={skill} tone="blue">
                {skill}
              </Tag>
            ))}
          </div>
        </Card>
        <Card title="公司类型分布">
          <BarList rows={analysis.companyTypes} />
        </Card>
      </div>
    </div>
  );
}

function BarList({ rows }: { rows: Array<{ label: string; value: number }> }) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="mb-1 flex justify-between text-xs text-slate-600">
            <span>{row.label}</span>
            <span>{Math.round(row.value)}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-blue-600" style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Icon className="h-3.5 w-3.5 text-brand-blue-600" />
        {label}
      </div>
      <p className="mt-2 text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}
