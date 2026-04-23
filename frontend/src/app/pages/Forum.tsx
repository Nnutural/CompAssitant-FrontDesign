import { MessageSquare, Users, Megaphone, Repeat, HelpCircle, Share2 } from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

const PostList = ({ posts }: { posts: { t: string; a: string; r: number; v: number; tags: string[] }[] }) => (
  <Card>
    <ul className="divide-y divide-slate-100">
      {posts.map((p) => (
        <li key={p.t} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0 text-xs text-slate-600">
            {p.a[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">{p.t}</p>
            <div className="flex items-center gap-2 mt-1">
              {p.tags.map((t) => (
                <Tag key={t} tone="blue">
                  {t}
                </Tag>
              ))}
              <span className="text-xs text-slate-400">@{p.a}</span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 shrink-0">
            <p>{p.r} 回复</p>
            <p className="mt-0.5">{p.v} 浏览</p>
          </div>
        </li>
      ))}
    </ul>
  </Card>
);

export function Forum() {
  return (
    <PageShell
      title="交流论坛"
      subtitle="专业社区 · 话题、组队、经验、问答与资源交换"
      actions={<button className="px-3 py-1.5 text-sm bg-brand-blue-600 text-white rounded-lg">发布帖子</button>}
      tabs={[
        {
          key: 'security',
          label: '安全论坛',
          description: '网络安全技术深度讨论区，包含漏洞分析、工具实战与学术前沿话题',
          render: () => (
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <PostList
                  posts={[
                    { t: '关于 LLM 越狱攻击的综合性防御思路', a: '张同学', r: 32, v: 1204, tags: ['AI 安全', '讨论'] },
                    { t: '分享：我是如何准备蓝帽杯并拿到奖项的', a: '林同学', r: 18, v: 876, tags: ['竞赛', '经验'] },
                    { t: '内网渗透中 BloodHound 的高级用法', a: 'Kai', r: 41, v: 2301, tags: ['红队', '技术'] },
                    { t: '求推荐零信任方向的入门书', a: '小安', r: 12, v: 233, tags: ['入门', '求助'] },
                  ]}
                />
              </div>
              <div className="col-span-1 space-y-4">
                <Card title="热门板块">
                  <ul className="space-y-2 text-sm">
                    {['#AI 安全', '#红蓝对抗', '#竞赛交流', '#面试面经', '#开源工具'].map((x) => (
                      <li key={x} className="text-slate-700 hover:text-brand-blue-600 cursor-pointer">
                        {x}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card title="活跃用户">
                  <ul className="space-y-2 text-sm">
                    {['Kai · 230 帖', '安枢小编 · 198 帖', 'V3n0M · 176 帖', '林同学 · 120 帖'].map((x) => (
                      <li key={x} className="flex items-center gap-2 text-slate-700">
                        <div className="w-6 h-6 bg-slate-100 rounded-full" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          ),
        },
        {
          key: 'topic',
          label: '话题讨论',
          description: '围绕行业趋势与学术热点发起讨论，参与观点碰撞与思维交流',
          render: () => (
            <div className="grid grid-cols-3 gap-4">
              {[
                { t: '#后量子密码迁移应该几年内启动', c: 128 },
                { t: '#大模型越狱的伦理边界', c: 89 },
                { t: '#国产化替代下的零信任实践', c: 76 },
                { t: '#校招红队岗门槛是否变高', c: 65 },
                { t: '#数据要素合规是"真需求"吗', c: 54 },
                { t: '#挑战杯网安类作品评分趋势', c: 42 },
              ].map((x) => (
                <Card key={x.t}>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-brand-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{x.t}</p>
                      <p className="text-xs text-slate-500 mt-1">{x.c} 条讨论</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ),
        },
        {
          key: 'team',
          label: '项目组队',
          description: '发布与浏览竞赛/科研组队需求，快速匹配志同道合的队友',
          render: () => (
            <div className="grid grid-cols-2 gap-4">
              {[
                { t: '【挑战杯】组队：缺 1 名后端 + 1 名算法', s: '方向：零信任工业互联网 · 剩 1 名名额' },
                { t: '【信安赛】组队：覆盖 Web / Pwn / Misc', s: '学校：西电 · 已 3 人' },
                { t: '【开源项目】AI 安全评估工具协作者', s: '需要有 PyTorch 基础' },
                { t: '【大创】基于隐私计算的医疗数据方案', s: '需要医学交叉背景' },
              ].map((x) => (
                <Card key={x.t}>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-brand-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{x.t}</p>
                      <p className="text-xs text-slate-500 mt-1">{x.s}</p>
                    </div>
                    <button className="text-xs px-2.5 py-1 bg-brand-blue-50 text-brand-blue-600 rounded-md">
                      申请加入
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ),
        },
        {
          key: 'exp',
          label: '经验分享',
          description: '学长学姐的参赛经历、保研路径与就业经验结构化分享',
          render: () => (
            <PostList
              posts={[
                { t: '从零到进头部安服商：我的 2 年学习路径', a: 'Amy', r: 57, v: 3211, tags: ['经验', '就业'] },
                { t: '护网行动蓝队值守的真实复盘', a: '张工', r: 33, v: 1980, tags: ['护网', '实战'] },
                { t: '科研小白写第一篇论文的流程复盘', a: '小李', r: 48, v: 2400, tags: ['科研'] },
              ]}
            />
          ),
        },
        {
          key: 'qa',
          label: '问答互助',
          description: '技术疑难问题互助社区，提问、解答与知识沉淀一体化',
          render: () => (
            <Card>
              <ul className="divide-y divide-slate-100">
                {[
                  { q: '学了 Web 之后是选 Pwn 还是逆向？', a: 3, s: '待解决' },
                  { q: '怎样复现 Log4Shell 比较稳？', a: 7, s: '已解决' },
                  { q: '校招安全开发面试要补什么？', a: 12, s: '已解决' },
                  { q: '论文降重有没有靠谱工具？', a: 2, s: '待解决' },
                ].map((x) => (
                  <li key={x.q} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <p className="text-sm text-slate-800">{x.q}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{x.a} 回答</span>
                      <Tag tone={x.s === '已解决' ? 'green' : 'amber'}>{x.s}</Tag>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
        {
          key: 'notice',
          label: '活动公告',
          description: '平台官方活动、合作讲座与线上线下交流活动的公告发布',
          render: () => (
            <Card>
              <ul className="space-y-3">
                {[
                  { t: '【官方】4 月论坛之星评选结果公示', d: '2026-04-20' },
                  { t: '【合作】安全研究院公开课：零信任实战', d: '2026-04-28' },
                  { t: '【赛事】强网杯青少年专项赛报名启动', d: '2026-05-01' },
                ].map((x) => (
                  <li key={x.t} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Megaphone className="w-4 h-4 text-amber-500" />
                      <p className="text-sm text-slate-800">{x.t}</p>
                    </div>
                    <span className="text-xs text-slate-500">{x.d}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
        {
          key: 'exchange',
          label: '资源交换',
          description: '学习资料、工具授权与数据集的互换共享，以物易物促进开放生态',
          render: () => (
            <div className="grid grid-cols-3 gap-4">
              {[
                { t: '交换：零信任白皮书合集', s: '求：工业互联网标准汇编' },
                { t: '求：大学生信安赛真题合集', s: '可提供：CTF 题解 Wiki' },
                { t: '提供：学习路线图（Web 方向）', s: '换：PWN 方向资料' },
                { t: '求：护网真题与经验合集', s: '可提供：内网渗透笔记' },
                { t: '提供：AI 安全论文复现集', s: '换：GPU 算力时段' },
                { t: '求：研一科研入门书单', s: '提供：导师推荐逻辑' },
              ].map((x) => (
                <Card key={x.t}>
                  <div className="flex items-start gap-3">
                    <Repeat className="w-4 h-4 text-brand-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{x.t}</p>
                      <p className="text-xs text-slate-500 mt-1">{x.s}</p>
                      <button className="text-xs text-brand-blue-600 mt-2 flex items-center gap-1">
                        <Share2 className="w-3 h-3" /> 发起交换
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}