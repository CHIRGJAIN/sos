import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge } from "@/sos/components/badges";
import { MapPreviewCard, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const AuthorityAreaMonitoringPage = () => {
  const { incidents } = useSosApp();

  const districtSummary = Object.entries(
    incidents.reduce<Record<string, { total: number; critical: number }>>((acc, incident) => {
      const key = incident.location.district;
      if (!acc[key]) acc[key] = { total: 0, critical: 0 };
      acc[key].total += 1;
      if (incident.priority === "critical") acc[key].critical += 1;
      return acc;
    }, {}),
  ).map(([district, value]) => ({ district, ...value }));

  return (
    <div className="space-y-4">
      <SectionTitle title="Area Monitoring" subtitle="District-level incident concentration and priority heat overview" />

      <MapPreviewCard
        points={incidents.slice(0, 8).map((incident, index) => ({
          label: `${incident.id} ${incident.location.area}`,
          top: `${14 + (index % 4) * 18}%`,
          left: `${20 + (index % 3) * 22}%`,
          priority: incident.priority,
        }))}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {districtSummary.map((item) => (
          <Card key={item.district} className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">{item.district}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>Total incidents: {item.total}</p>
              <p>Critical incidents: {item.critical}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Risk level:</span>
                <AlertBadge priority={item.critical >= 2 ? "critical" : item.total >= 4 ? "high" : "medium"} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuthorityAreaMonitoringPage;

