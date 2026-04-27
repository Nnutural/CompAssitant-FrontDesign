import type { Dispatch } from 'react';
import { Bookmark, Repeat, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tag } from '../../../components/PageShell';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import type { ForumAction } from '../store';
import type { ResourceExchange } from '../types';
import { formatFullDateTime } from '../utils';

export function ResourceExchangeDrawer({
  resource,
  dispatch,
  onClose,
}: {
  resource?: ResourceExchange;
  dispatch: Dispatch<ForumAction>;
  onClose: () => void;
}) {
  return (
    <Sheet open={Boolean(resource)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto bg-white p-0 sm:max-w-xl">
        {resource && (
          <>
            <SheetHeader className="border-b border-slate-100 p-5">
              <SheetTitle className="pr-8 text-xl leading-7 text-slate-900">{resource.title}</SheetTitle>
              <SheetDescription>
                {resource.ownerName} · {formatFullDateTime(resource.createdAt)}
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-5 p-5">
              <div className="flex flex-wrap gap-2">
                <Tag tone={resource.status === '可交换' ? 'green' : 'amber'}>{resource.status}</Tag>
                <Tag tone="blue">{resource.category}</Tag>
                {resource.favorited && <Tag tone="amber">已收藏</Tag>}
                {resource.exchangeRequested && <Tag tone="purple">已发起交换</Tag>}
                {resource.tags.map((tag) => (
                  <Tag key={tag} tone="purple">
                    {tag}
                  </Tag>
                ))}
              </div>

              <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">交换说明</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{resource.description}</p>
              </section>

              <div className="grid gap-3 sm:grid-cols-2">
                <Info title="我可提供" content={resource.offered} />
                <Info title="希望交换" content={resource.wanted} />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'toggleResourceFavorite', resourceId: resource.id });
                    toast.success(resource.favorited ? '已取消收藏资源' : '已收藏资源');
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                    resource.favorited ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  {resource.favorited ? '已收藏' : '收藏资源'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'toggleResourceExchange', resourceId: resource.id });
                    toast.success(resource.exchangeRequested ? '已取消交换请求' : '已发起交换');
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
                    resource.exchangeRequested ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-brand-blue-600 text-white hover:bg-brand-blue-700'
                  }`}
                >
                  {resource.exchangeRequested ? <Repeat className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {resource.exchangeRequested ? '取消交换' : '发起交换'}
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Info({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{content}</p>
    </div>
  );
}
