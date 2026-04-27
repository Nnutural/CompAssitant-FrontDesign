import { useState } from 'react';
import type { ReactNode } from 'react';
import { FileText, Play, RefreshCcw, RotateCcw, Save, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PageShell } from '@/app/components/PageShell';
import { DailyBriefDrawer } from '@/app/features/workspace/components/DailyBriefDrawer';
import { DataFreshnessPanel } from '@/app/features/workspace/components/DataFreshnessPanel';
import { DeadlineReminderPanel } from '@/app/features/workspace/components/DeadlineReminderPanel';
import { InsightFeed } from '@/app/features/workspace/components/InsightFeed';
import { PolicyFeed } from '@/app/features/workspace/components/PolicyFeed';
import { RecentAssetsPanel } from '@/app/features/workspace/components/RecentAssetsPanel';
import { RecommendedActionsPanel } from '@/app/features/workspace/components/RecommendedActionsPanel';
import { TodayTasksPanel } from '@/app/features/workspace/components/TodayTasksPanel';
import { WorkspaceSummaryBar } from '@/app/features/workspace/components/WorkspaceSummaryBar';
import { refreshDataSourceDemo } from '@/app/features/workspace/api';
import { useWorkspaceDashboard } from '@/app/features/workspace/store';
import type { DataSourceStatus } from '@/app/features/workspace/types';
import { firstHighPriorityTask } from '@/app/features/workspace/utils';

function ToolbarButton({
  children,
  icon: Icon,
  onClick,
  tone = 'default',
}: {
  children: string;
  icon: LucideIcon;
  onClick: () => void;
  tone?: 'default' | 'primary' | 'danger';
}) {
  const className =
    tone === 'primary'
      ? 'bg-brand-blue-600 text-white hover:bg-brand-blue-700'
      : tone === 'danger'
        ? 'border border-red-200 bg-white text-red-700 hover:bg-red-50'
        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50';

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{children}</span>
    </button>
  );
}

export function Workspace() {
  const navigate = useNavigate();
  const { dashboard, dispatch, saveNow, resetDemo } = useWorkspaceDashboard();
  const [briefOpen, setBriefOpen] = useState(false);

  const goToPath = (path: string, message: string) => {
    navigate(path);
    toast.success(message);
  };

  const openBrief = () => {
    setBriefOpen(true);
    dispatch({ type: 'markBriefOpened' });
    toast.success('今日简报已打开');
  };

  const startWork = () => {
    const task = firstHighPriorityTask(dashboard);
    if (!task) {
      toast.success('今日要务已全部完成');
      return;
    }
    navigate('/workspace?tab=today');
    window.setTimeout(() => {
      document.getElementById(`workspace-task-${task.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
    toast.success(`已定位到：${task.title}`);
  };

  const refreshSource = async (source: DataSourceStatus) => {
    if (source.status === 'syncing') return;
    dispatch({ type: 'startRefreshDataSources', sourceIds: [source.id] });
    try {
      const result = await refreshDataSourceDemo(source.freshnessScore);
      dispatch({ type: 'finishRefreshDataSource', sourceId: source.id, result, success: true });
      toast.success('数据源刷新成功');
    } catch (error) {
      dispatch({
        type: 'finishRefreshDataSource',
        sourceId: source.id,
        result: { freshnessScore: source.freshnessScore, lastSyncText: source.lastSyncText },
        success: false,
        errorMessage: error instanceof Error ? error.message : '演示刷新失败',
      });
      toast.error('数据源刷新失败');
    }
  };

  const refreshAllSources = () => {
    const sources = dashboard.dataSources.filter((source) => source.status !== 'syncing');
    if (sources.length === 0) return;
    dispatch({ type: 'startRefreshDataSources', sourceIds: sources.map((source) => source.id) });
    toast.info('正在刷新全部数据源');
    sources.forEach((source) => {
      refreshDataSourceDemo(source.freshnessScore)
        .then((result) => {
          dispatch({ type: 'finishRefreshDataSource', sourceId: source.id, result, success: true });
        })
        .catch((error) => {
          dispatch({
            type: 'finishRefreshDataSource',
            sourceId: source.id,
            result: { freshnessScore: source.freshnessScore, lastSyncText: source.lastSyncText },
            success: false,
            errorMessage: error instanceof Error ? error.message : '演示刷新失败',
          });
        });
    });
    window.setTimeout(() => toast.success('全部数据源刷新完成'), 1050);
  };

  const saveDashboard = () => {
    const ok = saveNow();
    if (ok) toast.success('总览工作台已保存');
    else toast.error('保存失败');
  };

  const resetDashboard = () => {
    resetDemo();
    toast.success('已重置演示数据');
  };

  const renderWithSummary = (content: ReactNode) => (
    <div className="space-y-5">
      <WorkspaceSummaryBar dashboard={dashboard} />
      {content}
    </div>
  );

  return (
    <>
      <PageShell
        title="总览"
        subtitle="跨模块工作台入口 · 连接今日要务、截止提醒、推荐行动、生成物、数据源与热点政策"
        defaultTab="today"
        actions={
          <div className="flex max-w-[680px] flex-wrap justify-end gap-2">
            <ToolbarButton icon={FileText} onClick={openBrief}>查看今日简报</ToolbarButton>
            <ToolbarButton icon={Play} onClick={startWork} tone="primary">开始工作</ToolbarButton>
            <ToolbarButton icon={RefreshCcw} onClick={refreshAllSources}>刷新数据</ToolbarButton>
            <ToolbarButton icon={Save} onClick={saveDashboard}>保存</ToolbarButton>
            <ToolbarButton icon={RotateCcw} onClick={resetDashboard} tone="danger">重置演示</ToolbarButton>
          </div>
        }
        tabs={[
          {
            key: 'today',
            label: '今日要务',
            description: '动态日期、任务完成、今日简报、本周节奏与跨模块入口',
            render: () =>
              renderWithSummary(
                <TodayTasksPanel
                  dashboard={dashboard}
                  dispatch={dispatch}
                  onOpenBrief={openBrief}
                  onStartWork={startWork}
                  onNavigate={goToPath}
                />,
              ),
          },
          {
            key: 'ddl',
            label: '截止提醒',
            description: '筛选、排序、查看详情、加入计划任务、忽略或标记已处理',
            render: () =>
              renderWithSummary(
                <DeadlineReminderPanel dashboard={dashboard} dispatch={dispatch} onNavigate={goToPath} />,
              ),
          },
          {
            key: 'actions',
            label: '推荐行动',
            description: '查看推荐理由、开始执行、稍后处理、关闭推荐或发起智能问答',
            render: () =>
              renderWithSummary(
                <RecommendedActionsPanel dashboard={dashboard} dispatch={dispatch} onNavigate={goToPath} />,
              ),
          },
          {
            key: 'recent',
            label: '最近生成物',
            description: '预览、复制链接、导出 Markdown、收藏并跳转继续编辑',
            render: () =>
              renderWithSummary(
                <RecentAssetsPanel dashboard={dashboard} dispatch={dispatch} onNavigate={goToPath} />,
              ),
          },
          {
            key: 'freshness',
            label: '数据新鲜度',
            description: '查看数据源健康状态，刷新单个或全部数据源并识别受影响卡片',
            render: () =>
              renderWithSummary(
                <DataFreshnessPanel
                  dashboard={dashboard}
                  onRefreshSource={refreshSource}
                  onRefreshAll={refreshAllSources}
                />,
              ),
          },
          {
            key: 'industry',
            label: '行业热点',
            description: 'AI 安全、零信任、供应链、云安全、工控安全与市场趋势资讯流',
            render: () =>
              renderWithSummary(
                <InsightFeed dashboard={dashboard} type="industry" dispatch={dispatch} onNavigate={goToPath} />,
              ),
          },
          {
            key: 'social',
            label: '社会热点',
            description: '数据泄露、AI 诈骗、高校赛事、社会治理与个人信息保护热点',
            render: () =>
              renderWithSummary(
                <InsightFeed dashboard={dashboard} type="social" dispatch={dispatch} onNavigate={goToPath} />,
              ),
          },
          {
            key: 'policy',
            label: '国家政策',
            description: '政策条目、状态兜底、政策解读、引用写作与加入计划任务',
            render: () =>
              renderWithSummary(
                <PolicyFeed dashboard={dashboard} dispatch={dispatch} onNavigate={goToPath} />,
              ),
          },
        ]}
      />

      <DailyBriefDrawer brief={dashboard.dailyBrief} open={briefOpen} onClose={() => setBriefOpen(false)} />
    </>
  );
}
