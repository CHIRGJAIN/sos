import React, { useMemo, useState } from "react";
import { Bell, ChevronDown, Menu, PanelLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Portal, useAuth } from "@/contexts/AuthContext";

interface TopbarProps {
  portal: Portal;
  title: string;
  onOpenMobileSidebar: () => void;
  onToggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  portal,
  title,
  onOpenMobileSidebar,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const { getUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = getUser(portal);
  const initials = useMemo(
    () => (user?.name?.trim()?.[0] || user?.email?.trim()?.[0] || portal[0]).toUpperCase(),
    [user, portal]
  );

  const handleLogout = () => {
    logout(portal);
    navigate(`/${portal}/login`);
  };

  const profileRoutes: Record<Portal, { detail: string; settings: string }> = {
    user: { detail: "/user/personal-detail", settings: "/user/profile" },
    ngo: { detail: "/ngo/feed", settings: "/ngo/feed" },
    resource: { detail: "/resource/handle", settings: "/resource/handle" },
    admin: { detail: "/admin/dashboard", settings: "/admin/dashboard" },
    authority: { detail: "/authority/dashboard", settings: "/authority/dashboard" },
    business: { detail: "/business/dashboard", settings: "/business/dashboard" },
  };

  const portalRoleLabel: Record<Portal, string> = {
    user: "USER PORTAL",
    ngo: "NGO OPS",
    resource: "RESOURCE DESK",
    admin: "BASIC ADMIN",
    authority: "AUTHORITY DESK",
    business: "BUSINESS PORTAL",
  };

  return (
    <header className="sticky top-0 z-30 h-[84px] border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-full w-full max-w-[1680px] items-center justify-between gap-3 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={onToggleSidebar}
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 lg:flex"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-sans text-2xl font-semibold text-slate-900">{title}</h1>
            <p className="truncate text-sm font-medium text-slate-500">Sankat Mochan Outreach Service Admin System</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <span className="hidden h-9 w-px bg-slate-200 md:block" />

          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50"
            >
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name || "Account"}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {portalRoleLabel[portal]}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {initials}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[110%] z-40 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(profileRoutes[portal].detail);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  Personal Detail
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(profileRoutes[portal].settings);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
