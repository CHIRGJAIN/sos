import { useMemo, useState } from "react";
import { addDays } from "date-fns";
import { CalendarClock, ChevronDown, LocateFixed, Send, TriangleAlert } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ActivityEntry } from "@/sos/models";
import { formatRelative, formatShortTime, groupTimelineLabel } from "@/sos/utils";
import { cn } from "@/lib/utils";

export const DashboardCard: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, description, action, className, children }) => (
  <Card className={cn("rounded-2xl border-slate-200/70 shadow-sm", className)}>
    <CardHeader className="space-y-1 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base font-semibold text-slate-900">{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {action}
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

export const StatCard: React.FC<{
  label: string;
  value: string;
  trend?: string;
  icon?: React.ReactNode;
  tone?: "default" | "danger" | "success";
}> = ({ label, value, trend, icon, tone = "default" }) => {
  const toneMap = {
    default: "border-slate-200/80",
    danger: "border-red-200/80 bg-red-50/40",
    success: "border-emerald-200/80 bg-emerald-50/40",
  };

  return (
    <div className={cn("rounded-2xl border bg-white p-4 shadow-sm", toneMap[tone])}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {trend ? <p className="mt-1 text-xs text-slate-500">{trend}</p> : null}
    </div>
  );
};

export const StatCardCompact: React.FC<{
  label: string;
  value: string;
  meta?: string;
  tone?: "neutral" | "critical" | "success";
}> = ({ label, value, meta, tone = "neutral" }) => {
  const toneMap = {
    neutral: "bg-white",
    critical: "bg-red-50/70",
    success: "bg-emerald-50/70",
  };

  return (
    <div className={cn("rounded-xl p-4", toneMap[tone])}>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold leading-none text-slate-900">{value}</p>
      {meta ? <p className="mt-2 text-xs text-slate-500">{meta}</p> : null}
    </div>
  );
};

export const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder, className }) => (
  <Input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder || "Search"}
    className={cn("h-10 rounded-full border-slate-300 bg-slate-50 pl-4 text-sm", className)}
    aria-label={placeholder || "Search"}
  />
);

export const MultiSelect: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}> = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
      return;
    }
    onChange([...selected, option]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 justify-between gap-2 rounded-full border-slate-300 bg-white px-4 text-sm"
        >
          <span className="truncate">
            {label}: {selected.length ? `${selected.length} selected` : "All"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-xl border-slate-200 p-3" align="start">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50">
              <Checkbox
                checked={selected.includes(option)}
                onCheckedChange={() => handleToggle(option)}
                aria-label={option}
              />
              <span className="text-sm text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const DateRangePicker: React.FC<{
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}> = ({ range, onChange }) => {
  const label = useMemo(() => {
    if (!range?.from) return "Date range";
    const from = range.from.toLocaleDateString();
    const to = range.to ? range.to.toLocaleDateString() : "...";
    return `${from} - ${to}`;
  }, [range]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 min-w-44 justify-start gap-2 rounded-full border-slate-300 bg-white px-4 text-sm"
        >
          <CalendarClock className="h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-xl border-slate-200 p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={onChange}
          defaultMonth={range?.from || new Date()}
          disabled={{ after: addDays(new Date(), 1) }}
        />
      </PopoverContent>
    </Popover>
  );
};

export const FilterBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
    {children}
  </div>
);

export const FilterToolbar: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-3 rounded-2xl bg-slate-50/85 p-3 sm:p-4",
      className,
    )}
  >
    {children}
  </div>
);

export const MapPreviewCard: React.FC<{
  points: Array<{ label: string; top: string; left: string; priority?: "high" | "critical" | "medium" | "low" }>;
}> = ({ points }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 via-cyan-50 to-indigo-100 p-4">
    <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_2px_2px,_#94a3b8_1px,_transparent_0)] [background-size:18px_18px]" />
    <div className="relative mb-3 flex items-center gap-2 text-slate-700">
      <LocateFixed className="h-4 w-4" />
      <p className="text-sm font-medium">Operational Map Preview</p>
    </div>
    <div className="relative h-40 rounded-xl border border-white/70 bg-white/80">
      {points.map((point) => {
        const tone =
          point.priority === "critical"
            ? "bg-red-500"
            : point.priority === "high"
              ? "bg-orange-500"
              : point.priority === "medium"
                ? "bg-amber-500"
                : "bg-sky-500";
        return (
          <div
            key={point.label}
            className="absolute"
            style={{ top: point.top, left: point.left }}
            aria-label={point.label}
            title={point.label}
          >
            <span className={cn("block h-3.5 w-3.5 rounded-full ring-4 ring-white/70", tone)} />
          </div>
        );
      })}
    </div>
  </div>
);

export const ActivityThread: React.FC<{
  entries: ActivityEntry[];
  compact?: boolean;
}> = ({ entries, compact }) => {
  const grouped = useMemo(() => {
    return entries.reduce<Record<string, ActivityEntry[]>>((acc, entry) => {
      const label = groupTimelineLabel(entry.createdAt);
      if (!acc[label]) acc[label] = [];
      acc[label].push(entry);
      return acc;
    }, {});
  }, [entries]);

  return (
    <ScrollArea className={compact ? "h-[280px]" : "h-[380px]"}>
      <div className="space-y-4 pr-3">
        {Object.entries(grouped).map(([label, items]) => (
          <div key={label} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <div className="space-y-2">
              {items
                .slice()
                .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
                .map((entry) => (
                  <div key={entry.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{entry.actor}</span>
                      <span>{formatShortTime(entry.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{entry.content}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                      {entry.edited ? <span>Edited</span> : null}
                      {entry.pinned ? <span>Pinned</span> : null}
                      {entry.mentions?.length ? <span>{entry.mentions.join(" ")}</span> : null}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export const CommentComposer: React.FC<{
  placeholder?: string;
  onSubmit: (value: string) => void;
  buttonLabel?: string;
}> = ({ placeholder, onSubmit, buttonLabel }) => {
  const [value, setValue] = useState("");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <Label htmlFor="comment-composer" className="mb-2 block text-xs font-medium text-slate-500">
        Add update
      </Label>
      <Textarea
        id="comment-composer"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder || "Post update, note, or mention @team"}
        className="min-h-20 rounded-xl border-slate-300"
      />
      <div className="mt-2 flex justify-end">
        <Button
          onClick={() => {
            if (!value.trim()) return;
            onSubmit(value.trim());
            setValue("");
          }}
          className="rounded-full"
          size="sm"
        >
          <Send className="mr-1 h-4 w-4" />
          {buttonLabel || "Post"}
        </Button>
      </div>
    </div>
  );
};

export const UpdateComposer = CommentComposer;

export const AvatarStack: React.FC<{ names: string[] }> = ({ names }) => (
  <div className="flex items-center">
    {names.slice(0, 4).map((name, index) => (
      <div
        key={name}
        className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-indigo-100 text-xs font-semibold text-indigo-700 first:ml-0"
        style={{ zIndex: 20 - index }}
        aria-label={name}
        title={name}
      >
        {name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
    ))}
    {names.length > 4 ? (
      <span className="ml-2 text-xs font-medium text-slate-500">+{names.length - 4}</span>
    ) : null}
  </div>
);

export const EmptyStateCard: React.FC<{
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
    <p className="text-base font-semibold text-slate-700">{title}</p>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
    {action ? <div className="mt-3">{action}</div> : null}
  </div>
);

export const ErrorStateCard: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
}> = ({ title, description, onRetry }) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
    <TriangleAlert className="mx-auto h-5 w-5 text-red-600" />
    <p className="mt-2 text-sm font-semibold text-red-700">{title || "Unable to load data"}</p>
    <p className="mt-1 text-xs text-red-600">{description || "Please retry."}</p>
    {onRetry ? (
      <Button variant="outline" size="sm" className="mt-3 rounded-full" onClick={onRetry}>
        Retry
      </Button>
    ) : null}
  </div>
);

export const SkeletonBlock: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, index) => (
      <Skeleton key={index} className="h-14 rounded-xl" />
    ))}
  </div>
);

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onOpenChange,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{cancelLabel || "Cancel"}</AlertDialogCancel>
        <AlertDialogAction
          onClick={(event) => {
            event.preventDefault();
            onConfirm();
            onOpenChange(false);
          }}
        >
          {confirmLabel || "Confirm"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}> = ({ title, subtitle, actions }) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
    {actions}
  </div>
);

export const MetadataRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 py-2 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

export const SidebarAlertList: React.FC<{
  title: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    meta?: string;
    badge?: React.ReactNode;
    tone?: "default" | "critical" | "warning";
  }>;
  emptyText?: string;
}> = ({ title, description, items, emptyText }) => {
  const toneClass: Record<"default" | "critical" | "warning", string> = {
    default: "bg-white",
    critical: "bg-red-50/60",
    warning: "bg-amber-50/60",
  };

  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="mb-2.5">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      </div>
      <div className="space-y-1.5">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-xl px-2.5 py-2",
                toneClass[item.tone || "default"],
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">{item.title}</p>
                  {item.subtitle ? <p className="text-xs text-slate-500">{item.subtitle}</p> : null}
                </div>
                {item.badge}
              </div>
              {item.meta ? <p className="mt-1 text-[11px] text-slate-500">{item.meta}</p> : null}
            </div>
          ))
        ) : (
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">{emptyText || "No items available."}</p>
        )}
      </div>
    </div>
  );
};

export const LiveStatusDot: React.FC<{ active: boolean }> = ({ active }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
    <span className={cn("h-2.5 w-2.5 rounded-full", active ? "bg-emerald-500" : "bg-slate-400")} />
    {active ? "Online" : "Offline"}
  </span>
);

export const Divider = Separator;

export const RelativeTime: React.FC<{ iso: string }> = ({ iso }) => (
  <span className="text-xs text-slate-500">{formatRelative(iso)}</span>
);
