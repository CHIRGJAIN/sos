import { Copy, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/web/components/StatusBadge";
import { ResourceEntry } from "@/web/types";

interface ResourceCardProps {
  resource: ResourceEntry;
  favorite: boolean;
  onFavorite: () => void;
  onView: () => void;
  onCopy: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, favorite, onFavorite, onView, onCopy }) => {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">{resource.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{resource.category}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={onFavorite}>
          <Star className={`h-4 w-4 ${favorite ? "fill-yellow-400 text-yellow-500" : "text-slate-400"}`} />
        </Button>
      </div>
      <p className="mt-3 text-sm text-slate-600">{resource.address}</p>
      <p className="mt-1 text-xs text-slate-500">
        {resource.district}, {resource.state}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={resource.verified ? "delivered" : "pending"} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600">
          {resource.availability}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="rounded-full" onClick={onView}>
          View
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" disabled={!resource.phone}>
          <Phone className="mr-1 h-3.5 w-3.5" />
          Call
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" onClick={onCopy}>
          <Copy className="mr-1 h-3.5 w-3.5" />
          Copy
        </Button>
      </div>
    </div>
  );
};

export default ResourceCard;
