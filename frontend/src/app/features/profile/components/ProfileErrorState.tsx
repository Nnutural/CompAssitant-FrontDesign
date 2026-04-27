export function ProfileErrorState({
  title = '个人中心加载失败',
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-100 bg-red-50 p-6">
      <p className="text-sm font-semibold text-red-700">{title}</p>
      <p className="mt-2 text-sm text-red-600">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          重试
        </button>
      )}
    </div>
  );
}
