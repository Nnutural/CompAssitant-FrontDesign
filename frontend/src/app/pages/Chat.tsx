import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, Send, User, Lightbulb, FlaskConical, Trophy, ShieldCheck, Flame, PenLine, Compass } from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

type Message = { role: 'user' | 'assistant'; content: string };

const agentsMap: Record<string, {
  icon: any;
  name: string;
  desc: string;
  q: string[];
  messages: Message[];
}> = {
  topic: {
    icon: Lightbulb,
    name: '选题指导',
    desc: '结合你的背景与热点，推荐合适的研究/竞赛选题',
    q: ['我想做 AI 安全相关选题，有哪些合适方向？', '我有嵌入式基础，能做什么选题？'],
    messages: [
      { role: 'user', content: '我想做 AI 安全相关选题，有哪些合适方向？' },
      {
        role: 'assistant',
        content:
          '基于当前 AI 安全热点与你的专业背景，我推荐三个候选方向：\n\n① **大模型提示注入检测** — 可结合 GPT-4/Claude 等模型构造攻击样本，工程量适中，创新点明确；\n② **工业互联网零信任网关** — 政策契合度高，适合挑战杯"科技创新"类赛道；\n③ **面向中小企业的合规自动化工具** — 市场痛点真实，可快速落地原型。\n\n你当前有哪方面的数据资源或实验基础？可以帮你进一步细化方向。',
      },
      { role: 'user', content: '方向①听起来不错，数据集从哪里获取？' },
      {
        role: 'assistant',
        content:
          '大模型提示注入方向的常用数据集与资源：\n\n• **AdvBench**（Zou et al., 2023）— 500 条有害指令基准，已被广泛引用；\n• **JailbreakBench** — 包含 100 条越狱提示，附评估框架；\n• **自建数据集**：可用 GPT-4 生成对抗样本，再人工标注；成本低、创新度高。\n\n建议先在 HuggingFace 搜索 "jailbreak" 过滤近 6 个月更新的数据集，我可以帮你筛选与比较。',
      },
    ],
  },
  research: {
    icon: FlaskConical,
    name: '科研咨询',
    desc: '论文检索、方法建议、实验设计与结果分析',
    q: ['零信任方向近 3 年 CCF-A 论文有哪些？', '联邦学习隐私评估常用指标？'],
    messages: [
      { role: 'user', content: '零信任方向近 3 年 CCF-A 论文有哪些？' },
      {
        role: 'assistant',
        content:
          '以下是零信任方向近 3 年（2022–2024）CCF-A 收录的代表性论文：\n\n| 年份 | 标题 | 会议/期刊 |\n|------|------|-----------|\n| 2024 | *ZTAuth: Continuous Auth for Zero-Trust IoT* | IEEE S&P |\n| 2023 | *MicroTrust: Micro-segmentation with ML* | USENIX Security |\n| 2022 | *ZeroVerify: Formal Verification of ZTA Policies* | CCS |\n\n是否需要我进一步提供这些论文的摘要、方法对比或引用建议？',
      },
      { role: 'user', content: '帮我对比一下这三篇的核心方法' },
      {
        role: 'assistant',
        content:
          '三篇论文核心方法对比：\n\n**ZTAuth** — 持续认证框架，基于行为特征建模（LSTM），侧重 IoT 场景下的实体可信度动态评估，假设最小化信任半径。\n\n**MicroTrust** — 网络微分段 + 强化学习策略优化，重点解决东西向流量的细粒度访问控制，实验基于 K8s 集群。\n\n**ZeroVerify** — 形式化验证路线，用 TLA+ 对 ZTA 策略做可达性分析，适合高安全等级合规场景，但工程落地难度大。\n\n若你的课题偏工程实现，MicroTrust 路线参考价值更高；若偏理论创新，ZeroVerify 的形式化方向较为独特。',
      },
    ],
  },
  contest: {
    icon: Trophy,
    name: '竞赛咨询',
    desc: '赛事选择、时间规划、作品策略',
    q: ['挑战杯学术作品的加分项有哪些？', '大学生信安赛偏好什么作品？'],
    messages: [
      { role: 'user', content: '挑战杯学术作品的加分项有哪些？' },
      {
        role: 'assistant',
        content:
          '挑战杯"学术科技作品"赛道的核心加分项，综合近五届获奖规律：\n\n🏆 **强加分项**\n• 已有 SCI/EI 期刊发表或录用（尤其中科院 Q1/Q2）\n• 国家级基金项目背书（国自然青年/面上）\n• 软著 + 专利组合（实用新型 + 发明至少各 1）\n\n📊 **中加分项**\n• 可运行的系统原型并附真实数据验证\n• 与政府/企业合作落地案例\n• 选题契合当年"重大专项"政策\n\n⚠️ **常见扣分项**\n• 可行性分析空泛，缺乏量化指标\n• 团队分工描述不明，贡献度模糊\n\n你目前的作品处于哪个阶段？我可以帮你做针对性优化建议。',
      },
      { role: 'user', content: '我们已经有初步系统，下个月初赛，怎么备战？' },
      {
        role: 'assistant',
        content:
          '距初赛一个月的冲刺节奏建议（按周拆解）：\n\n**第 1 周 — 材料对齐**\n整理研究报告框架，确保"问题—方法—实验—意义"四段闭环完整，技术原理图需达到自解释级别。\n\n**第 2 周 — 数据打磨**\n补充对照实验（至少 2 个 Baseline），补实验数据图表，所有指标标注置信区间。\n\n**第 3 周 — PPT + 答辩稿**\n制作 12 页内精简 PPT，重点打磨"创新点"和"应用价值"两页；写答辩稿并进行 2 次以上模拟答辩。\n\n**第 4 周 — 压测 + 提交**\n查重（知网 < 20%）、格式审核、系统演示 Demo 录屏备份。\n\n我可以帮你逐项检查或生成答辩稿模板，需要哪部分先开始？',
      },
    ],
  },
  policy: {
    icon: ShieldCheck,
    name: '政策解读',
    desc: '对法规、国标、专项的权威解读',
    q: ['数据安全法对高校科研数据的影响？', '关基运营者的主要义务有哪些？'],
    messages: [
      { role: 'user', content: '数据安全法对高校科研数据的影响？' },
      {
        role: 'assistant',
        content:
          '《数据安全法》（2021）对高校科研数据的主要影响集中在以下三个维度：\n\n**① 分类分级义务**\n高校需对科研数据进行分类（如基础科学数据、人类遗传资源数据等）并按重要性分级，重要数据须报主管部门备案。\n\n**② 跨境传输限制**\n涉及国家核心数据或重要数据的成果，向境外合作机构共享前须经安全评估，影响国际合作项目流程。\n\n**③ 数据处理合规**\n论文实验中使用个人信息（如问卷数据）须遵循"最小必要原则"，并在研究方案中明确数据销毁机制。\n\n建议参照教育部《高校数据安全管理办法（试行）》配套执行。需要具体条文原文或合规检查清单吗？',
      },
      { role: 'user', content: '需要合规检查清单，帮我列出' },
      {
        role: 'assistant',
        content:
          '**高校科研项目数据安全合规自检清单**\n\n□ 已对项目涉及数据进行分类分级，并形成书面台账\n□ 重要数据已向学校信息安全办公室备案\n□ 跨境数据传输已申请安全评估（如适用）\n□ 个人信息收集已取得明确知情同意，采集范围不超最小必要\n□ 数据存储在合规服务器（境内 ICP 备案平台或学校私有云）\n□ 项目结束后有书面数据销毁/归档记录\n□ 与企业/机构合作时已签署数据处理协议（DPA）\n□ 软件系统已完成代码安全扫描（SAST），无高危漏洞\n\n以上 8 项如有未达标项，建议优先处理带 ⭐ 标记的前 4 项（违规风险最高）。',
      },
    ],
  },
  hot: {
    icon: Flame,
    name: '热点研判',
    desc: '对舆情、攻击事件、产业动态做结构化分析',
    q: ['最近供应链攻击的典型模式？', '某高校数据泄露事件影响面如何？'],
    messages: [
      { role: 'user', content: '最近供应链攻击的典型模式？' },
      {
        role: 'assistant',
        content:
          '2024 年供应链攻击的主流模式（基于 CISA/ENISA 报告）：\n\n**① 开源包投毒（Typosquatting）**\n攻击者在 npm/PyPI 注册与流行包名高度相似的恶意包，植入窃密代码。近期案例：`request` → `requestss`，下载量过万后才被下架。\n\n**② CI/CD 管道劫持**\nGitHub Actions / Jenkins 中的 secrets 泄露，或通过 workflow 注入恶意构建步骤。XZ Utils 后门事件是典型代表。\n\n**③ 第三方 SDK 水坑**\n针对广泛集成的分析/广告 SDK 植入后门，一次入侵可影响数千 App 用户。\n\n**④ 硬件固件篡改**\n针对 ODM 厂商的固件签名绕过，多见于工控和路由器供应链。\n\n是否需要我进一步拆解某一模式的 TTP（战术、技术、程序）？',
      },
      { role: 'user', content: '帮我分析 XZ Utils 后门事件的完整攻击链' },
      {
        role: 'assistant',
        content:
          '**XZ Utils 后门事件攻击链（CVE-2024-3094）结构化分析**\n\n**阶段 1 — 长期渗透（18 个月）**\n攻击者以"Jia Tan"化名持续向 XZ Utils 贡献代码，建立社区信任，最终获得合并权限。\n\n**阶段 2 — 后门植入**\n在 5.6.0/5.6.1 版本的构建脚本中注入混淆代码，仅在特定构建环境（systemd + glibc）下激活，规避常规测试。\n\n**阶段 3 — 劫持 sshd**\n后门通过 liblzma hook 篡改 OpenSSH 的 RSA 公钥验证逻辑，攻击者可用特定私钥实现无授权 RCE。\n\n**阶段 4 — 发现与响应**\n Andres Freund 因登录延迟异常排查，发现 CPU 异常占用并溯源至后门，事件在进入 Debian/Fedora 稳定版前及时披露。\n\n**教训**：开源信任链需引入代码签名 + 构建可重现性验证（Reproducible Builds）。',
      },
    ],
  },
  writing: {
    icon: PenLine,
    name: '写作辅导',
    desc: '提供章节打磨、创新点提炼、答辩稿建议',
    q: ['帮我润色研究背景段', '如何提炼 3 条创新点？'],
    messages: [
      { role: 'user', content: '如何提炼 3 条创新点？我的论文是关于联邦学习隐私保护的' },
      {
        role: 'assistant',
        content:
          '提炼创新点的核心原则是"有别于现有工作 + 量化优势"，以联邦学习隐私保护为例：\n\n**常见角度框架**\n\n① **方法层创新** — 提出了新算法/模型结构\n示例写法：*"提出了基于自适应差分隐私预算分配的 AdpFed 算法，相较固定预算方案在 MNIST 上准确率提升 4.2%，隐私损失 ε 降低 31%。"*\n\n② **场景层创新** — 在新场景下应用已有方法并解决特有挑战\n示例写法：*"首次将垂直联邦学习引入医疗影像多中心联合诊断场景，设计了兼容 DICOM 标准的隐私梯度通信协议。"*\n\n③ **工程/系统层创新** — 系统设计、效率或可部署性\n示例写法：*"实现了支持万级参与方的轻量化聚合框架，单轮通信开销相较 FedAvg 减少 68%，已在实际边缘设备（树莓派 4B）完成验证。"*\n\n建议你把自己的方法用一句话描述给我，我来帮你套用上述框架优化表述。',
      },
      { role: 'user', content: '帮我润色这段：本文提出了一个方法，能保护隐私，效果还不错' },
      {
        role: 'assistant',
        content:
          '原句问题：信息量稀疏、缺乏量化、动词虚化（"还不错"）。\n\n**润色版本（学术风格）：**\n\n> 本文提出了一种基于自适应差分隐私的联邦学习框架（AdpFed），通过动态调整每轮噪声注入强度，在有效保障参与方数据隐私的同时，显著降低了模型精度损失。在 CIFAR-10 和 FEMNIST 基准数据集上的实验结果表明，AdpFed 在隐私预算 ε=1.0 的约束条件下，全局模型准确率较基线方法 FedAvg+DP 提升 3.8 个百分点，通信轮次减少 22%。\n\n**修改要点说明：**\n- 给方法命名（AdpFed），提升可引用性\n- 将"保护隐私"具体化为"动态噪声注入"\n- "还不错"替换为具体数字指标\n- 补充实验设置（数据集、对比基线）',
      },
    ],
  },
  path: {
    icon: Compass,
    name: '路径建议',
    desc: '结合当前画像推荐能力建设与成长路径',
    q: ['我想进红队，未来 1 年怎么学？', '偏科研 or 工业界，如何选？'],
    messages: [
      { role: 'user', content: '我想进红队，未来 1 年怎么学？' },
      {
        role: 'assistant',
        content:
          '面向红队方向的 12 个月成长路线图：\n\n**Q1（第 1–3 月）— 打地基**\n• 精读《黑客攻防技术宝典：Web 实战篇》+ PortSwigger Web Security Academy 全部 Labs\n• 掌握：SQL 注入、XSS、SSRF、XXE、反序列化 5 大漏洞利用\n• 工具：Burp Suite Pro 熟练使用\n\n**Q2（第 4–6 月）— 主机与内网**\n• 完成 TryHackMe "Advanced Exploitation" 路径\n• 学习 Cobalt Strike / Sliver C2 基础操作\n• 实践：HTB 中等难度机器 ×10\n\n**Q3（第 7–9 月）— 红队专项**\n• AD 域攻击链：Kerberoasting → DCSync → 票据伪造\n• 免杀入门：PE 特征修改、shellcode 加密\n• 参加 DASCTF / 长城杯 至少 1 场\n\n**Q4（第 10–12 月）— 实战输出**\n• 撰写 3 篇质量漏洞分析博客（投 freebuf/先知）\n• 参与 SRC 漏洞提交，争取中危以上 ×3\n• 整理 GitHub 项目集，准备简历与实习投递\n\n你目前处于哪个阶段？我可以帮你调整细节。',
      },
      { role: 'user', content: '偏科研 or 工业界，如何选？' },
      {
        role: 'assistant',
        content:
          '这是个高频问题，给你一个结构化的决策框架：\n\n**选科研路线，如果你…**\n✅ 对底层机制和"为什么"有持续好奇心\n✅ 能接受 3–5 年延迟回报（博士/博后）\n✅ 目标是高校教职或顶级实验室研究员\n✅ 有导师资源且方向有发论文的土壤\n\n**选工业界路线，如果你…**\n✅ 更享受"做出能用的东西"的成就感\n✅ 希望 3 年内获得可观薪资和明确晋升通道\n✅ 偏好团队协作与产品落地而非独立研究\n✅ 目标公司（头部安全厂商/大厂安全部）招聘需求旺盛\n\n**折中路线（适合大多数人）**\n读硕期间发 1–2 篇 CCF-B 以上论文，同时在安全公司实习，毕业后工业界起薪高且保留转科研通道。\n\n你现在大几？有没有意向的具体公司或导师方向？',
      },
    ],
  },
};

const markdownComponents: Components = {
  p: ({ children }) => <p className="my-1 first:mt-0 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="mt-3 mb-2 text-lg font-semibold text-slate-950 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-3 mb-2 text-base font-semibold text-slate-950 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-2 mb-1 text-sm font-semibold text-slate-950 first:mt-0">{children}</h3>,
  ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
  em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-[#003399]/40 pl-3 text-slate-600">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-[#003399] underline underline-offset-2">
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const value = String(children);
    const isBlock = Boolean(className) || value.includes('\n');

    return (
      <code
        className={
          isBlock
            ? 'block overflow-x-auto rounded-md bg-slate-900 px-3 py-2 text-xs leading-relaxed text-slate-100'
            : 'rounded bg-slate-200/70 px-1.5 py-0.5 text-[0.85em] text-slate-900'
        }
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-md bg-slate-900 p-0">{children}</pre>,
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-md border border-slate-200">
      <table className="min-w-full border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-100 text-slate-700">{children}</thead>,
  th: ({ children }) => <th className="border-b border-slate-200 px-3 py-2 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-t border-slate-100 px-3 py-2 align-top">{children}</td>,
};

function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents} skipHtml>
      {content}
    </ReactMarkdown>
  );
}

function ChatView({ agentKey }: { agentKey: string }) {
  const agent = agentsMap[agentKey] || agentsMap['topic'];
  const [, setParams] = useSearchParams();
  const [inputValue, setInputValue] = useState('');

  const handleAgentSwitch = (key: string) => {
    setParams({ tab: key });
  };

  const handleQuickQuestion = (q: string) => {
    setInputValue(q);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 space-y-4">
        <Card title="智能体切换">
          <ul className="space-y-1">
            {Object.entries(agentsMap).map(([k, a]) => (
              <li
                key={k}
                onClick={() => handleAgentSwitch(k)}
                className={`flex items-center gap-2 p-2 rounded-lg text-sm cursor-pointer transition-colors ${
                  k === agentKey
                    ? 'bg-[#003399]/10 text-[#003399]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <a.icon className={`w-4 h-4 shrink-0 ${k === agentKey ? 'text-[#003399]' : 'text-slate-400'}`} />
                <span>{a.name}</span>
                {k === agentKey && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#003399]" />
                )}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="推荐问题">
          <ul className="space-y-2">
            {agent.q.map((q) => (
              <li
                key={q}
                onClick={() => handleQuickQuestion(q)}
                className="text-xs text-slate-700 p-2 border border-slate-200 rounded-lg hover:border-[#003399]/40 hover:bg-[#003399]/5 cursor-pointer transition-colors"
              >
                {q}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="col-span-3 flex flex-col h-[640px]">
        <Card className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100 -mt-1">
            <div className="w-9 h-9 bg-[#003399] text-white rounded-lg flex items-center justify-center shrink-0">
              <agent.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
              <p className="text-xs text-slate-500">{agent.desc}</p>
            </div>
            <Tag tone="green">在线</Tag>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {agent.messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-[#003399]/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-[#003399]" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-lg text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#003399] text-white'
                      : 'bg-slate-50 text-slate-800 border border-slate-100'
                  }`}
                >
                  {m.role === 'assistant' ? <MarkdownMessage content={m.content} /> : m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
            <input
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003399] focus:border-transparent"
              placeholder={`向${agent.name}提问...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="px-4 py-2 bg-[#003399] text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-[#002266] transition-colors">
              <Send className="w-3.5 h-3.5" /> 发送
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function Chat() {
  return (
    <PageShell
      title="智能问答"
      subtitle="面向科研、竞赛、政策、写作的多智能体统一对话入口"
      tabs={Object.entries(agentsMap).map(([k, a]) => ({
        key: k,
        label: a.name,
        description: a.desc,
        render: () => <ChatView agentKey={k} />,
      }))}
    />
  );
}
