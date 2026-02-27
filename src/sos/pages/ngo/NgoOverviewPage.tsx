import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import {
  EmptyStateCard,
  FilterBar,
  SearchInput,
  SectionTitle,
  StatCard,
} from "@/sos/components/common";
import { ComposerCard, FeedCard } from "@/sos/components/feed";
import { useSosApp } from "@/sos/context/SosAppContext";

const NgoOverviewPage = () => {
  const navigate = useNavigate();
  const { incidents, volunteers, resources, broadcasts, addIncidentUpdate, updateIncidentStatus } = useSosApp();
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const assignedCases = incidents.filter((incident) => incident.assignedNgoIds.length > 0);
  const newAssignments = assignedCases.filter((incident) => incident.status === "assigned");
  const inProgress = assignedCases.filter((incident) => incident.status === "in-progress");
  const resolvedToday = assignedCases.filter((incident) => incident.status === "resolved").length;
  const availableVolunteers = volunteers.filter((volunteer) => volunteer.status === "available").length;
  const lowStock = resources.filter((item) => item.available <= item.minThreshold).length;

  const filtered = useMemo(() => {
    return assignedCases
      .filter((incident) => {
        const q = query.toLowerCase().trim();
        if (!q) return true;
        return (
          incident.id.toLowerCase().includes(q) ||
          incident.title.toLowerCase().includes(q) ||
          incident.location.area.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [assignedCases, query]);

  const onAction = (incidentId: string, action: string) => {
    if (action === "Accept" || action === "Dispatch") {
      const result = updateIncidentStatus(incidentId, "in-progress", `NGO action: ${action}`);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      return;
    }

    if (action === "Mark completed") {
      const result = updateIncidentStatus(incidentId, "resolved", "Marked completed by NGO");
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      return;
    }

    addIncidentUpdate(incidentId, `NGO update posted: ${action}`);
    toast.success(`${action} recorded`);
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="NGO Dashboard Overview" subtitle="Assigned tasks, collaboration feed, and resource readiness" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Active Cases" value={String(assignedCases.length)} />
        <StatCard label="New Assignments" value={String(newAssignments.length)} />
        <StatCard label="In Progress" value={String(inProgress.length)} />
        <StatCard label="Resolved Today" value={String(resolvedToday)} tone="success" />
        <StatCard label="Available Volunteers" value={String(availableVolunteers)} />
        <StatCard label="Stock Alerts" value={String(lowStock)} tone="danger" />
      </div>

      <ComposerCard
        title="Response Update Composer"
        actions={[
          "Team Dispatch Update",
          "Resource Availability Update",
          "Need Support Request",
          "Volunteer Call",
          "Situation Update for Authority",
        ]}
        onActionClick={(action) => toast.success(`${action} composer opened`)}
      />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by case ID or location" className="w-full md:w-[320px]" />
      </FilterBar>

      <div className="space-y-3">
        {filtered.slice(0, visibleCount).map((incident) => (
          <FeedCard
            key={incident.id}
            incident={incident}
            role="ngo"
            onAction={(action) => onAction(incident.id, action)}
            onViewCase={() => navigate(`/ngo/requests/${incident.id}`)}
          />
        ))}

        {broadcasts.slice(0, 2).map((broadcast) => (
          <Card key={broadcast.id} className="rounded-2xl border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>{broadcast.title}</span>
                <AlertBadge priority={broadcast.severity} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{broadcast.message}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>Audience: {broadcast.audience}</span>
                <StatusBadge status={broadcast.sent ? "resolved" : "open"} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" className="rounded-full">Accept</Button>
                <Button size="sm" variant="outline" className="rounded-full">Request backup</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {!filtered.length ? (
          <EmptyStateCard title="No assigned cases" description="New assignments will appear here." />
        ) : null}
      </div>

      {visibleCount < filtered.length ? (
        <div className="flex justify-center">
          <Button variant="outline" className="rounded-full" onClick={() => setVisibleCount((prev) => prev + 4)}>
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default NgoOverviewPage;
