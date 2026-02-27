import React, { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  Building,
  ClipboardList,
  FileText,
  HandHeart,
  LayoutDashboard,
  LineChart,
  Map,
  MessagesSquare,
  Newspaper,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";
import { SocialOpsShell } from "@/components/layout/SocialOpsShell";
import { SosAppProvider } from "@/sos/context/SosAppContext";
import NgoOverviewPage from "@/sos/pages/ngo/NgoOverviewPage";
import NgoAssignedCasesPage from "@/sos/pages/ngo/NgoAssignedCasesPage";
import NgoNearbyRequestsPage from "@/sos/pages/ngo/NgoNearbyRequestsPage";
import NgoResponseFeedPage from "@/sos/pages/ngo/NgoResponseFeedPage";
import NgoVolunteersPage from "@/sos/pages/ngo/NgoVolunteersPage";
import NgoResourcesPage from "@/sos/pages/ngo/NgoResourcesPage";
import NgoSupportRequestsPage from "@/sos/pages/ngo/NgoSupportRequestsPage";
import NgoCommunicationPage from "@/sos/pages/ngo/NgoCommunicationPage";
import NgoReportsPage from "@/sos/pages/ngo/NgoReportsPage";
import NgoPerformancePage from "@/sos/pages/ngo/NgoPerformancePage";
import NgoOrganizationProfilePage from "@/sos/pages/ngo/NgoOrganizationProfilePage";
import SettingsPage from "@/sos/pages/shared/SettingsPage";
import AuditLogsPage from "@/sos/pages/shared/AuditLogsPage";

type NgoMenuId =
  | "overview"
  | "assigned-cases"
  | "nearby-requests"
  | "response-feed"
  | "volunteers"
  | "resources"
  | "support-requests"
  | "communication"
  | "reports"
  | "performance"
  | "organization-profile"
  | "audit-logs"
  | "settings";

const MENU_STORAGE_KEY = "ngo-dashboard-active-menu";

const menuItems: Array<{
  id: NgoMenuId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section: string;
}> = [
  { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard, section: "Operations" },
  { id: "assigned-cases", label: "Assigned Cases", icon: ClipboardList, section: "Operations" },
  { id: "nearby-requests", label: "Nearby Requests", icon: Map, section: "Operations" },
  { id: "response-feed", label: "Response Feed", icon: Newspaper, section: "Operations" },
  { id: "volunteers", label: "Volunteers / Team", icon: Users, section: "Resources" },
  { id: "resources", label: "Resources & Inventory", icon: Boxes, section: "Resources" },
  { id: "support-requests", label: "Support Requests", icon: HandHeart, section: "Resources" },
  { id: "communication", label: "Communication Center", icon: MessagesSquare, section: "Collaboration" },
  { id: "reports", label: "Reports Submitted", icon: FileText, section: "Collaboration" },
  { id: "performance", label: "Performance Insights", icon: LineChart, section: "Collaboration" },
  { id: "organization-profile", label: "Organization Profile", icon: Building, section: "System" },
  { id: "audit-logs", label: "Audit Logs", icon: ScrollText, section: "System" },
  { id: "settings", label: "Settings", icon: Settings, section: "System" },
];

const NgoDashboardWorkspace: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<NgoMenuId>("overview");

  useEffect(() => {
    const stored = localStorage.getItem(MENU_STORAGE_KEY) as NgoMenuId | null;
    if (stored) {
      setActiveMenu(stored);
    }
  }, []);

  const handleMenuChange = (menuId: string) => {
    const id = menuId as NgoMenuId;
    setActiveMenu(id);
    localStorage.setItem(MENU_STORAGE_KEY, id);
  };

  const content = useMemo(() => {
    switch (activeMenu) {
      case "overview":
        return <NgoOverviewPage />;
      case "assigned-cases":
        return <NgoAssignedCasesPage />;
      case "nearby-requests":
        return <NgoNearbyRequestsPage />;
      case "response-feed":
        return <NgoResponseFeedPage />;
      case "volunteers":
        return <NgoVolunteersPage />;
      case "resources":
        return <NgoResourcesPage />;
      case "support-requests":
        return <NgoSupportRequestsPage />;
      case "communication":
        return <NgoCommunicationPage />;
      case "reports":
        return <NgoReportsPage />;
      case "performance":
        return <NgoPerformancePage />;
      case "organization-profile":
        return <NgoOrganizationProfilePage />;
      case "audit-logs":
        return <AuditLogsPage role="ngo" />;
      case "settings":
        return <SettingsPage />;
      default:
        return <NgoOverviewPage />;
    }
  }, [activeMenu]);

  return (
    <SocialOpsShell
      role="ngo"
      portal="ngo"
      title="NGO Operations Hub"
      menuItems={menuItems}
      activeMenuId={activeMenu}
      onChangeMenu={handleMenuChange}
      quickActions={["Dispatch Team", "Update Resources", "Request Backup"]}
    >
      {content}
    </SocialOpsShell>
  );
};

const NgoFeedPage: React.FC = () => {
  return (
    <SosAppProvider>
      <NgoDashboardWorkspace />
    </SosAppProvider>
  );
};

export default NgoFeedPage;
