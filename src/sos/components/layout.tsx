import { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  BadgeCheck,
  BarChart3,
  BellRing,
  Boxes,
  Building,
  Building2,
  ClipboardList,
  FileText,
  HandHeart,
  HelpCircle,
  Kanban,
  LayoutDashboard,
  LineChart,
  Map,
  MapPinned,
  Megaphone,
  Menu,
  MessagesSquare,
  Newspaper,
  PackageSearch,
  PanelLeft,
  ScrollText,
  Search,
  Settings,
  SignalHigh,
  UserCircle2,
  Users,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { authorityNav, ngoNav } from "@/sos/navigation";
import { NotificationDropdown, ChatPanel } from "@/sos/components/feed";
import {
  DashboardCard,
  LiveStatusDot,
  MapPreviewCard,
  MetadataRow,
  SectionTitle,
} from "@/sos/components/common";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Role, RoleNavItem } from "@/sos/models";
import { formatDateTime } from "@/sos/utils";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY_PREFIX = "sos-sidebar-collapsed";

const iconMap = {
  "layout-dashboard": LayoutDashboard,
  newspaper: Newspaper,
  "badge-check": BadgeCheck,
  kanban: Kanban,
  "building-2": Building2,
  users: Users,
  "alarm-clock": AlarmClock,
  "package-search": PackageSearch,
  "map-pinned": MapPinned,
  megaphone: Megaphone,
  "bar-chart-3": BarChart3,
  "messages-square": MessagesSquare,
  settings: Settings,
  map: Map,
  "clipboard-list": ClipboardList,
  boxes: Boxes,
  "hand-heart": HandHeart,
  "file-text": FileText,
  "line-chart": LineChart,
  building: Building,
  "scroll-text": ScrollText,
};

const navByRole: Record<Role, RoleNavItem[]> = {
  authority: authorityNav,
  ngo: ngoNav,
};

const quickActionsByRole: Record<Role, string[]> = {
  authority: ["Create Case", "Broadcast Alert", "Add Resource"],
  ngo: ["Dispatch Team", "Update Resources", "Request Backup"],
};

const SidebarNav: React.FC<{
  role: Role;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
}> = ({ role, collapsed, onToggleCollapsed, onNavigate }) => {
  const location = useLocation();
  const navItems = navByRole[role];
  const groupedNav = navItems.reduce<Record<string, RoleNavItem[]>>((acc, item) => {
    const section = item.section || "General";
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {});

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white/90 backdrop-blur",
        collapsed ? "w-[88px]" : "w-[260px]",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-3">
        <Link to={role === "authority" ? "/authority/dashboard" : "/ngo/dashboard"} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            SOS
          </span>
          {!collapsed ? <span className="text-sm font-semibold text-slate-900">Companion Ops</span> : null}
        </Link>
        <Button variant="ghost" size="icon" onClick={onToggleCollapsed} className="rounded-full" aria-label="Toggle sidebar">
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)] px-2 py-3">
        <div className="space-y-4">
          {Object.entries(groupedNav).map(([section, items]) => (
            <div key={section}>
              {!collapsed ? (
                <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {section}
                </p>
              ) : null}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap] || SignalHigh;
                  const button = (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                          isActive || location.pathname.startsWith(item.path)
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:bg-slate-100",
                          collapsed ? "justify-center" : "",
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed ? <span className="truncate">{item.label}</span> : null}
                      {!collapsed && item.badgeCount ? (
                        <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                          {item.badgeCount}
                        </span>
                      ) : null}
                    </NavLink>
                  );

                  if (!collapsed) return button;
                  return (
                    <TooltipProvider key={item.path}>
                      <Tooltip>
                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};

const TopNav: React.FC<{
  role: Role;
  onOpenMobileSidebar: () => void;
  onOpenRightPanel: () => void;
}> = ({ role, onOpenMobileSidebar, onOpenRightPanel }) => {
  const {
    session,
    syncOnline,
    toggleSyncStatus,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    conversations,
    sendMessage,
    markConversationRead,
    logout: logoutSos,
  } = useSosApp();
  const { logout: logoutPortal } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1800px] items-center gap-2 px-3 sm:px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={onOpenMobileSidebar}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden min-w-[320px] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
              }
            }}
            className="h-9 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
            placeholder="Search incidents, organizations, locations, case IDs"
            aria-label="Global search"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden rounded-full border-slate-300 md:inline-flex">
                Quick actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl">
              {quickActionsByRole[role].map((action) => (
                <DropdownMenuItem
                  key={action}
                  onClick={() => toast.success(`${action} opened`, { description: "Complete details in the form." })}
                >
                  {action}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <NotificationDropdown
            role={role}
            items={notifications}
            onRead={markNotificationRead}
            onReadAll={() => markAllNotificationsRead(role)}
          />

          <ChatPanel
            role={role}
            conversations={conversations.map((conversation) => ({
              id: conversation.id,
              title: conversation.title,
              participants: conversation.participants,
              unreadCount: conversation.unreadCount,
              updatedAt: conversation.updatedAt,
              messages: conversation.messages,
            }))}
            onSend={(conversationId, text) => {
              const result = sendMessage(conversationId, text);
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
            }}
            onRead={markConversationRead}
          />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate(`/${role}/help`)}
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full xl:hidden"
            onClick={onOpenRightPanel}
            aria-label="Open context panel"
          >
            <BarChart3 className="h-5 w-5" />
          </Button>

          <button
            onClick={toggleSyncStatus}
            className="hidden rounded-full border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 md:inline-flex"
            aria-label="Toggle sync status"
          >
            <LiveStatusDot active={syncOnline} />
          </button>

          <span className="hidden rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold uppercase text-indigo-700 md:inline-flex">
            {role}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open profile menu">
                <UserCircle2 className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{session?.name || "User"}</p>
                <p className="text-xs text-slate-500">{session?.organization}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(role === "authority" ? "/authority/settings" : "/ngo/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/search")}>Global Search</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logoutSos();
                  logoutPortal(role);
                  navigate("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

const AuthorityRightPanel: React.FC = () => {
  const { incidents, ngos, conversations } = useSosApp();

  const criticalIncidents = incidents.filter((incident) => incident.priority === "critical" && incident.status !== "closed");
  const escalations = incidents.filter((incident) => incident.priority !== "low" && ["open", "verified", "assigned"].includes(incident.status));
  const nearbyIncidents = incidents.slice(0, 5);

  return (
    <div className="space-y-3">
      <DashboardCard title="Live Critical Alerts" description="Active high-severity incidents">
        <div className="space-y-2">
          {criticalIncidents.slice(0, 4).map((incident) => (
            <div key={incident.id} className="rounded-xl border border-red-200 bg-red-50 p-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-red-700">{incident.id}</p>
                <StatusBadge status={incident.status} />
              </div>
              <p className="mt-1 text-xs text-red-700">{incident.title}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Escalation Queue" description="Needs immediate review">
        <div className="space-y-2">
          {escalations.slice(0, 4).map((incident) => (
            <div key={incident.id} className="rounded-xl border border-orange-200 bg-orange-50 p-2 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-orange-700">{incident.id}</p>
                <AlertBadge priority={incident.priority} />
              </div>
              <p className="text-orange-700">SLA {incident.slaMinutes} mins</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <MapPreviewCard
        points={nearbyIncidents.map((incident, index) => ({
          label: `${incident.id} ${incident.location.area}`,
          top: `${20 + index * 12}%`,
          left: `${30 + (index % 3) * 20}%`,
          priority: incident.priority,
        }))}
      />

      <DashboardCard title="NGO Availability Snapshot">
        <div className="space-y-2">
          {ngos.slice(0, 4).map((ngo) => (
            <div key={ngo.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <p className="text-xs font-semibold text-slate-800">{ngo.name}</p>
              <p className="text-xs text-slate-500">Capacity: {ngo.capacity}%</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Recent Communications">
        <div className="space-y-2">
          {conversations.slice(0, 3).map((conversation) => (
            <div key={conversation.id} className="rounded-xl border border-slate-200 p-2">
              <p className="text-xs font-semibold text-slate-700">{conversation.title}</p>
              <p className="text-xs text-slate-500">Updated {formatDateTime(conversation.updatedAt)}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

const NgoRightPanel: React.FC = () => {
  const { incidents, resources, volunteers, supportRequests, notifications } = useSosApp();

  const urgentAssignments = incidents.filter(
    (incident) => incident.assignedNgoIds.length && ["critical", "high"].includes(incident.priority),
  );
  const nearby = incidents.filter((incident) => ["open", "verified"].includes(incident.status)).slice(0, 4);
  const resourceLow = resources.filter((resource) => resource.available <= resource.minThreshold + resource.reserved);
  const authorityMessages = notifications.filter((note) => note.type === "message").slice(0, 3);

  return (
    <div className="space-y-3">
      <DashboardCard title="Urgent Assignments">
        <div className="space-y-2">
          {urgentAssignments.slice(0, 4).map((incident) => (
            <div key={incident.id} className="rounded-xl border border-red-200 bg-red-50 p-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-red-700">{incident.id}</p>
                <AlertBadge priority={incident.priority} />
              </div>
              <p className="text-xs text-red-700">{incident.location.area}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Nearby Cases">
        <div className="space-y-2">
          {nearby.map((incident) => (
            <div key={incident.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <p className="text-xs font-semibold text-slate-700">{incident.id}</p>
              <p className="text-xs text-slate-500">{incident.location.area}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Resource Snapshot">
        <div className="space-y-2">
          {resourceLow.slice(0, 4).map((resource) => (
            <div key={resource.id} className="rounded-xl border border-amber-200 bg-amber-50 p-2">
              <p className="text-xs font-semibold text-amber-700">{resource.resource}</p>
              <p className="text-xs text-amber-700">{resource.available} {resource.unit} available</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Volunteer Availability">
        <div className="space-y-2 text-xs">
          <MetadataRow label="Available" value={volunteers.filter((item) => item.status === "available").length} />
          <MetadataRow label="On Mission" value={volunteers.filter((item) => item.status === "on-mission").length} />
          <MetadataRow label="Offline" value={volunteers.filter((item) => item.status === "offline").length} />
        </div>
      </DashboardCard>

      <DashboardCard title="Authority Messages">
        <div className="space-y-2">
          {authorityMessages.map((message) => (
            <div key={message.id} className="rounded-xl border border-indigo-200 bg-indigo-50 p-2">
              <p className="text-xs font-semibold text-indigo-700">{message.title}</p>
              <p className="text-xs text-indigo-700">{message.description}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Escalation Requests">
        <div className="space-y-2">
          {supportRequests.slice(0, 3).map((request) => (
            <div key={request.id} className="rounded-xl border border-slate-200 p-2">
              <p className="text-xs font-semibold text-slate-700">{request.incidentId}</p>
              <p className="text-xs text-slate-500">{request.type} • {request.status}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

const RightPanel: React.FC<{ role: Role }> = ({ role }) => {
  return role === "authority" ? <AuthorityRightPanel /> : <NgoRightPanel />;
};

export const AppShell: React.FC<{ role: Role }> = ({ role }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}-${role}`);
    if (stored) {
      setCollapsed(stored === "true");
    }
  }, [role]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(`${STORAGE_KEY_PREFIX}-${role}`, String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <TopNav role={role} onOpenMobileSidebar={() => setMobileSidebarOpen(true)} onOpenRightPanel={() => setRightPanelOpen(true)} />

      <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-4 p-3 md:p-4 lg:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_340px] lg:px-6">
        <div className="sticky top-20 hidden h-[calc(100vh-94px)] lg:block">
          <SidebarNav role={role} collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
        </div>

        <main className="min-w-0 space-y-4">
          <Outlet />
        </main>

        <aside className="sticky top-20 hidden h-[calc(100vh-94px)] xl:block">
          <ScrollArea className="h-full pr-1">
            <RightPanel role={role} />
          </ScrollArea>
        </aside>
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[290px] border-slate-200 p-0">
          <SidebarNav
            role={role}
            collapsed={false}
            onToggleCollapsed={() => undefined}
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
        <SheetContent side="right" className="w-[360px] border-slate-200 p-0">
          <SheetHeader className="border-b border-slate-200 px-4 py-3">
            <SheetTitle>Context Panel</SheetTitle>
            <SheetDescription>Live operational widgets</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-82px)] p-4">
            <RightPanel role={role} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, actions }) => (
  <SectionTitle title={title} subtitle={subtitle} actions={actions} />
);

export const RoleWelcomeStrip: React.FC<{ role: Role }> = ({ role }) => {
  const { session, syncOnline } = useSosApp();
  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 p-4 text-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm opacity-90">{role === "authority" ? "Authority Command" : "NGO Response Hub"}</p>
          <h1 className="text-xl font-semibold">Welcome, {session?.name || "Operator"}</h1>
          <p className="text-sm opacity-90">{session?.organization}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs">
          <BellRing className="h-3.5 w-3.5" />
          Sync {syncOnline ? "online" : "offline"}
        </div>
      </div>
    </div>
  );
};

