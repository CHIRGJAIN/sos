import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NgoDirectoryEntry } from "@/web/types";

interface NgoCardProps {
  ngo: NgoDirectoryEntry;
  isFollowed: boolean;
  active?: boolean;
  onFollow: () => void;
  onOpen: () => void;
}

const NgoCard: React.FC<NgoCardProps> = ({ ngo, isFollowed, active = false, onFollow, onOpen }) => {
  const progress = Math.min(100, Math.round((ngo.fundraising.raised / ngo.fundraising.goal) * 100));

  return (
    <div
      className={`rounded-[26px] border p-4 transition ${
        active
          ? "border-[#007AFF]/20 bg-[#007AFF]/5 shadow-[0_14px_32px_rgba(0,122,255,0.08)]"
          : "border-white/70 bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            {ngo.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-950">{ngo.name}</p>
              <BadgeCheck className="h-4 w-4 text-[#34C759]" />
            </div>
            <p className="mt-1 text-xs text-slate-500">{ngo.category}</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600">
          {ngo.scope}
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-500">{ngo.location}</p>
      <div className="mt-4 rounded-[22px] bg-slate-50 p-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>Raised INR {ngo.fundraising.raised.toLocaleString()}</span>
          <span>{progress}%</span>
        </div>
        <Progress className="mt-2 h-2 bg-slate-200" value={progress} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant={isFollowed ? "default" : "outline"} size="sm" className="rounded-full" onClick={onFollow}>
          {isFollowed ? "Following" : "Follow"}
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" onClick={onOpen}>
          View details
        </Button>
      </div>
    </div>
  );
};

export default NgoCard;
