import { useState } from 'react';
import { AlertTriangle, Database, Eye, RefreshCcw } from 'lucide-react';

import { Card, Tag } from '@/app/components/PageShell';

import type { DataSourceStatus, WorkspaceDashboard } from '../types';
import { dataSourceStatusLabels, toneForDataSource } from '../utils';
import { DataSourceDetailDrawer } from './DataSourceDetailDrawer';

export function DataFreshnessPanel({
  dashboard,
  onRefreshSource,
  onRefreshAll,
}: {
  dashboard: WorkspaceDashboard;
  onRefreshSource: (source: DataSourceStatus) => void;
  onRefreshAll: () => void;
}) {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const selected = dashboard.dataSources.find((source) => source.id === selectedSourceId) ?? null;

  return (
    <>
      <Card
        title="数据新鲜度"
        subtitle="查看数据源健康状态，识别哪些卡片受旧数据影响"
        right={
          <button
            onClick={onRefreshAll}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            <RefreshCcw className="h-4 w-4" />
            刷新全部
          </button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.dataSources.map((source) => {
            const risky = source.status === 'outdated' || source.status === 'failed';
            return (
              <article
                key={source.id}
                className={`rounded-xl border p-4 ${
                  risky ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-slate-400" />
                      <h3 className="truncate text-sm font-semibold text-slate-900">{source.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{source.lastSyncText}</p>
                  </div>
                  <Tag tone={toneForDataSource(source.status)}>{dataSourceStatusLabels[source.status]}</Tag>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>新鲜度</span>
                    <span>{source.freshnessScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${risky ? 'bg-amber-500' : 'bg-brand-blue-600'}`}
                      style={{ width: `${source.freshnessScore}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {source.affectedCards.slice(0, 3).map((card) => (
                    <span key={card} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {card}
                    </span>
                  ))}
                </div>

                {source.errorMessage && (
                  <div className="mt-3 flex gap-2 rounded-lg border border-red-100 bg-red-50 p-2 text-xs text-red-700">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{source.errorMessage}</span>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onRefreshSource(source)}
                    disabled={source.status === 'syncing'}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCcw className={`h-3.5 w-3.5 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                    刷新
                  </button>
                  <button
                    onClick={() => setSelectedSourceId(source.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-blue-700"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    详情
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </Card>

      <DataSourceDetailDrawer
        source={selected}
        onClose={() => setSelectedSourceId(null)}
        onRefresh={onRefreshSource}
      />
    </>
  );
}
