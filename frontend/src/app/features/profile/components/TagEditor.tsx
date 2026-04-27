import { Plus, X } from 'lucide-react';
import { useState, type Dispatch } from 'react';
import { toast } from 'sonner';
import { Tag } from '@/app/components/PageShell';
import type { ProfileAction } from '../store';

const recommendedTags = ['LLM 安全', '隐私计算', '蓝队', 'DevSecOps', '可信执行环境', '安全运营', '保研材料'];

export function TagEditor({
  tags,
  dispatch,
}: {
  tags: string[];
  dispatch: Dispatch<ProfileAction>;
}) {
  const [value, setValue] = useState('');

  const addTag = (tag: string) => {
    const next = tag.trim();
    if (!next) return;
    dispatch({ type: 'addTag', tag: next });
    setValue('');
    toast.success(tags.includes(next) ? '标签已存在' : '标签已添加');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-brand-blue-50 px-2 py-1 text-xs text-brand-blue-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'removeTag', tag });
                toast.success('标签已删除');
              }}
              className="rounded p-0.5 hover:bg-brand-blue-100"
              aria-label={`删除标签 ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addTag(value);
          }}
          placeholder="新增兴趣标签"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue-400"
        />
        <button
          type="button"
          onClick={() => addTag(value)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
        >
          <Plus className="h-4 w-4" />
          添加
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs text-slate-500">推荐标签</p>
        <div className="flex flex-wrap gap-2">
          {recommendedTags.filter((tag) => !tags.includes(tag)).map((tag) => (
            <button key={tag} type="button" onClick={() => addTag(tag)}>
              <Tag tone="default">{tag}</Tag>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
