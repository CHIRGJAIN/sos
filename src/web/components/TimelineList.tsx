import { formatDistanceToNowStrict } from "date-fns";
import StatusChip from "@/web/components/StatusChip";
import { TimelineEvent } from "@/web/types";

const TimelineList: React.FC<{ events: TimelineEvent[] }> = ({ events }) => {
  return (
    <ul className="space-y-3">
      {events.map((event) => (
        <li key={event.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-700">{event.actor}</p>
            <p className="text-[11px] text-slate-500">
              {formatDistanceToNowStrict(new Date(event.createdAt), { addSuffix: true })}
            </p>
          </div>
          <p className="mt-1 text-sm text-slate-700">{event.message}</p>
          <div className="mt-2">
            {event.verificationFlag ? <StatusChip status="delivered" /> : <StatusChip status="pending" />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TimelineList;