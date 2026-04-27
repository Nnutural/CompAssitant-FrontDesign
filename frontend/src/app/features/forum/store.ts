import { useCallback, useEffect, useReducer } from 'react';
import { createDefaultForumWorkspace, FORUM_STORAGE_KEY } from './mockData';
import type {
  ForumBoard,
  ForumDraft,
  ForumPost,
  ForumTabKey,
  ForumWorkspace,
  PostSortBy,
  QaAnswer,
  QaQuestion,
  ResourceExchange,
  TeamRecruitment,
} from './types';
import { createDemoId, createExcerpt } from './utils';

export type ForumAction =
  | { type: 'replaceWorkspace'; workspace: ForumWorkspace }
  | { type: 'setAutosaveStatus'; status: ForumWorkspace['autosaveStatus']; savedAt?: string }
  | { type: 'setActiveBoard'; board: ForumTabKey }
  | { type: 'setActiveTopic'; topicId?: string }
  | { type: 'setSearchQuery'; query: string }
  | { type: 'setSelectedTag'; tag: string }
  | { type: 'setSortBy'; sortBy: PostSortBy }
  | { type: 'viewPost'; postId: string }
  | { type: 'togglePostLike'; postId: string }
  | { type: 'togglePostFavorite'; postId: string }
  | { type: 'addPostComment'; postId: string; content: string }
  | { type: 'publishPost'; title: string; board: ForumBoard; tags: string[]; content: string; topicId?: string }
  | { type: 'saveDraft'; draft: ForumDraft }
  | { type: 'deleteDraft'; draftId: string }
  | { type: 'toggleTopicFollow'; topicId: string }
  | { type: 'applyTeam'; teamId: string }
  | { type: 'cancelTeamApplication'; teamId: string }
  | { type: 'publishTeam'; team: Omit<TeamRecruitment, 'id' | 'ownerId' | 'ownerName' | 'applied' | 'createdAt'> }
  | { type: 'addQuestion'; title: string; content: string; tags: string[] }
  | { type: 'toggleQuestionFavorite'; questionId: string }
  | { type: 'viewQuestion'; questionId: string }
  | { type: 'addAnswer'; questionId: string; content: string }
  | { type: 'toggleAnswerLike'; questionId: string; answerId: string }
  | { type: 'acceptAnswer'; questionId: string; answerId: string }
  | { type: 'toggleNoticeRegistration'; noticeId: string }
  | { type: 'toggleNoticeReminder'; noticeId: string }
  | { type: 'publishResource'; resource: Omit<ResourceExchange, 'id' | 'ownerId' | 'ownerName' | 'status' | 'favorited' | 'exchangeRequested' | 'createdAt'> }
  | { type: 'toggleResourceFavorite'; resourceId: string }
  | { type: 'toggleResourceExchange'; resourceId: string };

function markDirty(workspace: ForumWorkspace): ForumWorkspace {
  return {
    ...workspace,
    autosaveStatus: 'unsaved',
    updatedAt: new Date().toISOString(),
  };
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function reducer(workspace: ForumWorkspace, action: ForumAction): ForumWorkspace {
  switch (action.type) {
    case 'replaceWorkspace':
      return action.workspace;
    case 'setAutosaveStatus':
      return {
        ...workspace,
        autosaveStatus: action.status,
        savedAt: action.savedAt ?? workspace.savedAt,
      };
    case 'setActiveBoard':
      return markDirty({ ...workspace, activeBoard: action.board });
    case 'setActiveTopic':
      return markDirty({ ...workspace, activeTopicId: action.topicId });
    case 'setSearchQuery':
      return markDirty({ ...workspace, searchQuery: action.query });
    case 'setSelectedTag':
      return markDirty({ ...workspace, selectedTag: action.tag });
    case 'setSortBy':
      return markDirty({ ...workspace, sortBy: action.sortBy });
    case 'viewPost':
      return markDirty({
        ...workspace,
        posts: workspace.posts.map((post) =>
          post.id === action.postId ? { ...post, viewCount: post.viewCount + 1 } : post,
        ),
      });
    case 'togglePostLike': {
      const liked = workspace.likedPostIds.includes(action.postId);
      return markDirty({
        ...workspace,
        likedPostIds: toggleValue(workspace.likedPostIds, action.postId),
        posts: workspace.posts.map((post) =>
          post.id === action.postId
            ? {
                ...post,
                liked: !liked,
                likeCount: Math.max(0, post.likeCount + (liked ? -1 : 1)),
              }
            : post,
        ),
      });
    }
    case 'togglePostFavorite': {
      const favorited = workspace.favoritePostIds.includes(action.postId);
      return markDirty({
        ...workspace,
        favoritePostIds: toggleValue(workspace.favoritePostIds, action.postId),
        posts: workspace.posts.map((post) =>
          post.id === action.postId
            ? {
                ...post,
                favorited: !favorited,
                favoriteCount: Math.max(0, post.favoriteCount + (favorited ? -1 : 1)),
              }
            : post,
        ),
      });
    }
    case 'addPostComment': {
      const now = new Date().toISOString();
      return markDirty({
        ...workspace,
        posts: workspace.posts.map((post) => {
          if (post.id !== action.postId) return post;
          return {
            ...post,
            replyCount: post.replyCount + 1,
            updatedAt: now,
            comments: [
              ...post.comments,
              {
                id: createDemoId('comment'),
                postId: post.id,
                authorId: workspace.currentUser.id,
                authorName: workspace.currentUser.name,
                content: action.content,
                likeCount: 0,
                liked: false,
                createdAt: now,
              },
            ],
          };
        }),
      });
    }
    case 'publishPost': {
      const now = new Date().toISOString();
      const post: ForumPost = {
        id: createDemoId('post'),
        board: action.board,
        title: action.title,
        authorId: workspace.currentUser.id,
        authorName: workspace.currentUser.name,
        content: action.content,
        excerpt: createExcerpt(action.content),
        tags: action.tags,
        topicId: action.topicId,
        replyCount: 0,
        viewCount: 0,
        likeCount: 0,
        favoriteCount: 0,
        liked: false,
        favorited: false,
        pinned: false,
        essence: false,
        createdAt: now,
        updatedAt: now,
        comments: [],
      };
      return markDirty({
        ...workspace,
        posts: [post, ...workspace.posts],
        topics: workspace.topics.map((topic) =>
          topic.id === action.topicId
            ? {
                ...topic,
                discussionCount: topic.discussionCount + 1,
                relatedPostIds: [post.id, ...topic.relatedPostIds],
              }
            : topic,
        ),
      });
    }
    case 'saveDraft': {
      const exists = workspace.drafts.some((draft) => draft.id === action.draft.id);
      return markDirty({
        ...workspace,
        drafts: exists
          ? workspace.drafts.map((draft) => (draft.id === action.draft.id ? action.draft : draft))
          : [action.draft, ...workspace.drafts],
      });
    }
    case 'deleteDraft':
      return markDirty({
        ...workspace,
        drafts: workspace.drafts.filter((draft) => draft.id !== action.draftId),
      });
    case 'toggleTopicFollow':
      return markDirty({
        ...workspace,
        topics: workspace.topics.map((topic) =>
          topic.id === action.topicId ? { ...topic, followed: !topic.followed } : topic,
        ),
      });
    case 'applyTeam': {
      const now = new Date().toISOString();
      return markDirty({
        ...workspace,
        joinedTeamIds: workspace.joinedTeamIds.includes(action.teamId)
          ? workspace.joinedTeamIds
          : [...workspace.joinedTeamIds, action.teamId],
        teams: workspace.teams.map((team) =>
          team.id === action.teamId ? { ...team, applied: true, appliedAt: now } : team,
        ),
      });
    }
    case 'cancelTeamApplication':
      return markDirty({
        ...workspace,
        joinedTeamIds: workspace.joinedTeamIds.filter((teamId) => teamId !== action.teamId),
        teams: workspace.teams.map((team) =>
          team.id === action.teamId ? { ...team, applied: false, appliedAt: undefined } : team,
        ),
      });
    case 'publishTeam': {
      const now = new Date().toISOString();
      const team: TeamRecruitment = {
        ...action.team,
        id: createDemoId('team'),
        ownerId: workspace.currentUser.id,
        ownerName: workspace.currentUser.name,
        applied: false,
        createdAt: now,
      };
      return markDirty({ ...workspace, teams: [team, ...workspace.teams] });
    }
    case 'addQuestion': {
      const now = new Date().toISOString();
      const question: QaQuestion = {
        id: createDemoId('qa'),
        title: action.title,
        content: action.content,
        authorId: workspace.currentUser.id,
        authorName: workspace.currentUser.name,
        tags: action.tags,
        status: '待解决',
        answerCount: 0,
        viewCount: 0,
        favorited: false,
        answers: [],
        createdAt: now,
      };
      return markDirty({ ...workspace, questions: [question, ...workspace.questions] });
    }
    case 'toggleQuestionFavorite': {
      const favorited = workspace.favoriteQuestionIds.includes(action.questionId);
      return markDirty({
        ...workspace,
        favoriteQuestionIds: toggleValue(workspace.favoriteQuestionIds, action.questionId),
        questions: workspace.questions.map((question) =>
          question.id === action.questionId ? { ...question, favorited: !favorited } : question,
        ),
      });
    }
    case 'viewQuestion':
      return markDirty({
        ...workspace,
        questions: workspace.questions.map((question) =>
          question.id === action.questionId ? { ...question, viewCount: question.viewCount + 1 } : question,
        ),
      });
    case 'addAnswer': {
      const now = new Date().toISOString();
      return markDirty({
        ...workspace,
        questions: workspace.questions.map((question) => {
          if (question.id !== action.questionId) return question;
          const answer: QaAnswer = {
            id: createDemoId('answer'),
            questionId: question.id,
            authorId: workspace.currentUser.id,
            authorName: workspace.currentUser.name,
            content: action.content,
            likeCount: 0,
            liked: false,
            accepted: false,
            createdAt: now,
          };
          return {
            ...question,
            answerCount: question.answerCount + 1,
            answers: [...question.answers, answer],
          };
        }),
      });
    }
    case 'toggleAnswerLike':
      return markDirty({
        ...workspace,
        questions: workspace.questions.map((question) => {
          if (question.id !== action.questionId) return question;
          return {
            ...question,
            answers: question.answers.map((answer) =>
              answer.id === action.answerId
                ? {
                    ...answer,
                    liked: !answer.liked,
                    likeCount: Math.max(0, answer.likeCount + (answer.liked ? -1 : 1)),
                  }
                : answer,
            ),
          };
        }),
      });
    case 'acceptAnswer':
      return markDirty({
        ...workspace,
        questions: workspace.questions.map((question) => {
          if (question.id !== action.questionId) return question;
          return {
            ...question,
            status: '已解决',
            acceptedAnswerId: action.answerId,
            answers: question.answers.map((answer) => ({
              ...answer,
              accepted: answer.id === action.answerId,
            })),
          };
        }),
      });
    case 'toggleNoticeRegistration': {
      const registered = workspace.noticeRegistrationIds.includes(action.noticeId);
      return markDirty({
        ...workspace,
        noticeRegistrationIds: toggleValue(workspace.noticeRegistrationIds, action.noticeId),
        notices: workspace.notices.map((notice) =>
          notice.id === action.noticeId ? { ...notice, registered: !registered } : notice,
        ),
      });
    }
    case 'toggleNoticeReminder':
      return markDirty({
        ...workspace,
        notices: workspace.notices.map((notice) =>
          notice.id === action.noticeId ? { ...notice, reminded: !notice.reminded } : notice,
        ),
      });
    case 'publishResource': {
      const now = new Date().toISOString();
      const resource: ResourceExchange = {
        ...action.resource,
        id: createDemoId('resource'),
        ownerId: workspace.currentUser.id,
        ownerName: workspace.currentUser.name,
        status: '可交换',
        favorited: false,
        exchangeRequested: false,
        createdAt: now,
      };
      return markDirty({ ...workspace, resources: [resource, ...workspace.resources] });
    }
    case 'toggleResourceFavorite': {
      const favorited = workspace.favoriteResourceIds.includes(action.resourceId);
      return markDirty({
        ...workspace,
        favoriteResourceIds: toggleValue(workspace.favoriteResourceIds, action.resourceId),
        resources: workspace.resources.map((resource) =>
          resource.id === action.resourceId ? { ...resource, favorited: !favorited } : resource,
        ),
      });
    }
    case 'toggleResourceExchange': {
      const resource = workspace.resources.find((item) => item.id === action.resourceId);
      if (!resource) return workspace;
      const nextRequested = !resource.exchangeRequested;
      const now = new Date().toISOString();
      const existing = workspace.exchangeRecords.find((record) => record.resourceId === action.resourceId);
      return markDirty({
        ...workspace,
        exchangeRecords: existing
          ? workspace.exchangeRecords.map((record) =>
              record.resourceId === action.resourceId
                ? { ...record, status: nextRequested ? '已发起' : '已取消', createdAt: now }
                : record,
            )
          : [
              ...workspace.exchangeRecords,
              {
                id: createDemoId('exchange'),
                resourceId: action.resourceId,
                userId: workspace.currentUser.id,
                status: '已发起',
                createdAt: now,
              },
            ],
        resources: workspace.resources.map((item) =>
          item.id === action.resourceId
            ? {
                ...item,
                exchangeRequested: nextRequested,
                status: nextRequested ? '交换中' : '可交换',
              }
            : item,
        ),
      });
    }
    default:
      return workspace;
  }
}

function applyPersistedFlags(workspace: ForumWorkspace): ForumWorkspace {
  return {
    ...workspace,
    posts: workspace.posts.map((post) => ({
      ...post,
      liked: workspace.likedPostIds.includes(post.id) || post.liked,
      favorited: workspace.favoritePostIds.includes(post.id) || post.favorited,
      comments: post.comments.map((comment) => ({ ...comment })),
    })),
    questions: workspace.questions.map((question) => ({
      ...question,
      favorited: workspace.favoriteQuestionIds.includes(question.id) || question.favorited,
      answers: question.answers.map((answer) => ({ ...answer })),
    })),
    resources: workspace.resources.map((resource) => ({
      ...resource,
      favorited: workspace.favoriteResourceIds.includes(resource.id) || resource.favorited,
    })),
    teams: workspace.teams.map((team) => ({
      ...team,
      applied: workspace.joinedTeamIds.includes(team.id) || team.applied,
    })),
    notices: workspace.notices.map((notice) => ({
      ...notice,
      registered: workspace.noticeRegistrationIds.includes(notice.id) || notice.registered,
    })),
  };
}

function loadInitialWorkspace(): ForumWorkspace {
  const defaults = createDefaultForumWorkspace();
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = window.localStorage.getItem(FORUM_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<ForumWorkspace>;
    return applyPersistedFlags({
      ...defaults,
      ...parsed,
      currentUser: parsed.currentUser ?? defaults.currentUser,
      users: parsed.users ?? defaults.users,
      posts: parsed.posts ?? defaults.posts,
      topics: parsed.topics ?? defaults.topics,
      teams: parsed.teams ?? defaults.teams,
      questions: parsed.questions ?? defaults.questions,
      notices: parsed.notices ?? defaults.notices,
      resources: parsed.resources ?? defaults.resources,
      drafts: parsed.drafts ?? [],
      likedPostIds: parsed.likedPostIds ?? [],
      favoritePostIds: parsed.favoritePostIds ?? [],
      favoriteQuestionIds: parsed.favoriteQuestionIds ?? [],
      favoriteResourceIds: parsed.favoriteResourceIds ?? [],
      joinedTeamIds: parsed.joinedTeamIds ?? [],
      noticeRegistrationIds: parsed.noticeRegistrationIds ?? [],
      exchangeRecords: parsed.exchangeRecords ?? [],
      autosaveStatus: 'saved',
    });
  } catch {
    return defaults;
  }
}

function persistWorkspace(workspace: ForumWorkspace, savedAt: string): void {
  const snapshot: ForumWorkspace = {
    ...workspace,
    savedAt,
    autosaveStatus: 'saved',
  };
  window.localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(snapshot));
}

export function useForumWorkspace() {
  const [workspace, dispatch] = useReducer(reducer, undefined, loadInitialWorkspace);

  useEffect(() => {
    if (workspace.autosaveStatus !== 'unsaved') return undefined;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'setAutosaveStatus', status: 'saving' });
      window.setTimeout(() => {
        try {
          const savedAt = new Date().toISOString();
          persistWorkspace(workspace, savedAt);
          dispatch({ type: 'setAutosaveStatus', status: 'saved', savedAt });
        } catch {
          dispatch({ type: 'setAutosaveStatus', status: 'error' });
        }
      }, 180);
    }, 750);
    return () => window.clearTimeout(timer);
  }, [workspace]);

  const saveNow = useCallback(() => {
    dispatch({ type: 'setAutosaveStatus', status: 'saving' });
    try {
      const savedAt = new Date().toISOString();
      persistWorkspace(workspace, savedAt);
      dispatch({ type: 'setAutosaveStatus', status: 'saved', savedAt });
      return true;
    } catch {
      dispatch({ type: 'setAutosaveStatus', status: 'error' });
      return false;
    }
  }, [workspace]);

  const resetDemo = useCallback(() => {
    const next = createDefaultForumWorkspace();
    window.localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(next));
    dispatch({ type: 'replaceWorkspace', workspace: next });
  }, []);

  return { workspace, dispatch, saveNow, resetDemo };
}
