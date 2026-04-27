import { Save, X } from 'lucide-react';
import { useEffect, useState, type Dispatch } from 'react';
import { toast } from 'sonner';
import type { ProfileAction } from '../store';
import type { PersonaWeights, ProfileWorkspace, UserProfile } from '../types';

type UserForm = Pick<
  UserProfile,
  'displayName' | 'school' | 'college' | 'major' | 'grade' | 'bio' | 'goals' | 'weeklyHours'
> & {
  targetDirections: string;
};

export function ProfileEditDrawer({
  open,
  workspace,
  dispatch,
  onClose,
}: {
  open: boolean;
  workspace: ProfileWorkspace;
  dispatch: Dispatch<ProfileAction>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<UserForm>(() => userToForm(workspace.user));
  const [weights, setWeights] = useState<PersonaWeights>(workspace.persona.weights);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(userToForm(workspace.user));
    setWeights(workspace.persona.weights);
    setError('');
  }, [open, workspace.user, workspace.persona.weights]);

  if (!open) return null;

  const update = (key: keyof UserForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = () => {
    if (!form.displayName.trim() || !form.school.trim() || !form.major.trim()) {
      setError('姓名、学校和专业为必填项');
      return;
    }
    dispatch({
      type: 'updateUser',
      user: {
        displayName: form.displayName.trim(),
        school: form.school.trim(),
        college: form.college.trim(),
        major: form.major.trim(),
        grade: form.grade.trim(),
        bio: form.bio.trim(),
        goals: form.goals.trim(),
        weeklyHours: form.weeklyHours.trim(),
        targetDirections: form.targetDirections.split(/[，,]/).map((item) => item.trim()).filter(Boolean),
      },
      weights,
    });
    toast.success('资料已保存');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[560px] max-w-[96vw] flex-col bg-white shadow-2xl">
        <header className="flex min-h-16 items-center justify-between border-b border-slate-200 px-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">编辑用户画像</h2>
            <p className="mt-1 text-xs text-slate-500">修改后会自动保存到本地演示状态</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <section className="grid gap-4 sm:grid-cols-2">
            <Field label="姓名" value={form.displayName} onChange={(value) => update('displayName', value)} required />
            <Field label="学校" value={form.school} onChange={(value) => update('school', value)} required />
            <Field label="学院" value={form.college} onChange={(value) => update('college', value)} />
            <Field label="专业" value={form.major} onChange={(value) => update('major', value)} required />
            <Field label="年级" value={form.grade} onChange={(value) => update('grade', value)} />
            <Field label="每周投入" value={form.weeklyHours} onChange={(value) => update('weeklyHours', value)} />
          </section>

          <section className="space-y-4">
            <Field label="目标方向（用逗号分隔）" value={form.targetDirections} onChange={(value) => update('targetDirections', value)} />
            <Textarea label="个人目标" value={form.goals} onChange={(value) => update('goals', value)} />
            <Textarea label="个人简介" value={form.bio} onChange={(value) => update('bio', value)} />
          </section>

          <section>
            <h3 className="text-sm font-semibold text-slate-900">画像权重</h3>
            <div className="mt-3 space-y-3">
              {Object.entries(weights).map(([key, value]) => (
                <label key={key} className="block">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{weightLabel(key)}</span>
                    <span>{value}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={40}
                    value={value}
                    onChange={(event) => setWeights((current) => ({ ...current, [key]: Number(event.target.value) }))}
                    className="w-full accent-brand-blue-600"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            onClick={save}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            <Save className="h-4 w-4" />
            保存资料
          </button>
        </footer>
      </aside>
    </>
  );
}

function userToForm(user: UserProfile): UserForm {
  return {
    displayName: user.displayName,
    school: user.school,
    college: user.college,
    major: user.major,
    grade: user.grade,
    bio: user.bio,
    goals: user.goals,
    weeklyHours: user.weeklyHours,
    targetDirections: user.targetDirections.join('，'),
  };
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}{required ? ' *' : ''}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 outline-none focus:border-brand-blue-400"
      />
    </label>
  );
}

function weightLabel(key: string): string {
  const labels: Record<string, string> = {
    writing: '写作模块',
    research: '科研模块',
    practice: '实战模块',
    careers: '就业模块',
    tasks: '任务模块',
    forum: '论坛互动',
  };
  return labels[key] ?? key;
}
