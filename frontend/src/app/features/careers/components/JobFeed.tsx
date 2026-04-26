import { useMemo, useState } from 'react';
import { Briefcase, Eye, Heart, Search, Target } from 'lucide-react';
import { toast } from 'sonner';
import type { Dispatch } from 'react';
import { Card, Tag } from '@/app/components/PageShell';
import type { CareerAction } from '../store';
import type { CompanyProfile, JobPosting, JobType, CareerWorkbench } from '../types';
import { CAREER_CITIES, JOB_DIRECTIONS } from '../types';
import { CareerEmptyState } from './CareerEmptyState';
import { JobDetailDrawer } from './JobDetailDrawer';

type SortKey = 'match' | 'salary' | 'heat' | 'updated';
type SalaryFilter = 'all' | 'lt20' | '20-30' | 'gt30';

export function JobFeed({
  workbench,
  jobs,
  companies,
  dispatch,
}: {
  workbench: CareerWorkbench;
  jobs: JobPosting[];
  companies: CompanyProfile[];
  dispatch: Dispatch<CareerAction>;
}) {
  const [query, setQuery] = useState('');
  const [jobType, setJobType] = useState<'全部' | JobType>('全部');
  const [salaryFilter, setSalaryFilter] = useState<SalaryFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('match');
  const [detailJob, setDetailJob] = useState<JobPosting | undefined>();

  const filteredJobs = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return jobs
      .filter((job) => {
        const text = `${job.title} ${job.companyName} ${job.skillKeywords.join(' ')} ${job.tags.join(' ')}`.toLowerCase();
        const queryMatch = !lowered || text.includes(lowered);
        const directionMatch = workbench.selectedDirection === '全部' || job.direction === workbench.selectedDirection;
        const cityMatch = workbench.selectedCity === '全部' || job.city === workbench.selectedCity;
        const typeMatch = jobType === '全部' || job.jobType === jobType;
        const salaryMatch =
          salaryFilter === 'all' ||
          (salaryFilter === 'lt20' && job.salaryMax < 20) ||
          (salaryFilter === '20-30' && job.salaryMax >= 20 && job.salaryMin <= 30) ||
          (salaryFilter === 'gt30' && job.salaryMax >= 30);
        return queryMatch && directionMatch && cityMatch && typeMatch && salaryMatch;
      })
      .sort((a, b) => {
        if (sortKey === 'salary') return b.salaryMax - a.salaryMax;
        if (sortKey === 'heat') return b.heatScore - a.heatScore;
        if (sortKey === 'updated') return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
        return b.matchScore - a.matchScore;
      });
  }, [jobs, jobType, query, salaryFilter, sortKey, workbench.selectedCity, workbench.selectedDirection]);

  const setTargetJob = (job: JobPosting) => {
    dispatch({
      type: 'setSelectedJob',
      jobId: job.id,
      direction: job.direction,
      city: job.city,
      companyId: job.companyId,
    });
    toast.success('已设为目标岗位');
  };

  const toggleFavorite = (job: JobPosting) => {
    dispatch({ type: 'toggleFavoriteJob', jobId: job.id });
    toast.success(workbench.favoriteJobs.includes(job.id) ? '已取消收藏' : '已收藏岗位');
  };

  const detailCompany = detailJob ? companies.find((company) => company.id === detailJob.companyId) : undefined;

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_150px_150px_150px_150px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-blue-400"
              placeholder="搜索岗位、公司或技能关键词"
            />
          </label>
          <select
            value={workbench.selectedDirection}
            onChange={(event) =>
              dispatch({ type: 'setSelectedDirection', direction: event.target.value as CareerWorkbench['selectedDirection'] })
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="全部">全部方向</option>
            {JOB_DIRECTIONS.map((direction) => (
              <option key={direction} value={direction}>
                {direction}
              </option>
            ))}
          </select>
          <select
            value={workbench.selectedCity}
            onChange={(event) =>
              dispatch({ type: 'setSelectedCity', city: event.target.value as CareerWorkbench['selectedCity'] })
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="全部">全部城市</option>
            {CAREER_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={jobType}
            onChange={(event) => setJobType(event.target.value as '全部' | JobType)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="全部">全部类型</option>
            <option value="校招">校招</option>
            <option value="实习">实习</option>
            <option value="社招">社招</option>
          </select>
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="match">匹配度</option>
            <option value="salary">薪资</option>
            <option value="heat">热度</option>
            <option value="updated">更新时间</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['all', 'lt20', '20-30', 'gt30'] as SalaryFilter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSalaryFilter(item)}
              className={`rounded-lg px-3 py-1.5 text-xs ${
                salaryFilter === item
                  ? 'bg-brand-blue-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item === 'all' ? '全部薪资' : item === 'lt20' ? '20K 以下' : item === '20-30' ? '20-30K' : '30K 以上'}
            </button>
          ))}
        </div>
      </Card>

      {filteredJobs.length === 0 ? (
        <CareerEmptyState title="暂无匹配岗位" description="调整关键词、方向、城市或薪资区间后再试。" />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredJobs.map((job) => {
            const favorited = workbench.favoriteJobs.includes(job.id);
            const selected = workbench.selectedJobId === job.id;
            return (
              <article
                key={job.id}
                className={`rounded-xl border bg-white p-4 shadow-sm ${
                  selected ? 'border-brand-blue-300 ring-2 ring-brand-blue-50' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag tone="blue">{job.direction}</Tag>
                        <Tag>{job.jobType}</Tag>
                        {selected && <Tag tone="green">当前目标</Tag>}
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900">{job.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {job.companyName} · {job.city} · {job.education}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(job)}
                    className={`rounded-lg p-2 ${favorited ? 'text-rose-500' : 'text-slate-400 hover:bg-slate-50'}`}
                    title={favorited ? '取消收藏' : '收藏岗位'}
                  >
                    <Heart className={favorited ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <Metric label="匹配度" value={`${job.matchScore}%`} />
                  <Metric label="热度" value={`${job.heatScore}`} />
                  <Metric label="薪资" value={job.salaryText} />
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {job.tags.slice(0, 5).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-500">更新于 {job.updatedAt} · 来源：{job.source}</p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailJob(job)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    查看详情
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetJob(job)}
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-brand-blue-600 px-3 py-2 text-xs text-white hover:bg-brand-blue-700"
                  >
                    <Target className="h-3.5 w-3.5" />
                    设为目标岗位
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <JobDetailDrawer
        open={detailJob !== undefined}
        job={detailJob}
        company={detailCompany}
        favorited={detailJob ? workbench.favoriteJobs.includes(detailJob.id) : false}
        onClose={() => setDetailJob(undefined)}
        onSetTarget={setTargetJob}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
