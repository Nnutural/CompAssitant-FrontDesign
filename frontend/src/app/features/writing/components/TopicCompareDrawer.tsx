import { X } from 'lucide-react';
import type { TopicIdea } from '../types';

export function TopicCompareDrawer({
  open,
  topics,
  onClose,
  onRemove,
}: {
  open: boolean;
  topics: TopicIdea[];
  onClose: () => void;
  onRemove: (topicId: string) => void;
}) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="关闭对比遮罩"
        className="fixed inset-0 z-40 cursor-default bg-slate-900/20"
        onClick={onClose}
      />
      <aside className="fixed bottom-0 right-0 top-0 z-50 flex w-[520px] max-w-[92vw] flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">选题多维对比</h2>
            <p className="mt-0.5 text-xs text-slate-500">匹配度、创新性、可行性和数据条件并排评估</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {topics.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
              尚未加入对比的选题。
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <article key={topic.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{topic.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">{topic.direction}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(topic.id)}
                      className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                    >
                      移除
                    </button>
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-brand-blue-50 p-2">
                      <dt className="text-brand-blue-700">匹配度</dt>
                      <dd className="mt-1 text-lg font-semibold text-brand-blue-700">{topic.matchScore}</dd>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-2">
                      <dt className="text-emerald-700">创新性</dt>
                      <dd className="mt-1 text-lg font-semibold text-emerald-700">{topic.innovationScore}</dd>
                    </div>
                    <div className="rounded-lg bg-amber-50 p-2">
                      <dt className="text-amber-700">可行性</dt>
                      <dd className="mt-1 text-lg font-semibold text-amber-700">{topic.feasibilityScore}</dd>
                    </div>
                  </dl>
                  <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">数据可得性：</span>
                      {topic.dataAvailability}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">难度：</span>
                      {topic.difficulty}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">推荐理由：</span>
                      {topic.recommendedReason}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
