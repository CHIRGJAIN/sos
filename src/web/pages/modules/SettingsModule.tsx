import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import SectionCard from "@/web/components/SectionCard";
import StatusChip from "@/web/components/StatusChip";
import { useSosWeb } from "@/web/context/SosWebContext";

const SettingsModule: React.FC = () => {
  const {
    t,
    settings,
    updateSettings,
    permissionsStatus,
    updatePermissionsStatus,
    language,
    setLanguage,
    safetyReadiness,
  } = useSosWeb();

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <SectionCard title={t("citizen.settings.title")}>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">Readiness</p>
              <p className="text-2xl font-semibold text-emerald-700">{safetyReadiness}%</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Countdown duration</p>
            <input
              type="range"
              min={3}
              max={10}
              value={settings.countdownSeconds}
              onChange={(event) => updateSettings({ countdownSeconds: Number(event.target.value) })}
              className="mt-3 w-full accent-[#FF3B30]"
            />
            <p className="mt-2 text-xs text-slate-500">{settings.countdownSeconds}s</p>
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-700">{t("citizen.sos.silentMode")}</span>
            <Switch checked={settings.silentMode} onCheckedChange={(checked) => updateSettings({ silentMode: checked })} />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-700">Auto-record</span>
            <Switch checked={settings.autoRecord} onCheckedChange={(checked) => updateSettings({ autoRecord: checked })} />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-700">Continuous location share</span>
            <Switch
              checked={settings.continuousLocationShare}
              onCheckedChange={(checked) => updateSettings({ continuousLocationShare: checked })}
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-700">Vibration</span>
            <Switch checked={settings.vibration} onCheckedChange={(checked) => updateSettings({ vibration: checked })} />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-sm text-slate-700">{t("citizen.sos.fakeCall")}</span>
            <Switch
              checked={settings.fakeCallShortcut}
              onCheckedChange={(checked) => updateSettings({ fakeCallShortcut: checked })}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <Button variant={language === "en" ? "default" : "outline"} onClick={() => setLanguage("en")}>
              English
            </Button>
            <Button variant={language === "hi" ? "default" : "outline"} onClick={() => setLanguage("hi")}>
              हिन्दी
            </Button>
          </div>

          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={settings.distressLanguage}
            onChange={(event) => updateSettings({ distressLanguage: event.target.value as typeof language })}
          >
            <option value="en">Distress language: EN</option>
            <option value="hi">Distress language: HI</option>
          </select>
        </div>
      </SectionCard>

      <SectionCard title="Permissions readiness">
        <div className="space-y-2">
          {Object.entries(permissionsStatus).map(([key, value]) => {
            const permissionKey = key as keyof typeof permissionsStatus;

            return (
            <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="capitalize text-slate-700">{key}</span>
                <StatusChip status={value === "granted" ? "delivered" : value === "prompt" ? "pending" : "failed"} />
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updatePermissionsStatus({
                      [permissionKey]: value === "granted" ? "prompt" : "granted",
                    } as Partial<typeof permissionsStatus>)
                  }
                >
                  {value === "granted" ? "Reset" : "Enable"}
                </Button>
              </div>
            </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

export default SettingsModule;
