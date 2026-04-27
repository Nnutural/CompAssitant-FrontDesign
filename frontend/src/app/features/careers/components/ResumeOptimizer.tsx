import { useState } from 'react';
import type { Dispatch } from 'react';
import { Clipboard, FileCheck2, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { analyzeResume } from '../api';
import type { CareerAction } from '../store';
import type { CareerWorkbench, JobPosting } from '../types';
import { copyText, getLatestResumeReview, getSelectedJob } from '../utils';
import { CareerEmptyState } from './CareerEmptyState';
import { CareerLoadingState } from './CareerLoadingState';

export function ResumeOptimizer({
  workbench,
  jobs,
  dispatch,
}: {
  workbench: CareerWorkbench;
  jobs: JobPosting[];
  dispatch: Dispatch<CareerAction>;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const selectedJob = getSelectedJob(workbench, jobs);
  const latestReview = getLatestResumeReview(workbench, selectedJob?.id);

  if (!selectedJob) {
    return <CareerEmptyState title="请先选择目标岗位" description="简历优化会围绕目标岗位关键词和公司偏好生成。" />;
  }

  const runAnalyze = async () => {
    setAnalyzing(true);
    const review = await analyzeResume(workbench.resumeDraft, selectedJob);
    dispatch({ type: 'addResumeReview', review });
    setAnalyzing(false);
    toast.success('已分析简历');
  };

  const applyRewrite = () => {
    if (!latestReview) {
      toast.error('请先分析简历');
      return;
    }
    const next = `${workbench.resumeDraft.trim()}\n\n${latestReview.projectRewriteExample}`;
    dispatch({ type: 'setResumeDraft', value: next });
    toast.success('已应用改写到简历草稿');
  };

  const saveVersion = () => {
    if (!latestReview) {
      toast.error('请先分析简历');
      return;
    }
    dispatch({ type: 'addResumeReview', review: { ...latestReview, id: `${latestReview.id}-copy-${Date.now()}`, createdAt: new Date().toISOString() } });
    toast.success('已保存简历版本');
  };

  const copyReview = async () => {
    if (!latestReview) {
      toast.error('暂无优化结果可复制');
      return;
    }
    try {
      await copyText(
        [
          `匹配率：${latestReview.matchRate}%`,
          `缺失关键词：${latestReview.missingKeywords.join('、') || '无'}`,
          `问题：${latestReview.problems.join('；')}`,
          `建议：${latestReview.rewriteSuggestions.join('；')}`,
          latestReview.projectRewriteExample,
        ].join('\n'),
      );
      toast.success('优化结果已复制');
    } catch {
      toast.error('复制失败');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_420px]">
      <Card
        title="简历草稿"
        subtitle={`目标岗位：${selectedJob.title} · ${selectedJob.companyName}`}
        right={<Tag tone="blue">{workbench.resumeDraft.length} 字符</Tag>}
      >
        <textarea
          value={workbench.resumeDraft}
          onChange={(event) => dispatch({ type: 'setResumeDraft', value: event.target.value })}
          className="min-h-[520px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 outline-none focus:border-brand-blue-400 focus:bg-white"
          placeholder="粘贴你的简历文本，系统会围绕当前目标岗位分析关键词匹配率。"
        />
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={runAnalyze}
            disabled={analyzing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700 disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" />
            {analyzing ? '分析中...' : '分析简历'}
          </button>
          <button
            type="button"
            onClick={applyRewrite}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <FileCheck2 className="h-4 w-4" />
            应用改写
          </button>
          <button
            type="button"
            onClick={saveVersion}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Save className="h-4 w-4" />
            保存版本
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        {analyzing && <CareerLoadingState label="正在计算岗位关键词匹配率..." />}
        <Card title="诊断结果" subtitle="缺失关键词、优势和问题">
          {!latestReview ? (
            <p className="text-sm leading-relaxed text-slate-500">点击“分析简历”后展示诊断结果。</p>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-brand-blue-50 p-4 text-center">
                <p className="text-xs text-brand-blue-700">岗位关键词匹配率</p>
                <p className="mt-1 text-3xl font-semibold text-brand-blue-700">{latestReview.matchRate}%</p>
              </div>
              <Block title="缺失关键词" items={latestReview.missingKeywords.length > 0 ? latestReview.missingKeywords : ['关键词覆盖较完整']} tone="amber" />
              <Block title="优势" items={latestReview.strengths} tone="green" />
              <Block title="问题" items={latestReview.problems} tone="red" />
            </div>
          )}
        </Card>

        <Card
          title="改写建议"
          subtitle="可直接应用到草稿"
          right={
            <button
              type="button"
              onClick={copyReview}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-brand-blue-600 hover:bg-brand-blue-50"
            >
              <Clipboard className="h-3.5 w-3.5" />
              复制
            </button>
          }
        >
          {!latestReview ? (
            <p className="text-sm leading-relaxed text-slate-500">暂无改写建议。</p>
          ) : (
            <div className="space-y-3">
              <ul className="space-y-2 text-sm leading-relaxed text-slate-600">
                {latestReview.rewriteSuggestions.map((item) => (
                  <li key={item} className="rounded-lg border border-slate-200 p-3">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                {latestReview.projectRewriteExample}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Block({ title, items, tone }: { title: string; items: string[]; tone: 'green' | 'amber' | 'red' }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-slate-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Tag key={item} tone={tone}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
}
