import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Clock3,
  Ellipsis,
  Image,
  MessageSquare,
  MoreHorizontal,
  Send,
  Share2,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Incident, NotificationItem, Priority, Role } from "@/sos/models";
import { AlertBadge, PriorityChip, StatusBadge } from "@/sos/components/badges";
import { DashboardCard, EmptyStateCard, RelativeTime } from "@/sos/components/common";
import { formatDateTime } from "@/sos/utils";
import { cn } from "@/lib/utils";

interface FeedCardProps {
  incident: Incident;
  role: Role;
  onAction: (action: string) => void;
  onViewCase?: () => void;
}

const roleActions: Record<Role, string[]> = {
  authority: [
    "Verify",
    "Assign NGO",
    "Escalate",
    "Add Note",
    "Mark In Progress",
    "Resolve",
    "Share to command channel",
    "Open timeline",
  ],
  ngo: [
    "Accept",
    "Dispatch",
    "Update",
    "Request backup",
    "Mark completed",
    "Open timeline",
    "Contact authority",
  ],
};

export const FeedCard: React.FC<FeedCardProps> = ({ incident, role, onAction, onViewCase }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{incident.id}</p>
            <PriorityChip priority={incident.priority} />
            <StatusBadge status={incident.status} />
          </div>
          <h3 className="mt-2 text-base font-semibold text-slate-900">{incident.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{incident.description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Incident actions">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            {roleActions[role].map((action) => (
              <DropdownMenuItem key={action} onClick={() => onAction(action)}>
                {action}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-3">
        <span>Category: {incident.category}</span>
        <span>Source: {incident.source}</span>
        <span>Location: {incident.location.area}</span>
        <span>District: {incident.location.district}</span>
        <span>Assigned: {incident.assignedNgoIds.length || 0} NGO(s)</span>
        <span>Updated: {formatDateTime(incident.updatedAt)}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          {incident.commentsCount} comments
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          ETA {incident.etaMinutes} mins
        </span>
        <span className="inline-flex items-center gap-1">
          <Image className="h-3.5 w-3.5" />
          {incident.attachments.length} attachments
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => (onViewCase ? onViewCase() : onAction("View full case"))}
        >
          View full case
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => onAction("Open timeline")}>
          Open timeline
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full" onClick={() => onAction("Share to command channel")}>
          <Share2 className="mr-1 h-3.5 w-3.5" />
          Share
        </Button>
      </div>
    </article>
  );
};

export const IncidentListItem: React.FC<FeedCardProps> = ({ incident, role, onAction, onViewCase }) => {
  const recommendedActionByStatus: Record<Incident["status"], string | null> = {
    open: role === "authority" ? "Verify" : "Accept",
    verified: role === "authority" ? "Assign NGO" : "Dispatch",
    assigned: role === "authority" ? "Mark In Progress" : "Dispatch",
    "in-progress": role === "authority" ? "Resolve" : "Mark completed",
    resolved: null,
    closed: null,
  };

  const recommendedAction = recommendedActionByStatus[incident.status];
  const secondaryActions = ["Open timeline", "Add Note"].filter(
    (action) => roleActions[role].includes(action) && action !== recommendedAction,
  );
  const hiddenActions = roleActions[role].filter(
    (action) => action !== recommendedAction && !secondaryActions.includes(action),
  );

  return (
    <article className="rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{incident.id}</p>
            <PriorityChip priority={incident.priority} />
            <StatusBadge status={incident.status} />
          </div>
          <h3 className="text-base font-semibold text-slate-900">{incident.title}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500" aria-label="More incident actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            {hiddenActions.map((action) => (
              <DropdownMenuItem key={action} onClick={() => onAction(action)}>
                {action}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{incident.description}</p>

      <div className="mt-3 grid gap-x-3 gap-y-1.5 text-xs text-slate-500 sm:grid-cols-2 xl:grid-cols-4">
        <span>Category: {incident.category}</span>
        <span>Source: {incident.source}</span>
        <span>Location: {incident.location.area}</span>
        <span>Updated: {formatDateTime(incident.updatedAt)}</span>
        <span>District: {incident.location.district}</span>
        <span>Assigned: {incident.assignedNgoIds.length} NGO(s)</span>
        <span>ETA: {incident.etaMinutes} mins</span>
        <span>Attachments: {incident.attachments.length}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => (onViewCase ? onViewCase() : onAction("View full case"))}
        >
          View full case
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>

        {recommendedAction ? (
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
            onClick={() => onAction(recommendedAction)}
          >
            {recommendedAction}
          </Button>
        ) : null}

        {secondaryActions.map((action) => (
          <Button
            key={action}
            variant="ghost"
            size="sm"
            className="rounded-full text-slate-600 hover:bg-slate-100"
            onClick={() => onAction(action)}
          >
            {action}
          </Button>
        ))}
      </div>
    </article>
  );
};

export const ComposerCard: React.FC<{
  title: string;
  actions: string[];
  onActionClick: (action: string) => void;
  compact?: boolean;
}> = ({ title, actions, onActionClick, compact }) => {
  if (!compact) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              className="rounded-full border-slate-300 bg-slate-50 text-slate-700"
              onClick={() => onActionClick(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const [primaryAction, ...rest] = actions;
  const secondaryActions = rest.slice(0, 2);
  const overflowActions = rest.slice(2);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <div className="flex flex-wrap items-center gap-2">
          {primaryAction ? (
            <Button size="sm" className="rounded-full" onClick={() => onActionClick(primaryAction)}>
              {primaryAction}
            </Button>
          ) : null}

          {secondaryActions.map((action) => (
            <Button
              key={action}
              variant="secondary"
              size="sm"
              className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              onClick={() => onActionClick(action)}
            >
              {action}
            </Button>
          ))}

          {overflowActions.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full text-slate-600">
                  More actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                {overflowActions.map((action) => (
                  <DropdownMenuItem key={action} onClick={() => onActionClick(action)}>
                    {action}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const FeedTabs: React.FC<{
  tabs: Array<{ value: string; label: string; count: number }>;
  value: string;
  onValueChange: (value: string) => void;
  compact?: boolean;
  showCounts?: boolean;
}> = ({ tabs, value, onValueChange, compact, showCounts = true }) => (
  <Tabs value={value} onValueChange={onValueChange}>
    <TabsList
      className={cn(
        compact
          ? "h-9 rounded-xl bg-slate-100 p-0.5"
          : "h-11 rounded-full border border-slate-200 bg-white p-1",
      )}
    >
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className={cn(
            compact ? "rounded-lg px-3 text-xs data-[state=active]:shadow-none" : "rounded-full px-4 text-xs md:text-sm",
          )}
        >
          {tab.label}
          {showCounts ? (
            <span
              className={cn(
                "ml-1 rounded-full px-1.5 py-0.5 text-[10px]",
                compact ? "bg-white/70 text-slate-500" : "bg-slate-100 text-slate-500",
              )}
            >
              {tab.count}
            </span>
          ) : null}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

export const NotificationDropdown: React.FC<{
  role: Role;
  items: NotificationItem[];
  onRead: (id: string) => void;
  onReadAll: () => void;
}> = ({ role, items, onRead, onReadAll }) => {
  const filtered = items
    .filter((item) => item.role === role || item.role === "all")
    .slice()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const unread = filtered.filter((item) => !item.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Open notifications">
          <Bell className="h-5 w-5" />
          {unread ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] rounded-2xl p-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          <Button variant="ghost" size="sm" className="h-7 rounded-full text-xs" onClick={onReadAll}>
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-[320px]">
          {filtered.length ? (
            <div className="p-2">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  to={item.linkedPath}
                  onClick={() => onRead(item.id)}
                  className={cn(
                    "mb-1 block rounded-xl border p-3 text-sm transition",
                    item.read ? "border-transparent bg-white" : "border-indigo-200 bg-indigo-50/60",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <AlertBadge priority={item.priority as Priority} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(item.createdAt)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <EmptyStateCard title="No notifications" description="You're all caught up." />
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ChatPanelProps {
  role: Role;
  conversations: {
    id: string;
    title: string;
    participants: string[];
    unreadCount: number;
    updatedAt: string;
    messages: Array<{ id: string; sender: string; text: string; createdAt: string; pinned?: boolean }>;
  }[];
  onSend: (conversationId: string, text: string) => void;
  onRead: (conversationId: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ role, conversations, onSend, onRead }) => {
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id || "");
  const [value, setValue] = useState("");

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId) || conversations[0],
    [activeConversationId, conversations],
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Open messages">
          <MessageSquare className="h-5 w-5" />
          {conversations.some((item) => item.unreadCount > 0) ? (
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-indigo-600" />
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full border-slate-200 p-0 sm:max-w-[860px]">
        <SheetHeader className="border-b border-slate-200 px-4 py-3">
          <SheetTitle>Coordination Center ({role.toUpperCase()})</SheetTitle>
        </SheetHeader>
        <div className="grid h-[calc(100vh-60px)] grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)_220px]">
          <div className="border-r border-slate-200">
            <div className="p-3">
              <Input placeholder="Search conversations" className="h-9 rounded-full border-slate-300" />
            </div>
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setActiveConversationId(conversation.id);
                      onRead(conversation.id);
                    }}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2 text-left",
                      activeConversation?.id === conversation.id
                        ? "border-indigo-200 bg-indigo-50"
                        : "border-transparent hover:bg-slate-50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-slate-800">{conversation.title}</p>
                      {conversation.unreadCount ? (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-slate-500">{conversation.participants.join(", ")}</p>
                    <RelativeTime iso={conversation.updatedAt} />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex flex-col">
            {activeConversation ? (
              <>
                <div className="border-b border-slate-200 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{activeConversation.title}</p>
                  <p className="text-xs text-slate-500">Incident thread and operation notes</p>
                </div>
                <ScrollArea className="h-[calc(100vh-200px)] px-4 py-3">
                  <div className="space-y-3">
                    {activeConversation.messages.map((message) => (
                      <div key={message.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{message.sender}</span>
                          <span>{formatDateTime(message.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-700">{message.text}</p>
                        {message.pinned ? (
                          <p className="mt-1 text-[11px] font-medium text-indigo-600">Pinned message</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t border-slate-200 p-3">
                  <div className="flex gap-2">
                    <Input
                      value={value}
                      onChange={(event) => setValue(event.target.value)}
                      placeholder="Write a message"
                      className="h-10 rounded-full border-slate-300"
                    />
                    <Button
                      className="rounded-full"
                      onClick={() => {
                        if (!activeConversation?.id || !value.trim()) return;
                        onSend(activeConversation.id, value.trim());
                        setValue("");
                      }}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4">
                <EmptyStateCard title="No conversations" description="Start collaborating with teams." />
              </div>
            )}
          </div>

          <div className="hidden border-l border-slate-200 p-4 md:block">
            <DashboardCard title="Participants" className="border-none shadow-none">
              <div className="space-y-2">
                {activeConversation?.participants.map((participant) => (
                  <div key={participant} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-slate-700">{participant}</span>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
