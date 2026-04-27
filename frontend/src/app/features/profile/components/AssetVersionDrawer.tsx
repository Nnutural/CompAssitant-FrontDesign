import { Clock3, X } from 'lucide-react';
import { Tag } from '@/app/components/PageShell';
import type { ProfileAsset } from '../types';
import { formatDateTime } from '../utils';

export function AssetVersionDrawer({
  asset,
  onClose,
}: {
  asset: ProfileAsset | null;
  onClose: () => void;
}) {
  if (!asset) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-[60] flex w-[440px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">版本历史</h2>
            <p className="mt-1 text-sm text-slate-500">{asset.title}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <ol className="space-y-3">
            {asset.versions.map((version, index) => (
              <li key={version.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{version.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDateTime(version.updatedAt)}
                    </p>
                  </div>
                  <Tag tone={index === 0 ? 'blue' : 'default'}>{version.version}</Tag>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{version.changelog}</p>
                <p className="mt-2 text-xs text-slate-400">{version.sizeText}</p>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </>
  );
}
