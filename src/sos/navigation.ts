import { RoleNavItem } from "@/sos/models";

export const authorityNav: RoleNavItem[] = [
  { label: "Dashboard Home", icon: "layout-dashboard", path: "/authority/dashboard", section: "Overview" },
  { label: "Case / Request List", icon: "newspaper", path: "/authority/requests", section: "Casework" },
  { label: "Approvals Queue", icon: "badge-check", path: "/authority/approvals", section: "Casework", badgeCount: 3 },
  { label: "Reports / Complaints", icon: "file-text", path: "/authority/reports", section: "Casework" },
  { label: "NGO Directory", icon: "building-2", path: "/authority/ngos", section: "Operations" },
  { label: "Assignments", icon: "kanban", path: "/authority/assignments", section: "Operations" },
  { label: "Responders", icon: "users", path: "/authority/responders", section: "Operations" },
  { label: "Escalations", icon: "alarm-clock", path: "/authority/escalations", section: "Operations", badgeCount: 4 },
  { label: "Resource Requests", icon: "package-search", path: "/authority/resource-requests", section: "Operations" },
  { label: "Area Monitoring", icon: "map-pinned", path: "/authority/area-monitoring", section: "Operations" },
  { label: "Announcements", icon: "megaphone", path: "/authority/announcements", section: "Broadcast" },
  { label: "Analytics", icon: "bar-chart-3", path: "/authority/analytics", section: "Broadcast" },
  { label: "Messages", icon: "messages-square", path: "/authority/messages", section: "Broadcast" },
  { label: "Notifications", icon: "scroll-text", path: "/authority/notifications", section: "System", badgeCount: 6 },
  { label: "Settings", icon: "settings", path: "/authority/settings", section: "System" },
  { label: "Help", icon: "hand-heart", path: "/authority/help", section: "System" },
];

export const ngoNav: RoleNavItem[] = [
  { label: "Dashboard Home", icon: "layout-dashboard", path: "/ngo/dashboard", section: "Overview" },
  { label: "Requests / Cases", icon: "clipboard-list", path: "/ngo/requests", section: "Casework", badgeCount: 5 },
  { label: "Submit New Request", icon: "file-text", path: "/ngo/submit", section: "Casework" },
  { label: "Documents / Records", icon: "scroll-text", path: "/ngo/documents", section: "Casework" },
  { label: "Status Tracking", icon: "line-chart", path: "/ngo/status-tracking", section: "Casework" },
  { label: "Assigned Tasks", icon: "kanban", path: "/ngo/tasks", section: "Operations" },
  { label: "Nearby Requests", icon: "map", path: "/ngo/nearby-requests", section: "Operations" },
  { label: "Response Feed", icon: "newspaper", path: "/ngo/response-feed", section: "Operations" },
  { label: "Resources", icon: "boxes", path: "/ngo/resources", section: "Operations" },
  { label: "Support Requests", icon: "hand-heart", path: "/ngo/support-requests", section: "Operations", badgeCount: 2 },
  { label: "Messages", icon: "messages-square", path: "/ngo/messages", section: "Operations" },
  { label: "Notifications", icon: "badge-check", path: "/ngo/notifications", section: "System", badgeCount: 4 },
  { label: "Reports", icon: "file-text", path: "/ngo/reports", section: "System" },
  { label: "Performance", icon: "bar-chart-3", path: "/ngo/performance", section: "System" },
  { label: "Organization Profile", icon: "building", path: "/ngo/profile", section: "System" },
  { label: "Team Members", icon: "users", path: "/ngo/team", section: "System" },
  { label: "Settings", icon: "settings", path: "/ngo/settings", section: "System" },
  { label: "Help", icon: "hand-heart", path: "/ngo/help", section: "System" },
];

export const sharedNavLinks = [
  { label: "Help", path: "/help" },
  { label: "Search", path: "/search" },
  { label: "Notifications", path: "/notifications" },
  { label: "Profile", path: "/profile" },
];
