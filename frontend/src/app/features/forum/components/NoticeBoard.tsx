import type { Dispatch } from 'react';
import { useState } from 'react';
import { Bell, CalendarDays, MapPin, Megaphone, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '../../../components/PageShell';
import type { ForumAction } from '../store';
import type { ForumWorkspace } from '../types';
import { NoticeDetailDrawer } from './NoticeDetailDrawer';

export function NoticeBoard({
  workspace,
  dispatch,
}: {
  workspace: ForumWorkspace;
  dispatch: Dispatch<ForumAction>;
}) {
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>();
  const selectedNotice = workspace.notices.find((notice) => notice.id === selectedNoticeId);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {workspace.notices.map((notice) => (
        <Card key={notice.id}>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Megaphone className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <Tag tone="blue">{notice.type}</Tag>
                  {notice.registered && <Tag tone="green">已报名</Tag>}
                  {notice.reminded && <Tag tone="amber">已提醒</Tag>}
                </div>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{notice.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{notice.content}</p>
              </div>
            </div>
            <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {notice.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {notice.location}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {notice.tags.map((tag) => (
                <Tag key={tag} tone="purple">
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setSelectedNoticeId(notice.id)}
                className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
              >
                查看详情
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'toggleNoticeRegistration', noticeId: notice.id });
                  toast.success(notice.registered ? '已取消报名' : '已报名');
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                  notice.registered ? 'bg-emerald-50 text-emerald-700' : 'bg-brand-blue-50 text-brand-blue-600 hover:bg-brand-blue-100'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" />
                {notice.registered ? '取消报名' : '报名'}
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'toggleNoticeReminder', noticeId: notice.id });
                  toast.success(notice.reminded ? '已取消提醒' : '已设置提醒');
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                  notice.reminded ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bell className="h-3.5 w-3.5" />
                {notice.reminded ? '取消提醒' : '提醒'}
              </button>
            </div>
          </div>
        </Card>
      ))}

      <NoticeDetailDrawer
        notice={selectedNotice}
        dispatch={dispatch}
        onClose={() => setSelectedNoticeId(undefined)}
      />
    </div>
  );
}
