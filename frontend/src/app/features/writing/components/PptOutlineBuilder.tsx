import { useState } from 'react';
import { ArrowDown, ArrowUp, FilePlus2, FileText, MessageSquareText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import { generatePptOutline, generateSpeakerNotes } from '../api';
import type { WritingAction } from '../store';
import type { PptSlide, WritingProject } from '../types';
import { buildPptMarkdown, createId, downloadTextFile, getActiveTopic } from '../utils';
import { WritingEmptyState } from './WritingEmptyState';
import { WritingLoadingState } from './WritingLoadingState';

export function PptOutlineBuilder({
  project,
  dispatch,
}: {
  project: WritingProject;
  dispatch: React.Dispatch<WritingAction>;
}) {
  const [generating, setGenerating] = useState(false);
  const [loadingNotesId, setLoadingNotesId] = useState<string | undefined>();
  const activeTopic = getActiveTopic(project);
  const hasDocument = project.document.sections.some((section) => section.content.trim());

  const generateOutline = async () => {
    if (!hasDocument) {
      toast.error('请先生成计划书或编辑文档');
      return;
    }
    setGenerating(true);
    const slides = await generatePptOutline(project.document.sections, activeTopic);
    dispatch({ type: 'setPptOutline', slides });
    setGenerating(false);
    toast.success('已生成 PPT 大纲');
  };

  const addSlide = () => {
    const slide: PptSlide = {
      id: createId('slide'),
      pageNo: project.pptOutline.length + 1,
      title: '新增页面',
      bullets: ['补充核心论点', '添加证据或图示', '回扣项目价值'],
      speakerNotes: '',
      relatedSectionIds: [],
      layoutType: 'section',
    };
    dispatch({ type: 'addPptSlide', slide });
    toast.success('已新增 slide');
  };

  const exportMarkdown = () => {
    try {
      downloadTextFile(`${project.name}-PPT大纲.md`, buildPptMarkdown(project.pptOutline));
      toast.success('已导出 PPT Markdown');
    } catch {
      toast.error('导出失败，请重试');
    }
  };

  const updateBullets = (slideId: string, value: string) => {
    dispatch({
      type: 'updatePptSlide',
      slideId,
      patch: { bullets: value.split('\n').map((line) => line.trim()).filter(Boolean) },
    });
  };

  const generateNotes = async (slide: PptSlide) => {
    setLoadingNotesId(slide.id);
    const notes = await generateSpeakerNotes(slide);
    dispatch({ type: 'updatePptSlide', slideId: slide.id, patch: { speakerNotes: notes } });
    setLoadingNotesId(undefined);
    toast.success('已生成讲稿备注');
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">PPT 大纲生成器</h2>
            <p className="mt-1 text-sm text-slate-500">
              根据文档章节生成页面结构，可重排、编辑、删除并导出 Markdown。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={generateOutline}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm text-white hover:bg-brand-blue-700 disabled:opacity-70"
            >
              <FileText className="h-4 w-4" />
              {generating ? '生成中...' : '根据文档生成大纲'}
            </button>
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <FilePlus2 className="h-4 w-4" />
              新增 slide
            </button>
            <button
              type="button"
              onClick={exportMarkdown}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              导出 Markdown
            </button>
          </div>
        </div>
      </Card>

      {generating && <WritingLoadingState label="正在根据文档生成 PPT 大纲..." />}

      {!hasDocument ? (
        <WritingEmptyState title="暂无文档内容" description="请先在计划书生成或文档编辑中生成正文，再生成 PPT 大纲。" />
      ) : project.pptOutline.length === 0 ? (
        <WritingEmptyState title="尚未生成 PPT 大纲" description="点击“根据文档生成大纲”，系统会生成可编辑 slide 列表。" />
      ) : (
        <div className="space-y-4">
          {project.pptOutline.map((slide, index) => (
            <article key={slide.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-4 xl:grid-cols-[160px_1fr_240px]">
                <div>
                  <Tag tone="blue">P{slide.pageNo}</Tag>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'movePptSlide', slideId: slide.id, direction: 'up' })}
                      disabled={index === 0}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                      title="上移"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'movePptSlide', slideId: slide.id, direction: 'down' })}
                      disabled={index === project.pptOutline.length - 1}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                      title="下移"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'deletePptSlide', slideId: slide.id })}
                      className="rounded-lg border border-slate-200 p-2 text-red-500 hover:bg-red-50"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">布局：{slide.layoutType}</p>
                </div>

                <div className="space-y-3">
                  <input
                    value={slide.title}
                    onChange={(event) =>
                      dispatch({ type: 'updatePptSlide', slideId: slide.id, patch: { title: event.target.value } })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-brand-blue-400"
                  />
                  <textarea
                    value={slide.bullets.join('\n')}
                    onChange={(event) => updateBullets(slide.id, event.target.value)}
                    className="min-h-[112px] w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700 outline-none focus:border-brand-blue-400 focus:bg-white"
                    placeholder="每行一个 bullet"
                  />
                  <div className="flex flex-wrap gap-1">
                    {slide.relatedSectionIds.map((sectionId) => (
                      <Tag key={sectionId}>
                        {project.document.sections.find((section) => section.id === sectionId)?.title ?? sectionId}
                      </Tag>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-slate-500">讲稿备注</p>
                    <button
                      type="button"
                      onClick={() => generateNotes(slide)}
                      disabled={loadingNotesId === slide.id}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-brand-blue-600 hover:bg-brand-blue-50 disabled:opacity-70"
                    >
                      <MessageSquareText className="h-3.5 w-3.5" />
                      {loadingNotesId === slide.id ? '生成中' : '生成备注'}
                    </button>
                  </div>
                  <textarea
                    value={slide.speakerNotes}
                    onChange={(event) =>
                      dispatch({ type: 'updatePptSlide', slideId: slide.id, patch: { speakerNotes: event.target.value } })
                    }
                    className="min-h-[150px] w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600 outline-none focus:border-brand-blue-400 focus:bg-white"
                    placeholder="讲稿备注"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
