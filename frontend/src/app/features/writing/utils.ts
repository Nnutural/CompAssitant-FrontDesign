import type {
  CanvasBlock,
  DocumentSection,
  PptSlide,
  TopicIdea,
  WritingEvidence,
  WritingProject,
  WritingTemplate,
} from './types';

export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 9);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

export function countWords(content: string): number {
  const chineseChars = content.match(/[\u4e00-\u9fa5]/g)?.length ?? 0;
  const words = content.replace(/[\u4e00-\u9fa5]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return chineseChars + words;
}

export function formatDateTime(value?: string): string {
  if (!value) return '尚未保存';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '尚未保存';
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getActiveTopic(project: WritingProject): TopicIdea | undefined {
  return project.topics.find((topic) => topic.id === project.activeTopicId);
}

export function getCurrentSection(project: WritingProject): DocumentSection | undefined {
  const currentId = project.document.currentSectionId;
  return project.document.sections.find((section) => section.id === currentId) ?? project.document.sections[0];
}

export function getCanvasStatusFromContent(content: string, previous?: CanvasBlock['status']): CanvasBlock['status'] {
  if (!content.trim()) return 'empty';
  if (previous === 'completed') return 'completed';
  return 'draft';
}

export function createEmptySections(template: WritingTemplate): DocumentSection[] {
  const now = new Date().toISOString();
  return template.sections.map((title, index) => ({
    id: `section-${template.id}-${index + 1}`,
    title,
    content: '',
    status: 'empty',
    wordCount: 0,
    evidenceIds: [],
    updatedAt: now,
  }));
}

export function renumberSlides(slides: PptSlide[]): PptSlide[] {
  return slides.map((slide, index) => ({ ...slide, pageNo: index + 1 }));
}

export function calculateProgress(project: WritingProject): number {
  const hasTopic = project.activeTopicId ? 18 : 0;
  const canvasTotal = project.canvas.blocks.length || 1;
  const canvasDone = project.canvas.blocks.filter((block) => block.status === 'completed').length;
  const canvasScore = Math.round((canvasDone / canvasTotal) * 20);

  const sectionTotal = project.document.sections.length || 1;
  const generatedSections = project.document.sections.filter((section) => section.status !== 'empty').length;
  const documentScore = Math.round((generatedSections / sectionTotal) * 32);

  const usedEvidence = project.evidences.some((evidence) => evidence.usedInSections.length > 0) ? 10 : 0;
  const pptScore = project.pptOutline.length > 0 ? 20 : 0;

  return Math.min(100, hasTopic + canvasScore + documentScore + usedEvidence + pptScore);
}

export function buildProjectMarkdown(project: WritingProject): string {
  const topic = getActiveTopic(project);
  const lines = [
    `# ${project.name}`,
    '',
    `> 当前选题：${topic?.title ?? '未选择'}`,
    `> 完成度：${project.progress}%`,
    '',
    '## 项目说明',
    '',
    project.description,
    '',
    '## 文档正文',
    '',
  ];

  project.document.sections.forEach((section) => {
    lines.push(`### ${section.title}`, '', section.content || '_本章尚未生成内容。_', '');
  });

  const usedEvidence = project.evidences.filter((evidence) => evidence.usedInSections.length > 0);
  if (usedEvidence.length > 0) {
    lines.push('## 参考文献', '');
    usedEvidence.forEach((evidence, index) => {
      lines.push(`${index + 1}. ${evidence.citationText}`);
    });
  }

  return lines.join('\n');
}

export function buildPptMarkdown(slides: PptSlide[]): string {
  if (slides.length === 0) return '# PPT 大纲\n\n暂无幻灯片。';
  return slides
    .map((slide) => {
      const bullets = slide.bullets.map((bullet) => `- ${bullet}`).join('\n');
      return `## P${slide.pageNo}. ${slide.title}\n\n${bullets}\n\n备注：${slide.speakerNotes || '待生成讲稿备注。'}`;
    })
    .join('\n\n');
}

export function formatEvidenceCitation(evidence: WritingEvidence, style: 'gbt' | 'apa'): string {
  if (style === 'apa') {
    return `${evidence.source}. (${evidence.year}). ${evidence.title}.`;
  }
  return evidence.citationText;
}

export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
