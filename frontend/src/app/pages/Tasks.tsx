import { Flag } from 'lucide-react';
import { PageShell, Card, Tag } from '../components/PageShell';

const Board = () => {
  const cols = [
    { k: '待办', tone: 'default' as const, items: ['复现 Log4Shell', '收集零信任文献 10 篇', '和导师确认方案'] },
    { k: '进行中', tone: 'blue' as const, items: ['计划书 3.2 节写作', 'AI 安全论文复现', '岗位分析报告'] },
    { k: '评审', tone: 'amber' as const, items: ['PPT 大纲 v2'] },
    { k: '已完成', tone: 'green' as const, items: ['选题推演 · 零信任', '创意画布填充'] },
  ];
  return (
    <div className="grid grid-cols-4 gap-4">
      {cols.map((c) => (
        <Card key={c.k} title={`${c.k} · ${c.items.length}`} right={<Tag tone={c.tone}>列</Tag>}>
          <div className="space-y-2">
            {c.items.map((t) => (
              <div key={t} className="p-3 border border-slate-200 rounded-lg hover:shadow-sm cursor-pointer">
                <p className="text-sm text-slate-800">{t}</p>
                <div className="flex items-center justify-between mt-2">
                  <Tag>写作</Tag>
                  <span className="text-xs text-slate-400">2026-04-28</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

const Timeline = () => (
  <Card title="项目时间线 · 挑战杯作品">
    <div className="overflow-x-auto">
      <div className="min-w-[800px] space-y-4">
        {[
          { t: '选题与立项', s: '04-01', e: '04-10', p: 100 },
          { t: '文献综述', s: '04-08', e: '04-22', p: 100 },
          { t: '方法设计', s: '04-15', e: '05-05', p: 70 },
          { t: '实验与评估', s: '05-01', e: '05-25', p: 20 },
          { t: '论文与 PPT', s: '05-20', e: '06-10', p: 0 },
          { t: '答辩与提交', s: '06-08', e: '06-20', p: 0 },
        ].map((s) => (
          <div key={s.t}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-800">{s.t}</span>
              <span className="text-xs text-slate-500">
                {s.s} → {s.e}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full">
              <div className="h-full bg-brand-blue-600 rounded-full" style={{ width: `${s.p}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const List = () => (
  <Card title="清单管理">
    <ul className="divide-y divide-slate-100">
      {[
        { t: '整理近 5 年零信任顶会论文', d: '2026-04-25', tag: '文献' },
        { t: '完成方法章节首稿', d: '2026-05-01', tag: '写作' },
        { t: '基线实验脚本跑通', d: '2026-05-06', tag: '实验' },
        { t: '答辩 PPT 第一版', d: '2026-05-28', tag: '演示' },
      ].map((x) => (
        <li key={x.t} className="flex items-center justify-between py-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
            <div>
              <p className="text-sm text-slate-800">{x.t}</p>
              <p className="text-xs text-slate-500">截止 {x.d}</p>
            </div>
          </label>
          <Tag tone="blue">{x.tag}</Tag>
        </li>
      ))}
    </ul>
  </Card>
);

const Milestone = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { t: '选题通过', s: '2026-04-10', tone: 'green' as const },
      { t: '论文综述定稿', s: '2026-05-01', tone: 'blue' as const },
      { t: '实验结果达标', s: '2026-05-20', tone: 'amber' as const },
      { t: '提交国赛作品', s: '2026-06-15', tone: 'red' as const },
    ].map((m) => (
      <Card key={m.t}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flag className="w-4 h-4 text-brand-blue-600" />
            <div>
              <p className="text-sm font-medium text-slate-900">{m.t}</p>
              <p className="text-xs text-slate-500 mt-0.5">目标：{m.s}</p>
            </div>
          </div>
          <Tag tone={m.tone}>里程碑</Tag>
        </div>
      </Card>
    ))}
  </div>
);

const CalendarView = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const marks: Record<number, string> = {
    3: '写作', 7: 'DDL', 12: '实验', 15: '会议', 22: '提交', 28: '答辩',
  };
  return (
    <Card title="2026 年 5 月 · 截止日历">
      <div className="grid grid-cols-7 gap-2 text-center">
        {['一', '二', '三', '四', '五', '六', '日'].map((d) => (
          <div key={d} className="text-xs text-slate-400 py-1">
            {d}
          </div>
        ))}
        {days.map((d) => (
          <div
            key={d}
            className={`aspect-square rounded-lg border text-xs flex flex-col items-center justify-center ${
              marks[d] ? 'border-brand-blue-400 bg-brand-blue-50' : 'border-slate-100'
            }`}
          >
            <span className="text-slate-700">{d}</span>
            {marks[d] && <span className="text-[10px] text-brand-blue-600 mt-0.5">{marks[d]}</span>}
          </div>
        ))}
      </div>
    </Card>
  );
};

const TeamCollab = () => (
  <div className="grid grid-cols-3 gap-4">
    <Card title="团队成员" className="col-span-1">
      <ul className="space-y-2">
        {[
          { n: '陈同学', r: '队长 · 写作' },
          { n: '李同学', r: '实验 · 算法' },
          { n: '王同学', r: '工程 · 后端' },
          { n: '赵同学', r: '设计 · PPT' },
        ].map((m) => (
          <li key={m.n} className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs text-slate-600">
              {m.n[0]}
            </div>
            <div>
              <p className="text-sm text-slate-800">{m.n}</p>
              <p className="text-xs text-slate-500">{m.r}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
    <Card title="任务分工矩阵" className="col-span-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-500 border-b border-slate-100">
            <th className="text-left py-2 font-normal">模块</th>
            <th className="text-left font-normal">主负责</th>
            <th className="text-left font-normal">支持</th>
            <th className="text-left font-normal">截止</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[
            ['文献综述', '陈', '李', '05-01'],
            ['方法实现', '李', '王', '05-15'],
            ['前端原型', '王', '赵', '05-20'],
            ['PPT 与答辩', '赵', '陈', '06-10'],
          ].map((r: any) => (
            <tr key={r[0]}>
              <td className="py-2.5 text-slate-800">{r[0]}</td>
              <td><Tag tone="blue">{r[1]}</Tag></td>
              <td className="text-slate-600">{r[2]}</td>
              <td className="text-slate-500 text-xs">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

export function Tasks() {
  return (
    <PageShell
      title="计划任务"
      subtitle="看板、时间线、清单、里程碑、日历与团队分工"
      actions={<button className="px-3 py-1.5 text-sm bg-brand-blue-600 text-white rounded-lg">新建任务</button>}
      tabs={[
        { key: 'board', label: '看板视图', description: '以四列看板管理所有任务，直观追踪待办、进行中、评审与完成状态', render: Board },
        { key: 'timeline', label: '时间线', description: '甘特时间线展示项目各阶段进度，把握整体节奏与关键路径', render: Timeline },
        { key: 'list', label: '清单管理', description: '平铺清单视图，支持快速标注完成、按截止日期筛选与批量操作', render: List },
        { key: 'milestone', label: '里程碑', description: '设定与追踪项目关键节点，确保重要目标按时完成', render: Milestone },
        { key: 'calendar', label: '截止日历', description: '以日历视图聚合所有任务与竞赛的截止日期，避免遗漏关键节点', render: CalendarView },
        { key: 'team', label: '协作分工', description: '团队成员任务分工矩阵与责任追踪，提升多人协作的透明度', render: TeamCollab },
      ]}
    />
  );
}