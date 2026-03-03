import { useEffect } from "react";
import {
  Activity,
  BadgeCheck,
  Building2,
  FileWarning,
  HandCoins,
  Handshake,
  HeartPulse,
  Home,
  LayoutDashboard,
  Radar,
  Shield,
  ShieldAlert,
  Siren,
  UserCircle2,
  Users,
} from "lucide-react";
import AppShell, { ShellNavItem } from "@/web/components/AppShell";
import SectionCard from "@/web/components/SectionCard";
import CitizenDashboardModule from "@/web/pages/modules/CitizenDashboardModule";
import CitizenSosModule from "@/web/pages/modules/CitizenSosModule";
import DistressHistoryModule from "@/web/pages/modules/DistressHistoryModule";
import ContactsModule from "@/web/pages/modules/ContactsModule";
import SocialFeedModule from "@/web/pages/modules/SocialFeedModule";
import ResourcesModule from "@/web/pages/modules/ResourcesModule";
import NgoDirectoryModule from "@/web/pages/modules/NgoDirectoryModule";
import RevelationModule from "@/web/pages/modules/RevelationModule";
import TransparencyModule from "@/web/pages/modules/TransparencyModule";
import SettingsModule from "@/web/pages/modules/SettingsModule";
import UserProfileCampaignModule from "@/web/pages/modules/UserProfileCampaignModule";
import AuthorityDashboardModule from "@/web/pages/modules/AuthorityDashboardModule";
import NgoDashboardPanel from "@/web/pages/modules/NgoDashboardPanel";
import AdminDashboardPanel from "@/web/pages/modules/AdminDashboardPanel";
import SpectatorAssistModule from "@/web/pages/modules/SpectatorAssistModule";
import { useSosWeb } from "@/web/context/SosWebContext";
import { DemoRole } from "@/web/types";

type CitizenModule =
  | "dashboard"
  | "sos"
  | "incident"
  | "spectator"
  | "history"
  | "contacts"
  | "social"
  | "resources"
  | "ngos"
  | "revelation"
  | "transparency"
  | "settings"
  | "profile";

type AuthorityModule = "dashboard" | "queue" | "analytics" | "broadcast" | "verification";
type NgoModule = "dashboard" | "requests" | "campaigns" | "resources" | "transparency";
type AdminModule = "dashboard" | "queue" | "verification" | "transparency";

type ModuleKey = CitizenModule | AuthorityModule | NgoModule | AdminModule;

interface PortalWorkspacePageProps {
  role: DemoRole;
  module: ModuleKey;
}

const PortalWorkspacePage: React.FC<PortalWorkspacePageProps> = ({ role, module }) => {
  const { setDemoRole, dashboardWidgets, t } = useSosWeb();

  useEffect(() => {
    setDemoRole(role);
  }, [role, setDemoRole]);

  const citizenNav: ShellNavItem[] = [
    { key: "home", label: "Home", path: "/user/home", icon: Home, section: "main" },
    { key: "sos", label: "SOS", path: "/user/sos", icon: ShieldAlert, section: "main" },
    { key: "incident", label: "Active Incident", path: "/user/incident", icon: Radar, section: "main" },
    { key: "revelation", label: "Revelation", path: "/user/revelation", icon: FileWarning, section: "operations" },
    { key: "spectator", label: "Spectator Assist", path: "/user/spectator", icon: HeartPulse, section: "operations" },
    { key: "ngos", label: "NGO Directory", path: "/user/ngos", icon: Handshake, section: "operations" },
    { key: "social", label: "Community Feed", path: "/user/social", icon: Users, section: "operations" },
    { key: "resources", label: "Resources", path: "/user/resources", icon: Building2, section: "management" },
    { key: "profile", label: "Profile", path: "/user/profile", icon: UserCircle2, section: "management" },
  ];

  const authorityNav: ShellNavItem[] = [
    { key: "dashboard", label: "Control Room", path: "/authority/dashboard", icon: LayoutDashboard, section: "main" },
    { key: "queue", label: "Case Queue", path: "/authority/queue", icon: Siren, section: "operations" },
    { key: "analytics", label: "Analytics", path: "/authority/analytics", icon: Activity, section: "management" },
    { key: "broadcast", label: "Broadcast", path: "/authority/broadcast", icon: ShieldAlert, section: "management" },
    { key: "verification", label: "Verification", path: "/authority/verification", icon: BadgeCheck, section: "management" },
  ];

  const ngoNav: ShellNavItem[] = [
    { key: "dashboard", label: "NGO Overview", path: "/ngo/dashboard", icon: LayoutDashboard, section: "main" },
    { key: "requests", label: "Requests", path: "/ngo/requests", icon: Siren, section: "operations" },
    { key: "campaigns", label: "Campaigns", path: "/ngo/campaigns", icon: HandCoins, section: "operations" },
    { key: "resources", label: "Allocation", path: "/ngo/resources", icon: Building2, section: "management" },
    { key: "transparency", label: "Transparency", path: "/ngo/transparency", icon: BadgeCheck, section: "management" },
  ];

  const adminNav: ShellNavItem[] = [
    { key: "dashboard", label: "Executive View", path: "/admin/dashboard", icon: LayoutDashboard, section: "main" },
    { key: "queue", label: "Moderation", path: "/admin/queue", icon: FileWarning, section: "operations" },
    { key: "verification", label: "Verification", path: "/admin/verification", icon: BadgeCheck, section: "operations" },
    { key: "transparency", label: "Oversight", path: "/admin/transparency", icon: Shield, section: "management" },
  ];

  const citizenModule = (() => {
    switch (module as CitizenModule) {
      case "dashboard":
        return <CitizenDashboardModule />;
      case "sos":
      case "incident":
        return <CitizenSosModule />;
      case "spectator":
        return <SpectatorAssistModule />;
      case "history":
        return <DistressHistoryModule />;
      case "contacts":
        return <ContactsModule />;
      case "social":
        return <SocialFeedModule />;
      case "resources":
        return <ResourcesModule />;
      case "ngos":
        return <NgoDirectoryModule />;
      case "revelation":
        return <RevelationModule />;
      case "transparency":
        return <TransparencyModule />;
      case "settings":
        return <SettingsModule />;
      case "profile":
        return <UserProfileCampaignModule />;
      default:
        return <CitizenDashboardModule />;
    }
  })();

  const rightRailContent = (
    <>
      <SectionCard title={t("widget.nearbyResources")}>
        <div className="space-y-2">
          {dashboardWidgets.nearbyResources.map((resource) => (
            <div key={resource.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <p className="font-semibold text-slate-900">{resource.label}</p>
              <p>{resource.distanceKm} km</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Community momentum">
        <div className="space-y-2">
          {dashboardWidgets.activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <p className="font-semibold text-slate-900">{campaign.title}</p>
              <p>{campaign.progress}% complete</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );

  if (role === "citizen") {
    return (
      <AppShell role={role} navItems={citizenNav} rightPanel={rightRailContent}>
        {citizenModule}
      </AppShell>
    );
  }

  if (role === "authority") {
    return (
      <AppShell role={role} navItems={authorityNav} rightPanel={rightRailContent}>
        <AuthorityDashboardModule mode={module as AuthorityModule} />
      </AppShell>
    );
  }

  if (role === "ngo") {
    return (
      <AppShell role={role} navItems={ngoNav} rightPanel={rightRailContent}>
        <NgoDashboardPanel mode={module as NgoModule} />
      </AppShell>
    );
  }

  return (
    <AppShell role={role} navItems={adminNav} rightPanel={rightRailContent}>
      <AdminDashboardPanel mode={module as AdminModule} />
    </AppShell>
  );
};

export default PortalWorkspacePage;
