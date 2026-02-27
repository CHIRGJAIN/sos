import React, { createContext, useContext, useState } from "react";
import {
  ActivityEntry,
  AssignmentCard,
  AuthRecord,
  BroadcastAlert,
  Conversation,
  Incident,
  IncidentStatus,
  NotificationItem,
  ResourceInventoryItem,
  Role,
  SessionUser,
  SupportRequest,
  Volunteer,
  incidentStatusTransitionMap,
} from "@/sos/models";
import {
  assignmentCards,
  auditLogs,
  broadcastAlerts,
  conversations,
  demoAuthRecords,
  incidentTimeline,
  incidents,
  ngoOrganizations,
  notifications,
  resourceInventory,
  supportRequests,
  volunteers,
} from "@/sos/mockData";

const SESSION_STORAGE_KEY = "sos-session";

type AuthFlowState = {
  otpTarget: string;
  pendingProfileRole: Role | null;
};

interface AuthResult {
  success: boolean;
  message: string;
}

interface SosAppContextType {
  session: SessionUser | null;
  authFlow: AuthFlowState;
  incidents: Incident[];
  notifications: NotificationItem[];
  conversations: Conversation[];
  timeline: ActivityEntry[];
  resources: ResourceInventoryItem[];
  volunteers: Volunteer[];
  broadcasts: BroadcastAlert[];
  assignmentBoard: AssignmentCard[];
  supportRequests: SupportRequest[];
  auditLogs: typeof auditLogs;
  ngos: typeof ngoOrganizations;
  syncOnline: boolean;
  login: (role: Role, email: string, password: string) => AuthResult;
  signup: (role: Role, name: string, email: string, password: string) => AuthResult;
  requestOtp: (target: string, role: Role) => AuthResult;
  verifyOtp: (code: string) => AuthResult;
  completeProfile: (organization: string) => AuthResult;
  logout: () => void;
  toggleSyncStatus: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: Role) => void;
  updateIncidentStatus: (id: string, nextStatus: IncidentStatus, note?: string) => AuthResult;
  verifyReport: (
    id: string,
    status: "verified" | "duplicate" | "false" | "need-info",
    note: string,
  ) => AuthResult;
  assignNgo: (incidentId: string, ngoId: string) => AuthResult;
  addIncidentUpdate: (incidentId: string, content: string) => void;
  createBroadcast: (alert: Omit<BroadcastAlert, "id" | "sent" | "sentAt">) => void;
  sendMessage: (conversationId: string, text: string) => AuthResult;
  markConversationRead: (conversationId: string) => void;
  createSupportRequest: (request: Omit<SupportRequest, "id" | "createdAt" | "status">) => void;
  updateSupportRequestStatus: (id: string, status: SupportRequest["status"]) => void;
  createIncident: (payload: Pick<Incident, "title" | "description" | "category" | "priority" | "source" | "location">) => Incident;
  updateResourceItem: (id: string, available: number, reserved: number) => AuthResult;
  moveAssignmentCard: (id: string, column: AssignmentCard["column"]) => void;
}

const SosAppContext = createContext<SosAppContextType | null>(null);

const hydrateSession = (): SessionUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
};

const saveSession = (session: SessionUser | null) => {
  if (!session) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

const createSessionFromAccount = (account: AuthRecord): SessionUser => ({
  id: account.id,
  name: account.name,
  email: account.email,
  role: account.role,
  organization: account.organization,
});

export const SosAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionUser | null>(() => hydrateSession());
  const [authRecords, setAuthRecords] = useState<AuthRecord[]>(demoAuthRecords);
  const [authFlow, setAuthFlow] = useState<AuthFlowState>({ otpTarget: "", pendingProfileRole: null });

  const [incidentState, setIncidentState] = useState<Incident[]>(incidents);
  const [notificationState, setNotificationState] = useState<NotificationItem[]>(notifications);
  const [conversationState, setConversationState] = useState<Conversation[]>(conversations);
  const [timelineState, setTimelineState] = useState<ActivityEntry[]>(incidentTimeline);
  const [resourceState, setResourceState] = useState<ResourceInventoryItem[]>(resourceInventory);
  const [broadcastState, setBroadcastState] = useState<BroadcastAlert[]>(broadcastAlerts);
  const [supportRequestState, setSupportRequestState] = useState<SupportRequest[]>(supportRequests);
  const [assignmentState, setAssignmentState] = useState<AssignmentCard[]>(assignmentCards);
  const [syncOnline, setSyncOnline] = useState(true);

  const login = (role: Role, email: string, password: string): AuthResult => {
    const normalized = email.trim().toLowerCase();
    const account = authRecords.find(
      (item) => item.role === role && item.email.toLowerCase() === normalized && item.password === password,
    );

    if (!account) {
      return { success: false, message: "Invalid credentials for selected role." };
    }

    const nextSession = createSessionFromAccount(account);
    setSession(nextSession);
    saveSession(nextSession);
    return { success: true, message: "Login successful." };
  };

  const signup = (role: Role, name: string, email: string, password: string): AuthResult => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (password.trim().length < 6) {
      return { success: false, message: "Password must be at least 6 characters." };
    }
    const exists = authRecords.some((item) => item.email.toLowerCase() === normalizedEmail && item.role === role);
    if (exists) {
      return { success: false, message: "Account already exists for this role and email." };
    }

    const nextRecord: AuthRecord = {
      id: `${role}-${Date.now()}`,
      role,
      email: normalizedEmail,
      password,
      name: name.trim() || normalizedEmail.split("@")[0],
      organization: role === "authority" ? "Emergency Command" : "New NGO",
    };

    setAuthRecords((prev) => [nextRecord, ...prev]);
    const nextSession = createSessionFromAccount(nextRecord);
    setSession(nextSession);
    saveSession(nextSession);
    setAuthFlow({ otpTarget: normalizedEmail, pendingProfileRole: role });

    return { success: true, message: "Account created. Continue profile setup." };
  };

  const requestOtp = (target: string, role: Role): AuthResult => {
    const cleaned = target.trim();
    if (!cleaned) {
      return { success: false, message: "Please enter mobile or email." };
    }
    setAuthFlow({ otpTarget: cleaned, pendingProfileRole: role });
    return { success: true, message: "OTP sent. Use 123456 for demo." };
  };

  const verifyOtp = (code: string): AuthResult => {
    if (code.trim() !== "123456") {
      return { success: false, message: "Invalid OTP. Use 123456 in demo mode." };
    }
    return { success: true, message: "OTP verified." };
  };

  const completeProfile = (organization: string): AuthResult => {
    if (!session) {
      return { success: false, message: "Session missing. Login first." };
    }
    if (!organization.trim()) {
      return { success: false, message: "Organization name is required." };
    }

    const nextSession: SessionUser = { ...session, organization: organization.trim() };
    setSession(nextSession);
    saveSession(nextSession);

    setAuthRecords((prev) =>
      prev.map((record) =>
        record.id === session.id ? { ...record, organization: organization.trim() } : record,
      ),
    );

    return { success: true, message: "Profile completed." };
  };

  const logout = () => {
    setSession(null);
    saveSession(null);
  };

  const toggleSyncStatus = () => setSyncOnline((prev) => !prev);

  const markNotificationRead = (id: string) => {
    setNotificationState((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllNotificationsRead = (role: Role) => {
    setNotificationState((prev) =>
      prev.map((notification) =>
        notification.role === role || notification.role === "all"
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const addTimelineEntry = (
    incidentId: string,
    content: string,
    actor: string,
    actorRole: ActivityEntry["actorRole"],
  ) => {
    setTimelineState((prev) => [
      {
        id: `act-${Date.now()}`,
        incidentId,
        content,
        actor,
        actorRole,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateIncidentStatus = (
    id: string,
    nextStatus: IncidentStatus,
    note?: string,
  ): AuthResult => {
    const incident = incidentState.find((item) => item.id === id);
    if (!incident) {
      return { success: false, message: "Incident not found." };
    }

    const allowed = incidentStatusTransitionMap[incident.status];
    if (!allowed.includes(nextStatus)) {
      return {
        success: false,
        message: `Status transition not allowed from ${incident.status} to ${nextStatus}.`,
      };
    }

    setIncidentState((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: nextStatus,
              updatedAt: new Date().toISOString(),
              updatesCount: item.updatesCount + 1,
            }
          : item,
      ),
    );

    setAssignmentState((prev) =>
      prev.map((item) => {
        if (item.incidentId !== id) return item;
        const nextColumnMap: Record<IncidentStatus, AssignmentCard["column"]> = {
          open: "unassigned",
          verified: "assigned",
          assigned: "assigned",
          "in-progress": "in-progress",
          resolved: "resolved",
          closed: "closed",
        };
        return { ...item, column: nextColumnMap[nextStatus] };
      }),
    );

    addTimelineEntry(
      id,
      note || `Status updated to ${nextStatus}.`,
      session?.name || "System",
      session?.role || "team",
    );

    return { success: true, message: `Incident ${id} marked ${nextStatus}.` };
  };

  const verifyReport = (
    id: string,
    status: "verified" | "duplicate" | "false" | "need-info",
    note: string,
  ): AuthResult => {
    const incident = incidentState.find((item) => item.id === id);
    if (!incident) {
      return { success: false, message: "Report not found." };
    }

    setIncidentState((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              verificationStatus: status,
              status: status === "verified" ? "verified" : item.status,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );

    addTimelineEntry(
      id,
      note || `Verification updated: ${status}`,
      session?.name || "Verification Desk",
      session?.role || "team",
    );

    return { success: true, message: `Verification marked as ${status}.` };
  };

  const assignNgo = (incidentId: string, ngoId: string): AuthResult => {
    const ngo = ngoOrganizations.find((item) => item.id === ngoId);
    if (!ngo) {
      return { success: false, message: "NGO not found." };
    }

    setIncidentState((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              assignedNgoIds: Array.from(new Set([...incident.assignedNgoIds, ngoId])),
              status: incident.status === "open" ? "assigned" : incident.status,
              updatedAt: new Date().toISOString(),
            }
          : incident,
      ),
    );

    addTimelineEntry(
      incidentId,
      `Assigned NGO: ${ngo.name}`,
      session?.name || "Authority Desk",
      session?.role || "authority",
    );

    return { success: true, message: `Assigned ${ngo.name} to ${incidentId}.` };
  };

  const addIncidentUpdate = (incidentId: string, content: string) => {
    const actor = session?.name || "Coordination Team";
    const actorRole = session?.role || "team";
    addTimelineEntry(incidentId, content, actor, actorRole);

    setIncidentState((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              updatesCount: incident.updatesCount + 1,
              commentsCount: incident.commentsCount + 1,
              updatedAt: new Date().toISOString(),
            }
          : incident,
      ),
    );
  };

  const createBroadcast = (alert: Omit<BroadcastAlert, "id" | "sent" | "sentAt">) => {
    const immediateSend = new Date(alert.scheduledFor).getTime() <= Date.now();
    const nextAlert: BroadcastAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      sent: immediateSend,
      sentAt: immediateSend ? new Date().toISOString() : undefined,
    };
    setBroadcastState((prev) => [nextAlert, ...prev]);
  };

  const sendMessage = (conversationId: string, text: string): AuthResult => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { success: false, message: "Message cannot be empty." };
    }
    const actorName = session?.name || "Coordinator";
    const actorRole = session?.role || "team";

    setConversationState((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;

        const message = {
          id: `msg-${Date.now()}`,
          conversationId,
          sender: actorName,
          senderRole: actorRole,
          text: trimmed,
          createdAt: new Date().toISOString(),
          readBy: [actorRole],
        };

        return {
          ...conversation,
          messages: [...conversation.messages, message],
          updatedAt: message.createdAt,
        };
      }),
    );

    return { success: true, message: "Message sent." };
  };

  const markConversationRead = (conversationId: string) => {
    setConversationState((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unreadCount: 0,
            }
          : conversation,
      ),
    );
  };

  const createSupportRequest = (
    request: Omit<SupportRequest, "id" | "createdAt" | "status">,
  ) => {
    const nextRequest: SupportRequest = {
      ...request,
      id: `sup-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "requested",
    };

    setSupportRequestState((prev) => [nextRequest, ...prev]);
  };

  const updateSupportRequestStatus = (id: string, status: SupportRequest["status"]) => {
    setSupportRequestState((prev) =>
      prev.map((request) => (request.id === id ? { ...request, status } : request)),
    );
  };

  const createIncident = (
    payload: Pick<Incident, "title" | "description" | "category" | "priority" | "source" | "location">,
  ) => {
    const nextIncident: Incident = {
      id: `INC-${Math.round(Math.random() * 9000 + 1000)}`,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      source: payload.source,
      location: payload.location,
      status: "open",
      verificationStatus: "pending",
      assignedNgoIds: [],
      assignedTeam: "Unassigned",
      updatesCount: 0,
      commentsCount: 0,
      attachments: ["/placeholder.svg"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etaMinutes: 30,
      slaMinutes: 60,
    };

    setIncidentState((prev) => [nextIncident, ...prev]);

    setAssignmentState((prev) => [
      {
        id: `as-${Date.now()}`,
        incidentId: nextIncident.id,
        title: nextIncident.title,
        priority: nextIncident.priority,
        location: nextIncident.location.area,
        assignedTo: "Unassigned",
        etaMinutes: nextIncident.etaMinutes,
        updatesCount: nextIncident.updatesCount,
        column: "unassigned",
      },
      ...prev,
    ]);

    return nextIncident;
  };

  const updateResourceItem = (id: string, available: number, reserved: number): AuthResult => {
    if (available < 0 || reserved < 0) {
      return { success: false, message: "Stock values cannot be negative." };
    }

    setResourceState((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              available,
              reserved,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );

    return { success: true, message: "Inventory updated." };
  };

  const moveAssignmentCard = (id: string, column: AssignmentCard["column"]) => {
    setAssignmentState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, column } : item)),
    );
  };

  const value: SosAppContextType = {
    session,
    authFlow,
    incidents: incidentState,
    notifications: notificationState,
    conversations: conversationState,
    timeline: timelineState,
    resources: resourceState,
    volunteers,
    broadcasts: broadcastState,
    assignmentBoard: assignmentState,
    supportRequests: supportRequestState,
    auditLogs,
    ngos: ngoOrganizations,
    syncOnline,
    login,
    signup,
    requestOtp,
    verifyOtp,
    completeProfile,
    logout,
    toggleSyncStatus,
    markNotificationRead,
    markAllNotificationsRead,
    updateIncidentStatus,
    verifyReport,
    assignNgo,
    addIncidentUpdate,
    createBroadcast,
    sendMessage,
    markConversationRead,
    createSupportRequest,
    updateSupportRequestStatus,
    createIncident,
    updateResourceItem,
    moveAssignmentCard,
  };

  return <SosAppContext.Provider value={value}>{children}</SosAppContext.Provider>;
};

export const useSosApp = () => {
  const context = useContext(SosAppContext);
  if (!context) {
    throw new Error("useSosApp must be used inside SosAppProvider");
  }
  return context;
};
