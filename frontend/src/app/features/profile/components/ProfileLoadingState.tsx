export function ProfileLoadingState({ text = '加载个人中心数据中...' }: { text?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-24 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <p className="mt-4 text-sm text-slate-500">{text}</p>
    </div>
  );
}
