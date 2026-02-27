import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle, StatCardCompact } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const NgoPerformancePage = () => {
  const { incidents, volunteers, resources, supportRequests } = useSosApp();

  const assignedCases = incidents.filter((item) => item.assignedNgoIds.length > 0);
  const resolved = assignedCases.filter((item) => item.status === "resolved" || item.status === "closed").length;
  const inProgress = assignedCases.filter((item) => item.status === "in-progress").length;
  const avgEta = assignedCases.length
    ? Math.round(assignedCases.reduce((sum, item) => sum + item.etaMinutes, 0) / assignedCases.length)
    : 0;
  const availableVolunteers = volunteers.filter((item) => item.status === "available").length;
  const lowStockItems = resources.filter((item) => item.available <= item.minThreshold).length;
  const openSupport = supportRequests.filter((item) => item.status !== "received").length;

  return (
    <div className="space-y-4">
      <SectionTitle title="Performance Insights" subtitle="Response speed, completion ratio, resource pressure, and support flow" />

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        <StatCardCompact label="Assigned Cases" value={String(assignedCases.length)} />
        <StatCardCompact label="Resolved" value={String(resolved)} tone="success" />
        <StatCardCompact label="In Progress" value={String(inProgress)} />
        <StatCardCompact label="Avg ETA" value={`${avgEta}m`} />
        <StatCardCompact label="Available Team" value={String(availableVolunteers)} />
        <StatCardCompact label="Low Stock" value={String(lowStockItems)} tone="critical" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Operational metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Completion ratio: {assignedCases.length ? Math.round((resolved / assignedCases.length) * 100) : 0}%</p>
            <p>Open support requests: {openSupport}</p>
            <p>Low stock resources: {lowStockItems}</p>
            <p>Volunteer readiness: {availableVolunteers}/{volunteers.length} available</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Performance notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p>Priority routing remains healthy for high and critical incidents.</p>
            <p>Resources should be replenished for low-stock items to avoid dispatch delays.</p>
            <p>Monitor support requests older than 24 hours for escalation.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NgoPerformancePage;

