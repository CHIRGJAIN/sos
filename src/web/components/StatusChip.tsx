import { cn } from "@/lib/utils";
import { useSosWeb } from "@/web/context/SosWebContext";

interface StatusChipProps {
  status: string;
  type?: "incident" | "severity" | "delivery";
}

const statusClassMap: Record<string, string> = {
  sending: "bg-amber-50 text-amber-700 border-amber-200",
  "alert-sent": "bg-orange-50 text-orange-700 border-orange-200",
  "tracking-active": "bg-blue-50 text-blue-700 border-blue-200",
  "waiting-response": "bg-red-50 text-red-700 border-red-200",
  accepted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  "en-route": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "on-scene": "bg-purple-50 text-purple-700 border-purple-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-100 text-slate-700 border-slate-200",
  pending: "bg-slate-100 text-slate-700 border-slate-200",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const statusKeyMap: Record<string, string> = {
  sending: "status.sending",
  "alert-sent": "status.alert-sent",
  "tracking-active": "status.tracking-active",
  "waiting-response": "status.waiting-response",
  accepted: "status.accepted",
  "en-route": "status.en-route",
  "on-scene": "status.on-scene",
  resolved: "status.resolved",
  cancelled: "status.cancelled",
  critical: "severity.critical",
  high: "severity.high",
  medium: "severity.medium",
  low: "severity.low",
  pending: "status.pending",
  sent: "status.sending",
  delivered: "status.delivered",
  success: "status.delivered",
  failed: "status.failed",
};

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const { t } = useSosWeb();
  const key = statusKeyMap[status] as Parameters<typeof t>[0] | undefined;
  const label = key ? t(key) : status;

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
        statusClassMap[status] || "bg-slate-100 text-slate-700 border-slate-200",
      )}
    >
      {label}
    </span>
  );
};

export default StatusChip;
