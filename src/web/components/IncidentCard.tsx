import { Clock3, MapPin } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import SeverityBadge from "@/web/components/SeverityBadge";
import StatusBadge from "@/web/components/StatusBadge";
import { IncidentRecord } from "@/web/types";

interface IncidentCardProps {
  incident: IncidentRecord;
  active?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident, active = false, compact = false, onClick }) => {
  const Container = onClick ? "button" : "div";

  return (
    <Container
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full rounded-[24px] border px-4 py-3 text-left transition-all",
        active
          ? "border-[#007AFF]/20 bg-[#007AFF]/5 shadow-[0_14px_32px_rgba(0,122,255,0.08)]"
          : "border-white/70 bg-white/90 shadow-[0_10px_28px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{incident.id}</p>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-950">{incident.title}</p>
      {!compact ? <p className="mt-1 line-clamp-2 text-sm text-slate-600">{incident.description}</p> : null}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {incident.location.area || incident.location.address}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          {formatDistanceToNowStrict(new Date(incident.updatedAt), { addSuffix: true })}
        </span>
        {incident.urgencyFlag ? <span className="font-semibold text-red-600">Urgent</span> : null}
      </div>
    </Container>
  );
};

export default IncidentCard;
