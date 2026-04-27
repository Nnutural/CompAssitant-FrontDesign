import { X } from 'lucide-react';
import { Tag } from '@/app/components/PageShell';
import type { CompanyProfile } from '../types';

export function CompanyCompareDrawer({
  open,
  companies,
  onClose,
  onRemove,
}: {
  open: boolean;
  companies: CompanyProfile[];
  onClose: () => void;
  onRemove: (companyId: string) => void;
}) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="关闭公司对比遮罩"
        className="fixed inset-0 z-40 cursor-default bg-slate-900/20"
        onClick={onClose}
      />
      <aside className="fixed bottom-0 right-0 top-0 z-50 flex w-[560px] max-w-[92vw] flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">公司对比</h2>
            <p className="mt-0.5 text-xs text-slate-500">对比业务方向、技术栈、城市、招聘偏好和岗位匹配度</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {companies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              尚未加入对比公司。
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <article key={company.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{company.name}</h3>
                        <Tag tone={company.tier === 'S' ? 'purple' : 'blue'}>{company.tier} 类</Tag>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{company.cityList.join(' / ')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(company.id)}
                      className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                    >
                      移除
                    </button>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                    <Info label="业务方向" value={company.businessAreas.join('、')} />
                    <Info label="技术栈" value={company.techStack.join('、')} />
                    <Info label="招聘偏好" value={company.hiringPreference.join('、')} />
                    <Info label="岗位匹配度" value={`${company.matchScore}%`} />
                  </dl>
                </article>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="font-medium text-slate-800">{label}</dt>
      <dd className="mt-1 leading-relaxed">{value}</dd>
    </div>
  );
}
