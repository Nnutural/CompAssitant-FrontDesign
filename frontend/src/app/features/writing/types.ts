export type AutosaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export type CanvasBlockType =
  | 'problem'
  | 'user'
  | 'method'
  | 'innovation'
  | 'metric'
  | 'risk'
  | 'route'
  | 'result';

export type BlockStatus = 'empty' | 'draft' | 'completed';
export type DocumentSectionStatus = 'empty' | 'draft' | 'generated' | 'edited';
export type EvidenceType = '标准' | '论文' | '政策' | '报告' | '案例' | '数据集';
export type PptLayoutType = 'cover' | 'section' | 'comparison' | 'timeline' | 'summary';

export interface TopicIdea {
  id: string;
  title: string;
  summary: string;
  direction: string;
  tags: string[];
  innovationScore: number;
  feasibilityScore: number;
  matchScore: number;
  dataAvailability: string;
  difficulty: string;
  targetCompetition: string;
  recommendedReason: string;
  evidenceIds: string[];
  favorited: boolean;
  selected: boolean;
  compared: boolean;
  createdAt: string;
}

export interface CanvasBlock {
  id: string;
  title: string;
  content: string;
  placeholder: string;
  type: CanvasBlockType;
  status: BlockStatus;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  status: DocumentSectionStatus;
  wordCount: number;
  evidenceIds: string[];
  updatedAt: string;
}

export interface WritingEvidence {
  id: string;
  type: EvidenceType;
  title: string;
  source: string;
  url: string;
  excerpt: string;
  reliability: number;
  year: number;
  citationText: string;
  usedInSections: string[];
  selected: boolean;
}

export interface PptSlide {
  id: string;
  pageNo: number;
  title: string;
  bullets: string[];
  speakerNotes: string;
  relatedSectionIds: string[];
  layoutType: PptLayoutType;
}

export interface WritingTemplate {
  id: string;
  name: string;
  scenario: string;
  description: string;
  sections: string[];
  recommended: boolean;
  tags: string[];
}

export interface WritingVersion {
  id: string;
  name: string;
  createdAt: string;
  sectionId: string;
  sectionTitle: string;
  content: string;
  wordCount: number;
}

export interface WritingDocument {
  sections: DocumentSection[];
  currentSectionId?: string;
}

export interface WritingCanvas {
  blocks: CanvasBlock[];
}

export interface WritingProject {
  id: string;
  name: string;
  description: string;
  activeTopicId?: string;
  selectedTemplateId?: string;
  progress: number;
  currentStep: string;
  savedAt: string;
  autosaveStatus: AutosaveStatus;
  topics: TopicIdea[];
  canvas: WritingCanvas;
  document: WritingDocument;
  evidences: WritingEvidence[];
  pptOutline: PptSlide[];
  versions: WritingVersion[];
  deductionInput: string;
  topicTags: string[];
}

export type AiOperation = 'polish' | 'expand' | 'compress';
