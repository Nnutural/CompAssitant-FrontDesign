export function ForumLoadingState({ label = '正在加载论坛工作台...' }: { label?: string }) {
  return (
    <div className="grid gap-3">
      <div className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
      <div className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
      <div className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white shadow-sm" />
      <p className="text-center text-xs text-slate-400">{label}</p>
    </div>
  );
}
