import { ExternalLink, Heart, Target, X } from 'lucide-react';
import { toast } from 'sonner';
import { Tag } from '@/app/components/PageShell';
import type { CompanyProfile, JobPosting } from '../types';
import { openSourceUrl } from '../utils';

export function JobDetailDrawer({
  job,
  company,
  favorited,
  open,
  onClose,
  onSetTarget,
  onToggleFavorite,
}: {
  job?: JobPosting;
  company?: CompanyProfile;
  favorited: boolean;
  open: boolean;
  onClose: () => void;
  onSetTarget: (job: JobPosting) => void;
  onToggleFavorite: (job: JobPosting) => void;
}) {
  if (!open || !job) return null;

  const handleOpenSource = () => {
    const opened = openSourceUrl(job.sourceUrl);
    if (!opened) toast.info('演示数据来源：该链接不会跳转真实招聘网站');
  };

  return (
    <>
      <button
        type="button"
        aria-label="关闭岗位详情遮罩"
        className="fixed inset-0 z-40 cursor-default bg-slate-900/20"
        onClick={onClose}
      />
      <aside className="fixed bottom-0 right-0 top-0 z-50 flex w-[520px] max-w-[92vw] flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2">
              <Tag tone="blue">{job.direction}</Tag>
              <Tag>{job.jobType}</Tag>
              <Tag tone="green">匹配度 {job.matchScore}%</Tag>
            </div>
            <h2 className="mt-3 text-base font-semibold leading-snug text-slate-900">{job.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {job.companyName} · {job.city} · {job.salaryText}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">岗位职责</h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
              {job.responsibilities.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">任职要求</h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
              {job.requirements.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">技能关键词</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skillKeywords.map((skill) => (
                <Tag key={skill} tone="blue">
                  {skill}
                </Tag>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">适配度解释</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              当前岗位与演示画像在 {job.skillKeywords.slice(0, 3).join('、')} 上有较强关联，
              但仍需要通过项目经历、面试题练习和学习路径补齐高优先级技能短板。
            </p>
          </section>

          {company && (
            <section>
              <h3 className="text-sm font-semibold text-slate-900">公司信息</h3>
              <div className="mt-2 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{company.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{company.cityList.join(' / ')}</p>
                  </div>
                  <Tag tone={company.tier === 'S' ? 'purple' : 'blue'}>{company.tier} 类</Tag>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  安全重点：{company.securityFocus.join('、')}。招聘偏好：{company.hiringPreference.join('、')}。
                </p>
              </div>
            </section>
          )}
        </div>

        <footer className="grid grid-cols-3 gap-2 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={() => onSetTarget(job)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700"
          >
            <Target className="h-4 w-4" />
            设为目标
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(job)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favorited ? '取消收藏' : '加入收藏'}
          </button>
          <button
            type="button"
            onClick={handleOpenSource}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            查看来源
          </button>
        </footer>
      </aside>
    </>
  );
}
