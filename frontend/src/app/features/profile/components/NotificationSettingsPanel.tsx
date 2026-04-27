import { BellRing, MailCheck, Send } from 'lucide-react';
import { type Dispatch, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Card, Tag } from '@/app/components/PageShell';
import type { ProfileAction } from '../store';
import type { NotificationChannel, ProfileWorkspace } from '../types';

const channels: NotificationChannel[] = ['站内', '邮件', '浏览器', '全部'];

export function NotificationSettingsPanel({
  workspace,
  dispatch,
}: {
  workspace: ProfileWorkspace;
  dispatch: Dispatch<ProfileAction>;
}) {
  const enabledCount = workspace.notificationSettings.filter((setting) => setting.enabled).length;

  return (
    <div className="space-y-4">
      <Card
        title="通知设置"
        subtitle={`${enabledCount} / ${workspace.notificationSettings.length} 项已开启`}
        right={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                dispatch({ type: 'setAllNotifications', enabled: true });
                toast.success('通知已全部开启');
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              批量开启
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'setAllNotifications', enabled: false });
                toast.success('通知已全部关闭');
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              批量关闭
            </button>
          </div>
        }
      >
        <div className="grid gap-3">
          {workspace.notificationSettings.map((setting) => (
            <section key={setting.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <BellRing className="h-4 w-4 text-slate-400" />
                    <h3 className="font-medium text-slate-900">{setting.title}</h3>
                    <Tag tone={setting.enabled ? 'green' : 'default'}>{setting.enabled ? '已开启' : '已关闭'}</Tag>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{setting.description}</p>
                </div>
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={setting.enabled}
                    onChange={(event) => {
                      dispatch({ type: 'updateNotificationSetting', settingId: setting.id, patch: { enabled: event.target.checked } });
                      toast.success('通知设置已更新');
                    }}
                  />
                  启用
                </label>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[180px_180px_1fr_auto]">
                <label className="block">
                  <span className="text-xs text-slate-500">通知渠道</span>
                  <select
                    value={setting.channel}
                    onChange={(event) => {
                      dispatch({ type: 'updateNotificationSetting', settingId: setting.id, patch: { channel: event.target.value as NotificationChannel } });
                      toast.success('通知设置已更新');
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                  >
                    {channels.map((channel) => <option key={channel} value={channel}>{channel}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs text-slate-500">提前提醒天数</span>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={setting.advanceDays}
                    onChange={(event) => {
                      dispatch({
                        type: 'updateNotificationSetting',
                        settingId: setting.id,
                        patch: { advanceDays: Math.max(0, Number(event.target.value)) },
                      });
                      toast.success('通知设置已更新');
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                  />
                </label>
                <label className="mt-5 inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={setting.quietHoursEnabled}
                    onChange={(event) => {
                      dispatch({ type: 'updateNotificationSetting', settingId: setting.id, patch: { quietHoursEnabled: event.target.checked } });
                      toast.success('通知设置已更新');
                    }}
                  />
                  启用静默时段
                </label>
                <button
                  onClick={() => toast.success(`测试通知已发送：${setting.title}`)}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
                >
                  <Send className="h-4 w-4" />
                  测试
                </button>
              </div>
            </section>
          ))}
        </div>
      </Card>

      <Card title="通知概览">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric icon={<MailCheck className="h-4 w-4" />} label="已开启" value={enabledCount} />
          <Metric label="邮件渠道" value={workspace.notificationSettings.filter((item) => item.channel === '邮件' || item.channel === '全部').length} />
          <Metric label="静默时段" value={workspace.notificationSettings.filter((item) => item.quietHoursEnabled).length} />
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon?: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
