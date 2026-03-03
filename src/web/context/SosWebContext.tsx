import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { t, TranslationKey } from "@/web/i18n";
import { initialMockContracts } from "@/web/mockData";
import { safeRead, safeWrite } from "@/web/storage";
import {
  CitizenCampaign,
  ContactNotificationStatus,
  ContributionHistoryItem,
  DemoRole,
  EmergencyContact,
  IncidentRecord,
  IncidentStatus,
  LanguageCode,
  MediaAttachmentType,
  MockAuthSession,
  NgoCampaign,
  NgoDirectoryEntry,
  PermissionsStatus,
  ResourceEntry,
  RevelationDraft,
  RevelationReport,
  SocialPost,
  TimelineEvent,
  TransparencyEntry,
  UserProfile,
  UserSettings,
} from "@/web/types";

const STORAGE_KEYS = {
  language: "sos-web-language",
  role: "sos-web-demo-role",
  authSession: "sos-web-auth-session",
  profile: "sos-web-profile",
  contacts: "sos-web-contacts",
  settings: "sos-web-settings",
  permissions: "sos-web-permissions",
  incidents: "sos-web-incidents",
  timeline: "sos-web-timeline",
  notificationStatuses: "sos-web-notification-statuses",
  draftReports: "sos-web-drafts",
  revelationReports: "sos-web-reports",
  socialPosts: "sos-web-posts",
  resourcesFavorites: "sos-web-resource-favorites",
  savedPosts: "sos-web-saved-posts",
  likedPosts: "sos-web-liked-posts",
  supportedPosts: "sos-web-supported-posts",
  followedNgos: "sos-web-followed-ngos",
  userCampaigns: "sos-web-user-campaigns",
};

type SosStage = "idle" | "arming" | "countdown" | "active";

interface SosWebContextValue {
  language: LanguageCode;
  demoRole: DemoRole;
  authSession: MockAuthSession;
  profile: UserProfile;
  contacts: EmergencyContact[];
  settings: UserSettings;
  permissionsStatus: PermissionsStatus;
  safetyReadiness: number;
  incidents: IncidentRecord[];
  timeline: TimelineEvent[];
  notificationStatuses: ContactNotificationStatus[];
  socialPosts: SocialPost[];
  resources: ResourceEntry[];
  revelationReports: RevelationReport[];
  draftReports: RevelationDraft[];
  authorityQueue: typeof initialMockContracts.authorityQueue;
  ngoCampaigns: NgoCampaign[];
  ngoDirectory: NgoDirectoryEntry[];
  followedNgoIds: string[];
  contributions: ContributionHistoryItem[];
  userCampaigns: CitizenCampaign[];
  transparencyEntries: TransparencyEntry[];
  dashboardWidgets: typeof initialMockContracts.dashboardWidgets;
  sosStage: SosStage;
  sosCountdown: number;
  activeIncident: IncidentRecord | null;
  likedPostIds: string[];
  savedPostIds: string[];
  supportedPostIds: string[];
  favoriteResourceIds: string[];
  t: (key: TranslationKey) => string;
  setLanguage: (language: LanguageCode) => void;
  setDemoRole: (role: DemoRole) => void;
  loginWithMockOtp: (mobile: string, role: DemoRole) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  updateSettings: (patch: Partial<UserSettings>) => void;
  updatePermissionsStatus: (patch: Partial<PermissionsStatus>) => void;
  addOrUpdateContact: (contact: EmergencyContact) => void;
  removeContact: (id: string) => void;
  reorderContacts: (ids: string[]) => void;
  beginSosHold: () => void;
  cancelSosFlow: () => void;
  resolveIncident: (incidentId: string) => void;
  escalateIncident: (incidentId: string) => void;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus) => void;
  retryNotification: (notificationId: string) => void;
  addIncidentEvidence: (incidentId: string, type: MediaAttachmentType) => void;
  createSpectatorIncident: (payload: {
    type: string;
    details: string;
    location: string;
    attachments?: MediaAttachmentType[];
  }) => string;
  togglePostLike: (postId: string) => void;
  togglePostSave: (postId: string) => void;
  togglePostSupport: (postId: string) => void;
  addSocialPost: (payload: {
    content: string;
    postType: NonNullable<SocialPost["postType"]>;
    title?: string;
    mediaTypes?: MediaAttachmentType[];
  }) => void;
  addSocialComment: (postId: string, commentText: string) => void;
  toggleResourceFavorite: (resourceId: string) => void;
  toggleNgoFollow: (ngoId: string) => void;
  createUserCampaign: (
    payload: Pick<CitizenCampaign, "title" | "summary" | "category" | "targetAmount" | "visibility">,
  ) => void;
  updateUserCampaignStatus: (campaignId: string, status: CitizenCampaign["status"]) => void;
  saveDraftReport: (draft: RevelationDraft) => void;
  deleteDraftReport: (draftId: string) => void;
  submitRevelationReport: (payload: Omit<RevelationReport, "id" | "createdAt" | "status">) => string;
}

const SosWebContext = createContext<SosWebContextValue | null>(null);

const createCaseId = (prefix: string) => {
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${suffix}`;
};

const createUserCampaignId = () => {
  const suffix = Math.floor(Math.random() * 9000 + 1000);
  return `UC-${suffix}`;
};

const sortContacts = (contacts: EmergencyContact[]) => {
  return [...contacts].sort((a, b) => a.priority - b.priority);
};

const findActiveIncident = (incidents: IncidentRecord[]) => {
  return incidents.find((incident) => !["resolved", "cancelled"].includes(incident.status)) || null;
};

const clampCountdown = (value: number) => {
  if (Number.isNaN(value)) return initialMockContracts.userSettings.countdownSeconds;
  return Math.min(10, Math.max(3, Math.round(value)));
};

const createAttachment = (type: MediaAttachmentType, labelPrefix = "evidence") => ({
  id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type,
  label: `${labelPrefix}-${type}`,
  createdAt: new Date().toISOString(),
});

export const SosWebProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return safeRead<LanguageCode>(STORAGE_KEYS.language, initialMockContracts.userSettings.language);
  });
  const [demoRole, setDemoRoleState] = useState<DemoRole>(() => {
    return safeRead<DemoRole>(STORAGE_KEYS.role, initialMockContracts.authSession.currentRole);
  });
  const [authSession, setAuthSession] = useState<MockAuthSession>(() => {
    return safeRead<MockAuthSession>(STORAGE_KEYS.authSession, initialMockContracts.authSession);
  });
  const [profile, setProfile] = useState<UserProfile>(() => {
    return safeRead<UserProfile>(STORAGE_KEYS.profile, initialMockContracts.profile);
  });
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    return sortContacts(safeRead(STORAGE_KEYS.contacts, initialMockContracts.contacts));
  });
  const [settings, setSettings] = useState<UserSettings>(() => {
    const stored = safeRead(STORAGE_KEYS.settings, initialMockContracts.userSettings);
    return {
      ...initialMockContracts.userSettings,
      ...stored,
      countdownSeconds: clampCountdown(stored.countdownSeconds ?? initialMockContracts.userSettings.countdownSeconds),
      language,
    };
  });
  const [permissionsStatus, setPermissionsStatus] = useState<PermissionsStatus>(() => {
    return safeRead(STORAGE_KEYS.permissions, initialMockContracts.permissionsStatus);
  });
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() => {
    return safeRead(STORAGE_KEYS.incidents, initialMockContracts.incidents);
  });
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => {
    return safeRead(STORAGE_KEYS.timeline, initialMockContracts.incidentTimeline);
  });
  const [notificationStatuses, setNotificationStatuses] = useState<ContactNotificationStatus[]>(() => {
    return safeRead(STORAGE_KEYS.notificationStatuses, initialMockContracts.notificationStatuses);
  });
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    return safeRead(STORAGE_KEYS.socialPosts, initialMockContracts.socialPosts);
  });
  const [revelationReports, setRevelationReports] = useState<RevelationReport[]>(() => {
    return safeRead(STORAGE_KEYS.revelationReports, initialMockContracts.revelationReports);
  });
  const [draftReports, setDraftReports] = useState<RevelationDraft[]>(() => {
    return safeRead(STORAGE_KEYS.draftReports, initialMockContracts.draftReports);
  });
  const [userCampaigns, setUserCampaigns] = useState<CitizenCampaign[]>(() => {
    return safeRead(STORAGE_KEYS.userCampaigns, initialMockContracts.userCampaigns);
  });
  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    return safeRead<string[]>(
      STORAGE_KEYS.likedPosts,
      initialMockContracts.socialPosts.filter((post) => post.engagement.likes > 500).slice(0, 1).map((post) => post.id),
    );
  });
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    return safeRead<string[]>(
      STORAGE_KEYS.savedPosts,
      initialMockContracts.socialPosts.filter((post) => post.isSaved).map((post) => post.id),
    );
  });
  const [supportedPostIds, setSupportedPostIds] = useState<string[]>(() => {
    return safeRead<string[]>(
      STORAGE_KEYS.supportedPosts,
      initialMockContracts.socialPosts.filter((post) => post.isSupported).map((post) => post.id),
    );
  });
  const [favoriteResourceIds, setFavoriteResourceIds] = useState<string[]>(() => {
    return safeRead<string[]>(STORAGE_KEYS.resourcesFavorites, []);
  });
  const [followedNgoIds, setFollowedNgoIds] = useState<string[]>(() => {
    return safeRead<string[]>(STORAGE_KEYS.followedNgos, []);
  });
  const [sosStage, setSosStage] = useState<SosStage>(findActiveIncident(incidents) ? "active" : "idle");
  const [sosCountdown, setSosCountdown] = useState(settings.countdownSeconds);

  const holdTimeoutRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const tFn = (key: TranslationKey) => t(language, key);

  const safetyReadiness = useMemo(() => {
    let score = 10;
    if (contacts.filter((contact) => contact.activeForSos).length >= 2) score += 30;
    if (permissionsStatus.location === "granted") score += 20;
    if (permissionsStatus.notifications === "granted") score += 15;
    if (permissionsStatus.camera === "granted") score += 10;
    if (permissionsStatus.microphone === "granted") score += 10;
    if (settings.autoRecord) score += 5;
    if (settings.continuousLocationShare) score += 5;
    if (settings.countdownSeconds <= 5) score += 5;
    return Math.min(score, 100);
  }, [contacts, permissionsStatus, settings]);

  useEffect(() => safeWrite(STORAGE_KEYS.language, language), [language]);
  useEffect(() => safeWrite(STORAGE_KEYS.role, demoRole), [demoRole]);
  useEffect(() => safeWrite(STORAGE_KEYS.authSession, authSession), [authSession]);
  useEffect(() => safeWrite(STORAGE_KEYS.profile, profile), [profile]);
  useEffect(() => safeWrite(STORAGE_KEYS.contacts, contacts), [contacts]);
  useEffect(() => safeWrite(STORAGE_KEYS.settings, settings), [settings]);
  useEffect(() => safeWrite(STORAGE_KEYS.permissions, permissionsStatus), [permissionsStatus]);
  useEffect(() => safeWrite(STORAGE_KEYS.incidents, incidents), [incidents]);
  useEffect(() => safeWrite(STORAGE_KEYS.timeline, timeline), [timeline]);
  useEffect(() => safeWrite(STORAGE_KEYS.notificationStatuses, notificationStatuses), [notificationStatuses]);
  useEffect(() => safeWrite(STORAGE_KEYS.draftReports, draftReports), [draftReports]);
  useEffect(() => safeWrite(STORAGE_KEYS.revelationReports, revelationReports), [revelationReports]);
  useEffect(() => safeWrite(STORAGE_KEYS.socialPosts, socialPosts), [socialPosts]);
  useEffect(() => safeWrite(STORAGE_KEYS.savedPosts, savedPostIds), [savedPostIds]);
  useEffect(() => safeWrite(STORAGE_KEYS.likedPosts, likedPostIds), [likedPostIds]);
  useEffect(() => safeWrite(STORAGE_KEYS.supportedPosts, supportedPostIds), [supportedPostIds]);
  useEffect(() => safeWrite(STORAGE_KEYS.resourcesFavorites, favoriteResourceIds), [favoriteResourceIds]);
  useEffect(() => safeWrite(STORAGE_KEYS.followedNgos, followedNgoIds), [followedNgoIds]);
  useEffect(() => safeWrite(STORAGE_KEYS.userCampaigns, userCampaigns), [userCampaigns]);

  useEffect(() => {
    setSettings((prev) => ({ ...prev, language }));
  }, [language]);

  useEffect(() => {
    if (!findActiveIncident(incidents) && sosStage === "active") {
      setSosStage("idle");
    }
    if (findActiveIncident(incidents) && sosStage === "idle") {
      setSosStage("active");
    }
  }, [incidents, sosStage]);

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) window.clearTimeout(holdTimeoutRef.current);
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, []);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    setSettings((prev) => ({ ...prev, language: nextLanguage }));
  };

  const setDemoRole = (role: DemoRole) => {
    setDemoRoleState(role);
    setAuthSession((prev) => ({
      ...prev,
      currentRole: role,
    }));
  };

  const loginWithMockOtp = (mobile: string, role: DemoRole) => {
    const cleaned = mobile.replace(/\D/g, "").slice(-10);
    const formatted = `+91 ${cleaned}`;
    setDemoRoleState(role);
    setAuthSession({
      isAuthenticated: true,
      mobile: formatted,
      otpVerified: true,
      currentRole: role,
      lastLoginAt: new Date().toISOString(),
    });
    if (role === "citizen") {
      setProfile((prev) => ({ ...prev, phone: formatted }));
    }
    toast.success("Mock OTP verified.");
  };

  const logout = () => {
    setAuthSession({
      isAuthenticated: false,
      mobile: "",
      otpVerified: false,
      currentRole: "citizen",
    });
    setDemoRoleState("citizen");
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
    toast.success("Profile updated.");
  };

  const updateSettings = (patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next: UserSettings = {
        ...prev,
        ...patch,
        countdownSeconds: clampCountdown(
          patch.countdownSeconds ?? prev.countdownSeconds ?? initialMockContracts.userSettings.countdownSeconds,
        ),
      };
      if (patch.language) {
        setLanguageState(patch.language);
      }
      return next;
    });
  };

  const updatePermissionsStatus = (patch: Partial<PermissionsStatus>) => {
    setPermissionsStatus((prev) => ({ ...prev, ...patch }));
  };

  const addOrUpdateContact = (contact: EmergencyContact) => {
    setContacts((prev) => {
      const exists = prev.some((item) => item.id === contact.id);
      const next = exists ? prev.map((item) => (item.id === contact.id ? contact : item)) : [...prev, contact];
      return sortContacts(next);
    });
    toast.success(tFn("success.contactSaved"));
  };

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((item) => item.id !== id));
    toast.success(tFn("success.contactDeleted"));
  };

  const reorderContacts = (ids: string[]) => {
    setContacts((prev) => {
      const map = new Map(prev.map((item) => [item.id, item]));
      const reordered = ids
        .map((id, index) => {
          const item = map.get(id);
          if (!item) return null;
          return { ...item, priority: index + 1 };
        })
        .filter(Boolean) as EmergencyContact[];
      if (!reordered.length) return prev;
      return reordered;
    });
  };

  const clearSosTimers = () => {
    if (holdTimeoutRef.current) {
      window.clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const pushTimeline = (
    incidentId: string,
    message: string,
    eventType: TimelineEvent["eventType"] = "status",
    actor = "System",
    actorRole: TimelineEvent["actorRole"] = "system",
  ) => {
    setTimeline((prev) => [
      {
        id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        incidentId,
        actor,
        actorRole,
        eventType,
        message,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateIncidentNotifications = (
    incidentId: string,
    updater: (current: ContactNotificationStatus[]) => ContactNotificationStatus[],
  ) => {
    setNotificationStatuses((prev) => updater(prev));
    setIncidents((prev) =>
      prev.map((incident) => {
        if (incident.id !== incidentId) return incident;
        const nextStatuses = updater(incident.notifiedContacts);
        return {
          ...incident,
          notifiedContacts: nextStatuses,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const createLiveIncident = () => {
    const incidentId = createCaseId("SOS");
    const nowIso = new Date().toISOString();
    const activeContacts = sortContacts(contacts.filter((contact) => contact.activeForSos));

    const generatedStatuses: ContactNotificationStatus[] = activeContacts.map((contact, index) => ({
      id: `ns-${Date.now()}-${index}`,
      incidentId,
      contactId: contact.id,
      contactName: contact.name,
      channel: index % 3 === 0 ? "sms" : index % 3 === 1 ? "push" : "voice",
      status: index === 0 ? "success" : index === 1 ? "pending" : "failed",
      sentAt: nowIso,
      updatedAt: nowIso,
      retryCount: 0,
    }));

    const incident: IncidentRecord = {
      id: incidentId,
      type: "sos",
      sourceType: "self",
      title: "Live SOS activation",
      description: "User triggered SOS from the web emergency console.",
      severity: "critical",
      status: "alert-sent",
      urgencyFlag: true,
      location: {
        lat: 28.6139,
        lng: 77.209,
        address: "Live location captured in web demo",
        area: "Current Region",
        district: "New Delhi",
        state: "Delhi",
      },
      notifiedContacts: generatedStatuses,
      attachments: [],
      verificationFlags: {
        authorityVerified: false,
        ngoLinked: false,
        evidenceReviewed: false,
      },
      categoryTags: ["web-sos", "live-tracking"],
      countdownSeconds: settings.countdownSeconds,
      silentMode: settings.silentMode,
      fakeCallEnabled: settings.fakeCallShortcut,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setIncidents((prev) => [incident, ...prev]);
    setNotificationStatuses((prev) => [...generatedStatuses, ...prev]);
    setSosStage("active");

    pushTimeline(incidentId, "SOS activated and contacts notified.", "status", "Citizen", "citizen");

    window.setTimeout(() => {
      setIncidents((prev) =>
        prev.map((item) =>
          item.id === incidentId
            ? { ...item, status: "tracking-active", updatedAt: new Date().toISOString() }
            : item,
        ),
      );
      pushTimeline(incidentId, "Tracking active with live location updates.", "location");
    }, 1200);

    toast.success(tFn("success.sosActivated"));
  };

  const beginSosHold = () => {
    if (sosStage !== "idle") return;
    clearSosTimers();
    setSosStage("arming");

    holdTimeoutRef.current = window.setTimeout(() => {
      setSosStage("countdown");
      setSosCountdown(settings.countdownSeconds);

      countdownRef.current = window.setInterval(() => {
        setSosCountdown((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) {
              window.clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            createLiveIncident();
            return settings.countdownSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }, 650);
  };

  const cancelSosFlow = () => {
    clearSosTimers();
    setSosCountdown(settings.countdownSeconds);
    setSosStage(findActiveIncident(incidents) ? "active" : "idle");
  };

  const resolveIncident = (incidentId: string) => {
    const nowIso = new Date().toISOString();
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              status: "resolved",
              urgencyFlag: false,
              updatedAt: nowIso,
              resolvedAt: nowIso,
            }
          : incident,
      ),
    );
    pushTimeline(incidentId, "Citizen confirmed safety and closed the incident.", "status", "Citizen", "citizen");
    setSosStage("idle");
    toast.success(tFn("success.incidentResolved"));
  };

  const escalateIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              severity: "critical",
              status: "waiting-response",
              urgencyFlag: true,
              updatedAt: new Date().toISOString(),
            }
          : incident,
      ),
    );
    pushTimeline(incidentId, "Citizen escalated the case to authorities.", "verification", "Citizen", "citizen");
    toast.success("Incident escalated.");
  };

  const updateIncidentStatus = (incidentId: string, status: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              status,
              urgencyFlag: status === "resolved" ? false : incident.urgencyFlag,
              updatedAt: new Date().toISOString(),
              resolvedAt: status === "resolved" ? new Date().toISOString() : incident.resolvedAt,
            }
          : incident,
      ),
    );
    pushTimeline(incidentId, `Status updated to ${status}.`);
  };

  const retryNotification = (notificationId: string) => {
    const current = notificationStatuses.find((item) => item.id === notificationId);
    if (!current) return;
    updateIncidentNotifications(current.incidentId, (statuses) =>
      statuses.map((item) =>
        item.id === notificationId
          ? {
              ...item,
              status: "success",
              updatedAt: new Date().toISOString(),
              retryCount: (item.retryCount || 0) + 1,
            }
          : item,
      ),
    );
    pushTimeline(
      current.incidentId,
      `Notification retry sent to ${current.contactName} (${current.channel.toUpperCase()}).`,
      "status",
    );
    toast.success("Notification retried.");
  };

  const addIncidentEvidence = (incidentId: string, type: MediaAttachmentType) => {
    const attachment = createAttachment(type);
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === incidentId
          ? {
              ...incident,
              attachments: [attachment, ...incident.attachments],
              updatedAt: new Date().toISOString(),
            }
          : incident,
      ),
    );
    pushTimeline(incidentId, `${type} evidence added by the citizen.`, "evidence", "Citizen", "citizen");
    toast.success(`${type} evidence added.`);
  };

  const createSpectatorIncident = (payload: {
    type: string;
    details: string;
    location: string;
    attachments?: MediaAttachmentType[];
  }) => {
    const incidentId = createCaseId("SPE");
    const nowIso = new Date().toISOString();
    const incident: IncidentRecord = {
      id: incidentId,
      type: "spectator-alert",
      sourceType: "spectator",
      title: `${payload.type} spectator alert`,
      description: payload.details.trim(),
      severity: payload.type === "fire" || payload.type === "medical" ? "critical" : "high",
      status: "alert-sent",
      urgencyFlag: true,
      location: {
        address: payload.location.trim() || "Shared by spectator",
        area: payload.location.trim() || "Shared by spectator",
        district: "Unknown district",
        state: "Unknown state",
      },
      notifiedContacts: [],
      attachments: (payload.attachments || []).map((type) => createAttachment(type, "spectator")),
      verificationFlags: {
        authorityVerified: false,
        ngoLinked: false,
        evidenceReviewed: false,
      },
      categoryTags: ["spectator-alert", payload.type.toLowerCase()],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    setIncidents((prev) => [incident, ...prev]);
    pushTimeline(incidentId, "Spectator assist alert submitted for another person.", "status", "Citizen", "citizen");
    toast.success("Spectator assist alert created.");
    return incidentId;
  };

  const syncPostFlags = (postId: string, patch: Partial<Pick<SocialPost, "isSaved" | "isSupported">>) => {
    setSocialPosts((posts) =>
      posts.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              ...patch,
            },
      ),
    );
  };

  const togglePostLike = (postId: string) => {
    setLikedPostIds((prev) => {
      const exists = prev.includes(postId);
      setSocialPosts((posts) =>
        posts.map((post) =>
          post.id !== postId
            ? post
            : {
                ...post,
                engagement: {
                  ...post.engagement,
                  likes: Math.max(0, post.engagement.likes + (exists ? -1 : 1)),
                },
              },
        ),
      );
      return exists ? prev.filter((id) => id !== postId) : [...prev, postId];
    });
  };

  const togglePostSave = (postId: string) => {
    setSavedPostIds((prev) => {
      const exists = prev.includes(postId);
      syncPostFlags(postId, { isSaved: !exists });
      return exists ? prev.filter((id) => id !== postId) : [...prev, postId];
    });
  };

  const togglePostSupport = (postId: string) => {
    setSupportedPostIds((prev) => {
      const exists = prev.includes(postId);
      setSocialPosts((posts) =>
        posts.map((post) =>
          post.id !== postId
            ? post
            : {
                ...post,
                isSupported: !exists,
                engagement: {
                  ...post.engagement,
                  supports: Math.max(0, post.engagement.supports + (exists ? -1 : 1)),
                },
              },
        ),
      );
      return exists ? prev.filter((id) => id !== postId) : [...prev, postId];
    });
  };

  const addSocialPost = (payload: {
    content: string;
    postType: NonNullable<SocialPost["postType"]>;
    title?: string;
    mediaTypes?: MediaAttachmentType[];
  }) => {
    const nowIso = new Date().toISOString();
    const post: SocialPost = {
      id: `post-${Date.now()}`,
      author: {
        name: demoRole === "citizen" ? profile.name : `${demoRole.toUpperCase()} Desk`,
        role: demoRole === "authority" || demoRole === "ngo" ? demoRole : "citizen",
        verified: demoRole !== "citizen",
      },
      title: payload.title?.trim() || undefined,
      content: payload.content.trim(),
      media: (payload.mediaTypes || []).map((type) => createAttachment(type, "post")),
      createdAt: nowIso,
      locationText: demoRole === "citizen" ? profile.address : "Command Center",
      category: payload.postType,
      postType: payload.postType,
      tags: [`#${payload.postType}`],
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        supports: 0,
      },
      commentsPreview: [],
      supporters: [],
      isUrgent: payload.postType === "community-alert",
      isNearby: true,
      isVerified: demoRole !== "citizen",
    };
    setSocialPosts((prev) => [post, ...prev]);
    toast.success("Post published.");
  };

  const addSocialComment = (postId: string, commentText: string) => {
    const textValue = commentText.trim();
    if (!textValue) return;
    setSocialPosts((posts) =>
      posts.map((post) =>
        post.id !== postId
          ? post
          : {
              ...post,
              commentsPreview: [
                {
                  id: `c-${Date.now()}`,
                  author: profile.name,
                  text: textValue,
                },
                ...post.commentsPreview,
              ],
              engagement: {
                ...post.engagement,
                comments: post.engagement.comments + 1,
              },
            },
      ),
    );
    toast.success("Comment added.");
  };

  const toggleResourceFavorite = (resourceId: string) => {
    setFavoriteResourceIds((prev) => {
      const exists = prev.includes(resourceId);
      return exists ? prev.filter((id) => id !== resourceId) : [...prev, resourceId];
    });
  };

  const toggleNgoFollow = (ngoId: string) => {
    setFollowedNgoIds((prev) => {
      const exists = prev.includes(ngoId);
      toast.success(exists ? "NGO unfollowed." : "NGO followed.");
      return exists ? prev.filter((id) => id !== ngoId) : [...prev, ngoId];
    });
  };

  const createUserCampaign = (
    payload: Pick<CitizenCampaign, "title" | "summary" | "category" | "targetAmount" | "visibility">,
  ) => {
    const campaign: CitizenCampaign = {
      id: createUserCampaignId(),
      title: payload.title.trim(),
      summary: payload.summary.trim(),
      category: payload.category,
      targetAmount: payload.targetAmount,
      raisedAmount: 0,
      visibility: payload.visibility,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setUserCampaigns((prev) => [campaign, ...prev]);
    toast.success(tFn("success.campaignCreated"));
  };

  const updateUserCampaignStatus = (campaignId: string, status: CitizenCampaign["status"]) => {
    setUserCampaigns((prev) =>
      prev.map((campaign) =>
        campaign.id === campaignId
          ? {
              ...campaign,
              status,
            }
          : campaign,
      ),
    );
  };

  const saveDraftReport = (draft: RevelationDraft) => {
    setDraftReports((prev) => {
      const exists = prev.some((item) => item.id === draft.id);
      const nextDraft = { ...draft, updatedAt: new Date().toISOString() };
      return exists ? prev.map((item) => (item.id === draft.id ? nextDraft : item)) : [nextDraft, ...prev];
    });
    toast.success(tFn("success.draftSaved"));
  };

  const deleteDraftReport = (draftId: string) => {
    setDraftReports((prev) => prev.filter((item) => item.id !== draftId));
  };

  const submitRevelationReport = (payload: Omit<RevelationReport, "id" | "createdAt" | "status">) => {
    const reportId = createCaseId("REV");
    const report: RevelationReport = {
      ...payload,
      id: reportId,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    setRevelationReports((prev) => [report, ...prev]);
    toast.success(tFn("success.reportSubmitted"));
    return reportId;
  };

  const activeIncident = useMemo(() => findActiveIncident(incidents), [incidents]);

  const ngoDirectory = useMemo(() => initialMockContracts.ngoDirectory, []);
  const resources = useMemo(() => initialMockContracts.resources, []);
  const authorityQueue = useMemo(() => initialMockContracts.authorityQueue, []);
  const dashboardWidgets = useMemo(() => initialMockContracts.dashboardWidgets, []);
  const transparencyEntries = useMemo(() => initialMockContracts.transparencyEntries, []);
  const contributions = useMemo(() => initialMockContracts.contributions, []);

  const value: SosWebContextValue = {
    language,
    demoRole,
    authSession,
    profile,
    contacts,
    settings,
    permissionsStatus,
    safetyReadiness,
    incidents,
    timeline,
    notificationStatuses,
    socialPosts,
    resources,
    revelationReports,
    draftReports,
    authorityQueue,
    ngoCampaigns: initialMockContracts.ngoCampaigns,
    ngoDirectory,
    followedNgoIds,
    contributions,
    userCampaigns,
    transparencyEntries,
    dashboardWidgets,
    sosStage,
    sosCountdown,
    activeIncident,
    likedPostIds,
    savedPostIds,
    supportedPostIds,
    favoriteResourceIds,
    t: tFn,
    setLanguage,
    setDemoRole,
    loginWithMockOtp,
    logout,
    updateProfile,
    updateSettings,
    updatePermissionsStatus,
    addOrUpdateContact,
    removeContact,
    reorderContacts,
    beginSosHold,
    cancelSosFlow,
    resolveIncident,
    escalateIncident,
    updateIncidentStatus,
    retryNotification,
    addIncidentEvidence,
    createSpectatorIncident,
    togglePostLike,
    togglePostSave,
    togglePostSupport,
    addSocialPost,
    addSocialComment,
    toggleResourceFavorite,
    toggleNgoFollow,
    createUserCampaign,
    updateUserCampaignStatus,
    saveDraftReport,
    deleteDraftReport,
    submitRevelationReport,
  };

  return <SosWebContext.Provider value={value}>{children}</SosWebContext.Provider>;
};

export const useSosWeb = () => {
  const context = useContext(SosWebContext);
  if (!context) {
    throw new Error("useSosWeb must be used inside SosWebProvider");
  }
  return context;
};
