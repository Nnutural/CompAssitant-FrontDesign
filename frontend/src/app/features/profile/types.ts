export type AutosaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface ProfileWorkspace {
  id: string;
  user: UserProfile;
  persona: PersonaProfile;
  capabilities: CapabilityScore[];
  assets: ProfileAsset[];
  submitChecklists: SubmitChecklist[];
  notificationSettings: NotificationSetting[];
  accountSecurity: AccountSecurity;
  complianceSettings: ComplianceSettings;
  favoriteAssetIds: string[];
  archivedAssetIds: string[];
  deletedAssetIds: string[];
  selectedAssetId?: string;
  selectedChecklistId: string;
  autosaveStatus: AutosaveStatus;
  savedAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarText: string;
  email: string;
  school: string;
  college: string;
  major: string;
  grade: string;
  enrollmentYear: number;
  identity: string;
  bio: string;
  goals: string;
  weeklyHours: string;
  targetDirections: string[];
  tags: string[];
  updatedAt: string;
}

export interface PersonaProfile {
  directionPreference: string;
  careerGoal: string;
  researchGoal: string;
  competitionGoal: string;
  personaSources: PersonaSource[];
  weights: PersonaWeights;
  lastGeneratedAt: string;
  suggestion: string;
}

export interface PersonaSource {
  id: string;
  module: string;
  title: string;
  description: string;
  confidence: number;
}

export interface PersonaWeights {
  writing: number;
  research: number;
  practice: number;
  careers: number;
  tasks: number;
  forum: number;
}

export type CapabilityCategory =
  | 'research'
  | 'engineering'
  | 'practice'
  | 'writing'
  | 'presentation'
  | 'career';

export type CapabilityTrend = 'up' | 'flat' | 'down';

export interface CapabilityScore {
  id: string;
  name: string;
  score: number;
  category: CapabilityCategory;
  evidence: string;
  trend: CapabilityTrend;
}

export type ProfileAssetType = 'document' | 'slides' | 'code' | 'proof';
export type ProfileAssetFormat = 'Doc' | 'PPT' | 'Repo' | 'PDF' | 'Markdown' | 'Image' | 'Certificate';
export type ProfileAssetStatus = 'draft' | 'reviewing' | 'completed' | 'archived';

export interface ProfileAsset {
  id: string;
  title: string;
  type: ProfileAssetType;
  format: ProfileAssetFormat;
  sourceModule: string;
  sourcePath: string;
  summary: string;
  contentPreview: string;
  tags: string[];
  version: string;
  versions: AssetVersion[];
  status: ProfileAssetStatus;
  favorited: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, string | number | boolean | string[]>;
}

export interface AssetVersion {
  id: string;
  version: string;
  title: string;
  updatedAt: string;
  changelog: string;
  sizeText: string;
}

export type SubmitScenario = '挑战杯' | '信安赛' | '大创' | '保研材料' | '实习投递';
export type SubmitRequirement = '必交' | '建议' | '可选';
export type SubmitChecklistItemStatus = 'ready' | 'missing' | 'reviewing';

export interface SubmitChecklist {
  id: string;
  name: string;
  scenario: SubmitScenario;
  deadline: string;
  items: SubmitChecklistItem[];
  submitHistory: SubmitHistory[];
  completionRate: number;
}

export interface SubmitChecklistItem {
  id: string;
  title: string;
  requirement: SubmitRequirement;
  status: SubmitChecklistItemStatus;
  boundAssetId?: string;
  note: string;
}

export interface SubmitHistory {
  id: string;
  createdAt: string;
  summary: string;
  missingCount: number;
  readyCount: number;
}

export type NotificationChannel = '站内' | '邮件' | '浏览器' | '全部';

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  channel: NotificationChannel;
  advanceDays: number;
  quietHoursEnabled: boolean;
}

export interface AccountSecurity {
  email: string;
  verified: boolean;
  membership: string;
  twoFactorEnabled: boolean;
  devices: AccountDevice[];
  sessions: AccountSession[];
  loginHistory: LoginHistoryItem[];
}

export interface AccountDevice {
  id: string;
  name: string;
  location: string;
  lastActiveAt: string;
  trusted: boolean;
}

export interface AccountSession {
  id: string;
  deviceName: string;
  ip: string;
  location: string;
  lastActiveAt: string;
  current: boolean;
  active: boolean;
}

export interface LoginHistoryItem {
  id: string;
  time: string;
  location: string;
  device: string;
  status: '成功' | '拦截';
}

export interface ComplianceSettings {
  dataScope: string;
  aiContentNoticeAccepted: boolean;
  exportRequests: DataExportRequest[];
  cacheClearedAt?: string;
  deletionRequested: boolean;
  deletionRequestedAt?: string;
  authorizationRecords: AuthorizationRecord[];
}

export interface DataExportRequest {
  id: string;
  requestedAt: string;
  status: '已生成' | '处理中';
  fileName: string;
}

export interface AuthorizationRecord {
  id: string;
  scope: string;
  description: string;
  updatedAt: string;
  enabled: boolean;
}

export type ProfileTabKey =
  | 'persona'
  | 'vault'
  | 'docs'
  | 'slides'
  | 'code'
  | 'proof'
  | 'submit'
  | 'notice'
  | 'account';

export interface ProfileStats {
  profileCompleteness: number;
  assetCount: number;
  documentCount: number;
  slidesCount: number;
  codeCount: number;
  proofCount: number;
  favoriteCount: number;
  archivedCount: number;
  notificationEnabledCount: number;
}

export interface AssetFilters {
  query: string;
  type: ProfileAssetType | 'all';
  status: ProfileAssetStatus | 'all';
  sourceModule: string;
  onlyFavorites: boolean;
  includeArchived: boolean;
  sort: 'updated' | 'created' | 'type' | 'status';
}

export interface AccountDialogConfig {
  action:
    | 'data-scope'
    | 'two-factor'
    | 'export-data'
    | 'clear-cache'
    | 'delete-account'
    | 'ai-notice'
    | 'authorization';
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
}
