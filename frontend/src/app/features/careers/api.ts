import type {
  CareerDirectionPlan,
  CareerWorkbench,
  JobPosting,
  LearningMilestone,
  LearningPace,
  ResumeReview,
  SkillGapItem,
} from './types';
import { createId, directionPlansFromContext, getLatestResumeReview } from './utils';

function delay<T>(value: T, ms = 760): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), ms);
  });
}

export function generateSkillSuggestions(gaps: SkillGapItem[], job: JobPosting | undefined): Promise<string[]> {
  const topGaps = gaps.filter((gap) => gap.priority !== 'low').slice(0, 5);
  const suggestions = topGaps.map((gap) => {
    if (gap.priority === 'high') {
      return `优先补齐 ${gap.name}：围绕“${job?.title ?? '目标岗位'}”做一个小项目，并输出 README、截图和量化指标。`;
    }
    return `强化 ${gap.name}：把学习笔记转成面试可讲的 2 分钟案例，并关联到简历关键词。`;
  });
  return delay(suggestions.length > 0 ? suggestions : ['当前技能差距较小，建议把已有项目表达改成岗位关键词和量化成果。'], 700);
}

export function generateLearningPath(
  gaps: SkillGapItem[],
  job: JobPosting | undefined,
  pace: LearningPace,
): Promise<LearningMilestone[]> {
  const topSkills = gaps.filter((gap) => gap.priority !== 'low').slice(0, 6);
  const skillNames = topSkills.length > 0 ? topSkills.map((gap) => gap.name) : job?.skillKeywords.slice(0, 5) ?? ['Web 安全', 'Linux'];
  const paceText = pace === '紧凑' ? '每周 5-6 次投入' : pace === '宽松' ? '每周 2-3 次投入' : '每周 3-4 次投入';

  const milestones: LearningMilestone[] = [
    {
      id: createId('milestone-30'),
      phase: '30天',
      title: `打牢 ${skillNames.slice(0, 2).join(' / ')} 基础`,
      description: `围绕 ${job?.title ?? '目标岗位'} 建立知识框架，节奏为${paceText}。`,
      relatedSkills: skillNames.slice(0, 3),
      resources: ['官方文档与安全基线', 'OWASP / CNCF / MITRE 公开资料', '岗位 JD 关键词清单'],
      tasks: ['完成基础知识清单', '复现 2 个典型案例', '输出一篇学习笔记'],
      completed: false,
      dueText: '第 1-4 周',
    },
    {
      id: createId('milestone-60'),
      phase: '60天',
      title: '完成岗位能力复现实验',
      description: '把高优先级技能转成可演示的实验和代码仓库。',
      relatedSkills: skillNames.slice(0, 4),
      resources: ['靶场环境', '开源工具源码', '经典论文或技术博客'],
      tasks: ['复现一个岗位相关漏洞或检测能力', '记录实验步骤和截图', '整理 README 与结果指标'],
      completed: false,
      dueText: '第 5-8 周',
    },
    {
      id: createId('milestone-90'),
      phase: '90天',
      title: '沉淀简历项目和面试案例',
      description: '将学习成果改写为简历项目、答辩表达和面试案例。',
      relatedSkills: skillNames.slice(1, 5),
      resources: ['STAR 表达模板', '优秀简历样例', '企业面试题库'],
      tasks: ['重写 2 条项目经历', '准备 8 个高频问答', '完成一次模拟面试'],
      completed: false,
      dueText: '第 9-12 周',
    },
    {
      id: createId('milestone-180'),
      phase: '180天',
      title: '完成投递与复盘闭环',
      description: '围绕目标公司投递、面试、复盘，持续修正方向。',
      relatedSkills: skillNames,
      resources: ['目标公司画像', '投递记录表', '面试复盘模板'],
      tasks: ['收藏 5 家目标公司', '投递 8 个岗位', '完成 3 次面试复盘'],
      completed: false,
      dueText: '第 13-24 周',
    },
  ];

  return delay(milestones, 850);
}

export function analyzeResume(resumeDraft: string, job: JobPosting): Promise<ResumeReview> {
  const normalized = resumeDraft.toLowerCase();
  const matched = job.skillKeywords.filter((keyword) => normalized.includes(keyword.toLowerCase()));
  const missingKeywords = job.skillKeywords.filter((keyword) => !matched.includes(keyword));
  const matchRate = Math.min(96, Math.max(42, 45 + Math.round((matched.length / Math.max(1, job.skillKeywords.length)) * 45) + Math.round(job.matchScore * 0.08)));

  const review: ResumeReview = {
    id: createId('resume-review'),
    targetJobId: job.id,
    matchRate,
    missingKeywords,
    strengths: [
      matched.length > 0 ? `已覆盖 ${matched.join('、')} 等岗位关键词。` : '已有安全项目经历，可继续强化岗位关键词。',
      '项目描述具备安全实践场景，适合进一步量化结果。',
      '具备本科生竞赛和实验背景，适合校招叙事。',
    ],
    problems: [
      missingKeywords.length > 0 ? `缺少 ${missingKeywords.slice(0, 4).join('、')} 等关键词。` : '关键词覆盖较好，但项目指标仍可量化。',
      '部分项目职责描述偏笼统，需要突出个人贡献。',
      '缺少与目标公司业务相关的投递理由。',
    ],
    rewriteSuggestions: [
      '把“参与项目”改为“负责模块 + 使用技术 + 量化结果”。',
      `在技能栏补充 ${missingKeywords.slice(0, 3).join('、') || job.skillKeywords.slice(0, 3).join('、')}。`,
      '每段项目经历补充测试数据、检出率、误报率、性能或影响范围。',
      '针对目标岗位增加一段 2-3 行的求职匹配摘要。',
    ],
    projectRewriteExample: `项目经历改写示例：负责面向 ${job.title} 的安全能力验证模块，使用 ${job.skillKeywords.slice(0, 3).join('、')} 完成风险样本构造、检测规则验证和结果复盘；在 20+ 个测试场景中沉淀可复用检查清单，并输出整改建议报告。`,
    createdAt: new Date().toISOString(),
  };

  return delay(review, 820);
}

export function generateDirectionPlans(
  workbench: CareerWorkbench,
  jobs: JobPosting[],
): Promise<CareerDirectionPlan[]> {
  const job = jobs.find((item) => item.id === workbench.selectedJobId);
  const latestReview = getLatestResumeReview(workbench, job?.id);
  return delay(directionPlansFromContext(workbench, job, latestReview), 780);
}
