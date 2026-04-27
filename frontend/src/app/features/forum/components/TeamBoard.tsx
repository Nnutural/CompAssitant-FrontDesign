import type { Dispatch } from 'react';
import { useMemo, useState } from 'react';
import { Plus, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Tag } from '../../../components/PageShell';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { TEAM_PROJECT_TYPES } from '../mockData';
import type { ForumAction } from '../store';
import type { ForumWorkspace, TeamProjectType } from '../types';
import { filterTeams, parseTags } from '../utils';
import { ForumEmptyState } from './ForumEmptyState';
import { TeamDetailDrawer } from './TeamDetailDrawer';

const initialTeamForm = {
  title: '',
  projectType: '挑战杯' as TeamProjectType,
  direction: '',
  description: '',
  requiredRoles: '',
  maxMembers: 4,
  tags: '',
};

export function TeamBoard({
  workspace,
  dispatch,
}: {
  workspace: ForumWorkspace;
  dispatch: Dispatch<ForumAction>;
}) {
  const [projectType, setProjectType] = useState('全部');
  const [direction, setDirection] = useState('全部');
  const [status, setStatus] = useState('全部');
  const [selectedTeamId, setSelectedTeamId] = useState<string>();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialTeamForm);

  const directions = useMemo(
    () => ['全部', ...Array.from(new Set(workspace.teams.map((team) => team.direction.split(' / ')[0])))],
    [workspace.teams],
  );
  const teams = filterTeams(workspace.teams, { projectType, direction, status });
  const selectedTeam = workspace.teams.find((team) => team.id === selectedTeamId);

  const publishTeam = () => {
    if (!form.title.trim() || !form.direction.trim() || !form.description.trim()) {
      toast.error('请补全组队标题、方向和介绍');
      return;
    }
    dispatch({
      type: 'publishTeam',
      team: {
        title: form.title.trim(),
        projectType: form.projectType,
        direction: form.direction.trim(),
        description: form.description.trim(),
        requiredRoles: parseTags(form.requiredRoles),
        currentMembers: [workspace.currentUser.name],
        maxMembers: Math.max(2, form.maxMembers),
        tags: parseTags(form.tags),
        status: '招募中',
        applicationRequirement: '请说明你的技能栈、可投入时间和希望承担的模块。',
        contactHint: '申请通过后会展示负责人联系方式，当前为 mock 演示文案。',
      },
    });
    setForm(initialTeamForm);
    setOpen(false);
    toast.success('组队需求已发布');
  };

  return (
    <div className="space-y-4">
      <Card title="组队筛选" subtitle="按项目类型、方向和状态筛选招募需求">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <select
            value={projectType}
            onChange={(event) => setProjectType(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
          >
            {TEAM_PROJECT_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
          >
            {directions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
          >
            {['全部', '招募中', '已满员', '已结束'].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            <Plus className="h-4 w-4" />
            发布组队需求
          </button>
        </div>
      </Card>

      {teams.length === 0 ? (
        <ForumEmptyState title="暂无匹配组队需求" description="切换筛选条件，或发布自己的组队需求。" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {teams.map((team) => (
            <Card key={team.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <Tag tone="blue">{team.projectType}</Tag>
                      <Tag tone={team.status === '招募中' ? 'green' : 'default'}>{team.status}</Tag>
                      {team.applied && <Tag tone="amber">已申请</Tag>}
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">{team.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{team.direction}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
                    <p className="text-xs text-slate-400">成员</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {team.currentMembers.length}/{team.maxMembers}
                    </p>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-slate-600">{team.description}</p>
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-500">缺少角色</p>
                  <div className="flex flex-wrap gap-2">
                    {team.requiredRoles.map((role) => (
                      <Tag key={role} tone="purple">
                        {role}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Users className="h-3.5 w-3.5" />
                    {team.currentMembers.join('、')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedTeamId(team.id)}
                    className="ml-auto rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                  >
                    查看详情
                  </button>
                  <button
                    type="button"
                    disabled={team.status !== '招募中'}
                    onClick={() => {
                      dispatch({ type: team.applied ? 'cancelTeamApplication' : 'applyTeam', teamId: team.id });
                      toast.success(team.applied ? '已取消组队申请' : '已申请加入');
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                      team.status !== '招募中'
                        ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                        : team.applied
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-brand-blue-50 text-brand-blue-600 hover:bg-brand-blue-100'
                    }`}
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {team.status !== '招募中' ? '已满员' : team.applied ? '取消申请' : '申请加入'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <TeamDetailDrawer team={selectedTeam} dispatch={dispatch} onClose={() => setSelectedTeamId(undefined)} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>发布组队需求</DialogTitle>
            <DialogDescription>用于演示社区内的项目协作招募流程。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="项目标题"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.projectType}
                onChange={(event) => setForm((current) => ({ ...current, projectType: event.target.value as TeamProjectType }))}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
              >
                {TEAM_PROJECT_TYPES.filter((item) => item !== '全部').map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <input
                value={form.direction}
                onChange={(event) => setForm((current) => ({ ...current, direction: event.target.value }))}
                placeholder="方向，例如 AI 安全 / 工具开发"
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
              />
            </div>
            <input
              value={form.requiredRoles}
              onChange={(event) => setForm((current) => ({ ...current, requiredRoles: event.target.value }))}
              placeholder="缺少角色，用逗号分隔"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <input
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              placeholder="标签，用逗号分隔"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <label className="grid gap-1 text-sm text-slate-600">
              最大人数
              <input
                type="number"
                min={2}
                max={8}
                value={form.maxMembers}
                onChange={(event) => setForm((current) => ({ ...current, maxMembers: Number(event.target.value) }))}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
              />
            </label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={5}
              placeholder="项目介绍、目标成果和协作方式"
              className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={publishTeam}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
            >
              <Plus className="h-4 w-4" />
              发布
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
