import type {
  ForumBoard,
  ForumPost,
  ForumStats,
  ForumWorkspace,
  PostSortBy,
  QaQuestion,
  ResourceExchange,
  TeamRecruitment,
} from './types';

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatFullDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function autosaveLabel(status: ForumWorkspace['autosaveStatus']): string {
  const labels: Record<ForumWorkspace['autosaveStatus'], string> = {
    saved: '已保存',
    saving: '保存中',
    unsaved: '未保存',
    error: '保存失败',
  };
  return labels[status];
}

export function autosaveTone(status: ForumWorkspace['autosaveStatus']): string {
  const tones: Record<ForumWorkspace['autosaveStatus'], string> = {
    saved: 'bg-emerald-50 text-emerald-700',
    saving: 'bg-blue-50 text-brand-blue-600',
    unsaved: 'bg-amber-50 text-amber-700',
    error: 'bg-red-50 text-red-700',
  };
  return tones[status];
}

export function computeForumStats(workspace: ForumWorkspace): ForumStats {
  const comments = workspace.posts.reduce(
    (total, post) => total + post.comments.filter((comment) => comment.authorId === workspace.currentUser.id).length,
    0,
  );
  return {
    likes: workspace.likedPostIds.length,
    favorites:
      workspace.favoritePostIds.length +
      workspace.favoriteQuestionIds.length +
      workspace.favoriteResourceIds.length,
    comments,
    registrations: workspace.noticeRegistrationIds.length,
    teamApplications: workspace.joinedTeamIds.length,
    exchanges: workspace.exchangeRecords.filter((record) => record.status === '已发起').length,
  };
}

export function filterPosts(
  posts: ForumPost[],
  options: {
    board: ForumBoard;
    query: string;
    selectedTag: string;
    sortBy: PostSortBy;
    topicId?: string;
  },
): ForumPost[] {
  const query = options.query.trim().toLowerCase();
  return posts
    .filter((post) => post.board === options.board)
    .filter((post) => !options.topicId || post.topicId === options.topicId)
    .filter((post) => options.selectedTag === '全部' || post.tags.includes(options.selectedTag))
    .filter((post) => {
      if (!query) return true;
      const haystack = [post.title, post.content, post.authorName, post.tags.join(' ')].join(' ').toLowerCase();
      return haystack.includes(query);
    })
    .sort((left, right) => comparePosts(left, right, options.sortBy));
}

function comparePosts(left: ForumPost, right: ForumPost, sortBy: PostSortBy): number {
  if (sortBy === 'essence') {
    const essenceScore = Number(right.essence) - Number(left.essence);
    if (essenceScore !== 0) return essenceScore;
  }
  if (sortBy === 'hot') {
    const rightHeat = right.likeCount * 2 + right.replyCount * 3 + right.viewCount / 40;
    const leftHeat = left.likeCount * 2 + left.replyCount * 3 + left.viewCount / 40;
    return rightHeat - leftHeat;
  }
  if (sortBy === 'replies') return right.replyCount - left.replyCount;
  if (sortBy === 'views') return right.viewCount - left.viewCount;
  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
}

export function filterQuestions(
  questions: QaQuestion[],
  filter: '全部' | '待解决' | '已解决' | '我的收藏',
): QaQuestion[] {
  if (filter === '我的收藏') return questions.filter((question) => question.favorited);
  if (filter === '全部') return questions;
  return questions.filter((question) => question.status === filter);
}

export function filterTeams(
  teams: TeamRecruitment[],
  filters: { projectType: string; direction: string; status: string },
): TeamRecruitment[] {
  return teams.filter((team) => {
    const projectMatch = filters.projectType === '全部' || team.projectType === filters.projectType;
    const directionMatch = filters.direction === '全部' || team.direction.includes(filters.direction);
    const statusMatch = filters.status === '全部' || team.status === filters.status;
    return projectMatch && directionMatch && statusMatch;
  });
}

export function filterResources(resources: ResourceExchange[], category: string): ResourceExchange[] {
  if (category === '全部') return resources;
  return resources.filter((resource) => resource.category === category);
}

export function createExcerpt(content: string, max = 84): string {
  const normalized = content.replace(/\s+/g, ' ').trim();
  return normalized.length > max ? `${normalized.slice(0, max)}...` : normalized;
}

export function parseTags(value: string): string[] {
  return value
    .split(/[,，、]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function joinTags(tags: string[]): string {
  return tags.join('，');
}

export function createDemoId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function summarizePost(post: ForumPost): string {
  const firstSentence = post.content.split(/[。！？]/).find(Boolean) ?? post.excerpt;
  const tags = post.tags.slice(0, 3).join('、');
  return `摘要：${firstSentence}。建议关注「${tags}」相关证据、指标和复盘动作，适合作为答辩时的经验沉淀。`;
}
