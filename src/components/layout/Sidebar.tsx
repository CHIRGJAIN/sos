import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Twitter,
  Home,
  ClipboardList,
  MapPin,
  User,
  MessageSquareWarning,
  ShieldCheck,
  Building2,
  Eye,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Portal, useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  portal: Portal;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const portalNav: Record<Portal, NavItem[]> = {
  user: [
    { label: "Home", path: "/user/home", icon: Home },
    { label: "Distress", path: "/user/distress", icon: MessageSquareWarning },
    { label: "Resources", path: "/user/contributions", icon: ClipboardList },
    { label: "Services", path: "/user/services", icon: MapPin },
    { label: "Social", path: "/user/social", icon: Twitter },
    { label: "Transparency", path: "/transparency", icon: Eye },
    { label: "Profile", path: "/user/profile", icon: User },
    { label: "Complaint", path: "/user/revelation", icon: MessageSquareWarning },
  ],
  ngo: [
    { label: "NGO Feed", path: "/ngo/feed", icon: Heart },
    { label: "Social", path: "/user/social", icon: Twitter },
    { label: "Services", path: "/user/services", icon: MapPin },
    { label: "Transparency", path: "/transparency", icon: Eye },
  ],
  resource: [
    { label: "Resources", path: "/resource/handle", icon: ClipboardList },
    { label: "Distress", path: "/user/distress", icon: MessageSquareWarning },
    { label: "Transparency", path: "/transparency", icon: Eye },
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard", icon: Home },
    { label: "Transparency", path: "/admin/transparency", icon: Eye },
    { label: "Revelations", path: "/admin/revelations", icon: MessageSquareWarning },
    { label: "NGO", path: "/ngo/feed", icon: Heart },
    { label: "Resources", path: "/resource/handle", icon: ClipboardList },
  ],
  authority: [
    { label: "Case Inbox", path: "/authority/dashboard", icon: ShieldCheck },
    { label: "Transparency", path: "/transparency", icon: Eye },
    { label: "Social", path: "/user/social", icon: Twitter },
  ],
  business: [
    { label: "Campaigns", path: "/business/dashboard", icon: Building2 },
    { label: "Transparency", path: "/transparency", icon: Eye },
    { label: "Resources", path: "/business/resources", icon: ClipboardList },
  ],
};

const Sidebar: React.FC<SidebarProps> = ({
  portal,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const navItems = portalNav[portal];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = () => {
    logout(portal);
    navigate(`/${portal}/login`);
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-primary/15 bg-navbar/95 text-navbar-foreground backdrop-blur-md transition-all duration-200",
          collapsed ? "lg:w-[84px]" : "lg:w-[260px]",
          mobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-[260px] lg:translate-x-0"
        )}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/15 px-3">
          <button
            onClick={onToggleCollapse}
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 lg:flex"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <div className={cn("font-serif text-lg font-semibold tracking-wide", collapsed ? "hidden lg:block lg:text-sm" : "")}>
            {collapsed ? "SOS" : "SOS Dashboard"}
          </div>
          <button
            onClick={onCloseMobile}
            className="h-10 w-10 rounded-full bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <ChevronLeft className="mx-auto h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onCloseMobile();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all",
                  active
                    ? "bg-white/20 text-white shadow-soft"
                    : "text-navbar-foreground/80 hover:bg-white/10 hover:text-white",
                  collapsed && "lg:justify-center"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/15 p-2">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-navbar-foreground/85 transition-all hover:bg-white/10 hover:text-white",
              collapsed && "lg:justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn(collapsed && "lg:hidden")}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
