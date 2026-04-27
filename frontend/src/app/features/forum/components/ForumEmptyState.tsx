import { SearchX } from 'lucide-react';

export function ForumEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      <SearchX className="h-8 w-8 text-slate-300" />
      <p className="text-sm font-medium text-slate-800">{title}</p>
      {description && <p className="max-w-md text-xs leading-5 text-slate-500">{description}</p>}
    </div>
  );
}
