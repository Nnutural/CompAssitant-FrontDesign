import { Banknote, Newspaper, Sparkles, FileText, Award, FlaskConical, GitCompare } from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

const ItemCard = ({
  icon: Icon,
  title,
  meta,
  desc,
  tags,
}: {
  icon: any;
  title: string;
  meta: string;
  desc: string;
  tags: { t: string; tone?: any }[];
}) => (
  <Card>
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 bg-brand-blue-50 text-brand-blue-600 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{meta}</p>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{desc}</p>
        <div className="flex gap-1.5 mt-3">
          {tags.map((g) => (
            <Tag key={g.t} tone={g.tone}>
              {g.t}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export function Research() {
  return (
    <PageShell
      title="科研创新"
      subtitle="基金、动态、文章、专利 · 聚合科研资源与机会发现"
      actions={
        <div className="flex gap-2">
          <select className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white">
            <option>全部方向</option>
            <option>AI 安全</option>
            <option>零信任</option>
            <option>工控安全</option>
          </select>
          <button className="px-3 py-1.5 text-sm bg-brand-blue-600 text-white rounded-lg">对比收藏</button>
        </div>
      }
      tabs={[
        {
          key: 'fund',
          label: '基金项目',
          description: '国家自然科学基金、省部级课题等科研立项信息，按匹配度与截止日期聚合',
          render: () => (
            <div className="grid grid-cols-2 gap-4">
              <ItemCard
                icon={Banknote}
                title="国家自然科学基金青年项目 · F0207"
                meta="截止 2026-06-15 · 面上 30 万"
                desc="面向网络空间安全新兴方向，支持面向大模型安全、数据要素安全、关基保护等选题。"
                tags={[{ t: '国家级' }, { t: '青年项目', tone: 'blue' }]}
              />
              <ItemCard
                icon={Banknote}
                title="教育部产学合作协同育人"
                meta="截止 2026-05-30 · 2-5 万"
                desc="支持网安实验教学、实训平台建设、教学内容与课程体系改革等方向。"
                tags={[{ t: '部级' }, { t: '产学合作', tone: 'purple' }]}
              />
              <ItemCard
                icon={Banknote}
                title="省级重点研发计划 · 网络安全专项"
                meta="截止 2026-07-01 · 50-100 万"
                desc="聚焦关键信息基础设施安全、数据跨境安全、智能终端安全。"
                tags={[{ t: '省级' }, { t: '重点', tone: 'amber' }]}
              />
              <ItemCard
                icon={Banknote}
                title="CCF-华为胡杨林基金 · 网络安全专项"
                meta="滚动申报"
                desc="支持青年学者开展前沿探索性研究，单项资助 5-15 万。"
                tags={[{ t: '企业' }, { t: '滚动', tone: 'green' }]}
              />
            </div>
          ),
        },
        {
          key: 'news',
          label: '科研动态',
          description: '网络安全领域顶会录用动态、机构前沿资讯与学术组织要闻',
          render: () => (
            <Card>
              <ul className="divide-y divide-slate-100">
                {[
                  { t: 'USENIX Security 2026 录用论文列表公布', s: '学术会议 · 共 320 篇' },
                  { t: '中国网络空间安全协会发布技术路线图', s: '行业组织' },
                  { t: '清华大学网研院成立 AI 安全中心', s: '机构动态' },
                  { t: 'IEEE S&P 2026 最佳论文奖揭晓', s: '奖项' },
                ].map((x) => (
                  <li key={x.t} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Newspaper className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-800">{x.t}</p>
                        <p className="text-xs text-slate-500">{x.s}</p>
                      </div>
                    </div>
                    <Tag tone="blue">最新</Tag>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
        {
          key: 'innovation',
          label: '学术创新',
          description: '近期高被引创新方法与算法突破方向速览，识别论文价值高地',
          render: () => (
            <div className="grid grid-cols-3 gap-4">
              {[
                { t: '大模型对齐安全', d: '本季度相关论文 +38%' },
                { t: '后量子密码', d: 'NIST 标准化进入尾声' },
                { t: '可解释 AI 安全检测', d: '高被引方向' },
                { t: '数据要素合规', d: '政策驱动高热度' },
                { t: '工控协议模糊测试', d: '工程与学术并重' },
                { t: '隐私计算工程化', d: '已进入落地期' },
              ].map((x) => (
                <Card key={x.t}>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-brand-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{x.t}</p>
                      <p className="text-xs text-slate-500 mt-1">{x.d}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ),
        },
        {
          key: 'hot',
          label: '热点文章',
          description: '按研究方向聚合的高被引与高转发论文推荐，附精读导读',
          render: () => (
            <Card>
              <ul className="divide-y divide-slate-100">
                {[
                  { t: 'Jailbreaking LLMs via Multi-turn Adversarial Chains', s: 'USENIX Security 2026', cite: 42 },
                  { t: 'Zero-Trust for Industrial IoT: A Systematic Review', s: 'IEEE S&P 2026', cite: 28 },
                  { t: 'Supply Chain Attack Detection with Graph Learning', s: 'NDSS 2026', cite: 17 },
                  { t: 'Rethinking Federated Learning Privacy', s: 'CCS 2025', cite: 156 },
                ].map((x) => (
                  <li key={x.t} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-800">{x.t}</p>
                        <p className="text-xs text-slate-500">{x.s}</p>
                      </div>
                    </div>
                    <Tag tone="purple">引用 {x.cite}</Tag>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
        {
          key: 'patent',
          label: '专利成果',
          description: '已公开网络安全相关专利的检索与申请状态追踪，提供申请流程指引',
          render: () => (
            <div className="grid grid-cols-2 gap-4">
              {[
                { t: '一种基于对抗样本的恶意流量识别方法', s: '发明专利 · 已授权', n: 'CN2025XXXXXX' },
                { t: '面向工业控��系统的零信任访问控制系统', s: '发明专利 · 实质审查', n: 'CN2025XXXXXX' },
                { t: '一种分布式日志溯源与取证装置', s: '实用新型 · 已授权', n: 'CN2025XXXXXX' },
                { t: '基于联邦学习的异常行为检测方法', s: '发明专利 · 公开', n: 'CN2025XXXXXX' },
              ].map((p) => (
                <Card key={p.t}>
                  <div className="flex items-start gap-3">
                    <Award className="w-4 h-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{p.t}</p>
                      <p className="text-xs text-slate-500 mt-1">{p.s}</p>
                      <p className="text-xs text-slate-400 mt-1">申请号 {p.n}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ),
        },
        {
          key: 'lab',
          label: '开放实验室',
          description: '顶校与研究机构开放课题、数据集资源与暑期访学合作机会',
          render: () => (
            <div className="grid grid-cols-2 gap-4">
              {[
                { t: '清华大学网络空间安全研究院', s: '开放课题 · 6 个' },
                { t: '中科院信息工程研究所', s: '开放课题 · 9 个' },
                { t: '上交大网络空间安全学院', s: '开放课题 · 4 个' },
                { t: '浙大 AI-安全交叉实验室', s: '暑期访学' },
              ].map((x) => (
                <Card key={x.t}>
                  <div className="flex items-start gap-3">
                    <FlaskConical className="w-4 h-4 text-brand-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{x.t}</p>
                      <p className="text-xs text-slate-500 mt-1">{x.s}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ),
        },
        {
          key: 'compare',
          label: '科研机会对比',
          description: '多维对比不同科研立项机会的资助额度、匹配度与申请截止时间',
          render: () => (
            <Card title="已选 3 项 · 按匹配度排序">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-100">
                    <th className="text-left py-2 font-normal">机会</th>
                    <th className="text-left font-normal">类型</th>
                    <th className="text-left font-normal">额度</th>
                    <th className="text-left font-normal">匹配度</th>
                    <th className="text-left font-normal">截止</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['国自然青年基金', '国家级', '30 万', 92, '2026-06-15'],
                    ['教育部协同育人', '部级', '5 万', 78, '2026-05-30'],
                    ['华为胡杨林', '企业', '15 万', 71, '滚动'],
                  ].map((r: any) => (
                    <tr key={r[0]} className="hover:bg-slate-50">
                      <td className="py-3 flex items-center gap-2">
                        <GitCompare className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-800">{r[0]}</span>
                      </td>
                      <td><Tag>{r[1]}</Tag></td>
                      <td className="text-slate-700">{r[2]}</td>
                      <td>
                        <div className="flex items-center gap-2 w-40">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                            <div className="h-full bg-brand-blue-600 rounded-full" style={{ width: `${r[3]}%` }} />
                          </div>
                          <span className="text-xs text-slate-600">{r[3]}%</span>
                        </div>
                      </td>
                      <td className="text-slate-500 text-xs">{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ),
        },
      ]}
    />
  );
}