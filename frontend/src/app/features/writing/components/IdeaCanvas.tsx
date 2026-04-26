import { useState } from 'react';
import { CheckCircle2, FileUp, Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { completeCanvasBlock, generateCanvasFromTopic } from '../api';
import type { WritingAction } from '../store';
import type { BlockStatus, WritingProject } from '../types';
import { getActiveTopic } from '../utils';
import { WritingEmptyState } from './WritingEmptyState';
import { WritingLoadingState } from './WritingLoadingState';

const statusTone: Record<BlockStatus, 'default' | 'blue' | 'green'> = {
  empty: 'default',
  draft: 'blue',
  completed: 'green',
};

const statusText: Record<BlockStatus, string> = {
  empty: '空白',
  draft: '草稿',
  completed: '已完成',
};

export function IdeaCanvas({
  project,
  dispatch,
  onGoToProposal,
}: {
  project: WritingProject;
  dispatch: React.Dispatch<WritingAction>;
  onGoToProposal: () => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [loadingBlockId, setLoadingBlockId] = useState<string | undefined>();
  const activeTopic = getActiveTopic(project);

  if (!activeTopic) {
    return (
      <WritingEmptyState
        title="请先选择当前选题"
        description="画布内容会根据当前选题生成。可在选题推演或选题卡池中设定当前选题。"
      />
    );
  }

  const generateCanvas = async () => {
    setGenerating(true);
    const blocks = await generateCanvasFromTopic(activeTopic, project.canvas.blocks);
    dispatch({ type: 'setCanvasBlocks', blocks });
    setGenerating(false);
    toast.success('已从当前选题生成创意画布');
  };

  const completeBlock = async (blockId: string) => {
    const block = project.canvas.blocks.find((item) => item.id === blockId);
    if (!block) return;
    setLoadingBlockId(blockId);
    const next = await completeCanvasBlock(activeTopic, block);
    dispatch({ type: 'updateCanvasBlock', blockId, patch: next });
    setLoadingBlockId(undefined);
    toast.success('已补全画布块');
  };

  const completedCount = project.canvas.blocks.filter((block) => block.status === 'completed').length;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-brand-blue-600">当前选题</p>
            <h2 className="mt-1 text-base font-semibold text-slate-900">{activeTopic.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              已完成 {completedCount}/{project.canvas.blocks.length} 个画布块
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={generateCanvas}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700 disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" />
              {generating ? '生成中...' : '从当前选题生成画布'}
            </button>
            <button
              type="button"
              onClick={() => toast.success('画布已进入自动保存队列')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Save className="h-4 w-4" />
              保存画布
            </button>
            <button
              type="button"
              onClick={() => {
                toast.success('已写入计划书上下文');
                onGoToProposal();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <FileUp className="h-4 w-4" />
              导出到计划书
            </button>
          </div>
        </div>
      </Card>

      {generating && <WritingLoadingState label="正在把选题拆解为画布结构..." />}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {project.canvas.blocks.map((block) => (
          <article key={block.id} className="flex min-h-[260px] flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{block.title}</h3>
                <p className="mt-1 text-xs text-slate-400">{block.placeholder}</p>
              </div>
              <Tag tone={statusTone[block.status]}>{statusText[block.status]}</Tag>
            </div>
            <textarea
              value={block.content}
              onChange={(event) =>
                dispatch({ type: 'updateCanvasBlock', blockId: block.id, patch: { content: event.target.value } })
              }
              className="mt-3 min-h-[128px] flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 outline-none focus:border-brand-blue-400 focus:bg-white"
              placeholder={block.placeholder}
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => completeBlock(block.id)}
                disabled={loadingBlockId === block.id}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-70"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {loadingBlockId === block.id ? '补全中' : 'AI 补全'}
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'updateCanvasBlock', blockId: block.id, patch: { status: 'completed' } })}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs text-white hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                标记完成
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
