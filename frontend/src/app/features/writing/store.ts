import { useCallback, useEffect, useReducer } from 'react';
import { createDefaultProject, WRITING_STORAGE_KEY } from './mockData';
import type {
  AutosaveStatus,
  CanvasBlock,
  DocumentSection,
  PptSlide,
  TopicIdea,
  WritingEvidence,
  WritingProject,
  WritingVersion,
} from './types';
import { calculateProgress, countWords, getCanvasStatusFromContent, renumberSlides } from './utils';

export type WritingAction =
  | { type: 'replaceProject'; project: WritingProject }
  | { type: 'setAutosaveStatus'; status: AutosaveStatus; savedAt?: string }
  | { type: 'setCurrentStep'; step: string }
  | { type: 'setDeductionInput'; value: string }
  | { type: 'setTopicTags'; tags: string[] }
  | { type: 'addTopics'; topics: TopicIdea[] }
  | { type: 'selectTopic'; topicId: string }
  | { type: 'setActiveTopic'; topicId: string }
  | { type: 'updateTopic'; topicId: string; patch: Partial<TopicIdea> }
  | { type: 'setCanvasBlocks'; blocks: CanvasBlock[] }
  | { type: 'updateCanvasBlock'; blockId: string; patch: Partial<CanvasBlock> }
  | { type: 'setTemplateSections'; templateId: string; sections: DocumentSection[] }
  | { type: 'setDocumentSections'; sections: DocumentSection[]; currentSectionId?: string }
  | { type: 'setCurrentSection'; sectionId: string }
  | { type: 'updateDocumentSection'; sectionId: string; patch: Partial<DocumentSection> }
  | { type: 'appendToCurrentSection'; text: string; evidenceId?: string }
  | { type: 'setPptOutline'; slides: PptSlide[] }
  | { type: 'updatePptSlide'; slideId: string; patch: Partial<PptSlide> }
  | { type: 'movePptSlide'; slideId: string; direction: 'up' | 'down' }
  | { type: 'deletePptSlide'; slideId: string }
  | { type: 'addPptSlide'; slide: PptSlide }
  | { type: 'updateEvidence'; evidenceId: string; patch: Partial<WritingEvidence> }
  | { type: 'addVersion'; version: WritingVersion };

function markDirty(project: WritingProject): WritingProject {
  return {
    ...project,
    progress: calculateProgress(project),
    autosaveStatus: 'unsaved',
  };
}

function reducer(project: WritingProject, action: WritingAction): WritingProject {
  switch (action.type) {
    case 'replaceProject':
      return action.project;
    case 'setAutosaveStatus':
      return {
        ...project,
        autosaveStatus: action.status,
        savedAt: action.savedAt ?? project.savedAt,
      };
    case 'setCurrentStep':
      if (project.currentStep === action.step) return project;
      return markDirty({ ...project, currentStep: action.step });
    case 'setDeductionInput':
      return markDirty({ ...project, deductionInput: action.value });
    case 'setTopicTags':
      return markDirty({ ...project, topicTags: action.tags });
    case 'addTopics': {
      const topics = [
        ...action.topics,
        ...project.topics.map((topic) => ({ ...topic, selected: false })),
      ];
      return markDirty({ ...project, topics });
    }
    case 'selectTopic':
      return markDirty({
        ...project,
        topics: project.topics.map((topic) => ({
          ...topic,
          selected: topic.id === action.topicId,
        })),
      });
    case 'setActiveTopic':
      return markDirty({
        ...project,
        activeTopicId: action.topicId,
        topics: project.topics.map((topic) => ({
          ...topic,
          selected: topic.id === action.topicId,
        })),
      });
    case 'updateTopic':
      return markDirty({
        ...project,
        topics: project.topics.map((topic) =>
          topic.id === action.topicId ? { ...topic, ...action.patch } : topic,
        ),
      });
    case 'setCanvasBlocks':
      return markDirty({ ...project, canvas: { blocks: action.blocks } });
    case 'updateCanvasBlock':
      return markDirty({
        ...project,
        canvas: {
          blocks: project.canvas.blocks.map((block) => {
            if (block.id !== action.blockId) return block;
            const next = { ...block, ...action.patch };
            if (typeof action.patch.content === 'string' && !action.patch.status) {
              next.status = getCanvasStatusFromContent(action.patch.content, block.status);
            }
            return next;
          }),
        },
      });
    case 'setTemplateSections':
      return markDirty({
        ...project,
        selectedTemplateId: action.templateId,
        document: {
          sections: action.sections,
          currentSectionId: action.sections[0]?.id,
        },
      });
    case 'setDocumentSections':
      return markDirty({
        ...project,
        document: {
          sections: action.sections,
          currentSectionId: action.currentSectionId ?? action.sections[0]?.id,
        },
      });
    case 'setCurrentSection':
      return markDirty({
        ...project,
        document: { ...project.document, currentSectionId: action.sectionId },
      });
    case 'updateDocumentSection':
      return markDirty({
        ...project,
        document: {
          ...project.document,
          sections: project.document.sections.map((section) => {
            if (section.id !== action.sectionId) return section;
            const content = action.patch.content ?? section.content;
            return {
              ...section,
              ...action.patch,
              content,
              wordCount: action.patch.content !== undefined ? countWords(content) : (action.patch.wordCount ?? section.wordCount),
              updatedAt: action.patch.updatedAt ?? new Date().toISOString(),
            };
          }),
        },
      });
    case 'appendToCurrentSection': {
      const sectionId = project.document.currentSectionId ?? project.document.sections[0]?.id;
      if (!sectionId) return project;
      const sections = project.document.sections.map((section) => {
        if (section.id !== sectionId) return section;
        const content = `${section.content.trim()}\n\n${action.text}`.trim();
        const evidenceIds = action.evidenceId && !section.evidenceIds.includes(action.evidenceId)
          ? [...section.evidenceIds, action.evidenceId]
          : section.evidenceIds;
        return {
          ...section,
          content,
          evidenceIds,
          status: 'edited' as const,
          wordCount: countWords(content),
          updatedAt: new Date().toISOString(),
        };
      });
      const evidences = action.evidenceId
        ? project.evidences.map((evidence) =>
            evidence.id === action.evidenceId
              ? {
                  ...evidence,
                  selected: true,
                  usedInSections: evidence.usedInSections.includes(sectionId)
                    ? evidence.usedInSections
                    : [...evidence.usedInSections, sectionId],
                }
              : evidence,
          )
        : project.evidences;
      return markDirty({
        ...project,
        document: { ...project.document, sections, currentSectionId: sectionId },
        evidences,
      });
    }
    case 'setPptOutline':
      return markDirty({ ...project, pptOutline: renumberSlides(action.slides) });
    case 'updatePptSlide':
      return markDirty({
        ...project,
        pptOutline: project.pptOutline.map((slide) =>
          slide.id === action.slideId ? { ...slide, ...action.patch } : slide,
        ),
      });
    case 'movePptSlide': {
      const currentIndex = project.pptOutline.findIndex((slide) => slide.id === action.slideId);
      const targetIndex = action.direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= project.pptOutline.length) return project;
      const slides = [...project.pptOutline];
      const current = slides[currentIndex];
      slides[currentIndex] = slides[targetIndex];
      slides[targetIndex] = current;
      return markDirty({ ...project, pptOutline: renumberSlides(slides) });
    }
    case 'deletePptSlide':
      return markDirty({
        ...project,
        pptOutline: renumberSlides(project.pptOutline.filter((slide) => slide.id !== action.slideId)),
      });
    case 'addPptSlide':
      return markDirty({ ...project, pptOutline: renumberSlides([...project.pptOutline, action.slide]) });
    case 'updateEvidence':
      return markDirty({
        ...project,
        evidences: project.evidences.map((evidence) =>
          evidence.id === action.evidenceId ? { ...evidence, ...action.patch } : evidence,
        ),
      });
    case 'addVersion':
      return markDirty({ ...project, versions: [action.version, ...project.versions] });
    default:
      return project;
  }
}

function loadInitialProject(): WritingProject {
  if (typeof window === 'undefined') return createDefaultProject();
  try {
    const raw = window.localStorage.getItem(WRITING_STORAGE_KEY);
    if (!raw) return createDefaultProject();
    const parsed = JSON.parse(raw) as WritingProject;
    const project = {
      ...createDefaultProject(),
      ...parsed,
      canvas: parsed.canvas ?? createDefaultProject().canvas,
      document: parsed.document ?? createDefaultProject().document,
      autosaveStatus: 'saved' as const,
    };
    return { ...project, progress: calculateProgress(project) };
  } catch {
    return createDefaultProject();
  }
}

function persistProject(project: WritingProject, savedAt: string): void {
  const snapshot: WritingProject = {
    ...project,
    savedAt,
    autosaveStatus: 'saved',
    progress: calculateProgress(project),
  };
  window.localStorage.setItem(WRITING_STORAGE_KEY, JSON.stringify(snapshot));
}

export function useWritingProject() {
  const [project, dispatch] = useReducer(reducer, undefined, loadInitialProject);

  useEffect(() => {
    if (project.autosaveStatus !== 'unsaved') return undefined;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'setAutosaveStatus', status: 'saving' });
      window.setTimeout(() => {
        try {
          const savedAt = new Date().toISOString();
          persistProject(project, savedAt);
          dispatch({ type: 'setAutosaveStatus', status: 'saved', savedAt });
        } catch {
          dispatch({ type: 'setAutosaveStatus', status: 'error' });
        }
      }, 120);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [project]);

  const saveNow = useCallback(() => {
    dispatch({ type: 'setAutosaveStatus', status: 'saving' });
    try {
      const savedAt = new Date().toISOString();
      persistProject(project, savedAt);
      dispatch({ type: 'setAutosaveStatus', status: 'saved', savedAt });
      return true;
    } catch {
      dispatch({ type: 'setAutosaveStatus', status: 'error' });
      return false;
    }
  }, [project]);

  const resetDemo = useCallback(() => {
    const next = createDefaultProject();
    window.localStorage.setItem(WRITING_STORAGE_KEY, JSON.stringify(next));
    dispatch({ type: 'replaceProject', project: next });
  }, []);

  return { project, dispatch, saveNow, resetDemo };
}
