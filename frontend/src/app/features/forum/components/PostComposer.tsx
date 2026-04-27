import type { Dispatch } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { FileText, Save, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import type { ForumAction } from '../store';
import type { ForumBoard, ForumDraft, ForumWorkspace, PostComposerInitialValue } from '../types';
import { createDemoId, formatFullDateTime, joinTags, parseTags } from '../utils';

const emptyForm = {
  draftId: undefined as string | undefined,
  title: '',
  board: 'security' as ForumBoard,
  tags: '',
  content: '',
  topicId: undefined as string | undefined,
};

export function PostComposer({
  workspace,
  dispatch,
  open,
  draftsOpen,
  initialValue,
  onOpenChange,
  onDraftsOpenChange,
  onInitialConsumed,
}: {
  workspace: ForumWorkspace;
  dispatch: Dispatch<ForumAction>;
  open: boolean;
  draftsOpen: boolean;
  initialValue?: PostComposerInitialValue;
  onOpenChange: (open: boolean) => void;
  onDraftsOpenChange: (open: boolean) => void;
  onInitialConsumed: () => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const activeTopic = useMemo(
    () => workspace.topics.find((topic) => topic.id === form.topicId),
    [form.topicId, workspace.topics],
  );

  useEffect(() => {
    if (!open) return;
    if (!initialValue) return;
    setForm({
      draftId: initialValue.draftId,
      title: initialValue.title ?? '',
      board: initialValue.board ?? 'security',
      tags: joinTags(initialValue.tags ?? []),
      content: initialValue.content ?? '',
      topicId: initialValue.topicId,
    });
    onInitialConsumed();
  }, [initialValue, onInitialConsumed, open]);

  const clearForm = () => setForm(emptyForm);

  const saveDraft = () => {
    if (!form.title.trim() && !form.content.trim()) {
      toast.error('草稿至少需要标题或正文');
      return;
    }
    const draft: ForumDraft = {
      id: form.draftId ?? createDemoId('draft'),
      type: 'post',
      title: form.title.trim() || '未命名帖子草稿',
      content: form.content.trim(),
      tags: parseTags(form.tags),
      board: form.board,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'saveDraft', draft });
    setForm((current) => ({ ...current, draftId: draft.id }));
    toast.success('草稿已保存');
  };

  const publishPost = () => {
    if (!form.title.trim()) {
      toast.error('请输入帖子标题');
      return;
    }
    if (!form.content.trim()) {
      toast.error('请输入帖子正文');
      return;
    }
    const tags = parseTags(form.tags);
    dispatch({
      type: 'publishPost',
      title: form.title.trim(),
      board: form.board,
      tags: tags.length > 0 ? tags : ['讨论'],
      content: form.content.trim(),
      topicId: form.topicId,
    });
    if (form.draftId) dispatch({ type: 'deleteDraft', draftId: form.draftId });
    clearForm();
    onOpenChange(false);
    toast.success('帖子已发布');
  };

  const continueDraft = (draft: ForumDraft) => {
    setForm({
      draftId: draft.id,
      title: draft.title,
      board: draft.board ?? 'security',
      tags: joinTags(draft.tags),
      content: draft.content,
      topicId: undefined,
    });
    onDraftsOpenChange(false);
    onOpenChange(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>发布帖子</DialogTitle>
            <DialogDescription>
              选择安全论坛或经验分享板块，正文和草稿会保存在本地演示数据中。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {activeTopic && (
              <div className="rounded-lg border border-brand-blue-100 bg-brand-blue-50 px-3 py-2 text-sm text-brand-blue-700">
                将发布到话题：{activeTopic.title}
              </div>
            )}
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-slate-700">标题</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="例如：LLM 越狱攻击防御思路"
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-slate-700">板块</span>
                <select
                  value={form.board}
                  onChange={(event) => setForm((current) => ({ ...current, board: event.target.value as ForumBoard }))}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
                >
                  <option value="security">安全论坛</option>
                  <option value="exp">经验分享</option>
                </select>
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-slate-700">标签</span>
                <input
                  value={form.tags}
                  onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                  placeholder="AI 安全，竞赛，工具"
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
                />
              </label>
            </div>
            <label className="grid gap-1.5 text-sm">
              <span className="font-medium text-slate-700">正文</span>
              <textarea
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                rows={8}
                placeholder="写下背景、步骤、结论或需要社区协作的问题..."
                className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm leading-6 outline-none focus:border-brand-blue-300 focus:ring-2 focus:ring-brand-blue-100"
              />
            </label>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                clearForm();
                toast.success('表单已清空');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Trash2 className="h-4 w-4" />
              清空
            </button>
            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Save className="h-4 w-4" />
              保存草稿
            </button>
            <button
              type="button"
              onClick={publishPost}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-700"
            >
              <Send className="h-4 w-4" />
              发布
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={draftsOpen} onOpenChange={onDraftsOpenChange}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>我的草稿</DialogTitle>
            <DialogDescription>草稿保存在 localStorage，刷新后仍可继续编辑。</DialogDescription>
          </DialogHeader>
          {workspace.drafts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
              暂无草稿
            </div>
          ) : (
            <div className="max-h-[420px] space-y-3 overflow-y-auto">
              {workspace.drafts.map((draft) => (
                <div key={draft.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-4 w-4 text-brand-blue-600" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{draft.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{draft.content || '暂无正文'}</p>
                      <p className="mt-2 text-xs text-slate-400">更新于 {formatFullDateTime(draft.updatedAt)}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => continueDraft(draft)}
                        className="rounded-lg bg-brand-blue-50 px-2.5 py-1.5 text-xs text-brand-blue-600 hover:bg-brand-blue-100"
                      >
                        继续编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'deleteDraft', draftId: draft.id });
                          toast.success('草稿已删除');
                        }}
                        className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
