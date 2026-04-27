import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PageShell } from '../components/PageShell';
import { ExperienceBoard } from '../features/forum/components/ExperienceBoard';
import { ForumLoadingState } from '../features/forum/components/ForumLoadingState';
import { ForumToolbar } from '../features/forum/components/ForumToolbar';
import { ForumWorkbenchBar } from '../features/forum/components/ForumWorkbenchBar';
import { NoticeBoard } from '../features/forum/components/NoticeBoard';
import { PostComposer } from '../features/forum/components/PostComposer';
import { PostDetailDrawer } from '../features/forum/components/PostDetailDrawer';
import { PostList } from '../features/forum/components/PostList';
import { QaBoard } from '../features/forum/components/QaBoard';
import { ResourceExchangeBoard } from '../features/forum/components/ResourceExchangeBoard';
import { TeamBoard } from '../features/forum/components/TeamBoard';
import { TopicBoard } from '../features/forum/components/TopicBoard';
import { useForumWorkspace } from '../features/forum/store';
import type { ForumTabKey, PostComposerInitialValue } from '../features/forum/types';

const tabs = [
  {
    key: 'security',
    label: '安全论坛',
    description: '网络安全技术深度讨论区，支持搜索、筛选、详情、点赞、收藏和评论。',
  },
  {
    key: 'topic',
    label: '话题讨论',
    description: '围绕 AI 安全、红蓝对抗、竞赛交流等热点话题发起讨论并沉淀帖子。',
  },
  {
    key: 'team',
    label: '项目组队',
    description: '发布和浏览竞赛、科研、开源项目组队需求，完成申请加入的协作闭环。',
  },
  {
    key: 'exp',
    label: '经验分享',
    description: '学长学姐的竞赛、科研、就业、保研与护网经验，支持摘要生成和收藏。',
  },
  {
    key: 'qa',
    label: '问答互助',
    description: '技术疑难问题互助社区，支持提问、回答、点赞、收藏和采纳答案。',
  },
  {
    key: 'notice',
    label: '活动公告',
    description: '官方活动、合作讲座、赛事报名和社区公告，支持报名与提醒状态保存。',
  },
  {
    key: 'exchange',
    label: '资源交换',
    description: '学习资料、工具、数据集、算力和经验的互换共享，支持发起交换和状态跟踪。',
  },
] as const;

type ForumPageTabKey = (typeof tabs)[number]['key'];

function isForumTab(value: string | null): value is ForumPageTabKey {
  return tabs.some((tab) => tab.key === value);
}

export function Forum() {
  const { workspace, dispatch, saveNow, resetDemo } = useForumWorkspace();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState<string>();
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [composerInitial, setComposerInitial] = useState<PostComposerInitialValue>();
  const tabParam = params.get('tab');
  const activeTab: ForumTabKey = isForumTab(tabParam) ? tabParam : 'security';
  const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
  const currentLabel = tabs[currentIndex]?.label ?? tabs[0].label;
  const selectedPost = workspace.posts.find((post) => post.id === selectedPostId);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (workspace.activeBoard !== activeTab) {
      dispatch({ type: 'setActiveBoard', board: activeTab });
    }
  }, [activeTab, dispatch, workspace.activeBoard]);

  const goToTab = (key: ForumTabKey) => {
    navigate(`/forum?tab=${key}`);
  };

  const goPrev = () => {
    const nextIndex = Math.max(0, currentIndex - 1);
    goToTab(tabs[nextIndex].key);
  };

  const goNext = () => {
    const nextIndex = Math.min(tabs.length - 1, currentIndex + 1);
    goToTab(tabs[nextIndex].key);
  };

  const handleSave = () => {
    const ok = saveNow();
    if (ok) toast.success('论坛工作台已保存');
    else toast.error('保存失败');
  };

  const handleReset = () => {
    resetDemo();
    setSelectedPostId(undefined);
    setComposerInitial(undefined);
    setComposerOpen(false);
    setDraftsOpen(false);
    goToTab('security');
    toast.success('已重置演示数据');
  };

  const openComposer = () => {
    setComposerInitial(undefined);
    setComposerOpen(true);
  };

  const consumeComposerInitial = useCallback(() => {
    setComposerInitial(undefined);
  }, []);

  const tabContent: Record<ForumTabKey, () => ReactNode> = {
    security: () => (
      <PostList
        board="security"
        workspace={workspace}
        dispatch={dispatch}
        onOpenPost={setSelectedPostId}
        title="安全论坛帖子"
      />
    ),
    topic: () => (
      <TopicBoard
        workspace={workspace}
        dispatch={dispatch}
        onOpenPost={setSelectedPostId}
        onComposeForTopic={(topic) => {
          dispatch({ type: 'setActiveTopic', topicId: topic.id });
          setComposerInitial({
            board: 'security',
            title: `${topic.title} 讨论：`,
            tags: topic.tags,
            topicId: topic.id,
          });
          setComposerOpen(true);
        }}
      />
    ),
    team: () => <TeamBoard workspace={workspace} dispatch={dispatch} />,
    exp: () => <ExperienceBoard workspace={workspace} dispatch={dispatch} onOpenPost={setSelectedPostId} />,
    qa: () => <QaBoard workspace={workspace} dispatch={dispatch} />,
    notice: () => <NoticeBoard workspace={workspace} dispatch={dispatch} />,
    exchange: () => <ResourceExchangeBoard workspace={workspace} dispatch={dispatch} />,
  };

  return (
    <>
      <PageShell
        title="交流论坛"
        subtitle="专业社区：话题、组队、经验、问答、活动与资源交换"
        defaultTab="security"
        actions={
          <ForumToolbar
            draftsCount={workspace.drafts.length}
            onOpenComposer={openComposer}
            onOpenDrafts={() => setDraftsOpen(true)}
            onSave={handleSave}
            onReset={handleReset}
          />
        }
        tabs={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
          description: tab.description,
          render: () => (
            <div className="space-y-4">
              <ForumWorkbenchBar
                workspace={workspace}
                currentLabel={currentLabel}
                onPrev={goPrev}
                onNext={goNext}
              />
              {loading ? <ForumLoadingState /> : tabContent[tab.key]()}
            </div>
          ),
        }))}
      />

      <PostDetailDrawer
        post={selectedPost}
        dispatch={dispatch}
        onClose={() => setSelectedPostId(undefined)}
      />
      <PostComposer
        workspace={workspace}
        dispatch={dispatch}
        open={composerOpen}
        draftsOpen={draftsOpen}
        initialValue={composerInitial}
        onOpenChange={setComposerOpen}
        onDraftsOpenChange={setDraftsOpen}
        onInitialConsumed={consumeComposerInitial}
      />
    </>
  );
}
