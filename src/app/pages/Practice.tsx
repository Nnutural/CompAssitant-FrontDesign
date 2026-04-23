import { BookOpen, Wrench, Trophy, Shield, Target, FileSearch, Clock } from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

const Grid = ({
  items,
}: {
  items: { t: string; s: string; m?: string; tag?: string; icon?: any }[];
}) => (
  <div className="grid grid-cols-3 gap-4">
    {items.map((x) => (
      <Card key={x.t}>
        <div className="flex items-start gap-3">
          {x.icon && (
            <div className="w-9 h-9 bg-brand-blue-50 text-brand-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <x.icon className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900">{x.t}</p>
              {x.tag && <Tag tone="blue">{x.tag}</Tag>}
            </div>
            <p className="text-xs text-slate-500 mt-1">{x.s}</p>
            {x.m && <p className="text-xs text-slate-400 mt-2">{x.m}</p>}
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export function Practice() {
  return (
    <PageShell
      title="实战进阶"
      subtitle="教程、工具、竞赛与靶场 · 行动导向的实战能力建设"
      actions={<button className="px-3 py-1.5 text-sm bg-brand-blue-600 text-white rounded-lg">我要参赛</button>}
      tabs={[
        {
          key: 'tutorial',
          label: '教程中心',
          description: '分方向、分难度的网络安全实战教程，覆盖 Web、逆向、内网渗透、AI 安全等核心路径',
          render: () => (
            <Grid
              items={[
                { icon: BookOpen, t: 'Web 安全入门到进阶', s: '12 章节 · 覆盖 OWASP Top10', tag: '热门' },
                { icon: BookOpen, t: '二进制漏洞挖掘实战', s: '8 章节 · Pwn 体系路径' },
                { icon: BookOpen, t: '内网渗透实操', s: '10 章节 · 域渗透全流程' },
                { icon: BookOpen, t: '代码审计与白盒方法', s: 'Java / PHP 审计' },
                { icon: BookOpen, t: '蓝队应急响应', s: '日志分析与溯源' },
                { icon: BookOpen, t: 'AI 安全对抗基础', s: '模型攻防与对齐' },
              ]}
            />
          ),
        },
        {
          key: 'tools',
          label: '工具库',
          description: '渗透测试、安全分析与防御工程常用工具集合，附配置模板与使用说明',
          render: () => (
            <Grid
              items={[
                { icon: Wrench, t: 'Burp Suite 配置模板', s: '面向电商逻辑漏洞' },
                { icon: Wrench, t: 'Nmap 高阶脚本集', s: '内网发现与服务指纹' },
                { icon: Wrench, t: 'Cobalt Strike 教研版', s: '红队教学专用' },
                { icon: Wrench, t: 'CyberChef 工作流', s: '30+ 常用流水线' },
                { icon: Wrench, t: 'Sliver C2 实验包', s: '合法教学使用' },
                { icon: Wrench, t: '取证工具箱', s: 'Volatility · Autopsy' },
              ]}
            />
          ),
        },
        {
          key: 'contest',
          label: '竞赛专区',
          description: '当前开放的安全赛事信息、历届优秀作品参考与个人参赛时间线管理',
          render: () => (
            <div className="space-y-4">
              <Grid
                items={[
                  { icon: Trophy, t: '全国大学生信息安全竞赛', s: '国赛 · 5 月报名', tag: '报名中' },
                  { icon: Trophy, t: '强网杯青少年专项赛', s: '线上初赛 · 6 月', tag: '即将' },
                  { icon: Trophy, t: '挑战杯课外学术作品', s: '校赛—省赛—国赛', tag: '筹备' },
                ]}
              />
              <Card title="我的参赛时间线">
                <ol className="relative border-l border-slate-200 ml-2 space-y-4">
                  {[
                    { t: '校赛报名 · 强网杯', d: '2026-04-28' },
                    { t: '校赛初赛 · 信安赛', d: '2026-05-15' },
                    { t: '省赛决赛 · 挑战杯', d: '2026-06-20' },
                  ].map((s) => (
                    <li key={s.t} className="ml-4">
                      <span className="absolute -left-1.5 w-3 h-3 bg-brand-blue-600 rounded-full" />
                      <p className="text-sm text-slate-800">{s.t}</p>
                      <p className="text-xs text-slate-500">{s.d}</p>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          ),
        },
        {
          key: 'hvv',
          label: '护网行动',
          description: '护网行动预告、红蓝队典型战法复盘与参与指引，了解实战演练全貌',
          render: () => (
            <Grid
              items={[
                { icon: Shield, t: '2026 年护网行动预告', s: '7 月启动 · 报名通道', tag: '预告' },
                { icon: Shield, t: '红队典型战法复盘', s: '近三年 58 起案例' },
                { icon: Shield, t: '蓝队监测与值守手册', s: 'SOP 与排班模板' },
                { icon: Shield, t: '攻防演练态势看板', s: '实时攻击源分布' },
              ]}
            />
          ),
        },
        {
          key: 'range',
          label: '靶场演练',
          description: '在线靶场环境快速接入，涵盖 Web、内网、工控、AI 对抗等多类型挑战',
          render: () => (
            <Grid
              items={[
                { icon: Target, t: 'Web 漏洞靶场 · 初级', s: '20 关 · SQLi / XSS', tag: '在线' },
                { icon: Target, t: '内网渗透靶场', s: '6 台主机 · 多层跳板', tag: '在线' },
                { icon: Target, t: '工控 PLC 靶场', s: '模拟能源场景' },
                { icon: Target, t: 'AI 对抗靶场', s: '对抗样本与越狱' },
              ]}
            />
          ),
        },
        {
          key: 'cases',
          label: '实战案例',
          description: '真实攻防场景的结构化分析与复盘报告，提炼可复用的攻防经验',
          render: () => (
            <Card>
              <ul className="divide-y divide-slate-100">
                {[
                  { t: '某高校 VPN 接口未授权访问修复', tag: '企业实战', m: '2026-04' },
                  { t: 'Log4Shell 在金融系统的完整应急复盘', tag: '应急响应', m: '2026-03' },
                  { t: '电商风控绕过：业务逻辑漏洞挖掘', tag: '业务安全', m: '2026-02' },
                  { t: '物联网设备固件逆向：某摄像头0day分析', tag: '硬件逆向', m: '2026-01' },
                ].map((x) => (
                  <li key={x.t} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <FileSearch className="w-4 h-4 text-slate-400" />
                      <p className="text-sm text-slate-800">{x.t}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tag>{x.tag}</Tag>
                      <span className="text-xs text-slate-400">{x.m}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
        {
          key: 'ddl',
          label: '竞赛DDL',
          description: '主流安全赛事的报名与提交截止日历，按紧急程度排序，不错过任何窗口',
          render: () => (
            <Card title="按紧急程度排序">
              <ul className="space-y-3">
                {[
                  { t: '强网杯青少年专项赛 · 初赛报名', d: '2026-04-30', days: 7, tone: 'red' as const },
                  { t: '全国大学生信息安全竞赛 · 作品提交', d: '2026-05-15', days: 22, tone: 'red' as const },
                  { t: 'AI 安全挑战赛 · 队伍确认', d: '2026-05-22', days: 29, tone: 'amber' as const },
                  { t: '工控安全邀请赛', d: '2026-06-18', days: 56, tone: 'amber' as const },
                  { t: '护网行动招募截止', d: '2026-07-05', days: 73, tone: 'default' as const },
                ].map((d) => (
                  <li
                    key={d.t}
                    className="flex items-center justify-between p-3 border border-slate-100 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-800">{d.t}</p>
                        <p className="text-xs text-slate-500">截止 {d.d}</p>
                      </div>
                    </div>
                    <Tag tone={d.tone}>{d.days} 天</Tag>
                  </li>
                ))}
              </ul>
            </Card>
          ),
        },
      ]}
    />
  );
}