import { RefreshCcw, X } from 'lucide-react';

import { Tag } from '@/app/components/PageShell';

import type { DataSourceStatus } from '../types';
import { dataSourceStatusLabels, toneForDataSource } from '../utils';

export function DataSourceDetailDrawer({
  source,
  onClose,
  onRefresh,
}: {
  source: DataSourceStatus | null;
  onClose: () => void;
  onRefresh: (source: DataSourceStatus) => void;
}) {
  if (!source) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[460px] max-w-[94vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <Tag tone={toneForDataSource(source.status)}>{dataSourceStatusLabels[source.status]}</Tag>
            <h2 className="mt-2 text-base font-semibold text-slate-900">{source.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <h3 className="text-sm font-semibold text-slate-900">数据源说明</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{source.description}</p>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">新鲜度</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{source.freshnessScore}%</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">数据量</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{source.sourceCount}</p>
            </div>
            <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">最近同步</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{source.lastSyncText}</p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">受影响卡片</h3>
            <div className="flex flex-wrap gap-2">
              {source.affectedCards.map((card) => (
                <Tag key={card} tone="blue">{card}</Tag>
              ))}
            </div>
          </section>

          {source.errorMessage && (
            <section className="rounded-xl border border-red-100 bg-red-50 p-4">
              <h3 className="text-sm font-semibold text-red-900">错误信息</h3>
              <p className="mt-2 text-sm text-red-700">{source.errorMessage}</p>
            </section>
          )}

          <section>
            <h3 className="text-sm font-semibold text-slate-900">建议处理方式</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{source.suggestion}</p>
          </section>
        </div>

        <footer className="border-t border-slate-200 p-4">
          <button
            onClick={() => onRefresh(source)}
            disabled={source.status === 'syncing'}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className={`h-4 w-4 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
            刷新数据源
          </button>
        </footer>
      </aside>
    </>
  );
}
