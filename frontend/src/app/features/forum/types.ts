export type AutosaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export type ForumTabKey =
  | 'security'
  | 'topic'
  | 'team'
  | 'exp'
  | 'qa'
  | 'notice'
  | 'exchange';

export type ForumBoard = 'security' | 'exp';
export type PostSortBy = 'latest' | 'hot' | 'replies' | 'views' | 'essence';
export type ForumDraftType = 'post' | 'question' | 'team' | 'resource';
export type TeamProjectType = '挑战杯' | '信安赛' | '开源项目' | '大创' | '科研项目';
export type TeamStatus = '招募中' | '已满员' | '已结束';
export type QaStatus = '待解决' | '已解决';
export type NoticeType = '官方' | '合作' | '赛事' | '讲座' | '活动';
export type ResourceStatus = '可交换' | '交换中' | '已完成';

export interface ForumWorkspace {
  id: string;
  activeBoard: ForumTabKey;
  activeTopicId?: string;
  searchQuery: string;
  selectedTag: string;
  sortBy: PostSortBy;
  currentUser: ForumUser;
  users: ForumUser[];
  posts: ForumPost[];
  topics: ForumTopic[];
  teams: TeamRecruitment[];
  questions: QaQuestion[];
  notices: ForumNotice[];
  resources: ResourceExchange[];
  drafts: ForumDraft[];
  likedPostIds: string[];
  favoritePostIds: string[];
  favoriteQuestionIds: string[];
  favoriteResourceIds: string[];
  joinedTeamIds: string[];
  noticeRegistrationIds: string[];
  exchangeRecords: ExchangeRecord[];
  autosaveStatus: AutosaveStatus;
  savedAt: string;
  updatedAt: string;
}

export interface ForumUser {
  id: string;
  name: string;
  avatarText: string;
  role: string;
  school: string;
  reputation: number;
  postCount: number;
  badges: string[];
  activeDays: number;
}

export interface ForumPost {
  id: string;
  board: ForumBoard;
  title: string;
  authorId: string;
  authorName: string;
  content: string;
  excerpt: string;
  tags: string[];
  topicId?: string;
  replyCount: number;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  liked: boolean;
  favorited: boolean;
  pinned: boolean;
  essence: boolean;
  createdAt: string;
  updatedAt: string;
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  likeCount: number;
  liked: boolean;
  createdAt: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  discussionCount: number;
  heatScore: number;
  followed: boolean;
  relatedPostIds: string[];
}

export interface TeamRecruitment {
  id: string;
  title: string;
  projectType: TeamProjectType;
  direction: string;
  description: string;
  requiredRoles: string[];
  currentMembers: string[];
  maxMembers: number;
  ownerId: string;
  ownerName: string;
  tags: string[];
  status: TeamStatus;
  applied: boolean;
  appliedAt?: string;
  applicationRequirement: string;
  contactHint: string;
  createdAt: string;
}

export interface QaQuestion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags: string[];
  status: QaStatus;
  answerCount: number;
  viewCount: number;
  favorited: boolean;
  acceptedAnswerId?: string;
  answers: QaAnswer[];
  createdAt: string;
}

export interface QaAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  content: string;
  likeCount: number;
  liked: boolean;
  accepted: boolean;
  createdAt: string;
}

export interface ForumNotice {
  id: string;
  title: string;
  type: NoticeType;
  content: string;
  date: string;
  location: string;
  organizer: string;
  registered: boolean;
  reminded: boolean;
  tags: string[];
}

export interface ResourceExchange {
  id: string;
  title: string;
  offered: string;
  wanted: string;
  ownerId: string;
  ownerName: string;
  description: string;
  category: string;
  tags: string[];
  status: ResourceStatus;
  favorited: boolean;
  exchangeRequested: boolean;
  createdAt: string;
}

export interface ForumDraft {
  id: string;
  type: ForumDraftType;
  title: string;
  content: string;
  tags: string[];
  board?: ForumBoard;
  updatedAt: string;
}

export interface ExchangeRecord {
  id: string;
  resourceId: string;
  userId: string;
  status: '已发起' | '已取消' | '已完成';
  createdAt: string;
}

export interface ForumStats {
  likes: number;
  favorites: number;
  comments: number;
  registrations: number;
  teamApplications: number;
  exchanges: number;
}

export interface PostComposerInitialValue {
  draftId?: string;
  title?: string;
  board?: ForumBoard;
  tags?: string[];
  content?: string;
  topicId?: string;
}
