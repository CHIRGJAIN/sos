export type LanguageCode = "en" | "hi";

export type DemoRole = "citizen" | "authority" | "ngo" | "admin";

export type IncidentType = "sos" | "spectator-alert" | "report";

export type IncidentSourceType = "self" | "spectator" | "report";

export type SeverityLevel = "critical" | "high" | "medium" | "low";

export type MediaAttachmentType = "photo" | "video" | "voice" | "document";

export type IncidentStatus =
  | "sending"
  | "alert-sent"
  | "tracking-active"
  | "waiting-response"
  | "accepted"
  | "en-route"
  | "on-scene"
  | "resolved"
  | "cancelled";

export interface LocationObject {
  lat?: number;
  lng?: number;
  address: string;
  area: string;
  district: string;
  state: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  altPhone?: string;
  relation: string;
  priority: number;
  activeForSos: boolean;
  notes?: string;
}

export interface MediaAttachment {
  id: string;
  type: MediaAttachmentType;
  label: string;
  createdAt: string;
  previewUrl?: string;
}

export interface ContactNotificationStatus {
  id: string;
  incidentId: string;
  contactId: string;
  contactName: string;
  channel: "sms" | "call" | "app" | "push" | "voice";
  status: "pending" | "sent" | "delivered" | "failed" | "success";
  sentAt: string;
  retryCount?: number;
  updatedAt?: string;
}

export interface TimelineEvent {
  id: string;
  incidentId: string;
  actor: string;
  actorRole: DemoRole | "system" | "public";
  eventType: "status" | "note" | "evidence" | "verification" | "location";
  message: string;
  createdAt: string;
  verificationFlag?: boolean;
}

export interface IncidentRecord {
  id: string;
  type: IncidentType;
  sourceType: IncidentSourceType;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  urgencyFlag: boolean;
  location: LocationObject;
  notifiedContacts: ContactNotificationStatus[];
  attachments: MediaAttachment[];
  authorityAssignee?: {
    name: string;
    station: string;
    contact: string;
  };
  verificationFlags: {
    authorityVerified: boolean;
    ngoLinked: boolean;
    evidenceReviewed: boolean;
  };
  categoryTags: string[];
  countdownSeconds?: number;
  silentMode?: boolean;
  fakeCallEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface SocialPost {
  id: string;
  author: {
    name: string;
    role: "citizen" | "ngo" | "authority";
    verified: boolean;
  };
  title?: string;
  content: string;
  imageUrl?: string;
  media?: MediaAttachment[];
  locationText?: string;
  createdAt: string;
  category:
    | "verified"
    | "relief"
    | "medical"
    | "awareness"
    | "nearby"
    | "general"
    | "food-support"
    | "community-alert";
  postType?: "relief" | "medical" | "awareness" | "food-support" | "community-alert";
  tags: string[];
  campaign?: {
    goalAmount: number;
    raisedAmount: number;
    contributors: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    supports: number;
  };
  commentsPreview: Array<{ id: string; author: string; text: string }>;
  supporters?: Array<{ id: string; name: string; type: "donor" | "supporter" }>;
  isVerified?: boolean;
  isUrgent?: boolean;
  isNearby?: boolean;
  isSaved?: boolean;
  isSupported?: boolean;
}

export interface ResourceEntry {
  id: string;
  name: string;
  category:
    | "helpline"
    | "shelter"
    | "legal"
    | "medical"
    | "psychosocial"
    | "women-child";
  district: string;
  state: string;
  phone?: string;
  address: string;
  availability: "24x7" | "day" | "limited";
  verified: boolean;
  lastUpdated: string;
  notes?: string;
}

export interface RevelationReport {
  id: string;
  category:
    | "public-atrocity"
    | "corruption"
    | "ngo-misuse"
    | "harassment-abuse"
    | "labor-exploitation"
    | "abuse"
    | "harassment"
    | "molestation"
    | "violence"
    | "bullying"
    | "stalking"
    | "other";
  severity: SeverityLevel;
  anonymous: boolean;
  includeLocation: boolean;
  title?: string;
  description: string;
  location?: LocationObject;
  attachments: Array<{ id: string; name: string; type: string; mediaType?: MediaAttachmentType }>;
  status: "submitted" | "under-review" | "verified" | "closed" | "flagged";
  createdAt: string;
}

export interface RevelationDraft {
  id: string;
  category: RevelationReport["category"];
  severity: SeverityLevel;
  anonymous: boolean;
  includeLocation: boolean;
  title?: string;
  description: string;
  attachments: Array<{ id: string; name: string; type: string; mediaType?: MediaAttachmentType }>;
  locationText?: string;
  updatedAt: string;
}

export interface AuthorityQueueItem {
  incidentId: string;
  assignedTo?: string;
  district: string;
  severity: SeverityLevel;
  status: IncidentStatus;
  type: IncidentType;
  verified: boolean;
  receivedAt: string;
}

export interface NgoCampaign {
  id: string;
  title: string;
  region: string;
  category: "food" | "medical" | "shelter" | "rehabilitation";
  active: boolean;
  targetAmount: number;
  raisedAmount: number;
  volunteersActive: number;
  requestsOpen: number;
}

export interface CitizenCampaign {
  id: string;
  title: string;
  summary: string;
  category: "awareness" | "relief" | "legal" | "medical" | "community";
  targetAmount: number;
  raisedAmount: number;
  visibility: "public" | "trusted";
  status: "draft" | "active" | "closed";
  createdAt: string;
}

export interface TransparencyEntry {
  id: string;
  district: string;
  state: string;
  category: "contribution" | "allocation" | "distribution" | "audit";
  title: string;
  amount?: number;
  quantity?: string;
  verificationBadge: "verified" | "pending" | "flagged";
  proofCount: number;
  updatedAt: string;
}

export interface NgoDirectoryEntry {
  id: string;
  name: string;
  category: string;
  location: string;
  scope: "district" | "state" | "national" | "global";
  description: string;
  contactPhone: string;
  contactEmail?: string;
  fundraising: {
    raised: number;
    goal: number;
  };
  campaigns: string[];
  services: string[];
}

export interface ContributionHistoryItem {
  id: string;
  title: string;
  amount: number;
  category: "donation" | "volunteer" | "campaign";
  status: "active" | "closed" | "fulfilled";
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UserSettings {
  countdownSeconds: number;
  silentMode: boolean;
  autoRecord: boolean;
  continuousLocationShare: boolean;
  vibration: boolean;
  fakeCallShortcut: boolean;
  distressLanguage: LanguageCode;
  language: LanguageCode;
}

export interface PermissionsStatus {
  location: "granted" | "denied" | "prompt";
  notifications: "granted" | "denied" | "prompt";
  microphone: "granted" | "denied" | "prompt";
  camera: "granted" | "denied" | "prompt";
}

export interface DashboardWidgets {
  urgentAlerts: Array<{ id: string; title: string; severity: SeverityLevel }>;
  nearbyResources: Array<{ id: string; label: string; distanceKm: number }>;
  trendingTags: string[];
  topContributors: Array<{ id: string; name: string; amount: number }>;
  safetyTips: string[];
  activeCampaigns: Array<{ id: string; title: string; progress: number }>;
}

export interface MockAuthSession {
  isAuthenticated: boolean;
  mobile: string;
  otpVerified: boolean;
  currentRole: DemoRole;
  lastLoginAt?: string;
}

export interface SosMockContracts {
  contacts: EmergencyContact[];
  incidents: IncidentRecord[];
  incidentTimeline: TimelineEvent[];
  notificationStatuses: ContactNotificationStatus[];
  socialPosts: SocialPost[];
  resources: ResourceEntry[];
  revelationReports: RevelationReport[];
  draftReports: RevelationDraft[];
  authorityQueue: AuthorityQueueItem[];
  ngoCampaigns: NgoCampaign[];
  ngoDirectory: NgoDirectoryEntry[];
  userCampaigns: CitizenCampaign[];
  contributions: ContributionHistoryItem[];
  transparencyEntries: TransparencyEntry[];
  profile: UserProfile;
  userSettings: UserSettings;
  permissionsStatus: PermissionsStatus;
  dashboardWidgets: DashboardWidgets;
  authSession: MockAuthSession;
}

export type UiDataState = "loading" | "ready" | "error";
