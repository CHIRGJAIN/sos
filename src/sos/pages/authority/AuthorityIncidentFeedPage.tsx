import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker, FilterToolbar, MultiSelect, SearchInput, SectionTitle } from "@/sos/components/common";
import { IncidentListItem } from "@/sos/components/feed";
import { useSosApp } from "@/sos/context/SosAppContext";
import { IncidentStatus, incidentStatusTransitionMap } from "@/sos/models";

const AuthorityIncidentFeedPage = () => {
  const navigate = useNavigate();
  const { incidents, updateIncidentStatus, addIncidentUpdate } = useSosApp();
  const [query, setQuery] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [range, setRange] = useState<DateRange>();
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "priority" | "sla">("latest");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered = useMemo(() => {
    return incidents
      .filter((incident) => {
        if (selectedPriorities.length && !selectedPriorities.includes(incident.priority)) return false;
        if (selectedStatuses.length && !selectedStatuses.includes(incident.status)) return false;

        if (range?.from) {
          const time = +new Date(incident.createdAt);
          const start = +new Date(range.from);
          const end = range.to ? +new Date(range.to) + 24 * 60 * 60 * 1000 : Number.MAX_SAFE_INTEGER;
          if (time < start || time > end) return false;
        }

        const q = query.toLowerCase().trim();
        if (!q) return true;
        return (
          incident.id.toLowerCase().includes(q) ||
          incident.title.toLowerCase().includes(q) ||
          incident.location.area.toLowerCase().includes(q) ||
          incident.location.district.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "latest") return +new Date(b.updatedAt) - +new Date(a.updatedAt);
        if (sortBy === "oldest") return +new Date(a.updatedAt) - +new Date(b.updatedAt);
        if (sortBy === "sla") return a.slaMinutes - b.slaMinutes;
        const rank = { critical: 0, high: 1, medium: 2, low: 3 };
        return rank[a.priority] - rank[b.priority];
      });
  }, [incidents, query, range, selectedPriorities, selectedStatuses, sortBy]);

  const onAction = (incidentId: string, action: string) => {
    const incident = incidents.find((entry) => entry.id === incidentId);
    if (!incident) return;

    if (action === "Add Note") {
      addIncidentUpdate(incident.id, "Authority note added from Incident Feed page.");
      toast.success("Note added");
      return;
    }

    const nextStatusMap: Record<string, IncidentStatus> = {
      Verify: "verified",
      "Assign NGO": "assigned",
      "Mark In Progress": "in-progress",
      Resolve: "resolved",
      Escalate: "assigned",
    };

    const nextStatus = nextStatusMap[action];
    if (!nextStatus) {
      toast.info(`${action} completed`);
      return;
    }

    if (!incidentStatusTransitionMap[incident.status].includes(nextStatus)) {
      toast.error(`Cannot change status from ${incident.status} to ${nextStatus}`);
      return;
    }

    const result = updateIncidentStatus(incident.id, nextStatus, `Updated from incident feed by ${action}.`);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
  };

  return (
    <div className="space-y-5">
      <SectionTitle title="Incident Feed" subtitle="Live stream of reported and assigned incidents" />

      <FilterToolbar>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by case ID, category, location"
          className="w-full bg-white md:w-[300px]"
        />
        <MultiSelect
          label="Priority"
          options={["critical", "high", "medium", "low"]}
          selected={selectedPriorities}
          onChange={setSelectedPriorities}
        />
        <MultiSelect
          label="Status"
          options={["open", "verified", "assigned", "in-progress", "resolved", "closed"]}
          selected={selectedStatuses}
          onChange={setSelectedStatuses}
        />
        <DateRangePicker range={range} onChange={setRange} />
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="h-10 w-full rounded-full border-slate-300 bg-white sm:ml-auto sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest updated</SelectItem>
            <SelectItem value="oldest">Oldest updated</SelectItem>
            <SelectItem value="priority">Priority first</SelectItem>
            <SelectItem value="sla">Shortest SLA</SelectItem>
          </SelectContent>
        </Select>
      </FilterToolbar>

      <div className="space-y-2.5">
        {filtered.slice(0, visibleCount).map((incident) => (
          <IncidentListItem
            key={incident.id}
            incident={incident}
            role="authority"
            onAction={(action) => onAction(incident.id, action)}
            onViewCase={() => navigate(`/authority/requests/${incident.id}`)}
          />
        ))}
      </div>

      {visibleCount < filtered.length ? (
        <div className="flex justify-center">
          <Button variant="secondary" className="rounded-full bg-slate-100 text-slate-700" onClick={() => setVisibleCount((prev) => prev + 6)}>
            Load more incidents
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default AuthorityIncidentFeedPage;
