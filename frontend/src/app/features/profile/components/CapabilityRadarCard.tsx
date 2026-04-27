import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, Tag } from '@/app/components/PageShell';
import type { CapabilityScore } from '../types';

const trendIcons = {
  up: TrendingUp,
  flat: Minus,
  down: TrendingDown,
};

const trendLabels = {
  up: '上升',
  flat: '稳定',
  down: '下降',
};

export function CapabilityRadarCard({ capabilities }: { capabilities: CapabilityScore[] }) {
  return (
    <Card title="能力雷达" subtitle="基于资产、任务和互动记录的演示画像评分">
      <ul className="space-y-4">
        {capabilities.map((capability) => {
          const TrendIcon = trendIcons[capability.trend];
          return (
            <li key={capability.id}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{capability.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{capability.evidence}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Tag tone={capability.trend === 'up' ? 'green' : capability.trend === 'down' ? 'red' : 'default'}>
                    <TrendIcon className="mr-1 h-3 w-3" />
                    {trendLabels[capability.trend]}
                  </Tag>
                  <span className="w-8 text-right text-sm font-semibold text-slate-900">{capability.score}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-blue-600 transition-all"
                  style={{ width: `${capability.score}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
