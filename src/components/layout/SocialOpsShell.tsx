import { useEffect, useMemo, useState } from "react";
import {
  HelpCircle,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Search,
  UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NotificationDropdown, ChatPanel } from "@/sos/components/feed";
import {
  DashboardCard,
  LiveStatusDot,
  MapPreviewCard,
  MetadataRow,
  SidebarAlertList,
} from "@/sos/components/common";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Role } from "@/sos/models";
import { formatDateTime } from "@/sos/utils";
import { cn } from "@/lib/utils";
import { Portal, useAuth } from "@/contexts/AuthContext";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
  badge?: number;
}

interface SocialOpsShellProps {
  role: Role;
  portal: Extract<Portal, "authority" | "ngo">;
  title: string;
  menuItems: MenuItem[];
  activeMenuId: string;
  onChangeMenu: (menuId: string) => void;
  quickActions: string[];
  children: React.ReactNode;
}

const STORAGE_KEY_PREFIX = "social-ops-sidebar-collapsed";

const SidebarMenu: React.FC<{
  menuItems: MenuItem[];
  activeMenuId: string;
  collapsed: boolean;
  onChangeMenu: (menuId: string) => void;
}> = ({ menuItems, activeMenuId, collapsed, onChangeMenu }) => {
  const grouped = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item.section || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <ScrollArea className="h-[calc(100vh-66px)] px-2 py-3">
      <div className="space-y-4">
        {Object.entries(grouped).map(([section, items]) => (
          <div key={section}>
            {!collapsed ? (
              <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                {section}
              </p>
            ) : null}
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const content = (
                  <button
                    key={item.id}
                    onClick={() => onChangeMenu(item.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                      activeMenuId === item.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100",
                      collapsed ? "justify-center px-0" : "",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                    {!collapsed && item.badge ? (
                      <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );

                if (!collapsed) return content;
                return (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>{content}</TooltipTrigger>
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
  );
};

const AuthorityRightPanel = () => {
  const { incidents, ngos, conversations } = useSosApp();

  const criticalIncidents = incidents.filter(
    (incident) => incident.priority === "critical" && incident.status !== "closed",
  );
  const escalations = incidents.filter(
    (incident) =>
      incident.priority !== "low" && ["open", "verified", "assigned"].includes(incident.status),
  );

  const criticalItems = criticalIncidents.slice(0, 4).map((incident) => ({
    id: incident.id,
    title: `${incident.id} ${incident.title}`,
    subtitle: incident.location.area,
    meta: `Updated ${formatDateTime(incident.updatedAt)}`,
    badge: <StatusBadge status={incident.status} />,
    tone: "critical" as const,
  }));

  const escalationItems = escalations.slice(0, 4).map((incident) => ({
    id: incident.id,
    title: incident.id,
    subtitle: incident.title,
    meta: `SLA ${incident.slaMinutes} mins`,
    badge: <AlertBadge priority={incident.priority} />,
    tone: "warning" as const,
  }));

  return (
    <div className="space-y-3">
      <SidebarAlertList
        title="Live Critical Alerts"
        description="Active high-severity incidents"
        items={criticalItems}
        emptyText="No critical alerts in the queue."
      />

      <SidebarAlertList
        title="Escalation Queue"
        description="Cases needing immediate review"
        items={escalationItems}
        emptyText="Escalation queue is clear."
      />

      <MapPreviewCard
        points={incidents.slice(0, 5).map((incident, index) => ({
          label: `${incident.id} ${incident.location.area}`,
          top: `${18 + index * 12}%`,
          left: `${26 + (index % 3) * 18}%`,
          priority: incident.priority,
        }))}
      />

      <DashboardCard title="NGO Availability Snapshot" className="border-none shadow-sm">
        <div className="space-y-2">
          {ngos.slice(0, 4).map((ngo) => (
            <div key={ngo.id} className="rounded-xl bg-slate-50 p-2.5">
              <p className="text-xs font-semibold text-slate-800">{ngo.name}</p>
              <p className="text-xs text-slate-500">Capacity {ngo.capacity}% - {ngo.availability}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Recent Communications" className="border-none shadow-sm">
        <div className="space-y-2">
          {conversations.slice(0, 3).map((conversation) => (
            <div key={conversation.id} className="rounded-xl bg-slate-50 p-2.5">
              <p className="text-xs font-semibold text-slate-700">{conversation.title}</p>
              <p className="text-xs text-slate-500">Updated {formatDateTime(conversation.updatedAt)}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

const NgoRightPanel = () => {
  const { incidents, resources, volunteers, supportRequests, notifications } = useSosApp();
  const urgentAssignments = incidents.filter(
    (incident) =>
      incident.assignedNgoIds.length > 0 && ["critical", "high"].includes(incident.priority),
  );
  const resourceLow = resources.filter(
    (resource) => resource.available <= resource.minThreshold + resource.reserved,
  );
  const authorityMessages = notifications.filter((note) => note.type === "message");

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
          {incidents
            .filter((incident) => ["open", "verified"].includes(incident.status))
            .slice(0, 4)
            .map((incident) => (
              <div key={incident.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                <p className="text-xs font-semibold text-slate-700">{incident.id}</p>
                <p className="text-xs text-slate-500">{incident.location.area}</p>
              </div>
            ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Resource Stock Snapshot">
        <div className="space-y-2">
          {resourceLow.slice(0, 4).map((resource) => (
            <div key={resource.id} className="rounded-xl border border-amber-200 bg-amber-50 p-2">
              <p className="text-xs font-semibold text-amber-700">{resource.resource}</p>
              <p className="text-xs text-amber-700">
                {resource.available} {resource.unit} available
              </p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Volunteer Availability">
        <div className="space-y-1 text-xs">
          <MetadataRow
            label="Available"
            value={volunteers.filter((item) => item.status === "available").length}
          />
          <MetadataRow
            label="On Mission"
            value={volunteers.filter((item) => item.status === "on-mission").length}
          />
          <MetadataRow
            label="Offline"
            value={volunteers.filter((item) => item.status === "offline").length}
          />
        </div>
      </DashboardCard>

      <DashboardCard title="Authority Messages">
        <div className="space-y-2">
          {authorityMessages.slice(0, 3).map((message) => (
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
              <p className="text-xs text-slate-500">
                {request.type} - {request.status}
              </p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
};

export const SocialOpsShell: React.FC<SocialOpsShellProps> = ({
  role,
  portal,
  title,
  menuItems,
  activeMenuId,
  onChangeMenu,
  quickActions,
  children,
}) => {
  const navigate = useNavigate();
  const { getUser, logout } = useAuth();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    conversations,
    sendMessage,
    markConversationRead,
  } = useSosApp();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [syncOnline, setSyncOnline] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}-${role}`);
    if (stored) setCollapsed(stored === "true");
  }, [role]);

  const saveCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(`${STORAGE_KEY_PREFIX}-${role}`, String(next));
      return next;
    });
  };

  const roleNotifications = useMemo(
    () =>
      notifications.map((item) => ({
        ...item,
        linkedPath: role === "authority" ? "/authority/dashboard" : "/ngo/feed",
      })),
    [notifications, role],
  );

  const profile = getUser(portal);
  const [primaryQuickAction, ...restQuickActions] = quickActions;
  const inlineQuickActions = restQuickActions.slice(0, 2);
  const overflowQuickActions = restQuickActions.slice(2);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[66px] max-w-[1800px] items-center gap-2 px-3 sm:px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 pr-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">
              SOS
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">Companion</p>
              <p className="text-sm font-semibold text-slate-800">{title}</p>
            </div>
          </div>

          <div className="hidden min-w-[260px] flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 md:flex lg:max-w-[520px]">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  toast.info(`Searching for "${searchValue}"`);
                }
              }}
              className="h-9 border-none bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
              placeholder="Search incidents, organizations, locations, case IDs"
              aria-label="Global search"
            />
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {primaryQuickAction ? (
              <Button
                size="sm"
                className="hidden rounded-full md:inline-flex"
                onClick={() => toast.success(`${primaryQuickAction} opened`)}
              >
                {primaryQuickAction}
              </Button>
            ) : null}

            <div className="hidden items-center gap-1 lg:flex">
              {inlineQuickActions.map((action) => (
                <Button
                  key={action}
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-slate-600 hover:bg-slate-100"
                  onClick={() => toast.success(`${action} opened`)}
                >
                  {action}
                </Button>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full text-slate-600 hover:bg-slate-100">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="hidden md:inline">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                {overflowQuickActions.map((action) => (
                  <DropdownMenuItem key={action} onClick={() => toast.success(`${action} opened`)}>
                    {action}
                  </DropdownMenuItem>
                ))}
                {overflowQuickActions.length ? <DropdownMenuSeparator /> : null}
                <DropdownMenuItem onClick={() => toast.info("Help center coming soon")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help center
                </DropdownMenuItem>
                <DropdownMenuItem className="xl:hidden" onClick={() => setRightPanelOpen(true)}>
                  Open context panel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NotificationDropdown
              role={role}
              items={roleNotifications}
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
              onRead={markConversationRead}
              onSend={(conversationId, text) => {
                const result = sendMessage(conversationId, text);
                if (!result.success) {
                  toast.error(result.message);
                  return;
                }
                toast.success(result.message);
              }}
            />

            <button
              onClick={() => setSyncOnline((prev) => !prev)}
              className="hidden items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1.5 text-xs md:inline-flex"
              aria-label="Toggle sync status"
            >
              <LiveStatusDot active={syncOnline} />
              <span className="h-3 w-px bg-slate-300" />
              <span className="font-semibold uppercase tracking-wide text-slate-500">{role}</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-slate-600 hover:bg-slate-100"
                  aria-label="Open profile menu"
                >
                  <UserCircle2 className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{profile?.name || "Account"}</p>
                  <p className="text-xs text-slate-500">{profile?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.info("Profile module available in sidebar")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Settings module available in sidebar")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout(portal);
                    navigate(`/${portal}/login`);
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-4 p-3 md:p-4 lg:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_340px] lg:px-6">
        <aside className="sticky top-20 hidden h-[calc(100vh-94px)] overflow-hidden rounded-2xl border border-slate-200 bg-white lg:block">
          <div className="flex h-[66px] items-center justify-between border-b border-slate-200 px-3">
            {!collapsed ? <p className="text-sm font-semibold text-slate-800">Workspace</p> : <span />}
            <Button variant="ghost" size="icon" className="rounded-full" onClick={saveCollapsed} aria-label="Collapse sidebar">
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
          <SidebarMenu
            menuItems={menuItems}
            activeMenuId={activeMenuId}
            collapsed={collapsed}
            onChangeMenu={onChangeMenu}
          />
        </aside>

        <main className="min-w-0 space-y-4">{children}</main>

        <aside className="sticky top-20 hidden h-[calc(100vh-94px)] xl:block">
          <ScrollArea className="h-full pr-1">
            {role === "authority" ? <AuthorityRightPanel /> : <NgoRightPanel />}
          </ScrollArea>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {menuItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onChangeMenu(item.id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px]",
                  activeMenuId === item.id ? "bg-indigo-50 text-indigo-700" : "text-slate-500",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[290px] border-slate-200 p-0">
          <SheetHeader className="border-b border-slate-200 px-4 py-3">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>Role navigation</SheetDescription>
          </SheetHeader>
          <SidebarMenu
            menuItems={menuItems}
            activeMenuId={activeMenuId}
            collapsed={false}
            onChangeMenu={(menuId) => {
              onChangeMenu(menuId);
              setMobileSidebarOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
        <SheetContent side="right" className="w-[360px] border-slate-200 p-0">
          <SheetHeader className="border-b border-slate-200 px-4 py-3">
            <SheetTitle>Context Panel</SheetTitle>
            <SheetDescription>Live role widgets</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-82px)] p-4">
            {role === "authority" ? <AuthorityRightPanel /> : <NgoRightPanel />}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

