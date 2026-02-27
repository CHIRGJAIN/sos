import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { EmptyStateCard, MetadataRow, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const AuthorityNgoProfilePage = () => {
  const { ngoId } = useParams<{ ngoId: string }>();
  const { ngos, incidents } = useSosApp();

  const ngo = ngos.find((item) => item.id === ngoId);

  if (!ngo) {
    return (
      <EmptyStateCard
        title="NGO profile not found"
        description="The selected NGO does not exist or was removed."
        action={
          <Button asChild className="rounded-full">
            <Link to="/authority/ngos">Back to directory</Link>
          </Button>
        }
      />
    );
  }

  const ngoIncidents = incidents.filter((incident) => incident.assignedNgoIds.includes(ngo.id));

  return (
    <div className="space-y-4">
      <SectionTitle
        title={ngo.name}
        subtitle="NGO profile, service coverage, capacity, and assigned case activity"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" asChild>
              <Link to="/authority/ngos">Back to directory</Link>
            </Button>
            <Button className="rounded-full" onClick={() => toast.success(`Assignment created for ${ngo.name}`)}>
              Assign Case
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Assigned cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ngoIncidents.length ? (
              ngoIncidents.map((incident) => (
                <Link
                  key={incident.id}
                  to={`/authority/requests/${incident.id}`}
                  className="block rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{incident.id} - {incident.title}</p>
                    <div className="flex items-center gap-2">
                      <AlertBadge priority={incident.priority} />
                      <StatusBadge status={incident.status} />
                    </div>
                  </div>
                  <div className="mt-2 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                    <span>Area: {incident.location.area}</span>
                    <span>District: {incident.location.district}</span>
                    <span>ETA: {incident.etaMinutes} mins</span>
                    <span>Updated: {formatDateTime(incident.updatedAt)}</span>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyStateCard title="No active assignments" description="Assign a case to this NGO to see activity here." />
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Organization metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <MetadataRow label="Contact person" value={ngo.contactPerson} />
              <MetadataRow label="Phone" value={ngo.contactPhone} />
              <MetadataRow label="Availability" value={ngo.availability} />
              <MetadataRow label="Active cases" value={ngo.activeCases} />
              <MetadataRow label="Reliability" value={`${ngo.reliabilityScore.toFixed(1)} / 5`} />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Capacity utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-600">Current response load based on ongoing cases.</p>
              <Progress value={ngo.capacity} className="h-2" />
              <p className="text-xs font-medium text-slate-500">{ngo.capacity}% utilized</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Services & coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {ngo.services.map((service) => (
                  <span key={service} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                    {service}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500">Coverage areas: {ngo.coverageAreas.join(", ")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthorityNgoProfilePage;

