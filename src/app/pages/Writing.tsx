import { Sparkles, Layers, Palette, Blocks, FileText, Edit3, Presentation, Quote, Send } from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

const Deduce = () => (
  <div className="grid grid-cols-3 gap-4">
    <Card title="对话输入" className="col-span-1">
      <div className="space-y-3">
        <textarea
          className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm resize-none"
          placeholder="描述你的研究兴趣，如：我对零信任在工业互联网的应用感兴趣..."
          defaultValue="我对零信任在工业互联网的应用感兴趣，希望做一个面向中小企业的落地方案。"
        />
        <div className="flex gap-2">
          <Tag tone="blue">#零信任</Tag>
          <Tag tone="blue">#工业互联网</Tag>
          <Tag>+ 添加标签</Tag>
        </div>
        <button className="w-full px-4 py-2 bg-brand-blue-600 text-white rounded-lg text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> 生成选题建议
        </button>
      </div>
    </Card>
    <Card title="思路卡片" className="col-span-1">
      <div className="space-y-2">
        {[
          '基于 SDP 的 OT 侧访问控制最小集',
          '面向 PLC 协议的持续身份校验',
          '轻量级零信任网关在中小制造业的部署',
          '资产发现与微隔离的分阶段路径',
        ].map((x, i) => (
          <div key={x} className="p-3 border border-slate-200 rounded-lg hover:border-brand-blue-400 cursor-pointer">
            <p className="text-xs text-slate-400">思路 {i + 1}</p>
            <p className="text-sm text-slate-800 mt-1">{x}</p>
          </div>
        ))}
      </div>
    </Card>
    <Card title="生成结果" className="col-span-1">
      <div className="space-y-3">
        <div className="p-3 bg-brand-blue-50 border border-brand-blue-100 rounded-lg">
          <p className="text-xs text-brand-blue-700">推荐选题 · 匹配度 92%</p>
          <p className="text-sm font-medium text-slate-900 mt-1">
            面向中小制造企业的轻量级零信任接入网关设计与评估
          </p>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            以 SDP + 微隔离为核心，解决 OT/IT 融合场景下的最小权限与可持续身份校验问题。
          </p>
        </div>
        <div className="flex gap-2">
          <Tag tone="green">可做性高</Tag>
          <Tag tone="amber">数据中等</Tag>
          <Tag tone="blue">对标赛道清晰</Tag>
        </div>
        <button className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
          转为计划书 →
        </button>
      </div>
    </Card>
  </div>
);

const CardPool = () => (
  <div className="grid grid-cols-3 gap-4">
    {[
      { t: 'AI 模型对抗检测', d: '12 张思路 · 3 张对标' },
      { t: '数据要素合规落地', d: '8 张思路' },
      { t: '供应链攻击检测', d: '10 张思路' },
      { t: '物联网固件漏洞挖掘', d: '6 张思路' },
      { t: '隐私计算工程化', d: '15 张思路 · 1 张计划书' },
      { t: '企业安全运营度量', d: '7 张思路' },
    ].map((c) => (
      <Card key={c.t}>
        <div className="flex items-start gap-3">
          <Layers className="w-4 h-4 text-brand-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-900">{c.t}</p>
            <p className="text-xs text-slate-500 mt-1">{c.d}</p>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const Canvas = () => (
  <Card title="创意画布 · 零信任落地">
    <div className="grid grid-cols-3 gap-3">
      {[
        { t: '问题定义', c: '中小制造企业 OT/IT 融合后权限混乱，缺少可持续身份校验。' },
        { t: '目标用户', c: '中小型制造业安全与信息化负责人。' },
        { t: '核心方法', c: 'SDP + 微隔离 + 轻量身份代理。' },
        { t: '关键创新', c: '面向低算力边缘的高频身份校验优化。' },
        { t: '评估指标', c: '误拒率、延迟增量、部署成本、策略一致性。' },
        { t: '风险挑战', c: '真实数据获取困难、协议异构。' },
      ].map((b) => (
        <div key={b.t} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-blue-600" />
            <p className="text-sm font-medium text-slate-900">{b.t}</p>
          </div>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">{b.c}</p>
        </div>
      ))}
    </div>
  </Card>
);

const Module = () => (
  <div className="grid grid-cols-4 gap-4">
    {[
      { t: '摘要生成', d: '一键提炼 300 字' },
      { t: '研究背景', d: '自动关联政策与文献' },
      { t: '方法章节', d: '结构化填充' },
      { t: '实验设计', d: '指标与基线推荐' },
      { t: '结果分析', d: '图表文字生成' },
      { t: '参考文献', d: 'BibTeX 与规范化' },
      { t: '创新点提炼', d: '3-5 条凝练' },
      { t: '答辩稿生成', d: '面向评委' },
    ].map((m) => (
      <Card key={m.t}>
        <div className="flex items-center gap-2">
          <Blocks className="w-4 h-4 text-brand-blue-600" />
          <p className="text-sm font-medium text-slate-900">{m.t}</p>
        </div>
        <p className="text-xs text-slate-500 mt-2">{m.d}</p>
      </Card>
    ))}
  </div>
);

const Proposal = () => (
  <div className="grid grid-cols-3 gap-4">
    <Card title="计划书模板" className="col-span-1">
      <ul className="space-y-2">
        {['挑战杯学术作品', '国自然青年项目', '教育部产学合作', '省级大创项目'].map((t) => (
          <li key={t} className="flex items-center justify-between p-2.5 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-800">{t}</span>
            </div>
            <button className="text-xs text-brand-blue-600">使用</button>
          </li>
        ))}
      </ul>
    </Card>
    <Card title="章节大纲 · 挑战杯" className="col-span-2">
      <ol className="space-y-2 text-sm text-slate-700">
        {[
          '1. 作品背景与意义',
          '2. 国内外研究现状',
          '3. 关键科学问题',
          '4. 技术路线与创新点',
          '5. 研究计划与进度安排',
          '6. 预期成果与应用前景',
          '7. 经费预算与参考文献',
        ].map((c) => (
          <li key={c} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
            <span>{c}</span>
            <Tag tone="blue">AI 填充</Tag>
          </li>
        ))}
      </ol>
    </Card>
  </div>
);

const Editor = () => (
  <Card>
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 border-r border-slate-100 pr-4 space-y-2">
        <p className="text-xs text-slate-500 mb-2">章节</p>
        {['摘要', '1. 背景', '2. 现状', '3. 方法', '4. 实验', '5. 结论'].map((s, i) => (
          <div
            key={s}
            className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${
              i === 2 ? 'bg-brand-blue-50 text-brand-blue-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="col-span-3 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Edit3 className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-800">2. 国内外研究现状</span>
          <Tag tone="green">已保存</Tag>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          近年来，随着工业互联网的加速渗透，零信任架构成为应对 OT/IT 融合场景下访问控制挑战的代表性思路……
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          国外以 Google BeyondCorp、NIST SP 800-207 为代表，提出了以身份为中心的持续校验模型……
        </p>
      </div>
    </div>
  </Card>
);

const PPT = () => (
  <Card title="PPT 大纲 · 挑战杯答辩">
    <ol className="space-y-2">
      {[
        { t: '封面 · 作品名称与团队', n: 'P1' },
        { t: '研究背景与意义', n: 'P2' },
        { t: '国内外现状 · 差距分析', n: 'P3-4' },
        { t: '关键科学问题', n: 'P5' },
        { t: '技术路线与系统架构', n: 'P6-8' },
        { t: '实验结果与对比', n: 'P9-11' },
        { t: '创新点总结', n: 'P12' },
        { t: '应用前景与致谢', n: 'P13-14' },
      ].map((s) => (
        <li key={s.t} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Presentation className="w-4 h-4 text-brand-blue-600" />
            <span className="text-sm text-slate-800">{s.t}</span>
          </div>
          <Tag>{s.n}</Tag>
        </li>
      ))}
    </ol>
  </Card>
);

const Cite = () => (
  <Card title="引用证据">
    <ul className="divide-y divide-slate-100">
      {[
        { t: '[1] Zero Trust Architecture (NIST SP 800-207)', s: '标准 · 2020' },
        { t: '[2] BeyondCorp: A New Approach to Enterprise Security', s: 'USENIX · 2014' },
        { t: '[3] Securing Industrial Control Systems: A Systematic Review', s: 'Comput. & Security · 2023' },
        { t: '[4] 零信任网络安全标准研究（GB/T）', s: '国标 · 2024' },
      ].map((r) => (
        <li key={r.t} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Quote className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-sm text-slate-800">{r.t}</p>
              <p className="text-xs text-slate-500">{r.s}</p>
            </div>
          </div>
          <Tag tone="green">已引用</Tag>
        </li>
      ))}
    </ul>
  </Card>
);

export function Writing() {
  return (
    <PageShell
      title="选题写作"
      subtitle="从选题推演到计划书、PPT 与引用 · 写作主线一站式"
      actions={
        <button className="px-3 py-1.5 text-sm bg-brand-blue-600 text-white rounded-lg flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" /> 快速生成
        </button>
      }
      tabs={[
        { key: 'deduce', label: '选题推演', description: '基于你的研究兴趣与背景，多维推演潜在选题方向并生成思路卡片', render: Deduce },
        { key: 'cards', label: '选题卡池', description: '候选选题的结构化卡片池，支持收藏、标注与多维度对比筛选', render: CardPool },
        { key: 'canvas', label: '创意画布', description: '以思维导图方式展开选题结构，自由布局论文框架与核心论点', render: Canvas },
        { key: 'module', label: '写作模块', description: '计划书、论文各章节的写作模块与 AI 辅助填充模板库', render: Module },
        { key: 'proposal', label: '计划书生成', description: '选择模板后一键生成完整计划书初稿，支持自定义章节结构', render: Proposal },
        { key: 'editor', label: '文档编辑', description: '在线协同文档编辑器，支持 AI 辅助润色、批注与版本管理', render: Editor },
        { key: 'ppt', label: 'PPT大纲', description: '根据论文内容自动生成 PPT 大纲与各章节演讲要点建议', render: PPT },
        { key: 'cite', label: '引用证据', description: '智能引用管理，从证据库一键插入标准格式引用，支持多种引用规范', render: Cite },
      ]}
    />
  );
}