import {
  AlertTriangle,
  Sparkles,
  FileText,
  Database,
  Flame,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  CalendarClock,
} from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

const WelcomeBar = () => (
  <div className="bg-gradient-to-r from-brand-blue-600 to-brand-blue-700 rounded-xl p-6 text-white flex items-center justify-between">
    <div>
      <p className="text-sm opacity-80">周四 · 2026-04-23</p>
      <h2 className="text-xl font-semibold mt-1">早上好，陈同学</h2>
      <p className="mt-2 text-sm opacity-90">
        今天有 <span className="font-semibold">3 项</span> 截止提醒 ·{' '}
        <span className="font-semibold">5 条</span> 推荐行动待处理
      </p>
    </div>
    <div className="flex gap-2">
      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm backdrop-blur">
        查看今日简报
      </button>
      <button className="px-4 py-2 bg-white text-brand-blue-700 rounded-lg text-sm font-medium">
        开始工作
      </button>
    </div>
  </div>
);

const Today = () => (
  <div className="space-y-5">
    <WelcomeBar />
    <div className="grid grid-cols-3 gap-4">
      {[
        { k: '待完成任务', v: '12', sub: '其中 3 项高优先级', tone: 'blue' as const },
        { k: '进行中项目', v: '4', sub: '1 项本周交付', tone: 'purple' as const },
        { k: '已生成资产', v: '28', sub: '本月 +7', tone: 'green' as const },
      ].map((m) => (
        <Card key={m.k}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500">{m.k}</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">{m.v}</p>
              <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
            </div>
            <Tag tone={m.tone}>实时</Tag>
          </div>
        </Card>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Card title="今日要务" right={<Tag tone="blue">3</Tag>} className="col-span-2">
        <ul className="divide-y divide-slate-100">
          {[
            { t: '完成挑战杯计划书 3.2 节初稿', meta: '选题写作 · 预计 2h', tag: '高' },
            { t: '核对"网安就业岗位分析报告"引用', meta: '引用证据 · 0.5h', tag: '中' },
            { t: '回复导师关于实验方案的反馈', meta: '计划任务 · 15min', tag: '中' },
          ].map((r) => (
            <li key={r.t} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                <div>
                  <p className="text-sm text-slate-800">{r.t}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{r.meta}</p>
                </div>
              </div>
              <Tag tone={r.tag === '高' ? 'red' : 'amber'}>{r.tag}优</Tag>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="本周节奏">
        <div className="space-y-3">
          {[
            { d: '周一', p: 90 },
            { d: '周二', p: 70 },
            { d: '周三', p: 85 },
            { d: '今日', p: 45 },
            { d: '周五', p: 0 },
          ].map((w) => (
            <div key={w.d}>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{w.d}</span>
                <span>{w.p}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-blue-600 rounded-full"
                  style={{ width: `${w.p}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

const DDL = () => (
  <Card title="截止提醒" subtitle="按紧急程度排序">
    <ul className="space-y-3">
      {[
        { t: '挑战杯课外学术作品作品提交', d: '2026-05-12', days: 19, tone: 'red' as const },
        { t: '教育部网络安全创新创业大赛报名截止', d: '2026-05-03', days: 10, tone: 'red' as const },
        { t: '国家自然科学基金青年项目初稿', d: '2026-06-15', days: 53, tone: 'amber' as const },
        { t: '网安学术前沿综述投稿', d: '2026-07-01', days: 69, tone: 'amber' as const },
      ].map((d) => (
        <li
          key={d.t}
          className="flex items-center justify-between p-3 border border-slate-100 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <CalendarClock className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-sm text-slate-800">{d.t}</p>
              <p className="text-xs text-slate-500 mt-0.5">截止 {d.d}</p>
            </div>
          </div>
          <Tag tone={d.tone}>{d.days} 天</Tag>
        </li>
      ))}
    </ul>
  </Card>
);

const Actions = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { t: '完善选题"零信任在工业互联网的应用"创意画布', why: '已准备 4 张思路卡片待整合', icon: Sparkles },
      { t: '基于最新护网动态更新岗位分析报告', why: '相关数据源 2 天前已更新', icon: ShieldCheck },
      { t: '将 3 篇收藏论文转为计划书引用证据', why: '可自动生成 7 个引用点', icon: FileText },
      { t: '同步本周任务到团队看板', why: '检测到 2 项变更未同步', icon: CheckCircle2 },
    ].map((a) => (
      <Card key={a.t}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-brand-blue-50 text-brand-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <a.icon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-900 font-medium">{a.t}</p>
            <p className="text-xs text-slate-500 mt-1">{a.why}</p>
            <button className="mt-3 text-xs text-brand-blue-600 flex items-center gap-1 hover:underline">
              开始 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const Recent = () => (
  <Card title="最近生成物">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-xs text-slate-500 border-b border-slate-100">
          <th className="text-left py-2 font-normal">标题</th>
          <th className="text-left font-normal">类型</th>
          <th className="text-left font-normal">模块</th>
          <th className="text-right font-normal">时间</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {[
          ['"基于LLM的钓鱼检测" 计划书', '文档', '计划书生成', '2h 前'],
          ['挑战杯答辩 PPT 大纲', 'PPT', 'PPT大纲', '昨天'],
          ['岗位分析：安全运营工程师', '报告', '岗位分析', '昨天'],
          ['"工业互联网零信任"创意画布', '画布', '创意画布', '2 天前'],
        ].map((r) => (
          <tr key={r[0]} className="hover:bg-slate-50">
            <td className="py-2.5 text-slate-800">{r[0]}</td>
            <td><Tag>{r[1]}</Tag></td>
            <td className="text-slate-500">{r[2]}</td>
            <td className="text-right text-slate-400 text-xs">{r[3]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

const Freshness = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { k: '国家政策库', f: 98, t: '今日 06:00 同步' },
      { k: '竞赛与DDL', f: 95, t: '4 小时前' },
      { k: '招聘数据', f: 82, t: '昨日 22:00' },
      { k: '学术文献', f: 76, t: '1 天前' },
      { k: '护网动态', f: 88, t: '6 小时前' },
      { k: '论坛热度', f: 91, t: '30 分钟前' },
    ].map((d) => (
      <Card key={d.k}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-800">{d.k}</p>
            <p className="text-xs text-slate-500 mt-0.5">{d.t}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-slate-900">{d.f}%</p>
            <p className="text-xs text-slate-400">新鲜度</p>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

const HotList = ({ items, icon: Icon }: { items: { t: string; s: string; tag: string }[]; icon: any }) => (
  <Card>
    <ul className="divide-y divide-slate-100">
      {items.map((x, i) => (
        <li key={x.t} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <span className="text-xs text-brand-blue-600 font-semibold w-5 shrink-0">{i + 1}</span>
          <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-slate-800">{x.t}</p>
            <p className="text-xs text-slate-500 mt-0.5">{x.s}</p>
          </div>
          <Tag tone="blue">{x.tag}</Tag>
        </li>
      ))}
    </ul>
  </Card>
);

export function Workspace() {
  return (
    <PageShell
      title="总览"
      subtitle="工作台首页 · 获取今日要务、热点与推荐行动"
      tabs={[
        { key: 'today', label: '今日要务', description: '今天待完成任务、高优先级提醒与本周工作节奏总览', render: Today },
        { key: 'ddl', label: '截止提醒', description: '所有活跃项目与赛事的截止时间预警，按紧急程度自动排序', render: DDL },
        { key: 'actions', label: '推荐行动', description: '基于你的数据画像，系统智能推荐的下一步最优行动清单', render: Actions },
        { key: 'recent', label: '最近生成物', description: '你近期通过平台生成的文档、报告、PPT 与画布资产', render: Recent },
        { key: 'freshness', label: '数据新鲜度', description: '各数据源的最近同步时效，确保你所用信息处于最新状态', render: Freshness },
        {
          key: 'industry',
          label: '行业热点',
          description: '安全产业最新动态、厂商动向与市场趋势，每日更新',
          render: () => (
            <HotList
              icon={Flame}
              items={[
                { t: 'OpenAI 发布安全助手代理 SDK', s: '安全自动化 / AI Agent', tag: '行业' },
                { t: '国内头部安服商 Q1 营收集体下滑', s: '安全服务市场', tag: '市场' },
                { t: '零信任在能源行业落地案例增多', s: '零信任 / 关基', tag: '趋势' },
                { t: '供应链攻击针对 CI/CD 环境激增 42%', s: '威胁情报', tag: '预警' },
              ]}
            />
          ),
        },
        {
          key: 'social',
          label: '社会热点',
          description: '与网络安全相关的社会舆情、公众关注事件与典型案例',
          render: () => (
            <HotList
              icon={Globe2}
              items={[
                { t: '多地政务平台数据泄露事件调查进展', s: '数据安全 / 合规', tag: '舆情' },
                { t: '大学生参与"蓝帽杯"规模再创新高', s: '高校 / 赛事', tag: '教育' },
                { t: 'AI 诈骗案上升，公安部公布典型案例', s: '社会安全', tag: '案例' },
              ]}
            />
          ),
        },
        {
          key: 'policy',
          label: '国家政策',
          description: '最新网络安全法规政策动态解读与合规要点速览',
          render: () => (
            <HotList
              icon={ShieldCheck}
              items={[
                { t: '《网络数据安全管理条例》正式施行', s: '国务院 · 2026-01-01', tag: '法规' },
                { t: '工信部发布关基运营者网络安全保护要求', s: '工信部 · 部门规章', tag: '政策' },
                { t: '网信办开展个人信息出境监督检查专项', s: '网信办 · 专项行动', tag: '监管' },
              ]}
            />
          ),
        },
      ]}
    />
  );
}