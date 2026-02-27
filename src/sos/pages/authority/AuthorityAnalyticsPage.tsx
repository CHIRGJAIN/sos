import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle, StatCard } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const pieColors = ["#ef4444", "#f97316", "#f59e0b", "#06b6d4", "#22c55e", "#6366f1", "#0ea5e9", "#64748b"];

const AuthorityAnalyticsPage = () => {
  const { incidents, ngos } = useSosApp();

  const incidentsByCategory = Object.entries(
    incidents.reduce<Record<string, number>>((acc, incident) => {
      acc[incident.category] = (acc[incident.category] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const incidentsByArea = Object.entries(
    incidents.reduce<Record<string, number>>((acc, incident) => {
      acc[incident.location.district] = (acc[incident.location.district] || 0) + 1;
      return acc;
    }, {}),
  ).map(([district, total]) => ({ district, total }));

  const statusDistribution = Object.entries(
    incidents.reduce<Record<string, number>>((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {}),
  ).map(([status, count]) => ({ status, count }));

  const performance = ngos.map((ngo) => ({
    name: ngo.name.split(" ").slice(0, 2).join(" "),
    activeCases: ngo.activeCases,
    reliability: ngo.reliabilityScore,
  }));

  const resolutionTrend = [
    { day: "Mon", resolved: 12, open: 18 },
    { day: "Tue", resolved: 17, open: 16 },
    { day: "Wed", resolved: 15, open: 19 },
    { day: "Thu", resolved: 21, open: 14 },
    { day: "Fri", resolved: 18, open: 13 },
    { day: "Sat", resolved: 14, open: 12 },
    { day: "Sun", resolved: 16, open: 11 },
  ];

  return (
    <div className="space-y-4">
      <SectionTitle title="Analytics & Reports" subtitle="Incidents, response trends, and NGO performance insights" />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total incidents" value={String(incidents.length)} />
        <StatCard
          label="Open vs Closed"
          value={`${statusDistribution.find((row) => row.status === "closed")?.count || 0}/${incidents.length}`}
        />
        <StatCard
          label="Avg NGO reliability"
          value={`${(performance.reduce((sum, ngo) => sum + ngo.reliability, 0) / performance.length).toFixed(1)}/5`}
        />
        <StatCard label="Peak hour" value="18:00 - 20:00" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Incidents by category</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={incidentsByCategory} dataKey="value" nameKey="name" outerRadius={88} innerRadius={45}>
                  {incidentsByCategory.map((_, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Incidents by area</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentsByArea}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="district" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Resolution trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="resolved" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="open" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">NGO response performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="activeCases" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthorityAnalyticsPage;
