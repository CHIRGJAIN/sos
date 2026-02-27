import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { EmptyStateCard, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const AuthorityEscalationsPage = () => {
  const { incidents, addIncidentUpdate } = useSosApp();
  const escalations = incidents
    .filter(
      (incident) =>
        ["critical", "high"].includes(incident.priority) &&
        ["open", "verified", "assigned", "in-progress"].includes(incident.status),
    )
    .slice()
    .sort((a, b) => a.slaMinutes - b.slaMinutes);

  return (
    <div className="space-y-4">
      <SectionTitle title="Escalations" subtitle="SLA-sensitive incidents requiring immediate command actions" />

      {escalations.length ? (
        <div className="space-y-3">
          {escalations.map((incident) => (
            <Card key={incident.id} className="rounded-2xl border-slate-200">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                  <span>{incident.id} - {incident.title}</span>
                  <div className="flex gap-2">
                    <AlertBadge priority={incident.priority} />
                    <StatusBadge status={incident.status} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>{incident.description}</p>
                <div className="grid gap-1 text-xs text-slate-500 sm:grid-cols-4">
                  <span>Area: {incident.location.area}</span>
                  <span>District: {incident.location.district}</span>
                  <span>SLA: {incident.slaMinutes} mins</span>
                  <span>Updated: {formatDateTime(incident.updatedAt)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      addIncidentUpdate(incident.id, "Escalation acknowledged by command desk.");
                      toast.success(`${incident.id} escalation acknowledged`);
                    }}
                  >
                    Acknowledge
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      addIncidentUpdate(incident.id, "Escalated to regional response cell.");
                      toast.success(`${incident.id} escalated to regional cell`);
                    }}
                  >
                    Escalate Regionally
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyStateCard title="Escalation queue clear" description="No active incidents need escalation right now." />
      )}
    </div>
  );
};

export default AuthorityEscalationsPage;

