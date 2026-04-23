import {
  Briefcase,
  Target,
  GraduationCap,
  FileText,
  MessageCircleQuestion,
  Building2,
  Compass,
  MapPin,
} from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

export function Careers() {
  return (
    <PageShell
      title="就业招聘"
      subtitle="岗位、差距、路径、简历、面试与企业画像 · 成长导向的就业视图"
      actions={
        <div className="flex gap-2">
          <select className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white">
            <option>全部岗位</option>
            <option>安全开发</option>
            <option>红队 / 蓝队</option>
            <option>安全研究</option>
            <option>安全运营</option>
          </select>
        </div>
      }
      tabs={[
        {
          key: 'jobs',
          label: '招聘速递',
          description: '安全行业最新招聘信息聚合，按方向筛选，实时更新岗位动态',
          render: () => (
            <Card>
              <ul className="divide-y divide-slate-100">
                {[
                  { t: '安全研究员（AI 安全方向）', c: '奇安信', s: '北京 · 社招/校招', r: '18-35K', tag: '热门' },
                  { t: '渗透测试工程师', c: '深信服', s: '深圳 · 校招', r: '15-25K', tag: '校招' },
                  { t: '安全运营工程师', c: '阿里云安全', s: '杭州 · 校招', r: '18-30K' },
                  { t: '高级安全开发（云原生）', c: '腾讯', s: '深圳 · 社招', r: '25-45K' },
                  { t: '工控安全研究员', c: '360', s: '北京 · 校招', r: '16-28K' },
                ].map((j: any) => (
                  <li key={j.t} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{j.t}</p>
                        <p className="text-xs text-slate-500">
                          {j.c} · {j.s}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {j.tag && <Tag tone="blue">{j.tag}</Tag>}
                      <span className="text-sm text-slate-700">{j.r}</span>
                      <button className="text-xs px-2.5 py-1 bg-brand-blue-600 text-white rounded-md">查看</button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
        {
          key: 'analysis',
          label: '岗位分析',
          description: '主流安全岗位的技能要求分布、薪资水平与竞争热度多维分析',
          render: () => (
            <div className="grid grid-cols-3 gap-4">
              <Card title="需求分布" className="col-span-1">
                <ul className="space-y-3">
                  {[
                    ['安全开发', 38],
                    ['安全运营', 24],
                    ['渗透测试', 18],
                    ['安全研究', 12],
                    ['合规审计', 8],
                  ].map((r: any) => (
                    <li key={r[0]}>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>{r[0]}</span>
                        <span>{r[1]}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full">
                        <div className="h-full bg-brand-blue-600 rounded-full" style={{ width: `${r[1]}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="核心技能要求 · 安全开发" className="col-span-2">
                <div className="flex flex-wrap gap-2">
                  {['Go / Rust', 'Kubernetes', 'eBPF', 'WAF 原理', 'Linux 内核', '云原生安全', 'SAST/DAST', 'CI/CD 安全', '密码学基础', '威胁建模'].map((s) => (
                    <Tag key={s} tone="blue">{s}</Tag>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  数据基于近 30 天 BOSS / 拉勾 / 牛客 1.2 万条岗位信息分析
                </p>
              </Card>
            </div>
          ),
        },
        {
          key: 'gap',
          label: '技能差距',
          description: '对比你的个人画像与目标岗位要求，精准识别需要补强的技能缺口',
          render: () => (
            <Card title="你的画像 vs 目标岗位 · 安全研究（AI 方向）">
              <ul className="space-y-3">
                {[
                  { s: 'Python / PyTorch', u: 80, need: 90 },
                  { s: '对抗样本与鲁棒性', u: 40, need: 85 },
                  { s: 'LLM 安全对齐', u: 30, need: 80 },
                  { s: '论文复现能力', u: 55, need: 75 },
                  { s: '密码学基础', u: 60, need: 65 },
                ].map((s) => (
                  <li key={s.s}>
                    <div className="flex justify-between text-sm text-slate-700 mb-1">
                      <span>{s.s}</span>
                      <span className="text-xs text-slate-500">你 {s.u}% · 需求 {s.need}%</span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full">
                      <div className="absolute h-full bg-brand-blue-600 rounded-full" style={{ width: `${s.u}%` }} />
                      <div className="absolute top-0 h-2 border-r-2 border-red-500" style={{ left: `${s.need}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
        {
          key: 'path',
          label: '学习路径',
          description: '针对目标岗位定制的分阶段能力建设路径，附资源推荐与时间规划',
          render: () => (
            <Card title="个性化路径 · 6 个月成为 AI 安全研究方向候选人">
              <ol className="relative border-l border-slate-200 ml-2 space-y-5">
                {[
                  { t: 'M1 · 打好深度学习基础', d: '《深度学习》+ PyTorch 官方教程' },
                  { t: 'M2 · 对抗样本经典论文复现', d: 'FGSM / PGD / C&W · 5 篇' },
                  { t: 'M3 · LLM 安全与越狱', d: 'Prompt Injection · Alignment' },
                  { t: 'M4 · 参加 AI 安全竞赛', d: '天池 · AICS · Kaggle' },
                  { t: 'M5 · 输出研究笔记与开源', d: 'GitHub · 个人博客' },
                  { t: 'M6 · 投递与面试', d: '头部安全厂商 + AI 安全实验室' },
                ].map((s) => (
                  <li key={s.t} className="ml-4">
                    <span className="absolute -left-1.5 w-3 h-3 bg-brand-blue-600 rounded-full" />
                    <p className="text-sm font-medium text-slate-900">{s.t}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.d}</p>
                  </li>
                ))}
              </ol>
            </Card>
          ),
        },
        {
          key: 'resume',
          label: '简历优化',
          description: 'AI 辅助简历诊断与优化建议，提升岗位关键词匹配度与表达专业性',
          render: () => (
            <div className="grid grid-cols-2 gap-4">
              <Card title="简历诊断 · v3.2">
                <ul className="space-y-2 text-sm">
                  {[
                    { t: '核心经历量化不足', tone: 'red' as const, c: '建议用数字描述成果' },
                    { t: '技能关键词匹配度 72%', tone: 'amber' as const, c: '缺失：eBPF / 云原生' },
                    { t: '项目描述表达清晰', tone: 'green' as const, c: '符合 STAR 结构' },
                  ].map((i) => (
                    <li key={i.t} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span>{i.t}</span>
                      </div>
                      <Tag tone={i.tone}>{i.c}</Tag>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card title="优化建议">
                <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                  <li>将"参与安全项目"改为"独立负责渗透测试模块，发现高危漏洞 12 个"。</li>
                  <li>新增"AI 安全"相关关键词：对抗样本、LLM 评估、对齐。</li>
                  <li>删除与目标岗位相关性低的社团经历 2 条。</li>
                  <li>将科研成果的收录情况（EI/CCF）明确标注。</li>
                </ul>
              </Card>
            </div>
          ),
        },
        {
          key: 'interview',
          label: '面试题库',
          description: '按岗位方向分类的高频面试���精选，附参考解析与答题策略',
          render: () => (
            <Card>
              <ul className="divide-y divide-slate-100">
                {[
                  { t: 'HTTPS 握手过程中有哪些安全风险？', tag: '基础' },
                  { t: '请设计一个百万级用户的登录风控架构。', tag: '系统' },
                  { t: '讲一个你独立挖掘的漏洞，全过程。', tag: '实战' },
                  { t: '介绍一篇你最近读过的 AI 安全论文。', tag: '科研' },
                  { t: '怎样评估一个 WAF 的有效性？', tag: '深入' },
                ].map((q) => (
                  <li key={q.t} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <MessageCircleQuestion className="w-4 h-4 text-slate-400" />
                      <p className="text-sm text-slate-800">{q.t}</p>
                    </div>
                    <Tag tone="blue">{q.tag}</Tag>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
        {
          key: 'company',
          label: '企业画像',
          description: '主流安全厂商与大厂安全部的业务方向、团队文化与招聘偏好画像',
          render: () => (
            <div className="grid grid-cols-3 gap-4">
              {[
                { t: '奇安信', s: '综合安服龙头 · 研究力强', tag: 'A 类' },
                { t: '深信服', s: '网络+终端安全 · 产品成熟', tag: 'A 类' },
                { t: '360', s: '威胁情报 · 研究资源丰富', tag: 'A 类' },
                { t: '阿里云安全', s: '云安全业务 · 规模化', tag: 'S 类' },
                { t: '腾讯安全', s: '业务广 · 岗位多样', tag: 'S 类' },
                { t: '蚂蚁安全', s: '金融科技 · 对抗前沿', tag: 'S 类' },
              ].map((c) => (
                <Card key={c.t}>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-brand-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900">{c.t}</p>
                        <Tag tone="purple">{c.tag}</Tag>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{c.s}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                        <MapPin className="w-3 h-3" /> 多地办公
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ),
        },
        {
          key: 'direction',
          label: '发展方向规划',
          description: '结合市场趋势与个人画像，规划科研、工业或复合路线的短中长期发展',
          render: () => (
            <div className="grid grid-cols-3 gap-4">
              {[
                { t: '科研路线', d: '保研 / 考研 · 硕博 · 研究机构', icon: GraduationCap },
                { t: '工业路线', d: '安服厂商 · 甲方安全团队 · 云安全', icon: Target },
                { t: '复合路线', d: '企业研究院 · 产学合作 · 标准组织', icon: Compass },
              ].map((x) => (
                <Card key={x.t}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-brand-blue-50 text-brand-blue-600 rounded-lg flex items-center justify-center">
                      <x.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{x.t}</p>
                      <p className="text-xs text-slate-500 mt-1">{x.d}</p>
                      <div className="mt-2"><Tag tone="blue">基于画像推荐</Tag></div>
                    </div>
                  </div>
                </Card>
              ))}
              <div className="col-span-3">
                <Card title="近 3 年相同画像同学去向">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {[
                      { k: '深造', v: '42%' },
                      { k: '头部厂商', v: '31%' },
                      { k: '云厂商安全', v: '18%' },
                      { k: '其它', v: '9%' },
                    ].map((s) => (
                      <div key={s.k}>
                        <p className="text-2xl font-semibold text-slate-900">{s.v}</p>
                        <p className="text-xs text-slate-500 mt-1">{s.k}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}