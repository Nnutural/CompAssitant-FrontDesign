import { useState } from 'react';
import { Blocks, Eye, FilePlus2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { generateModuleContent } from '../api';
import { WRITING_MODULES } from '../mockData';
import type { WritingAction } from '../store';
import type { WritingProject } from '../types';
import { getActiveTopic, getCurrentSection } from '../utils';
import { WritingEmptyState } from './WritingEmptyState';

export function WritingModuleLibrary({
  project,
  dispatch,
}: {
  project: WritingProject;
  dispatch: React.Dispatch<WritingAction>;
}) {
  const [preview, setPreview] = useState<{ moduleId: string; content: string } | undefined>();
  const [loadingModuleId, setLoadingModuleId] = useState<string | undefined>();
  const currentSection = getCurrentSection(project);
  const activeTopic = getActiveTopic(project);

  const generatePreview = async (moduleId: string, moduleName: string) => {
    setLoadingModuleId(moduleId);
    const content = await generateModuleContent(moduleName, activeTopic);
    setPreview({ moduleId, content });
    setLoadingModuleId(undefined);
    toast.success('已生成模块示例内容');
  };

  const insertModule = async (moduleId: string, moduleName: string) => {
    if (!currentSection) {
      toast.error('请先在计划书生成中创建章节');
      return;
    }
    const content =
      preview?.moduleId === moduleId ? preview.content : await generateModuleContent(moduleName, activeTopic);
    dispatch({ type: 'appendToCurrentSection', text: content });
    toast.success('已插入当前章节');
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {WRITING_MODULES.map((module) => (
          <article key={module.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue-600">
                <Blocks className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900">{module.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{module.description}</p>
              </div>
            </div>
            <div className="mt-3">
              <Tag tone="blue">{module.target}</Tag>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => generatePreview(module.id, module.name)}
                disabled={loadingModuleId === module.id}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-70"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {loadingModuleId === module.id ? '生成中...' : '生成示例内容'}
              </button>
              <button
                type="button"
                onClick={() => setPreview({ moduleId: module.id, content: preview?.content ?? module.description })}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
              >
                <Eye className="h-3.5 w-3.5" />
                预览
              </button>
              <button
                type="button"
                onClick={() => insertModule(module.id, module.name)}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-brand-blue-600 px-3 py-2 text-xs text-white hover:bg-brand-blue-700"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                插入当前章节
              </button>
            </div>
          </article>
        ))}
      </div>

      <Card title="当前章节预览" subtitle="模块内容会追加到当前章节末尾">
        {currentSection ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">当前章节</p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">{currentSection.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{currentSection.wordCount} 字 · {currentSection.status}</p>
            </div>
            <div className="max-h-[380px] overflow-y-auto rounded-lg border border-slate-200 p-3 text-sm leading-relaxed text-slate-600">
              {preview?.content || currentSection.content || '当前章节还没有内容，可先生成示例或插入模块。'}
            </div>
          </div>
        ) : (
          <WritingEmptyState title="暂无当前章节" description="请先在计划书生成中选择模板并创建章节。" />
        )}
      </Card>
    </div>
  );
}
