export type Role = "authority" | "ngo";

export type Priority = "critical" | "high" | "medium" | "low";

export type IncidentStatus =
  | "open"
  | "verified"
  | "assigned"
  | "in-progress"
  | "resolved"
  | "closed";

export type VerificationStatus = "pending" | "verified" | "duplicate" | "false" | "need-info";

export type IncidentCategory =
  | "medical"
  | "fire"
  | "disaster"
  | "women-safety"
  | "child-help"
  | "food-support"
  | "rescue"
  | "shelter";

export interface LocationMeta {
  area: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  priority: Priority;
  status: IncidentStatus;
  verificationStatus: VerificationStatus;
  source: "citizen" | "app" | "call-center" | "officer";
  location: LocationMeta;
  assignedNgoIds: string[];
  assignedTeam: string;
  updatesCount: number;
  commentsCount: number;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  etaMinutes: number;
  slaMinutes: number;
}

export interface AuthorityUser {
  id: string;
  name: string;
  role: string;
  online: boolean;
  district: string;
}

export interface NgoOrganization {
  id: string;
  name: string;
  services: string[];
  coverageAreas: string[];
  availability: "available" | "limited" | "offline";
  capacity: number;
  contactPerson: string;
  contactPhone: string;
  reliabilityScore: number;
  activeCases: number;
}

export interface Volunteer {
  id: string;
  organizationId: string;
  name: string;
  role: "driver" | "medic" | "coordinator" | "field-volunteer";
  status: "available" | "on-mission" | "offline";
  skills: string[];
  assignedTaskCount: number;
  shift: string;
}

export interface ResourceInventoryItem {
  id: string;
  organizationId: string;
  resource: string;
  available: number;
  reserved: number;
  unit: string;
  minThreshold: number;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  role: Role | "all";
  type:
    | "incident-assigned"
    | "case-escalated"
    | "broadcast-alert"
    | "comment-added"
    | "resource-update"
    | "ngo-response"
    | "verification-complete"
    | "message";
  title: string;
  description: string;
  read: boolean;
  linkedPath: string;
  createdAt: string;
  priority: Priority;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: string;
  senderRole: Role | "team";
  text: string;
  createdAt: string;
  readBy: string[];
  pinned?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  participants: string[];
  participantRoles: Array<Role | "team">;
  incidentId?: string;
  unreadCount: number;
  updatedAt: string;
  messages: Message[];
}

export interface BroadcastAlert {
  id: string;
  title: string;
  message: string;
  severity: Priority;
  audience: "all-ngos" | "selected-ngos" | "public" | "district-teams";
  geoTarget: string;
  scheduledFor: string;
  sent: boolean;
  sentAt?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole: Role | "system" | "team";
  action: string;
  entityType: "incident" | "assignment" | "resource" | "broadcast" | "message";
  entityId: string;
  createdAt: string;
  details: string;
  visibleTo: Role[];
}

export interface ActivityEntry {
  id: string;
  incidentId: string;
  actor: string;
  actorRole: Role | "team";
  content: string;
  createdAt: string;
  edited?: boolean;
  pinned?: boolean;
  mentions?: string[];
}

export interface SupportRequest {
  id: string;
  incidentId: string;
  requestedByNgoId: string;
  type: "volunteers" | "ambulance" | "food" | "medical-kits" | "transport" | "shelter";
  status: "requested" | "acknowledged" | "approved" | "dispatched" | "received";
  createdAt: string;
  note: string;
}

export interface AssignmentCard {
  id: string;
  incidentId: string;
  title: string;
  priority: Priority;
  location: string;
  assignedTo: string;
  etaMinutes: number;
  updatesCount: number;
  column: "unassigned" | "assigned" | "acknowledged" | "in-progress" | "waiting-resource" | "resolved" | "closed";
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
}

export interface AuthRecord {
  id: string;
  role: Role;
  email: string;
  password: string;
  name: string;
  organization: string;
}

export interface RoleNavItem {
  label: string;
  icon: string;
  path: string;
  badgeCount?: number;
  section?: string;
}

export const incidentStatusTransitionMap: Record<IncidentStatus, IncidentStatus[]> = {
  open: ["verified", "assigned", "closed"],
  verified: ["assigned", "in-progress", "closed"],
  assigned: ["in-progress", "resolved", "closed"],
  "in-progress": ["resolved", "closed"],
  resolved: ["closed"],
  closed: [],
};

export const priorityOrder: Priority[] = ["critical", "high", "medium", "low"];
