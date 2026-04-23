import { User, FolderOpen, FileText, Presentation, Code2, Award, CheckCircle2, Bell, Shield } from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

const Persona = () => (
  <div className="grid grid-cols-3 gap-4">
    <Card title="基础信息" className="col-span-1">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-brand-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold">
          陈
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">陈同学</p>
          <p className="text-xs text-slate-500 mt-1">本科大三 · 网络空间安全</p>
          <p className="text-xs text-slate-500">某重点高校 · 2023 级</p>
        </div>
      </div>
      <dl className="mt-5 space-y-2 text-sm">
        {[
          ['方向偏好', 'AI 安全 · 零信任'],
          ['目标', '保研 + 头部厂商实习'],
          ['时间投入', '每周 20-25h'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <dt className="text-slate-500">{k}</dt>
            <dd className="text-slate-800">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
    <Card title="能力雷达" className="col-span-1">
      <ul className="space-y-3">
        {[
          ['科研能力', 68],
          ['工程能力', 74],
          ['实战能力', 62],
          ['写作能力', 80],
          ['表达能力', 70],
        ].map((r: any) => (
          <li key={r[0]}>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>{r[0]}</span>
              <span>{r[1]}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full">
              <div className="h-full bg-brand-blue-600 rounded-full" style={{ width: `${r[1]}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
    <Card title="兴趣与标签" className="col-span-1">
      <div className="flex flex-wrap gap-2">
        {['AI 安全', '零信任', '工业互联网', '挑战杯', '保研', '红队', '论文写作', '开源', '数据合规'].map((t) => (
          <Tag key={t} tone="blue">
            {t}
          </Tag>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        画像基于你的行为、偏好与成果动态生成，可在设置中修改权重。
      </p>
    </Card>
  </div>
);

const Vault = () => (
  <div className="grid grid-cols-4 gap-4">
    {[
      { k: '文档资产', v: 28, icon: FileText, tone: 'blue' as const },
      { k: '演示资产', v: 9, icon: Presentation, tone: 'purple' as const },
      { k: '代码资产', v: 14, icon: Code2, tone: 'green' as const },
      { k: '证明材料', v: 16, icon: Award, tone: 'amber' as const },
    ].map((s) => (
      <Card key={s.k}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500">{s.k}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{s.v}</p>
          </div>
          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
            <s.icon className="w-4 h-4 text-slate-600" />
          </div>
        </div>
        <Tag tone={s.tone}>本月 +{Math.floor(s.v / 4)}</Tag>
      </Card>
    ))}
    <div className="col-span-4">
      <Card title="最近资产">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-100">
              <th className="text-left py-2 font-normal">名称</th>
              <th className="text-left font-normal">类型</th>
              <th className="text-left font-normal">来源模块</th>
              <th className="text-right font-normal">更新时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              ['挑战杯计划书 v3', 'Doc', '计划书生成', '2h 前'],
              ['答辩 PPT 大纲 v2', 'PPT', 'PPT 大纲', '昨天'],
              ['零信任网关原型', 'Code', '实战进阶', '3 天前'],
              ['信安赛省赛证书', '证明', '竞赛专区', '上周'],
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
    </div>
  </div>
);

const AssetList = ({ title, items, icon: Icon }: any) => (
  <Card title={title}>
    <ul className="divide-y divide-slate-100">
      {items.map((x: any) => (
        <li key={x.t} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-sm text-slate-800">{x.t}</p>
              <p className="text-xs text-slate-500">{x.s}</p>
            </div>
          </div>
          <Tag tone="blue">{x.v}</Tag>
        </li>
      ))}
    </ul>
  </Card>
);

const Submit = () => (
  <Card title="提交清单 · 挑战杯国赛">
    <ul className="space-y-3">
      {[
        { t: '作品申报书（PDF）', d: '必交', ok: true },
        { t: '作品主体论文 / 报告', d: '必交', ok: true },
        { t: '研究成果附录（代码/数据）', d: '建议', ok: false },
        { t: '答辩 PPT', d: '必交', ok: false },
        { t: '指导教师签字材料', d: '必交', ok: false },
        { t: '查重报告', d: '必交', ok: false },
      ].map((x) => (
        <li key={x.t} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className={`w-4 h-4 ${x.ok ? 'text-emerald-500' : 'text-slate-300'}`} />
            <div>
              <p className="text-sm text-slate-800">{x.t}</p>
              <p className="text-xs text-slate-500">{x.d}</p>
            </div>
          </div>
          <Tag tone={x.ok ? 'green' : 'amber'}>{x.ok ? '已准备' : '待准备'}</Tag>
        </li>
      ))}
    </ul>
  </Card>
);

const Notice = () => (
  <Card title="通知设置">
    <ul className="space-y-3">
      {[
        ['竞赛截止提醒（提前 7 天）', true],
        ['新政策发布通知', true],
        ['论文与基金机会推送', true],
        ['论坛 @ 与回复', true],
        ['每周成长周报', false],
      ].map(([t, v]: any) => (
        <li key={t} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-800">{t}</span>
          </div>
          <span className={`w-10 h-5 rounded-full ${v ? 'bg-brand-blue-600' : 'bg-slate-200'} relative`}>
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${v ? 'left-5' : 'left-0.5'}`} />
          </span>
        </li>
      ))}
    </ul>
  </Card>
);

const Account = () => (
  <div className="grid grid-cols-2 gap-4">
    <Card title="账户信息">
      <dl className="space-y-2 text-sm">
        {[
          ['登录账号', 'chen_stu@example.edu.cn'],
          ['实名认证', '已认证 · 学生'],
          ['会员版本', '教育版 · Pro'],
          ['设备登录', '3 台设备'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-slate-100 last:border-none">
            <dt className="text-slate-500">{k}</dt>
            <dd className="text-slate-800">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
    <Card title="合规与数据">
      <ul className="space-y-3 text-sm">
        {[
          { t: '数据授权范围', s: '仅用于平台个性化与智能推荐' },
          { t: '敏感操作二次验证', s: '已开启' },
          { t: '导出个人数据', s: '可在 24 小时内申请全量导出' },
          { t: '注销账户', s: '保留 30 天后不可恢复' },
        ].map((x) => (
          <li key={x.t} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-800">{x.t}</p>
                <p className="text-xs text-slate-500 mt-0.5">{x.s}</p>
              </div>
            </div>
            <button className="text-xs text-brand-blue-600">管理</button>
          </li>
        ))}
      </ul>
    </Card>
  </div>
);

export function Profile() {
  return (
    <PageShell
      title="个人中心"
      subtitle="画像、资产、提交、通知与账户 · 个人沉淀与配置"
      actions={
        <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg flex items-center gap-1.5">
          <User className="w-4 h-4" /> 编辑资料
        </button>
      }
      tabs={[
        { key: 'persona', label: '用户画像', description: '你的个人能力雷达、方向偏好标签与成长画像动态展示', render: Persona },
        { key: 'vault', label: '个人资产库', description: '平台上所有个人生成资产的统一管理入口，含文档、演示、代码与证明', render: Vault },
        {
          key: 'docs',
          label: '文档资产',
          description: '计划书、综述报告等文档类资产的查看、下载与版本管理',
          render: () => (
            <AssetList
              title="文档资产"
              icon={FileText}
              items={[
                { t: '挑战杯计划书 v3', s: '计划书生成 · 2h 前', v: 'Doc' },
                { t: '零信任方向综述', s: '写作模块 · 1 天前', v: 'Doc' },
                { t: '岗位分析报告', s: '岗位分析 · 2 天前', v: 'Doc' },
                { t: '政策解读 · 数据安全法', s: '政策解读 · 上周', v: 'Doc' },
              ]}
            />
          ),
        },
        {
          key: 'slides',
          label: '演示资产',
          description: 'PPT 大纲与演示文件的管理、预览与导出，支持多格式下载',
          render: () => (
            <AssetList
              title="演示资产"
              icon={Presentation}
              items={[
                { t: '挑战杯答辩 PPT v2', s: 'PPT 大纲 · 昨天', v: 'PPT' },
                { t: '信安赛汇报 PPT', s: '竞赛专区 · 上周', v: 'PPT' },
                { t: '课程组会 PPT', s: '计划任务 · 2 周前', v: 'PPT' },
              ]}
            />
          ),
        },
        {
          key: 'code',
          label: '代码资产',
          description: '项目代码仓库链接与贡献记录管理，统一展示你的工程产出',
          render: () => (
            <AssetList
              title="代码资产"
              icon={Code2}
              items={[
                { t: 'zero-trust-gateway', s: 'Go · 实战进阶', v: 'Repo' },
                { t: 'llm-jailbreak-eval', s: 'Python · 科研创新', v: 'Repo' },
                { t: 'ctf-writeups-2025', s: '竞赛记录', v: 'Repo' },
              ]}
            />
          ),
        },
        {
          key: 'proof',
          label: '证明材料',
          description: '参赛证书、奖项证明与资格认证材料的上传、归档与检索',
          render: () => (
            <AssetList
              title="证明材料"
              icon={Award}
              items={[
                { t: '2025 全国大学生信安赛 · 省二等奖', s: '竞赛 · 证书编号 XXXX', v: '证书' },
                { t: '挑战杯校赛 · 一等奖', s: '竞赛', v: '证书' },
                { t: '护网行动志愿者服务证明', s: '实战', v: '证明' },
                { t: '导师推荐信（扫描件）', s: '保研材料', v: 'PDF' },
              ]}
            />
          ),
        },
        { key: 'submit', label: '提交清单', description: '各竞赛提交包的要素核对、完成状态跟踪与提交记录存档', render: Submit },
        { key: 'notice', label: '通知设置', description: '截止提醒、系统通知与消息推送的个性化开关配置', render: Notice },
        { key: 'account', label: '账户与合规', description: '账户安全信息、数据授权范围与个人数据合规操作入口', render: Account },
      ]}
    />
  );
}