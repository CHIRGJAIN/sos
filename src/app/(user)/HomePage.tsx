import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Clock3,
  LocateFixed,
  MapPin,
  ShieldAlert,
  Upload,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PillButton from "@/components/ui/PillButton";
import { DistressSignal, ReporterRole, distressSignals } from "@/data/mockData";

const formatDateTime = (date: Date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const initialActivity = useMemo(() => distressSignals.slice(0, 5), []);
  const [recentActivity, setRecentActivity] = useState<DistressSignal[]>(initialActivity);
  const [geoStatus, setGeoStatus] = useState("Pending");
  const [lastSosAt, setLastSosAt] = useState("No SOS sent yet");
  const [reporterRole, setReporterRole] = useState<ReporterRole>("VICTIM");

  const createSosEvent = (geoLocation: string) => {
    const now = new Date();
    const newEvent: DistressSignal = {
      id: `sos-${now.getTime()}`,
      type: "SOS",
      geoLocation,
      for: reporterRole === "VICTIM" ? "Self" : "Victim Support",
      dateTime: formatDateTime(now),
      feedback: "Signal generated",
      reporterRole,
    };

    setRecentActivity((prev) => [newEvent, ...prev].slice(0, 5));
    setLastSosAt(newEvent.dateTime);
    alert(`SOS Distress Signal Created\nLocation: ${geoLocation}\nTime: ${newEvent.dateTime}`);
  };

  const handleSOS = () => {
    if (!navigator.geolocation) {
      setGeoStatus("Geo unavailable");
      createSosEvent("Unknown");
      return;
    }

    setGeoStatus("Locating...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const geo = `${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E`;
        setGeoStatus("Live location captured");
        createSosEvent(geo);
      },
      () => {
        setGeoStatus("Unable to detect location");
        createSosEvent("Unknown");
      }
    );
  };

  return (
    <DashboardShell portal="user" title="SOS">
      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-primary/20 bg-popover/75 p-3">
              <p className="mb-2 text-xs text-muted-foreground">Reporting As</p>
              <div className="flex flex-wrap gap-2">
                <PillButton active={reporterRole === "VICTIM"} onClick={() => setReporterRole("VICTIM")}>
                  Victim
                </PillButton>
                <PillButton
                  active={reporterRole === "SPECTATOR"}
                  onClick={() => setReporterRole("SPECTATOR")}
                >
                  Spectator
                </PillButton>
              </div>
            </div>

            <button
              onClick={handleSOS}
              className="flex w-full items-center justify-between rounded-xl bg-accent px-4 py-3 text-left text-accent-foreground shadow-soft"
            >
              <span className="font-semibold">Send SOS</span>
              <ShieldAlert className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate("/user/media-upload")}
              className="flex w-full items-center justify-between rounded-xl border border-primary/20 bg-popover px-4 py-3 text-left"
            >
              <span className="font-medium">Media Upload</span>
              <Upload className="h-5 w-5 text-accent" />
            </button>
            <button
              onClick={() => navigate("/user/distress")}
              className="flex w-full items-center justify-between rounded-xl border border-primary/20 bg-popover px-4 py-3 text-left"
            >
              <span className="font-medium">View Distress History</span>
              <Clock3 className="h-5 w-5 text-foreground/70" />
            </button>
            <button
              onClick={() => navigate("/user/services")}
              className="flex w-full items-center justify-between rounded-xl border border-primary/20 bg-popover px-4 py-3 text-left"
            >
              <span className="font-medium">Nearest Services</span>
              <MapPin className="h-5 w-5 text-foreground/70" />
            </button>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="border-primary/25 bg-[linear-gradient(145deg,hsl(24_95%_53%_/_0.2)_0%,hsl(30_70%_78%_/_0.2)_100%)]">
            <CardContent className="grid items-center gap-6 p-6 md:grid-cols-[260px_minmax(0,1fr)]">
              <button
                onClick={handleSOS}
                className="mx-auto flex h-56 w-56 flex-col items-center justify-center rounded-full border-8 border-accent/20 bg-accent text-accent-foreground shadow-[0_0_0_12px_hsl(0_75%_50%_/_0.15)] transition-transform hover:scale-[1.01] active:scale-95"
              >
                <span className="font-serif text-5xl font-bold tracking-wide">SOS</span>
                <span className="mt-2 text-xs uppercase tracking-[0.18em]">Emergency Distress Signal</span>
              </button>

              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold lg:text-3xl">Emergency Distress Signal</h2>
                  <p className="text-sm text-muted-foreground">
                    Trigger immediate response for yourself or nearby people in danger.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-primary/20 bg-popover/70 p-3">
                    <p className="text-xs text-muted-foreground">Last SOS Time</p>
                    <p className="mt-1 text-sm font-medium">{lastSosAt}</p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-popover/70 p-3">
                    <p className="text-xs text-muted-foreground">Geolocation</p>
                    <p className="mt-1 text-sm font-medium">{geoStatus}</p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-popover/70 p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Emergency Contact</p>
                    <p className="mt-1 text-sm font-medium">+91 91234 56789</p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-popover/70 p-3 sm:col-span-2">
                    <p className="text-xs text-muted-foreground">Current Reporter Role</p>
                    <p className="mt-1 text-sm font-medium">{reporterRole}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentActivity.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-xl border border-primary/20 bg-popover/75 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {event.type === "SOS" ? "SOS Signal" : "Media Upload"}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.geoLocation}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{event.dateTime}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default HomePage;
