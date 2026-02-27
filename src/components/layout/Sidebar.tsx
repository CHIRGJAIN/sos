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
  ArrowLeft,
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

const portalHomePath: Record<Portal, string> = {
  user: "/user/home",
  ngo: "/ngo/feed",
  resource: "/resource/handle",
  admin: "/admin/dashboard",
  authority: "/authority/dashboard",
  business: "/business/dashboard",
};

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
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-[#f5f6f8] text-slate-700 transition-all duration-200",
          collapsed ? "lg:w-[92px]" : "lg:w-[292px]",
          mobileOpen ? "translate-x-0 w-[292px]" : "-translate-x-full w-[292px] lg:translate-x-0"
        )}
      >
        <div className="border-b border-slate-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-3", collapsed && "lg:mx-auto")}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-700 text-sm font-bold text-white shadow-sm">
                Y
              </div>
              <div className={cn("min-w-0", collapsed && "lg:hidden")}>
                <p className="truncate text-sm font-semibold text-slate-900">Sankat Mochan Outreach Service</p>
              
              </div>
            </div>
            <button
              onClick={onToggleCollapse}
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 lg:flex"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </div>

          <button
            onClick={() => {
              navigate(portalHomePath[portal]);
              onCloseMobile();
            }}
            className={cn(
              "mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-blue-600 hover:bg-blue-50",
              collapsed && "lg:justify-center lg:px-2"
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <ArrowLeft className="h-4 w-4" />
            </span>
            <span className={cn(collapsed && "lg:hidden")}>Back to Dashboard</span>
          </button>

          <button
            onClick={onCloseMobile}
            className="mt-3 h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-500 lg:hidden"
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
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                  active
                    ? "bg-[#e6edf8] text-blue-600"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                  collapsed && "lg:justify-center"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", active ? "text-blue-600" : "text-slate-400")} />
                <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-2">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600",
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
