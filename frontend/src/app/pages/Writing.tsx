import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PageShell } from '../components/PageShell';
import { generateCanvasFromTopic, generateDraftSections, generatePptOutline } from '../features/writing/api';
import { WRITING_TEMPLATES } from '../features/writing/mockData';
import { useWritingProject } from '../features/writing/store';
import { buildProjectMarkdown, downloadTextFile, getActiveTopic } from '../features/writing/utils';
import { CitationEvidencePanel } from '../features/writing/components/CitationEvidencePanel';
import { DocumentEditor } from '../features/writing/components/DocumentEditor';
import { IdeaCanvas } from '../features/writing/components/IdeaCanvas';
import { ProposalGenerator } from '../features/writing/components/ProposalGenerator';
import { PptOutlineBuilder } from '../features/writing/components/PptOutlineBuilder';
import { TopicCardPool } from '../features/writing/components/TopicCardPool';
import { TopicDeductionPanel } from '../features/writing/components/TopicDeductionPanel';
import { WritingModuleLibrary } from '../features/writing/components/WritingModuleLibrary';
import { WritingProjectBar } from '../features/writing/components/WritingProjectBar';
import { WritingToolbar } from '../features/writing/components/WritingToolbar';

const tabs = [
  {
    key: 'deduce',
    label: '选题推演',
    description: '基于研究兴趣和标签生成候选选题，并沉淀为可复用的思路卡片。',
  },
  {
    key: 'cards',
    label: '选题卡池',
    description: '搜索、排序、收藏、对比候选选题，并设定当前项目选题。',
  },
  {
    key: 'canvas',
    label: '创意画布',
    description: '把当前选题拆解为问题、用户、方法、创新、路线、指标、风险和成果。',
  },
  {
    key: 'module',
    label: '写作模块',
    description: '复用摘要、背景、方法、实验、创新点和答辩稿等写作模块。',
  },
  {
    key: 'proposal',
    label: '计划书生成',
    description: '选择模板并生成可编辑的计划书章节和初稿。',
  },
  {
    key: 'editor',
    label: '文档编辑',
    description: '切换章节、编辑正文、AI 润色扩写压缩、插入引用并保存版本。',
  },
  {
    key: 'ppt',
    label: 'PPT 大纲',
    description: '根据文档章节生成 PPT 大纲，并支持编辑、重排和导出。',
  },
  {
    key: 'cite',
    label: '引用证据',
    description: '管理项目级证据池，复制引用或插入当前章节。',
  },
] as const;

type WritingTabKey = (typeof tabs)[number]['key'];

function isWritingTab(value: string | null): value is WritingTabKey {
  return tabs.some((tab) => tab.key === value);
}

export function Writing() {
  const { project, dispatch, saveNow, resetDemo } = useWritingProject();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [quickLoading, setQuickLoading] = useState(false);
  const tabParam = params.get('tab');
  const activeTab: WritingTabKey = isWritingTab(tabParam) ? tabParam : 'deduce';
  const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const currentLabel = tabs[currentIndex]?.label ?? tabs[0].label;

  useEffect(() => {
    dispatch({ type: 'setCurrentStep', step: activeTab });
  }, [activeTab, dispatch]);

  const goToTab = (key: WritingTabKey) => {
    navigate(`/writing?tab=${key}`);
  };

  const goPrev = () => {
    const nextIndex = Math.max(0, currentIndex - 1);
    goToTab(tabs[nextIndex].key);
  };

  const goNext = () => {
    const nextIndex = Math.min(tabs.length - 1, currentIndex + 1);
    goToTab(tabs[nextIndex].key);
  };

  const handleSave = () => {
    const ok = saveNow();
    if (ok) toast.success('项目草稿已保存');
    else toast.error('保存失败');
  };

  const handleExport = () => {
    try {
      downloadTextFile(`${project.name}.md`, buildProjectMarkdown(project));
      toast.success('已导出 Markdown');
    } catch {
      toast.error('导出失败，请重试');
    }
  };

  const handleReset = () => {
    resetDemo();
    toast.success('已重置演示数据');
    goToTab('deduce');
  };

  const handleQuickGenerate = async () => {
    const activeTopic = getActiveTopic(project);
    if (!activeTopic) {
      toast.error('请先选择当前选题');
      goToTab('deduce');
      return;
    }
    const template =
      WRITING_TEMPLATES.find((item) => item.id === project.selectedTemplateId) ??
      WRITING_TEMPLATES.find((item) => item.id === 'tpl-security-work') ??
      WRITING_TEMPLATES[0];

    setQuickLoading(true);
    const canvasBlocks = await generateCanvasFromTopic(activeTopic, project.canvas.blocks);
    dispatch({ type: 'setCanvasBlocks', blocks: canvasBlocks });
    dispatch({ type: 'setTemplateSections', templateId: template.id, sections: [] });
    const sections = await generateDraftSections(template, activeTopic, canvasBlocks, project.evidences);
    dispatch({ type: 'setDocumentSections', sections, currentSectionId: sections[0]?.id });
    const slides = await generatePptOutline(sections, activeTopic);
    dispatch({ type: 'setPptOutline', slides });
    setQuickLoading(false);
    toast.success('已快速生成画布、计划书和 PPT 大纲');
    goToTab('editor');
  };

  const shellTabs = useMemo(
    () => [
      {
        ...tabs[0],
        render: () => (
          <TopicDeductionPanel project={project} dispatch={dispatch} onGoToProposal={() => goToTab('proposal')} />
        ),
      },
      {
        ...tabs[1],
        render: () => <TopicCardPool project={project} dispatch={dispatch} />,
      },
      {
        ...tabs[2],
        render: () => <IdeaCanvas project={project} dispatch={dispatch} onGoToProposal={() => goToTab('proposal')} />,
      },
      {
        ...tabs[3],
        render: () => <WritingModuleLibrary project={project} dispatch={dispatch} />,
      },
      {
        ...tabs[4],
        render: () => <ProposalGenerator project={project} dispatch={dispatch} onGoToEditor={() => goToTab('editor')} />,
      },
      {
        ...tabs[5],
        render: () => <DocumentEditor project={project} dispatch={dispatch} onSave={handleSave} />,
      },
      {
        ...tabs[6],
        render: () => <PptOutlineBuilder project={project} dispatch={dispatch} />,
      },
      {
        ...tabs[7],
        render: () => <CitationEvidencePanel project={project} dispatch={dispatch} />,
      },
    ],
    [dispatch, project],
  );

  return (
    <PageShell
      title="选题写作"
      subtitle="从选题推演到计划书、文档、PPT 和引用证据的一站式写作演示链路"
      defaultTab="deduce"
      actions={
        <WritingToolbar
          project={project}
          quickLoading={quickLoading}
          onQuickGenerate={handleQuickGenerate}
          onSave={handleSave}
          onExport={handleExport}
          onReset={handleReset}
        />
      }
      tabs={shellTabs.map((tab) => ({
        key: tab.key,
        label: tab.label,
        description: tab.description,
        render: () => (
          <div className="space-y-4">
            <WritingProjectBar project={project} currentLabel={currentLabel} onPrev={goPrev} onNext={goNext} />
            {tab.render()}
          </div>
        ),
      }))}
    />
  );
}
