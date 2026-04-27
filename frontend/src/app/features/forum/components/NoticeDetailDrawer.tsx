import type { Dispatch, ReactNode } from 'react';
import { Bell, CalendarDays, MapPin, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Tag } from '../../../components/PageShell';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import type { ForumAction } from '../store';
import type { ForumNotice } from '../types';

export function NoticeDetailDrawer({
  notice,
  dispatch,
  onClose,
}: {
  notice?: ForumNotice;
  dispatch: Dispatch<ForumAction>;
  onClose: () => void;
}) {
  return (
    <Sheet open={Boolean(notice)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:max-w-xl">
        {notice && (
          <>
            <SheetHeader className="border-b border-slate-100 p-5">
              <SheetTitle className="pr-8 text-xl leading-7 text-slate-900">{notice.title}</SheetTitle>
              <SheetDescription>
                {notice.type} · {notice.organizer}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <Tag tone="blue">{notice.type}</Tag>
                {notice.registered && <Tag tone="green">已报名</Tag>}
                {notice.reminded && <Tag tone="amber">已提醒</Tag>}
                {notice.tags.map((tag) => (
                  <Tag key={tag} tone="purple">
                    {tag}
                  </Tag>
                ))}
              </div>

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">活动内容</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{notice.content}</p>
              </section>

              <div className="grid gap-3">
                <Info icon={<CalendarDays className="h-4 w-4" />} label="时间" value={notice.date} />
                <Info icon={<MapPin className="h-4 w-4" />} label="地点" value={notice.location} />
                <Info icon={<UserCheck className="h-4 w-4" />} label="主办方" value={notice.organizer} />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'toggleNoticeRegistration', noticeId: notice.id });
                    toast.success(notice.registered ? '已取消报名' : '已报名');
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                    notice.registered ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700'
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  {notice.registered ? '取消报名' : '报名活动'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'toggleNoticeReminder', noticeId: notice.id });
                    toast.success(notice.reminded ? '已取消提醒' : '已设置提醒');
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                    notice.reminded ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  {notice.reminded ? '取消提醒' : '设置提醒'}
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="text-brand-blue-600">{icon}</span>
      <span className="w-14 text-xs text-slate-400">{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
}
