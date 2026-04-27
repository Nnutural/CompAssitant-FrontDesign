import { useMemo, useState } from 'react';
import type { Dispatch } from 'react';
import { Building2, Eye, Heart, MapPin, Plus, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import type { CareerAction } from '../store';
import type { CareerCity, CareerWorkbench, CompanyProfile, CompanyTier, JobPosting } from '../types';
import { CAREER_CITIES } from '../types';
import { CareerEmptyState } from './CareerEmptyState';
import { CompanyCompareDrawer } from './CompanyCompareDrawer';

export function CompanyProfilePanel({
  workbench,
  companies,
  jobs,
  dispatch,
}: {
  workbench: CareerWorkbench;
  companies: CompanyProfile[];
  jobs: JobPosting[];
  dispatch: Dispatch<CareerAction>;
}) {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<'全部' | CompanyTier>('全部');
  const [city, setCity] = useState<'全部' | CareerCity>('全部');
  const [business, setBusiness] = useState('全部');
  const [detailCompany, setDetailCompany] = useState<CompanyProfile | undefined>();
  const [compareOpen, setCompareOpen] = useState(false);
  const businessOptions = Array.from(new Set(companies.flatMap((company) => company.businessAreas)));
  const comparedCompanies = companies.filter((company) => workbench.comparedCompanyIds.includes(company.id));

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return companies
      .filter((company) => {
        const text = `${company.name} ${company.businessAreas.join(' ')} ${company.securityFocus.join(' ')} ${company.techStack.join(' ')}`.toLowerCase();
        return (
          (!lowered || text.includes(lowered)) &&
          (tier === '全部' || company.tier === tier) &&
          (city === '全部' || company.cityList.includes(city)) &&
          (business === '全部' || company.businessAreas.includes(business))
        );
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [business, city, companies, query, tier]);

  const toggleFavorite = (company: CompanyProfile) => {
    dispatch({ type: 'toggleFavoriteCompany', companyId: company.id });
    toast.success(workbench.favoriteCompanies.includes(company.id) ? '已取消收藏' : '已收藏公司');
  };

  const toggleCompare = (company: CompanyProfile) => {
    dispatch({ type: 'toggleCompanyCompare', companyId: company.id });
    toast.success(workbench.comparedCompanyIds.includes(company.id) ? '已移出对比' : '已加入对比');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_130px_150px_180px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-blue-400"
              placeholder="搜索公司、业务方向或技术栈"
            />
          </label>
          <select
            value={tier}
            onChange={(event) => setTier(event.target.value as '全部' | CompanyTier)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="全部">全部层级</option>
            <option value="S">S 类</option>
            <option value="A">A 类</option>
            <option value="B">B 类</option>
          </select>
          <select
            value={city}
            onChange={(event) => setCity(event.target.value as '全部' | CareerCity)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="全部">全部城市</option>
            {CAREER_CITIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={business}
            onChange={(event) => setBusiness(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
          >
            <option value="全部">全部业务</option>
            {businessOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            className="rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700"
          >
            公司对比（{comparedCompanies.length}）
          </button>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <CareerEmptyState title="暂无匹配公司" description="调整公司名称、层级、城市或业务方向后再试。" />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {filtered.map((company) => {
            const favorited = workbench.favoriteCompanies.includes(company.id);
            const compared = workbench.comparedCompanyIds.includes(company.id);
            return (
              <article key={company.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{company.name}</h3>
                        <Tag tone={company.tier === 'S' ? 'purple' : 'blue'}>{company.tier} 类</Tag>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3" />
                        {company.cityList.join(' / ')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(company)}
                    className={`rounded-lg p-2 ${favorited ? 'text-rose-500' : 'text-slate-400 hover:bg-slate-50'}`}
                    title={favorited ? '取消收藏' : '收藏公司'}
                  >
                    <Heart className={favorited ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
                  </button>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  安全重点：{company.securityFocus.join('、')}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {company.techStack.slice(0, 5).map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <Metric label="匹配度" value={`${company.matchScore}%`} />
                  <Metric label="开放岗位" value={`${company.openJobs.length}`} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDetailCompany(company);
                      dispatch({ type: 'setSelectedCompany', companyId: company.id });
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    详情
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCompare(company)}
                    className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs ${
                      compared ? 'bg-brand-blue-600 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    对比
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(company)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {favorited ? '取消' : '收藏'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <CompanyDetailDrawer
        company={detailCompany}
        jobs={jobs}
        onClose={() => setDetailCompany(undefined)}
        onToggleFavorite={toggleFavorite}
        favorited={detailCompany ? workbench.favoriteCompanies.includes(detailCompany.id) : false}
      />
      <CompanyCompareDrawer
        open={compareOpen}
        companies={comparedCompanies}
        onClose={() => setCompareOpen(false)}
        onRemove={(companyId) => dispatch({ type: 'toggleCompanyCompare', companyId })}
      />
    </div>
  );
}

function CompanyDetailDrawer({
  company,
  jobs,
  favorited,
  onClose,
  onToggleFavorite,
}: {
  company?: CompanyProfile;
  jobs: JobPosting[];
  favorited: boolean;
  onClose: () => void;
  onToggleFavorite: (company: CompanyProfile) => void;
}) {
  if (!company) return null;
  const openJobs = jobs.filter((job) => company.openJobs.includes(job.id));

  return (
    <>
      <button
        type="button"
        aria-label="关闭公司详情遮罩"
        className="fixed inset-0 z-40 cursor-default bg-slate-900/20"
        onClick={onClose}
      />
      <aside className="fixed bottom-0 right-0 top-0 z-50 flex w-[520px] max-w-[92vw] flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">{company.name}</h2>
              <Tag tone={company.tier === 'S' ? 'purple' : 'blue'}>{company.tier} 类</Tag>
            </div>
            <p className="mt-1 text-sm text-slate-500">{company.cityList.join(' / ')}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <DetailSection title="业务方向" items={company.businessAreas} />
          <DetailSection title="安全团队特点" items={company.securityFocus} />
          <DetailSection title="技术栈" items={company.techStack} />
          <DetailSection title="招聘偏好" items={company.hiringPreference} />
          <DetailSection title="文化标签" items={company.cultureTags} />
          <section>
            <h3 className="text-sm font-semibold text-slate-900">适配岗位</h3>
            <div className="mt-2 space-y-2">
              {openJobs.map((job) => (
                <div key={job.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-800">{job.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{job.city} · {job.salaryText}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-xl bg-brand-blue-50 p-4 text-sm leading-relaxed text-brand-blue-700">
            推荐投递策略：优先突出与 {company.techStack.slice(0, 3).join('、')} 相关的项目经历，
            同时准备一段说明你为什么适合 {company.securityFocus[0]} 方向。
          </section>
        </div>
        <footer className="border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={() => onToggleFavorite(company)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700"
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-white' : ''}`} />
            {favorited ? '取消收藏' : '收藏公司'}
          </button>
        </footer>
      </aside>
    </>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <Tag key={item} tone="blue">
            {item}
          </Tag>
        ))}
      </div>
    </section>
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
