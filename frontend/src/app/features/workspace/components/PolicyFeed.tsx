import { useCallback, useEffect, useMemo, useState, type Dispatch } from 'react';
import { Bot, ExternalLink, Eye, FilePlus2, Scale, Star } from 'lucide-react';
import { toast } from 'sonner';

import { Card, Tag } from '@/app/components/PageShell';

import { loadPolicyFeedDemo } from '../api';
import type { WorkspaceAction } from '../store';
import type { InsightItem, WorkspaceDashboard } from '../types';
import { buildInsightPrompt, isDemoUrl, pushWorkspaceTaskImport } from '../utils';
import { InsightDetailDrawer } from './InsightDetailDrawer';
import { WorkspaceEmptyState } from './WorkspaceEmptyState';
import { WorkspaceErrorState } from './WorkspaceErrorState';
import { WorkspaceLoadingState } from './WorkspaceLoadingState';

type LoadState = 'loading' | 'loaded' | 'error';

export function PolicyFeed({
  dashboard,
  dispatch,
  onNavigate,
}: {
  dashboard: WorkspaceDashboard;
  dispatch: Dispatch<WorkspaceAction>;
  onNavigate: (path: string, message: string) => void;
}) {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [remoteCount, setRemoteCount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoadState('loading');
    setError(null);
    const shouldFail = window.localStorage.getItem('workspace-policy-demo-fail') === '1';
    const shouldEmpty = window.localStorage.getItem('workspace-policy-demo-empty') === '1';
    loadPolicyFeedDemo({ fail: shouldFail, empty: shouldEmpty })
      .then((items) => {
        setRemoteCount(items.length);
        setLoadState('loaded');
      })
      .catch((err: Error) => {
        setRemoteCount(0);
        setError(err.message);
        setLoadState('error');
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const policies = useMemo(
    () => [...dashboard.policies].sort((a, b) => b.reliability - a.reliability),
    [dashboard.policies],
  );
  const selected = dashboard.policies.find((item) => item.id === selectedId) ?? null;

  const toggleFavorite = (item: InsightItem) => {
    dispatch({ type: 'togglePolicyFavorite', policyId: item.id });
    toast.success(item.favorited ? '已取消收藏政策' : '已收藏政策');
  };

  const openSource = (policy: InsightItem) => {
    if (isDemoUrl(policy.sourceUrl)) {
      toast.info('当前为演示来源，后续可接入真实数据源');
      return;
    }
    window.open(policy.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  const addPolicyTask = (policy: InsightItem) => {
    pushWorkspaceTaskImport({
      title: policy.title,
      description: policy.summary,
      module: policy.relatedModules[0] ?? 'chat',
      sourceLabel: '国家政策',
      sourcePath: `/chat?tab=policy&query=${encodeURIComponent(buildInsightPrompt(policy))}`,
      priority: policy.reliability >= 90 ? 'high' : 'medium',
      tags: policy.tags,
      relatedObjectId: policy.id,
    });
    toast.success('已加入计划任务');
  };

  if (loadState === 'loading') {
    return <WorkspaceLoadingState text="加载政策演示数据中..." />;
  }

  const isEmpty = loadState === 'loaded' && remoteCount === 0 && policies.length === 0;

  return (
    <>
      <div className="space-y-4">
        {loadState === 'error' && (
          <WorkspaceErrorState
            title="政策源加载失败，已使用本地演示数据兜底"
            description={error ?? '演示政策源暂不可用。'}
            onRetry={load}
          />
        )}

        <Card title="国家政策" subtitle="当前阶段使用本地 mock 政策列表，保留 loading/error/empty/retry/fallback 状态">
          {isEmpty ? (
            <WorkspaceEmptyState title="暂无政策" description="政策源返回空数据，且本地兜底数据为空。" />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {policies.map((policy) => (
                <article key={policy.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        {policy.tags.map((tag) => (
                          <Tag key={tag} tone="blue">{tag}</Tag>
                        ))}
                        {policy.favorited && <Tag tone="amber">已收藏</Tag>}
                      </div>
                      <h3 className="mt-2 text-sm font-semibold leading-6 text-slate-900">{policy.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{policy.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{policy.source}</span>
                        <span>{policy.publishedAt}</span>
                        <span>可信度 {policy.reliability}%</span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedId(policy.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          详情
                        </button>
                        <button
                          onClick={() => openSource(policy)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          来源
                        </button>
                        <button
                          onClick={() => toggleFavorite(policy)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          <Star className={`h-3.5 w-3.5 ${policy.favorited ? 'fill-amber-400 text-amber-500' : ''}`} />
                          {policy.favorited ? '取消收藏' : '收藏'}
                        </button>
                        <button
                          onClick={() => onNavigate(`/chat?tab=policy&query=${encodeURIComponent(buildInsightPrompt(policy))}`, '已生成政策解读，并携带政策上下文')}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-blue-700"
                        >
                          <Bot className="h-3.5 w-3.5" />
                          政策解读
                        </button>
                        <button
                          onClick={() => onNavigate(`/writing?tab=editor&quote=${encodeURIComponent(policy.title)}`, '已引用到写作，并携带政策摘要')}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          <FilePlus2 className="h-3.5 w-3.5" />
                          引用
                        </button>
                        <button
                          onClick={() => addPolicyTask(policy)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          加任务
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>

      <InsightDetailDrawer
        item={selected}
        onClose={() => setSelectedId(null)}
        onToggleFavorite={toggleFavorite}
        onNavigate={onNavigate}
      />
    </>
  );
}
