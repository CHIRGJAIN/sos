import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionTitle } from "@/sos/components/common";

const SettingsPage = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [compactMode, setCompactMode] = useState(true);

  return (
    <div className="space-y-4">
      <SectionTitle title="Settings" subtitle="Notification preferences and account behavior" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts">Email alerts</Label>
              <Switch id="email-alerts" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-alerts">Push alerts</Label>
              <Switch id="push-alerts" checked={pushAlerts} onCheckedChange={setPushAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="critical-only">Only critical incidents</Label>
              <Switch id="critical-only" checked={criticalOnly} onCheckedChange={setCriticalOnly} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Appearance & Density</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-mode">Compact cards mode</Label>
              <Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} />
            </div>
            <p className="text-sm text-slate-500">Sticky shell and responsive panel behavior are enabled by default.</p>
            <Button className="rounded-full">Save preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
