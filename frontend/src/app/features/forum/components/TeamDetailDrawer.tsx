import type { Dispatch, ReactNode } from 'react';
import { CalendarClock, Mail, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Tag } from '../../../components/PageShell';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import type { ForumAction } from '../store';
import type { TeamRecruitment } from '../types';
import { formatFullDateTime } from '../utils';

export function TeamDetailDrawer({
  team,
  dispatch,
  onClose,
}: {
  team?: TeamRecruitment;
  dispatch: Dispatch<ForumAction>;
  onClose: () => void;
}) {
  return (
    <Sheet open={Boolean(team)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:max-w-xl">
        {team && (
          <>
            <SheetHeader className="border-b border-slate-100 p-5">
              <SheetTitle className="pr-8 text-xl leading-7 text-slate-900">{team.title}</SheetTitle>
              <SheetDescription>
                {team.projectType} · {team.direction} · {formatFullDateTime(team.createdAt)}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <Tag tone={team.status === '招募中' ? 'green' : 'default'}>{team.status}</Tag>
                {team.applied && <Tag tone="blue">已申请</Tag>}
                {team.tags.map((tag) => (
                  <Tag key={tag} tone="purple">
                    {tag}
                  </Tag>
                ))}
              </div>

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">项目介绍</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{team.description}</p>
              </section>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard icon={<Users className="h-4 w-4" />} title="已有成员" content={team.currentMembers.join('、')} />
                <InfoCard
                  icon={<UserPlus className="h-4 w-4" />}
                  title="缺少角色"
                  content={team.requiredRoles.join('、')}
                />
              </div>

              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">申请要求</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{team.applicationRequirement}</p>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Mail className="h-4 w-4 text-brand-blue-600" />
                  联系方式
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{team.contactHint}</p>
              </section>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">成员进度</span>
                  <span className="text-slate-500">
                    {team.currentMembers.length}/{team.maxMembers}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-brand-blue-600"
                    style={{ width: `${Math.min(100, (team.currentMembers.length / team.maxMembers) * 100)}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={team.status !== '招募中'}
                onClick={() => {
                  dispatch({ type: team.applied ? 'cancelTeamApplication' : 'applyTeam', teamId: team.id });
                  toast.success(team.applied ? '已取消组队申请' : '已申请加入');
                }}
                className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                  team.status !== '招募中'
                    ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                    : team.applied
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700'
                }`}
              >
                <CalendarClock className="h-4 w-4" />
                {team.status !== '招募中' ? '暂不可申请' : team.applied ? '取消申请' : '申请加入'}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function InfoCard({ icon, title, content }: { icon: ReactNode; title: string; content: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <span className="text-brand-blue-600">{icon}</span>
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{content}</p>
    </div>
  );
}
