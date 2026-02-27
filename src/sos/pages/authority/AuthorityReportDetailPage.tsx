import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { ActivityThread, EmptyStateCard, MetadataRow, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const AuthorityReportDetailPage = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const { incidents, timeline } = useSosApp();
  const report = incidents.find((incident) => incident.id === reportId);

  if (!report) {
    return (
      <EmptyStateCard
        title="Report not found"
        description="The report may have been removed or the link is invalid."
        action={
          <Button asChild className="rounded-full">
            <Link to="/authority/reports">Back to reports</Link>
          </Button>
        }
      />
    );
  }

  const reportTimeline = timeline.filter((entry) => entry.incidentId === report.id);

  return (
    <div className="space-y-4">
      <SectionTitle
        title={`Report ${report.id}`}
        subtitle="Report metadata, status, and operational timeline"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/authority/reports">Back to reports</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to={`/authority/requests/${report.id}`}>Open full case</Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Report summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <AlertBadge priority={report.priority} />
              <StatusBadge status={report.status} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{report.description}</p>
            </div>
            <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
              <MetadataRow label="Category" value={report.category} />
              <MetadataRow label="Source" value={report.source} />
              <MetadataRow label="Area" value={report.location.area} />
              <MetadataRow label="District" value={report.location.district} />
              <MetadataRow label="City" value={report.location.city} />
              <MetadataRow label="SLA" value={`${report.slaMinutes} mins`} />
              <MetadataRow label="Created" value={formatDateTime(report.createdAt)} />
              <MetadataRow label="Updated" value={formatDateTime(report.updatedAt)} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Activity timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityThread entries={reportTimeline} compact />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthorityReportDetailPage;

