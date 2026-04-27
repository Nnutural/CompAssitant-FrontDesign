import { Download, X } from 'lucide-react';
import { Tag } from '@/app/components/PageShell';
import type { ProfileAsset, SubmitChecklist } from '../types';
import { buildChecklistMarkdown, calculateChecklistCompletionRate, checklistStatusLabels, checklistStatusTones, formatDate } from '../utils';

export function SubmitPackageDrawer({
  checklist,
  assets,
  onClose,
  onDownload,
}: {
  checklist: SubmitChecklist | null;
  assets: ProfileAsset[];
  onClose: () => void;
  onDownload: (content: string) => void;
}) {
  if (!checklist) return null;
  const readyCount = checklist.items.filter((item) => item.status === 'ready').length;
  const missingCount = checklist.items.filter((item) => item.status !== 'ready' && item.requirement === '必交').length;
  const content = buildChecklistMarkdown(checklist, assets);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[520px] max-w-[96vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">提交包摘要</h2>
            <p className="mt-1 text-sm text-slate-500">{checklist.name} · {formatDate(checklist.deadline)}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="grid grid-cols-3 gap-3">
            <Metric label="完成率" value={`${calculateChecklistCompletionRate(checklist.items)}%`} />
            <Metric label="已准备" value={readyCount} />
            <Metric label="缺失必交" value={missingCount} />
          </div>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">材料项</h3>
            <ul className="mt-3 space-y-2">
              {checklist.items.map((item) => {
                const asset = assets.find((candidate) => candidate.id === item.boundAssetId);
                return (
                  <li key={item.id} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <Tag tone={checklistStatusTones[item.status]}>{checklistStatusLabels[item.status]}</Tag>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{item.requirement} · {asset?.title ?? '未绑定资产'}</p>
                    {item.note && <p className="mt-2 text-sm text-slate-600">{item.note}</p>}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <footer className="border-t border-slate-200 p-4">
          <button
            onClick={() => onDownload(content)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            <Download className="h-4 w-4" />
            下载 Markdown 清单
          </button>
        </footer>
      </aside>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
