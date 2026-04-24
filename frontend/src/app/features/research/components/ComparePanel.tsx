import { Trash2 } from 'lucide-react';

import { Card, Tag } from '@/app/components/PageShell';

import type { CompareItem } from '../types';
import { typeLabel } from '../utils';
import { StateBlock } from './StateBlock';

export function ComparePanel({
  items,
  loading,
  error,
  onRetry,
  onRemove,
}: {
  items: CompareItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onRemove: (item: CompareItem) => void;
}) {
  if (loading) return <StateBlock state="loading" message="正在读取对比项..." />;
  if (error) return <StateBlock state="error" message={error} onRetry={onRetry} />;
  if (!items.length) return <StateBlock state="empty" message="还没有加入对比的科研机会。" />;

  return (
    <Card title={`${items.length} 项对比`} subtitle="按类型混合展示，后续可扩展为分组对比矩阵">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
              <th className="py-2 font-normal">名称</th>
              <th className="font-normal">类型</th>
              <th className="font-normal">来源/机构</th>
              <th className="font-normal">截止/年份</th>
              <th className="font-normal">指标</th>
              <th className="font-normal">推荐理由</th>
              <th className="font-normal">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={`${item.item_type}-${item.item_id}`} className="align-top">
                <td className="py-3 pr-4 text-slate-900 font-medium min-w-56">{item.title}</td>
                <td className="py-3 pr-4"><Tag tone="blue">{typeLabel(item.item_type)}</Tag></td>
                <td className="py-3 pr-4 text-slate-600 min-w-36">{item.source}</td>
                <td className="py-3 pr-4 text-slate-600">{item.deadline_or_year}</td>
                <td className="py-3 pr-4 text-slate-600">
                  {item.metric_label}: {item.metric_value}
                </td>
                <td className="py-3 pr-4 text-slate-500 min-w-72">{item.recommendation_reason}</td>
                <td className="py-3">
                  <button
                    onClick={() => onRemove(item)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    移除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
