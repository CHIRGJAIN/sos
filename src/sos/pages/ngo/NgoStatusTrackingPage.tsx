import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/sos/components/badges";
import { EmptyStateCard, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const statusOrder = ["open", "verified", "assigned", "in-progress", "resolved", "closed"] as const;

const NgoStatusTrackingPage = () => {
  const { incidents } = useSosApp();
  const assigned = incidents.filter((incident) => incident.assignedNgoIds.length > 0);

  return (
    <div className="space-y-4">
      <SectionTitle title="Status Tracking" subtitle="Live status board for all NGO-linked incidents" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {statusOrder.map((status) => {
          const count = assigned.filter((incident) => incident.status === status).length;
          return (
            <Card key={status} className="rounded-2xl border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{status.replace("-", " ")}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Recent status changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {assigned.length ? (
            assigned
              .slice()
              .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
              .slice(0, 12)
              .map((incident) => (
                <div key={incident.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{incident.id} - {incident.title}</p>
                    <p className="text-xs text-slate-500">{incident.location.area}, {incident.location.district}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={incident.status} />
                    <span className="text-xs text-slate-500">{formatDateTime(incident.updatedAt)}</span>
                  </div>
                </div>
              ))
          ) : (
            <EmptyStateCard title="No tracked cases" description="Status events appear once cases are assigned." />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoStatusTrackingPage;

