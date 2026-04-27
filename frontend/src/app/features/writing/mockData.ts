import type {
  CanvasBlock,
  TopicIdea,
  WritingEvidence,
  WritingProject,
  WritingTemplate,
} from './types';

export const WRITING_STORAGE_KEY = 'writing-project-demo';

export const DEFAULT_TOPIC_TAGS = [
  '零信任',
  '工业互联网',
  'AI 安全',
  '隐私计算',
  '供应链安全',
  '恶意流量检测',
];

export const DEFAULT_CANVAS_BLOCKS: CanvasBlock[] = [
  {
    id: 'canvas-problem',
    title: '问题定义',
    content: '',
    placeholder: '要解决的真实痛点、约束和场景边界是什么？',
    type: 'problem',
    status: 'empty',
  },
  {
    id: 'canvas-user',
    title: '目标用户',
    content: '',
    placeholder: '谁会使用或受益？他们的使用环境是什么？',
    type: 'user',
    status: 'empty',
  },
  {
    id: 'canvas-method',
    title: '核心方法',
    content: '',
    placeholder: '核心技术路线、算法或系统机制是什么？',
    type: 'method',
    status: 'empty',
  },
  {
    id: 'canvas-innovation',
    title: '关键创新',
    content: '',
    placeholder: '和已有方案相比，差异点与新颖性在哪里？',
    type: 'innovation',
    status: 'empty',
  },
  {
    id: 'canvas-route',
    title: '技术路线',
    content: '',
    placeholder: '从数据、模型、系统到评估如何闭环？',
    type: 'route',
    status: 'empty',
  },
  {
    id: 'canvas-metric',
    title: '评估指标',
    content: '',
    placeholder: '如何证明方案有效、可用、可部署？',
    type: 'metric',
    status: 'empty',
  },
  {
    id: 'canvas-risk',
    title: '风险挑战',
    content: '',
    placeholder: '数据、成本、合规、工程落地的主要风险是什么？',
    type: 'risk',
    status: 'empty',
  },
  {
    id: 'canvas-result',
    title: '预期成果',
    content: '',
    placeholder: '最终产出论文、系统、报告、演示或开源资产？',
    type: 'result',
    status: 'empty',
  },
];

export const DEFAULT_EVIDENCES: WritingEvidence[] = [
  {
    id: 'ev-nist-zt',
    type: '标准',
    title: 'Zero Trust Architecture: NIST SP 800-207',
    source: 'National Institute of Standards and Technology',
    url: 'https://www.nist.gov/publications/zero-trust-architecture',
    excerpt:
      '该标准给出了零信任架构的核心原则，包括持续验证、最小权限访问、基于策略的动态授权与资源级保护。',
    reliability: 5,
    year: 2020,
    citationText:
      'Rose S, Borchert O, Mitchell S, et al. Zero Trust Architecture: NIST Special Publication 800-207[S]. NIST, 2020.',
    usedInSections: [],
    selected: false,
  },
  {
    id: 'ev-beyondcorp',
    type: '论文',
    title: 'BeyondCorp: A New Approach to Enterprise Security',
    source: 'USENIX ;login:',
    url: 'https://research.google/pubs/beyondcorp-a-new-approach-to-enterprise-security/',
    excerpt:
      'BeyondCorp 将访问控制从网络边界转向用户、设备与上下文，推动了以身份为中心的企业安全架构实践。',
    reliability: 5,
    year: 2014,
    citationText:
      'Ward R, Beyer B. BeyondCorp: A New Approach to Enterprise Security[J]. USENIX ;login:, 2014.',
    usedInSections: [],
    selected: false,
  },
  {
    id: 'ev-ics-review',
    type: '论文',
    title: 'Securing Industrial Control Systems: A Systematic Review',
    source: 'Computers & Security',
    url: 'https://example.com/ics-review',
    excerpt:
      '系统综述指出，工业控制系统安全需要同时考虑协议异构、实时性约束、资产可见性与补丁窗口不足等问题。',
    reliability: 4,
    year: 2023,
    citationText:
      'Li M, Chen X, Zhang Y. Securing Industrial Control Systems: A Systematic Review[J]. Computers & Security, 2023.',
    usedInSections: [],
    selected: false,
  },
  {
    id: 'ev-industry-policy',
    type: '政策',
    title: '工业互联网创新发展行动计划',
    source: '工业和信息化部',
    url: 'https://example.com/industrial-internet-policy',
    excerpt:
      '政策强调推动工业互联网平台、安全体系和标识解析体系建设，鼓励面向中小企业的轻量化安全能力落地。',
    reliability: 4,
    year: 2024,
    citationText:
      '工业和信息化部. 工业互联网创新发展行动计划[Z]. 2024.',
    usedInSections: [],
    selected: false,
  },
  {
    id: 'ev-sme-security',
    type: '报告',
    title: '中小制造企业数字化转型安全能力调研报告',
    source: '中国信通院',
    url: 'https://example.com/sme-security-report',
    excerpt:
      '调研显示，中小制造企业常面临安全预算有限、资产台账不完整、远程运维入口分散与人员能力不足等挑战。',
    reliability: 4,
    year: 2024,
    citationText:
      '中国信通院. 中小制造企业数字化转型安全能力调研报告[R]. 2024.',
    usedInSections: [],
    selected: false,
  },
  {
    id: 'ev-competition-case',
    type: '案例',
    title: '挑战杯网络安全方向获奖作品结构分析',
    source: '竞赛作品公开资料',
    url: 'https://example.com/challenge-cup-security-case',
    excerpt:
      '优秀作品通常具备清晰问题场景、可验证系统原型、量化评估指标与面向社会价值的落地叙事。',
    reliability: 3,
    year: 2023,
    citationText:
      '竞赛作品公开资料. 挑战杯网络安全方向获奖作品结构分析[EB/OL]. 2023.',
    usedInSections: [],
    selected: false,
  },
];

export const DEFAULT_TOPICS: TopicIdea[] = [
  {
    id: 'topic-zero-trust-gateway',
    title: '面向中小制造企业的轻量级零信任接入网关设计与评估',
    summary:
      '以 SDP、持续身份校验和微隔离为核心，构建适配 OT/IT 融合场景的低成本接入控制原型。',
    direction: '工业互联网安全',
    tags: ['零信任', '工业互联网', '供应链安全'],
    innovationScore: 88,
    feasibilityScore: 86,
    matchScore: 94,
    dataAvailability: '中高：可用公开拓扑、仿真流量与访谈数据支撑',
    difficulty: '中等',
    targetCompetition: '网络安全竞赛作品说明书',
    recommendedReason:
      '选题兼具工程原型、可量化评估和明确应用场景，适合答辩展示与计划书展开。',
    evidenceIds: ['ev-nist-zt', 'ev-beyondcorp', 'ev-sme-security'],
    favorited: true,
    selected: true,
    compared: false,
    createdAt: new Date().toISOString(),
  },
];

export const WRITING_TEMPLATES: WritingTemplate[] = [
  {
    id: 'tpl-challenge-cup',
    name: '挑战杯学术作品',
    scenario: '创新竞赛',
    description: '强调问题价值、研究基础、创新点、技术路线和社会应用价值。',
    sections: [
      '摘要',
      '1. 作品背景与研究意义',
      '2. 国内外研究现状',
      '3. 关键问题与研究目标',
      '4. 技术路线与系统设计',
      '5. 创新点与可行性分析',
      '6. 实验设计与评估指标',
      '7. 预期成果与应用前景',
      '参考文献',
    ],
    recommended: true,
    tags: ['答辩友好', '创新展示', '原型验证'],
  },
  {
    id: 'tpl-nsfc-youth',
    name: '国自然青年项目',
    scenario: '科研基金',
    description: '突出科学问题、研究内容、研究基础、年度计划和预期成果。',
    sections: [
      '摘要',
      '1. 立项依据与科学问题',
      '2. 研究目标与研究内容',
      '3. 拟解决的关键科学问题',
      '4. 研究方案与可行性',
      '5. 创新点',
      '6. 年度研究计划',
      '7. 预期成果',
      '参考文献',
    ],
    recommended: false,
    tags: ['科学问题', '基金文本', '研究计划'],
  },
  {
    id: 'tpl-industry-edu',
    name: '教育部产学合作',
    scenario: '产教融合',
    description: '关注企业需求、课程/平台建设、实践场景和产出转化。',
    sections: [
      '项目概述',
      '1. 产业需求与建设基础',
      '2. 建设目标',
      '3. 建设内容与实施路径',
      '4. 校企协同机制',
      '5. 项目进度安排',
      '6. 成果形式与推广计划',
      '参考文献',
    ],
    recommended: false,
    tags: ['产学合作', '平台建设', '成果转化'],
  },
  {
    id: 'tpl-innovation-training',
    name: '省级大创项目',
    scenario: '学生创新训练',
    description: '适合学生团队立项，强调计划清晰、任务拆解和可完成性。',
    sections: [
      '项目简介',
      '1. 研究背景',
      '2. 项目目标',
      '3. 研究内容',
      '4. 创新特色',
      '5. 实施计划',
      '6. 经费预算与成果',
      '参考文献',
    ],
    recommended: false,
    tags: ['学生团队', '周期可控', '实践成果'],
  },
  {
    id: 'tpl-security-work',
    name: '网络安全竞赛作品说明书',
    scenario: '安全竞赛',
    description: '突出威胁场景、系统架构、攻防验证、部署价值和演示脚本。',
    sections: [
      '作品摘要',
      '1. 威胁场景与需求分析',
      '2. 总体架构',
      '3. 核心功能与实现方法',
      '4. 攻防验证与性能评估',
      '5. 部署方案与应用价值',
      '6. 创新点总结',
      '7. 演示流程与答辩要点',
      '参考文献',
    ],
    recommended: true,
    tags: ['网络安全', '系统原型', '演示脚本'],
  },
];

export const WRITING_MODULES = [
  {
    id: 'module-abstract',
    name: '摘要生成',
    description: '生成 300 字左右的结构化摘要。',
    target: '摘要',
  },
  {
    id: 'module-background',
    name: '研究背景',
    description: '补充政策、产业需求和应用场景。',
    target: '背景章节',
  },
  {
    id: 'module-related',
    name: '国内外研究现状',
    description: '按标准、工业实践、学术研究梳理现状。',
    target: '现状章节',
  },
  {
    id: 'module-method',
    name: '方法章节',
    description: '展开系统架构、关键算法和模块职责。',
    target: '方法章节',
  },
  {
    id: 'module-experiment',
    name: '实验设计',
    description: '生成指标、基线、数据和实验流程。',
    target: '实验章节',
  },
  {
    id: 'module-result',
    name: '结果分析',
    description: '组织性能、可靠性和部署成本分析。',
    target: '结果章节',
  },
  {
    id: 'module-innovation',
    name: '创新点提炼',
    description: '凝练 3-5 条答辩可讲的创新点。',
    target: '创新点章节',
  },
  {
    id: 'module-reference',
    name: '参考文献',
    description: '根据证据池生成规范化引用段落。',
    target: '参考文献',
  },
  {
    id: 'module-defense',
    name: '答辩稿生成',
    description: '生成面向评委的 3 分钟讲稿。',
    target: 'PPT 讲稿',
  },
] as const;

export function createDefaultProject(): WritingProject {
  return {
    id: 'writing-project-demo',
    name: '鸿雁杯选题写作演示项目',
    description: '围绕网络安全与工业互联网场景，演示从选题推演到计划书、证据引用和 PPT 大纲的前端闭环。',
    activeTopicId: 'topic-zero-trust-gateway',
    selectedTemplateId: undefined,
    progress: 18,
    currentStep: 'deduce',
    savedAt: new Date().toISOString(),
    autosaveStatus: 'saved',
    topics: DEFAULT_TOPICS.map((topic) => ({ ...topic, tags: [...topic.tags], evidenceIds: [...topic.evidenceIds] })),
    canvas: {
      blocks: DEFAULT_CANVAS_BLOCKS.map((block) => ({ ...block })),
    },
    document: {
      sections: [],
      currentSectionId: undefined,
    },
    evidences: DEFAULT_EVIDENCES.map((evidence) => ({
      ...evidence,
      usedInSections: [...evidence.usedInSections],
    })),
    pptOutline: [],
    versions: [],
    deductionInput:
      '我对零信任在工业互联网中的应用感兴趣，希望做一个面向中小制造企业、低成本、可演示的安全接入方案。',
    topicTags: ['零信任', '工业互联网', '供应链安全'],
  };
}
