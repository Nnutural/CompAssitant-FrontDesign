import { useMemo, useState } from 'react';
import { FileText, LayoutTemplate, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { generateDraftSections, generateSectionContent } from '../api';
import { WRITING_TEMPLATES } from '../mockData';
import type { WritingAction } from '../store';
import type { DocumentSection, WritingProject, WritingTemplate } from '../types';
import { createEmptySections, getActiveTopic } from '../utils';
import { WritingEmptyState } from './WritingEmptyState';
import { WritingLoadingState } from './WritingLoadingState';

export function ProposalGenerator({
  project,
  dispatch,
  onGoToEditor,
}: {
  project: WritingProject;
  dispatch: React.Dispatch<WritingAction>;
  onGoToEditor: () => void;
}) {
  const [loadingSectionId, setLoadingSectionId] = useState<string | undefined>();
  const [draftLoading, setDraftLoading] = useState(false);
  const activeTopic = getActiveTopic(project);
  const selectedTemplate = WRITING_TEMPLATES.find((template) => template.id === project.selectedTemplateId);

  const preview = useMemo(() => {
    const generated = project.document.sections.filter((section) => section.status !== 'empty').length;
    const totalWords = project.document.sections.reduce((sum, section) => sum + section.wordCount, 0);
    const evidenceCount = new Set(project.document.sections.flatMap((section) => section.evidenceIds)).size;
    return { generated, totalWords, evidenceCount };
  }, [project.document.sections]);

  const useTemplate = (template: WritingTemplate) => {
    dispatch({ type: 'setTemplateSections', templateId: template.id, sections: createEmptySections(template) });
    toast.success(`已使用模板：${template.name}`);
  };

  const fillSection = async (section: DocumentSection) => {
    setLoadingSectionId(section.id);
    const next = await generateSectionContent(section, activeTopic, project.canvas.blocks, project.evidences);
    dispatch({ type: 'updateDocumentSection', sectionId: section.id, patch: next });
    setLoadingSectionId(undefined);
    toast.success('已填充本章');
  };

  const generateDraft = async () => {
    if (!selectedTemplate) {
      toast.error('请先选择计划书模板');
      return;
    }
    setDraftLoading(true);
    const sections = await generateDraftSections(selectedTemplate, activeTopic, project.canvas.blocks, project.evidences);
    dispatch({ type: 'setDocumentSections', sections, currentSectionId: sections[0]?.id });
    setDraftLoading(false);
    toast.success('已生成计划书初稿');
    onGoToEditor();
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_1fr_320px]">
      <Card title="计划书模板" subtitle="选择一个展示场景">
        <div className="space-y-3">
          {WRITING_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => useTemplate(template)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                template.id === project.selectedTemplateId
                  ? 'border-brand-blue-400 bg-brand-blue-50'
                  : 'border-slate-200 hover:border-brand-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{template.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{template.scenario}</p>
                </div>
                {template.recommended && <Tag tone="green">推荐</Tag>}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{template.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="mt-3 text-xs font-medium text-brand-blue-600">使用</div>
            </button>
          ))}
        </div>
      </Card>

      <Card
        title={selectedTemplate ? `章节大纲 · ${selectedTemplate.name}` : '章节大纲'}
        subtitle="支持单章 AI 填充和一键生成初稿"
        right={
          <button
            type="button"
            onClick={generateDraft}
            disabled={draftLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-xs text-white hover:bg-brand-blue-700 disabled:opacity-70"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {draftLoading ? '生成中...' : '一键生成初稿'}
          </button>
        }
      >
        {draftLoading && <WritingLoadingState label="正在生成完整计划书初稿..." />}
        {project.document.sections.length === 0 ? (
          <WritingEmptyState title="尚未选择模板" description="点击左侧模板的“使用”，系统会生成可编辑章节大纲。" />
        ) : (
          <ol className="mt-4 space-y-2">
            {project.document.sections.map((section, index) => (
              <li
                key={section.id}
                className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                  section.id === project.document.currentSectionId ? 'border-brand-blue-300 bg-brand-blue-50' : 'border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'setCurrentSection', sectionId: section.id })}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-sm font-medium text-slate-800">
                    {index + 1}. {section.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {section.status} · {section.wordCount} 字
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => fillSection(section)}
                  disabled={loadingSectionId === section.id}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-white disabled:opacity-70"
                >
                  {loadingSectionId === section.id ? '填充中...' : 'AI 填充本章'}
                </button>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Card title="生成预览" subtitle="用于答辩展示的实时状态">
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-blue-600">
              <LayoutTemplate className="h-4 w-4" />
              计划书上下文
            </div>
            <h3 className="mt-2 text-sm font-semibold leading-snug text-slate-900">{project.name}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{activeTopic?.title ?? '尚未选择当前选题'}</p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="模板" value={selectedTemplate?.name ?? '未选择'} />
            <Stat label="已生成章节" value={`${preview.generated}/${project.document.sections.length}`} />
            <Stat label="总字数" value={`${preview.totalWords}`} />
            <Stat label="证据引用" value={`${preview.evidenceCount}`} />
          </dl>
          <button
            type="button"
            onClick={onGoToEditor}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <FileText className="h-4 w-4" />
            进入文档编辑
          </button>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 truncate font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
