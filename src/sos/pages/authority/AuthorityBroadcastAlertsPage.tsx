import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertBadge } from "@/sos/components/badges";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Priority } from "@/sos/models";
import { formatDateTime } from "@/sos/utils";

const AuthorityBroadcastAlertsPage = () => {
  const { broadcasts, createBroadcast } = useSosApp();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<Priority>("high");
  const [audience, setAudience] = useState<"all-ngos" | "selected-ngos" | "public" | "district-teams">("all-ngos");
  const [geoTarget, setGeoTarget] = useState("Citywide");
  const [schedule, setSchedule] = useState("now");
  const [scheduleDate, setScheduleDate] = useState("");

  const preview = useMemo(
    () => ({ title, message, severity, audience, geoTarget, schedule, scheduleDate }),
    [audience, geoTarget, message, schedule, scheduleDate, severity, title],
  );

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required.");
      return;
    }

    const scheduledFor =
      schedule === "now" || !scheduleDate ? new Date().toISOString() : new Date(scheduleDate).toISOString();

    createBroadcast({
      title: title.trim(),
      message: message.trim(),
      severity,
      audience,
      geoTarget,
      scheduledFor,
    });

    toast.success("Broadcast queued");
    setTitle("");
    setMessage("");
    setSchedule("now");
    setScheduleDate("");
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Broadcast Alerts" subtitle="Create, schedule, and monitor emergency broadcasts" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Create alert</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={submit}>
              <div className="space-y-1">
                <Label>Title</Label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Critical weather warning" />
              </div>
              <div className="space-y-1">
                <Label>Message</Label>
                <Textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-24" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Severity</Label>
                  <Select value={severity} onValueChange={(value) => setSeverity(value as Priority)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Audience</Label>
                  <Select value={audience} onValueChange={(value) => setAudience(value as typeof audience)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-ngos">All NGOs</SelectItem>
                      <SelectItem value="selected-ngos">Selected NGOs</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="district-teams">District Teams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Geo target</Label>
                <Input value={geoTarget} onChange={(event) => setGeoTarget(event.target.value)} placeholder="West district" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Schedule</Label>
                  <Select value={schedule} onValueChange={setSchedule}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send now</SelectItem>
                      <SelectItem value="later">Schedule later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {schedule === "later" ? (
                  <div className="space-y-1">
                    <Label>Date/time</Label>
                    <Input type="datetime-local" value={scheduleDate} onChange={(event) => setScheduleDate(event.target.value)} />
                  </div>
                ) : null}
              </div>
              <Button type="submit" className="w-full rounded-full">Save broadcast</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{preview.title || "Broadcast title"}</p>
                <AlertBadge priority={preview.severity} />
              </div>
              <p className="text-sm text-slate-600">{preview.message || "Alert message preview."}</p>
              <p className="text-xs text-slate-500">Audience: {preview.audience}</p>
              <p className="text-xs text-slate-500">Geo target: {preview.geoTarget}</p>
              <p className="text-xs text-slate-500">Schedule: {preview.schedule === "now" ? "Immediate" : preview.scheduleDate || "Not set"}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Sent history</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {broadcasts.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{alert.title}</p>
                    <AlertBadge priority={alert.severity} />
                  </div>
                  <p className="text-xs text-slate-600">{alert.message}</p>
                  <p className="text-xs text-slate-500">{alert.sent ? `Sent at ${formatDateTime(alert.sentAt || alert.scheduledFor)}` : `Scheduled ${formatDateTime(alert.scheduledFor)}`}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthorityBroadcastAlertsPage;
