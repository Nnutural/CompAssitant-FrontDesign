import type { Dispatch } from 'react';
import { useState } from 'react';
import { Bookmark, Plus, Repeat, Share2 } from 'lucide-react';
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
import { RESOURCE_CATEGORIES } from '../mockData';
import type { ForumAction } from '../store';
import type { ForumWorkspace } from '../types';
import { filterResources, parseTags } from '../utils';
import { ForumEmptyState } from './ForumEmptyState';
import { ResourceExchangeDrawer } from './ResourceExchangeDrawer';

const initialResourceForm = {
  title: '',
  offered: '',
  wanted: '',
  description: '',
  category: '资料',
  tags: '',
};

export function ResourceExchangeBoard({
  workspace,
  dispatch,
}: {
  workspace: ForumWorkspace;
  dispatch: Dispatch<ForumAction>;
}) {
  const [category, setCategory] = useState('全部');
  const [selectedResourceId, setSelectedResourceId] = useState<string>();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialResourceForm);
  const resources = filterResources(workspace.resources, category);
  const selectedResource = workspace.resources.find((resource) => resource.id === selectedResourceId);

  const publishResource = () => {
    if (!form.title.trim() || !form.offered.trim() || !form.wanted.trim()) {
      toast.error('请填写资源标题、可提供内容和希望交换内容');
      return;
    }
    dispatch({
      type: 'publishResource',
      resource: {
        title: form.title.trim(),
        offered: form.offered.trim(),
        wanted: form.wanted.trim(),
        description: form.description.trim() || '发布者希望通过社区资源交换完成互助协作。',
        category: form.category,
        tags: parseTags(form.tags),
      },
    });
    setForm(initialResourceForm);
    setOpen(false);
    toast.success('资源已发布');
  };

  return (
    <div className="space-y-4">
      <Card title="资源交换筛选" subtitle="按资源类型浏览资料、工具、数据集、算力和经验">
        <div className="flex flex-wrap items-center gap-2">
          {RESOURCE_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-lg px-3 py-2 text-sm ${
                category === item ? 'bg-brand-blue-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
          >
            <Plus className="h-4 w-4" />
            发布资源
          </button>
        </div>
      </Card>

      {resources.length === 0 ? (
        <ForumEmptyState title="暂无匹配资源" description="切换分类，或发布新的交换资源。" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-50 text-brand-blue-600">
                    <Repeat className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Tag tone={resource.status === '可交换' ? 'green' : 'amber'}>{resource.status}</Tag>
                      <Tag tone="blue">{resource.category}</Tag>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-slate-900">{resource.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">@{resource.ownerName}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="line-clamp-2 text-slate-600">
                    <span className="font-medium text-slate-800">提供：</span>
                    {resource.offered}
                  </p>
                  <p className="line-clamp-2 text-slate-600">
                    <span className="font-medium text-slate-800">希望：</span>
                    {resource.wanted}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Tag key={tag} tone="purple">
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedResourceId(resource.id)}
                    className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                  >
                    查看详情
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'toggleResourceFavorite', resourceId: resource.id });
                      toast.success(resource.favorited ? '已取消收藏资源' : '已收藏资源');
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                      resource.favorited ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {resource.favorited ? '已收藏' : '收藏'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: 'toggleResourceExchange', resourceId: resource.id });
                      toast.success(resource.exchangeRequested ? '已取消交换请求' : '已发起交换');
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs ${
                      resource.exchangeRequested ? 'bg-amber-50 text-amber-700' : 'bg-brand-blue-50 text-brand-blue-600 hover:bg-brand-blue-100'
                    }`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    {resource.exchangeRequested ? '取消交换' : '发起交换'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ResourceExchangeDrawer
        resource={selectedResource}
        dispatch={dispatch}
        onClose={() => setSelectedResourceId(undefined)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>发布资源交换</DialogTitle>
            <DialogDescription>不接入真实文件上传，仅记录可交换资源和状态。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="资源标题"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            >
              {RESOURCE_CATEGORIES.filter((item) => item !== '全部').map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              value={form.offered}
              onChange={(event) => setForm((current) => ({ ...current, offered: event.target.value }))}
              placeholder="我可提供"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <input
              value={form.wanted}
              onChange={(event) => setForm((current) => ({ ...current, wanted: event.target.value }))}
              placeholder="希望交换"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <input
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              placeholder="标签，用逗号分隔"
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={5}
              placeholder="交换说明、适用范围或注意事项"
              className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={publishResource}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
            >
              <Plus className="h-4 w-4" />
              发布资源
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
