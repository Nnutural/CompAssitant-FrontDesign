import { MessageSquare } from 'lucide-react';

import type { TaskActivity } from '../types';

export function TaskActivityFeed({ activities }: { activities: TaskActivity[] }) {
  if (activities.length === 0) {
    return <p className="text-sm text-slate-400">暂无活动记录</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue-50 text-brand-blue-600">
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-slate-700">{activity.content}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {activity.actor} · {new Date(activity.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
