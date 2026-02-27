import { AlertTriangle, Flame, ShieldAlert, Siren } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IncidentStatus, Priority } from "@/sos/models";
import { cn } from "@/lib/utils";

const priorityStyleMap: Record<Priority, string> = {
  critical: "bg-red-50 text-red-700",
  high: "bg-orange-50 text-orange-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-700",
};

const statusStyleMap: Record<IncidentStatus, string> = {
  open: "bg-slate-100 text-slate-700",
  verified: "bg-sky-50 text-sky-700",
  assigned: "bg-indigo-50 text-indigo-700",
  "in-progress": "bg-teal-50 text-teal-700",
  resolved: "bg-emerald-50 text-emerald-700",
  closed: "bg-zinc-100 text-zinc-700",
};

const priorityIconMap = {
  critical: Siren,
  high: ShieldAlert,
  medium: AlertTriangle,
  low: Flame,
};

export const AlertBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const Icon = priorityIconMap[priority];
  return (
    <Badge className={cn("gap-1.5 rounded-md border-0 px-2 py-1 text-[11px] font-medium", priorityStyleMap[priority])}>
      <Icon className="h-3.5 w-3.5" />
      {priority.toUpperCase()}
    </Badge>
  );
};

export const PriorityChip: React.FC<{ priority: Priority }> = ({ priority }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md border-0 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
      priorityStyleMap[priority],
    )}
  >
    {priority}
  </span>
);

export const StatusBadge: React.FC<{ status: IncidentStatus }> = ({ status }) => (
  <Badge
    className={cn(
      "rounded-md border-0 px-2 py-1 text-[11px] font-medium capitalize",
      statusStyleMap[status],
    )}
  >
    {status.replace("-", " ")}
  </Badge>
);
