import { Archive, Bell, Database, Save, ShieldCheck, UserCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Tag } from '@/app/components/PageShell';
import type { ProfileWorkspace } from '../types';
import { autosaveLabels, computeProfileStats, formatDateTime } from '../utils';

export function ProfileWorkbenchBar({
  workspace,
  onSave,
  onReset,
}: {
  workspace: ProfileWorkspace;
  onSave: () => void;
  onReset: () => void;
}) {
  const stats = computeProfileStats(workspace);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:items-center">
          <Metric icon={<UserCheck className="h-4 w-4" />} label="画像完整度" value={`${stats.profileCompleteness}%`} />
          <Metric icon={<Database className="h-4 w-4" />} label="资产总数" value={stats.assetCount} />
          <Metric icon={<Bell className="h-4 w-4" />} label="通知开启" value={stats.notificationEnabledCount} />
          <Metric icon={<Archive className="h-4 w-4" />} label="收藏 / 归档" value={`${stats.favoriteCount}/${stats.archivedCount}`} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="text-sm text-slate-500">
            <Tag tone={workspace.autosaveStatus === 'error' ? 'red' : workspace.autosaveStatus === 'unsaved' ? 'amber' : 'green'}>
              {autosaveLabels[workspace.autosaveStatus]}
            </Tag>
            <span className="ml-2">最近保存 {formatDateTime(workspace.savedAt)}</span>
          </div>
          <button
            onClick={onSave}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Save className="h-4 w-4" />
            保存
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <ShieldCheck className="h-4 w-4" />
            重置演示
          </button>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="min-w-[130px] rounded-lg bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
