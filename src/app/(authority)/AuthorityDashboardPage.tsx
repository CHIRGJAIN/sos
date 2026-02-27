import React, { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  BarChart3,
  BadgeCheck,
  Building2,
  ClipboardList,
  Kanban,
  LayoutDashboard,
  MapPinned,
  Megaphone,
  MessagesSquare,
  Newspaper,
  PackageSearch,
  Settings,
  Users,
} from "lucide-react";
import { SocialOpsShell } from "@/components/layout/SocialOpsShell";
import { SosAppProvider } from "@/sos/context/SosAppContext";
import AuthorityOverviewPage from "@/sos/pages/authority/AuthorityOverviewPage";
import AuthorityIncidentFeedPage from "@/sos/pages/authority/AuthorityIncidentFeedPage";
import AuthorityVerifyReportsPage from "@/sos/pages/authority/AuthorityVerifyReportsPage";
import AuthorityAssignmentBoardPage from "@/sos/pages/authority/AuthorityAssignmentBoardPage";
import AuthorityNgoDirectoryPage from "@/sos/pages/authority/AuthorityNgoDirectoryPage";
import AuthorityRespondersPage from "@/sos/pages/authority/AuthorityRespondersPage";
import AuthorityEscalationsPage from "@/sos/pages/authority/AuthorityEscalationsPage";
import AuthorityResourceRequestsPage from "@/sos/pages/authority/AuthorityResourceRequestsPage";
import AuthorityAreaMonitoringPage from "@/sos/pages/authority/AuthorityAreaMonitoringPage";
import AuthorityBroadcastAlertsPage from "@/sos/pages/authority/AuthorityBroadcastAlertsPage";
import AuthorityAnalyticsPage from "@/sos/pages/authority/AuthorityAnalyticsPage";
import AuthorityCommunicationPage from "@/sos/pages/authority/AuthorityCommunicationPage";
import SettingsPage from "@/sos/pages/shared/SettingsPage";

type AuthorityMenuId =
  | "overview"
  | "incidents"
  | "verify"
  | "assignment"
  | "ngos"
  | "responders"
  | "escalations"
  | "resource-requests"
  | "area-monitoring"
  | "broadcasts"
  | "analytics"
  | "communication"
  | "settings";

const MENU_STORAGE_KEY = "authority-dashboard-active-menu";

const menuItems: Array<{
  id: AuthorityMenuId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
}> = [
  { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard, section: "Command" },
  { id: "incidents", label: "Incident Feed", icon: Newspaper, section: "Command" },
  { id: "verify", label: "Verify Reports", icon: BadgeCheck, section: "Command" },
  { id: "assignment", label: "Assignment Board", icon: Kanban, section: "Operations" },
  { id: "ngos", label: "NGOs Directory", icon: Building2, section: "Operations" },
  { id: "responders", label: "Responders / Teams", icon: Users, section: "Operations" },
  { id: "escalations", label: "Escalations", icon: AlarmClock, section: "Operations" },
  { id: "resource-requests", label: "Resource Requests", icon: PackageSearch, section: "Operations" },
  { id: "area-monitoring", label: "Area Monitoring", icon: MapPinned, section: "Monitoring" },
  { id: "broadcasts", label: "Broadcast Alerts", icon: Megaphone, section: "Monitoring" },
  { id: "analytics", label: "Analytics & Reports", icon: BarChart3, section: "Monitoring" },
  { id: "communication", label: "Communication Center", icon: MessagesSquare, section: "Collaboration" },
  { id: "settings", label: "Settings", icon: Settings, section: "System" },
];

const AuthorityDashboardWorkspace: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<AuthorityMenuId>("overview");

  useEffect(() => {
    const stored = localStorage.getItem(MENU_STORAGE_KEY) as AuthorityMenuId | null;
    if (stored) {
      setActiveMenu(stored);
    }
  }, []);

  const handleMenuChange = (menuId: string) => {
    const id = menuId as AuthorityMenuId;
    setActiveMenu(id);
    localStorage.setItem(MENU_STORAGE_KEY, id);
  };

  const content = useMemo(() => {
    switch (activeMenu) {
      case "overview":
        return <AuthorityOverviewPage />;
      case "incidents":
        return <AuthorityIncidentFeedPage />;
      case "verify":
        return <AuthorityVerifyReportsPage />;
      case "assignment":
        return <AuthorityAssignmentBoardPage />;
      case "ngos":
        return <AuthorityNgoDirectoryPage />;
      case "responders":
        return <AuthorityRespondersPage />;
      case "escalations":
        return <AuthorityEscalationsPage />;
      case "resource-requests":
        return <AuthorityResourceRequestsPage />;
      case "area-monitoring":
        return <AuthorityAreaMonitoringPage />;
      case "broadcasts":
        return <AuthorityBroadcastAlertsPage />;
      case "analytics":
        return <AuthorityAnalyticsPage />;
      case "communication":
        return <AuthorityCommunicationPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <AuthorityOverviewPage />;
    }
  }, [activeMenu]);

  return (
    <SocialOpsShell
      role="authority"
      portal="authority"
      title="Authority Command Center"
      menuItems={menuItems}
      activeMenuId={activeMenu}
      onChangeMenu={handleMenuChange}
      quickActions={["Create Case", "Broadcast Alert", "Add Resource"]}
    >
      {content}
    </SocialOpsShell>
  );
};

const AuthorityDashboardPage: React.FC = () => {
  return (
    <SosAppProvider>
      <AuthorityDashboardWorkspace />
    </SosAppProvider>
  );
};

export default AuthorityDashboardPage;
