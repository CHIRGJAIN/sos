import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  Globe,
  LayoutGrid,
  Menu,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  UserCircle2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import LeftSidebar from "@/web/components/LeftSidebar";
import RightSidebarWidgets from "@/web/components/RightSidebarWidgets";
import { localeList } from "@/web/i18n";
import { useSosWeb } from "@/web/context/SosWebContext";
import { DemoRole } from "@/web/types";

export interface ShellNavItem {
  key: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  section: "main" | "operations" | "management";
}

interface AppShellProps {
  role: DemoRole;
  navItems: ShellNavItem[];
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}

const roleRouteMap: Record<DemoRole, string> = {
  citizen: "/user/home",
  authority: "/authority/dashboard",
  ngo: "/ngo/dashboard",
  admin: "/admin/dashboard",
};

const roleProfileRouteMap: Record<DemoRole, string> = {
  citizen: "/user/profile",
  authority: "/authority/dashboard",
  ngo: "/ngo/dashboard",
  admin: "/admin/dashboard",
};

const roleLabelKeyMap: Record<DemoRole, Parameters<ReturnType<typeof useSosWeb>["t"]>[0]> = {
  citizen: "roles.citizen",
  authority: "roles.authority",
  ngo: "roles.ngo",
  admin: "roles.admin",
};

const AppShell: React.FC<AppShellProps> = ({ role, navItems, children, rightPanel }) => {
  const {
    t,
    language,
    setLanguage,
    demoRole,
    setDemoRole,
    authSession,
    logout,
    dashboardWidgets,
  } = useSosWeb();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const isImmersiveHome = role === "citizen" && location.pathname === "/user/home";

  const mobileNav = useMemo(() => {
    if (role === "citizen") {
      return [
        navItems.find((item) => item.key === "dashboard"),
        navItems.find((item) => item.key === "social"),
        navItems.find((item) => item.key === "resources"),
        navItems.find((item) => item.key === "profile"),
      ].filter(Boolean) as ShellNavItem[];
    }
    return navItems.slice(0, 4);
  }, [navItems, role]);

  const MobileNavList = () => (
    <div className="space-y-1">
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
              active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[linear-gradient(180deg,#eef3fb_0%,#f6f8fc_28%,#f8fafc_100%)]"
      style={{
        fontFamily:
          language === "hi"
            ? "'Noto Sans Devanagari', 'Nirmala UI', system-ui, sans-serif"
            : "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1720px] items-center gap-3 px-3 md:px-5 xl:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label={t("nav.menu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] border-white/70 bg-white/95 p-0">
              <SheetHeader className="border-b border-slate-100 px-5 py-4">
                <SheetTitle className="flex items-center gap-3 text-left">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#FF3B30_0%,#FF9500_100%)] text-white">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Trinix SOS</p>
                    <p className="text-sm font-semibold text-slate-950">Command Center</p>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-88px)] px-4 py-4">
                <MobileNavList />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <button
            type="button"
            onClick={() => navigate(roleRouteMap[role])}
            className="flex items-center gap-3 rounded-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#FF3B30_0%,#FF9500_100%)] text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Trinix SOS</p>
              <p className="text-sm font-semibold text-slate-950">Command Center</p>
            </div>
          </button>

          <div className="ml-1 hidden flex-1 items-center gap-2 rounded-full border border-white/80 bg-white px-4 shadow-sm md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={t("nav.searchPlaceholder")}
              className="h-11 border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full xl:hidden" aria-label="Open insights">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] border-white/70 bg-[#f8fafc] p-4">
                <RightSidebarWidgets embedded>{rightPanel}</RightSidebarWidgets>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-0.5 -top-0.5 rounded-full bg-[#FF3B30] px-1 text-[10px] text-white">
                    {dashboardWidgets.urgentAlerts.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 rounded-[22px] border-white/70 bg-white/95">
                <DropdownMenuLabel>{t("widget.urgentAlerts")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dashboardWidgets.urgentAlerts.slice(0, 4).map((alert) => (
                  <DropdownMenuItem key={alert.id} className="items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                      <p className="text-xs text-slate-500">{alert.severity}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full px-3">
                  <Globe className="mr-1 h-4 w-4" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-[22px] border-white/70 bg-white/95">
                {localeList.map((locale) => (
                  <DropdownMenuItem key={locale.code} onClick={() => setLanguage(locale.code)}>
                    {locale.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden rounded-full px-3 md:inline-flex">
                  <LayoutGrid className="mr-1 h-4 w-4" />
                  {t("nav.role")}
                  <ChevronDown className="ml-1 h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-[22px] border-white/70 bg-white/95">
                {(["citizen", "authority", "ngo", "admin"] as DemoRole[]).map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onClick={() => {
                      setDemoRole(item);
                      navigate(roleRouteMap[item]);
                    }}
                  >
                    <span
                      className={cn("mr-2 h-2 w-2 rounded-full", demoRole === item ? "bg-slate-950" : "bg-slate-300")}
                    />
                    {t(roleLabelKeyMap[item])}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserCircle2 className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-[22px] border-white/70 bg-white/95">
                <DropdownMenuLabel>{t(roleLabelKeyMap[role])}</DropdownMenuLabel>
                {authSession.mobile ? (
                  <DropdownMenuLabel className="pt-0 text-xs font-normal text-slate-500">
                    {authSession.mobile}
                  </DropdownMenuLabel>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(roleProfileRouteMap[role])}>{t("nav.profile")}</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "mx-auto grid max-w-[1720px] grid-cols-1 gap-4 px-3 py-4 md:px-5",
          isImmersiveHome ? "xl:grid-cols-[auto_minmax(0,1fr)] xl:gap-4 xl:px-4" : "xl:grid-cols-[auto_minmax(0,780px)_340px] xl:gap-5 xl:px-6",
        )}
      >
        <LeftSidebar role={role} navItems={navItems} collapsed={collapsed} onToggleCollapsed={() => setCollapsed((prev) => !prev)} />

        <main className={cn("min-w-0 pb-24 lg:pb-6", isImmersiveHome && "xl:min-h-[calc(100dvh-5.5rem)]")}>{children}</main>

        {isImmersiveHome ? null : <RightSidebarWidgets>{rightPanel}</RightSidebarWidgets>}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/92 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-4 gap-1">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition-all",
                  active ? "bg-slate-950 text-white" : "text-slate-500",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AppShell;
