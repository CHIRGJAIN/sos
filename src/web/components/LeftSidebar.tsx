import { ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSosWeb } from "@/web/context/SosWebContext";
import { DemoRole } from "@/web/types";
import type { ShellNavItem } from "@/web/components/AppShell";

interface LeftSidebarProps {
  role: DemoRole;
  navItems: ShellNavItem[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const roleLabelMap = {
  citizen: "Citizen",
  authority: "Authority",
  ngo: "NGO",
  admin: "Admin",
} as const;

const LeftSidebar: React.FC<LeftSidebarProps> = ({ role, navItems, collapsed, onToggleCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, authSession } = useSosWeb();

  return (
    <aside
      className={cn(
        "sticky top-4 hidden h-[calc(100vh-2rem)] flex-col rounded-[32px] border border-white/70 bg-white/90 p-3 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur lg:flex",
        collapsed ? "w-[96px]" : "w-[288px]",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-2 py-1">
        <button
          type="button"
          onClick={() => navigate(role === "citizen" ? "/user/home" : `/${role}/dashboard`)}
          className={cn("flex items-center gap-3", collapsed && "justify-center")}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#FF3B30_0%,#FF9500_100%)] text-white">
            <ShieldAlert className="h-6 w-6" />
          </div>
          {!collapsed ? (
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Trinix SOS</p>
              <p className="text-sm font-semibold text-slate-950">Command Center</p>
            </div>
          ) : null}
        </button>
        <Button variant="ghost" size="icon" className="hidden h-9 w-9 rounded-full xl:inline-flex" onClick={onToggleCollapsed}>
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="mt-4 flex-1">
        <nav className="space-y-1 pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-all",
                  active
                    ? "bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="mt-3 rounded-[24px] border border-slate-200 bg-slate-50/90 p-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            {(profile.name || "TR").slice(0, 2).toUpperCase()}
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{profile.name || "Trinix User"}</p>
              <p className="truncate text-xs text-slate-500">{authSession.mobile || roleLabelMap[role]}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {roleLabelMap[role]}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
