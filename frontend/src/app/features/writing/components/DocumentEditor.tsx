import { useState } from 'react';
import { Archive, Bot, ClipboardPlus, Download, Save, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { transformSectionContent } from '../api';
import type { WritingAction } from '../store';
import type { AiOperation, DocumentSection, WritingProject } from '../types';
import {
  buildProjectMarkdown,
  copyText,
  createId,
  downloadTextFile,
  formatDateTime,
  formatEvidenceCitation,
  getCurrentSection,
} from '../utils';
import { WritingEmptyState } from './WritingEmptyState';

const operationText: Record<AiOperation, string> = {
  polish: 'AI 润色',
  expand: 'AI 扩写',
  compress: 'AI 压缩',
};

export function DocumentEditor({
  project,
  dispatch,
  onSave,
}: {
  project: WritingProject;
  dispatch: React.Dispatch<WritingAction>;
  onSave: () => void;
}) {
  const [loadingOperation, setLoadingOperation] = useState<AiOperation | undefined>();
  const currentSection = getCurrentSection(project);

  if (!currentSection) {
    return (
      <WritingEmptyState
        title="暂无可编辑文档"
        description="请先在计划书生成中选择模板并生成初稿，随后即可切换章节、编辑正文和插入引用。"
      />
    );
  }

  const updateCurrentContent = (content: string) => {
    dispatch({
      type: 'updateDocumentSection',
      sectionId: currentSection.id,
      patch: { content, status: 'edited' },
    });
  };

  const runAiOperation = async (operation: AiOperation) => {
    setLoadingOperation(operation);
    const content = await transformSectionContent(currentSection.content, operation);
    dispatch({
      type: 'updateDocumentSection',
      sectionId: currentSection.id,
      patch: { content, status: 'edited' },
    });
    setLoadingOperation(undefined);
    toast.success(`${operationText[operation]}完成`);
  };

  const insertEvidence = (evidenceId: string) => {
    const evidence = project.evidences.find((item) => item.id === evidenceId);
    if (!evidence) return;
    dispatch({
      type: 'appendToCurrentSection',
      text: `[引用] ${formatEvidenceCitation(evidence, 'gbt')}`,
      evidenceId,
    });
    toast.success('已插入引用到当前章节');
  };

  const createVersion = () => {
    dispatch({
      type: 'addVersion',
      version: {
        id: createId('version'),
        name: `${currentSection.title} 快照`,
        createdAt: new Date().toISOString(),
        sectionId: currentSection.id,
        sectionTitle: currentSection.title,
        content: currentSection.content,
        wordCount: currentSection.wordCount,
      },
    });
    toast.success('已生成版本快照');
  };

  const exportMarkdown = async () => {
    try {
      const markdown = buildProjectMarkdown(project);
      downloadTextFile(`${project.name}.md`, markdown);
      await copyText(markdown);
      toast.success('已导出 Markdown，并复制到剪贴板');
    } catch {
      toast.error('导出失败，请重试');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_1fr_320px]">
      <Card title="章节导航" subtitle={`${project.document.sections.length} 个章节`}>
        <nav className="space-y-2">
          {project.document.sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => dispatch({ type: 'setCurrentSection', sectionId: section.id })}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                section.id === currentSection.id
                  ? 'bg-brand-blue-50 text-brand-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="line-clamp-2">{section.title}</span>
              <span className="mt-1 block text-xs text-slate-400">{section.wordCount} 字 · {section.status}</span>
            </button>
          ))}
        </nav>
      </Card>

      <Card
        title={currentSection.title}
        subtitle={`${currentSection.wordCount} 字 · 引用 ${currentSection.evidenceIds.length} 条 · 更新 ${formatDateTime(currentSection.updatedAt)}`}
        right={<Tag tone={currentSection.status === 'edited' ? 'blue' : 'green'}>{currentSection.status}</Tag>}
      >
        <textarea
          value={currentSection.content}
          onChange={(event) => updateCurrentContent(event.target.value)}
          className="min-h-[560px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 outline-none focus:border-brand-blue-400 focus:bg-white"
          placeholder="在这里编辑当前章节正文。可使用右侧 AI 操作或插入证据引用。"
        />
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Save className="h-4 w-4" />
            保存
          </button>
          <button
            type="button"
            onClick={createVersion}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Archive className="h-4 w-4" />
            版本快照
          </button>
          <button
            type="button"
            onClick={exportMarkdown}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700"
          >
            <Download className="h-4 w-4" />
            导出 Markdown
          </button>
        </div>
      </Card>

      <div className="space-y-4">
        <Card title="AI 操作" subtitle="前端模拟异步生成">
          <div className="grid gap-2">
            {(['polish', 'expand', 'compress'] as AiOperation[]).map((operation) => (
              <button
                key={operation}
                type="button"
                onClick={() => runAiOperation(operation)}
                disabled={loadingOperation !== undefined}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-70"
              >
                <Wand2 className="h-4 w-4" />
                {loadingOperation === operation ? '处理中...' : operationText[operation]}
              </button>
            ))}
          </div>
        </Card>

        <Card title="插入引用" subtitle="选择证据插入当前章节">
          <div className="space-y-3">
            {project.evidences.slice(0, 5).map((evidence) => (
              <div key={evidence.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="line-clamp-2 text-sm font-medium text-slate-800">{evidence.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{evidence.source} · {evidence.year}</p>
                  </div>
                  <Tag tone={evidence.usedInSections.includes(currentSection.id) ? 'green' : 'default'}>
                    {evidence.usedInSections.includes(currentSection.id) ? '已引用' : evidence.type}
                  </Tag>
                </div>
                <button
                  type="button"
                  onClick={() => insertEvidence(evidence.id)}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 hover:bg-brand-blue-50 hover:text-brand-blue-700"
                >
                  <ClipboardPlus className="h-3.5 w-3.5" />
                  插入引用
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="版本状态" subtitle={`${project.versions.length} 个快照`}>
          {project.versions.length === 0 ? (
            <p className="text-sm leading-relaxed text-slate-500">点击“版本快照”后，这里会记录当前章节版本。</p>
          ) : (
            <ul className="space-y-2">
              {project.versions.slice(0, 4).map((version) => (
                <li key={version.id} className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1 font-medium text-slate-800">
                    <Bot className="h-3.5 w-3.5 text-brand-blue-600" />
                    {version.name}
                  </div>
                  <p className="mt-1">{formatDateTime(version.createdAt)} · {version.wordCount} 字</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
