import { Card } from '@/app/components/PageShell';

import type { WorkspaceDashboard } from '../types';
import { getDashboardStats, getWeeklyRhythm } from '../utils';

export function WeeklyRhythmCard({ dashboard }: { dashboard: WorkspaceDashboard }) {
  const rhythm = getWeeklyRhythm(dashboard);
  const stats = getDashboardStats(dashboard);

  return (
    <Card title="本周节奏" subtitle="由任务完成率和 DDL 压力动态生成">
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>今日完成度</span>
            <span>{stats.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-blue-600" style={{ width: `${stats.progress}%` }} />
          </div>
        </div>

        <div className="space-y-3">
          {rhythm.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-brand-blue-600" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
