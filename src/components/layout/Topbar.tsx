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

  return (
    <header className="sticky top-0 z-30 h-[72px] border-b border-primary/15 bg-popover/60 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-3 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMobileSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-popover lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={onToggleSidebar}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-popover lg:flex"
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <h1 className="font-serif text-xl font-semibold text-foreground lg:text-3xl">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-popover"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-foreground/80" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-primary/20 bg-popover px-2 py-1.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {initials}
              </span>
              <span className="hidden text-sm font-medium text-foreground lg:block">
                {user?.name || "Account"}
              </span>
              <ChevronDown className="h-4 w-4 text-foreground/70" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[110%] z-40 w-52 rounded-xl border border-primary/20 bg-popover p-1.5 shadow-lg">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(profileRoutes[portal].detail);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary/60"
                >
                  Personal Detail
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(profileRoutes[portal].settings);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary/60"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-accent hover:bg-accent/10"
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
