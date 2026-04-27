import { KeyboardEvent, useState } from 'react';
import { Check, Plus, Sparkles, Target, X } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { generateTopicIdeas } from '../api';
import { DEFAULT_TOPIC_TAGS } from '../mockData';
import type { WritingAction } from '../store';
import type { TopicIdea, WritingProject } from '../types';
import { WritingLoadingState } from './WritingLoadingState';

export function TopicDeductionPanel({
  project,
  dispatch,
  onGoToProposal,
}: {
  project: WritingProject;
  dispatch: React.Dispatch<WritingAction>;
  onGoToProposal: () => void;
}) {
  const [tagInput, setTagInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const selectedTopic = project.topics.find((topic) => topic.selected);
  const recentTopics = [...project.topics].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5);

  const addTag = (tag: string) => {
    const normalized = tag.trim();
    if (!normalized || project.topicTags.includes(normalized)) return;
    dispatch({ type: 'setTopicTags', tags: [...project.topicTags, normalized] });
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    dispatch({ type: 'setTopicTags', tags: project.topicTags.filter((item) => item !== tag) });
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag(tagInput);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    const topics = await generateTopicIdeas(
      project.deductionInput,
      project.topicTags,
      project.evidences.map((evidence) => evidence.id),
    );
    dispatch({ type: 'addTopics', topics });
    setGenerating(false);
    toast.success('已生成 5 张候选选题卡片');
  };

  const setActiveTopic = (topic: TopicIdea) => {
    dispatch({ type: 'setActiveTopic', topicId: topic.id });
    toast.success('已设为当前选题');
  };

  const convertToProposal = (topic: TopicIdea) => {
    dispatch({ type: 'setActiveTopic', topicId: topic.id });
    toast.success('已写入计划书上下文');
    onGoToProposal();
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Card title="研究兴趣输入" subtitle="输入背景、偏好和约束，前端模拟 AI 生成选题">
        <div className="space-y-4">
          <textarea
            value={project.deductionInput}
            onChange={(event) => dispatch({ type: 'setDeductionInput', value: event.target.value })}
            className="h-36 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 outline-none focus:border-brand-blue-400 focus:bg-white"
            placeholder="描述你的研究兴趣，例如：我对零信任在工业互联网的落地感兴趣，希望能做出原型并完成可量化评估。"
          />

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">标签</p>
            <div className="flex flex-wrap gap-2">
              {project.topicTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="inline-flex items-center gap-1 rounded-md bg-brand-blue-50 px-2 py-1 text-xs text-brand-blue-700"
                >
                  #{tag}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_TOPIC_TAGS.filter((tag) => !project.topicTags.includes(tag)).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                >
                  + {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={handleTagKeyDown}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
                placeholder="自定义标签"
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                添加
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? '生成中...' : '生成选题建议'}
          </button>
          {generating && <WritingLoadingState label="AI 正在推演候选选题..." />}
        </div>
      </Card>

      <Card title="思路卡片" subtitle="点击卡片作为当前候选思路">
        <div className="space-y-3">
          {recentTopics.map((topic, index) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => dispatch({ type: 'selectTopic', topicId: topic.id })}
              className={`w-full rounded-lg border p-3 text-left transition ${
                topic.selected ? 'border-brand-blue-400 bg-brand-blue-50' : 'border-slate-200 hover:border-brand-blue-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-400">思路 {index + 1}</p>
                {topic.selected && <Check className="h-4 w-4 text-brand-blue-600" />}
              </div>
              <p className="mt-1 line-clamp-2 text-sm font-medium text-slate-800">{topic.title}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {topic.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag} tone="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card title="AI 生成结果" subtitle="选题评分、难度和推荐理由">
        {selectedTopic ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-brand-blue-100 bg-brand-blue-50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-brand-blue-700">
                <Target className="h-4 w-4" />
                推荐选题 · 匹配度 {selectedTopic.matchScore}%
              </div>
              <h3 className="mt-2 text-base font-semibold leading-snug text-slate-900">{selectedTopic.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{selectedTopic.summary}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Metric label="创新性" value={selectedTopic.innovationScore} tone="emerald" />
              <Metric label="可行性" value={selectedTopic.feasibilityScore} tone="amber" />
              <Metric label="匹配度" value={selectedTopic.matchScore} tone="blue" />
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-800">难度：</span>
                {selectedTopic.difficulty}
              </p>
              <p>
                <span className="font-medium text-slate-800">数据：</span>
                {selectedTopic.dataAvailability}
              </p>
              <p className="leading-relaxed">
                <span className="font-medium text-slate-800">推荐理由：</span>
                {selectedTopic.recommendedReason}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTopic(selectedTopic)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                设为当前选题
              </button>
              <button
                type="button"
                onClick={() => convertToProposal(selectedTopic)}
                className="rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700"
              >
                转为计划书
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
            生成或选择一张思路卡片后，这里会展示 AI 结果。
          </div>
        )}
      </Card>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: 'blue' | 'emerald' | 'amber' }) {
  const toneClass = {
    blue: 'bg-brand-blue-50 text-brand-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  }[tone];
  return (
    <div className={`rounded-lg p-3 text-center ${toneClass}`}>
      <p className="text-xs">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
