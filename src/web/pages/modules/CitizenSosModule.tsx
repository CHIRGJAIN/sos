import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Camera, Clock3, MapPin, Mic, PhoneCall, Siren, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ActionBar from "@/web/components/ActionBar";
import ConfirmationDialog from "@/web/components/ConfirmationDialog";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import StatusBadge from "@/web/components/StatusBadge";
import TimelineList from "@/web/components/TimelineList";
import { useSosWeb } from "@/web/context/SosWebContext";
import { MediaAttachmentType } from "@/web/types";

const channelLabelMap: Record<string, string> = {
  sms: "SMS",
  push: "Push",
  voice: "Voice",
  app: "Push",
  call: "Voice",
};

const CitizenSosModule: React.FC = () => {
  const {
    sosStage,
    sosCountdown,
    settings,
    updateSettings,
    activeIncident,
    timeline,
    beginSosHold,
    cancelSosFlow,
    resolveIncident,
    escalateIncident,
    retryNotification,
    addIncidentEvidence,
  } = useSosWeb();
  const [elapsedTick, setElapsedTick] = useState(Date.now());
  const [confirmSafe, setConfirmSafe] = useState(false);

  useEffect(() => {
    if (!activeIncident) return;
    const timer = window.setInterval(() => setElapsedTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [activeIncident]);

  const incidentEvents = useMemo(() => {
    return activeIncident ? timeline.filter((event) => event.incidentId === activeIncident.id).slice(0, 10) : [];
  }, [activeIncident, timeline]);

  const ringProgress = sosStage === "arming" ? 0.35 : sosStage === "countdown" ? 0.72 : sosStage === "active" ? 1 : 0.12;

  const handleEvidence = (type: MediaAttachmentType) => {
    if (!activeIncident) return;
    addIncidentEvidence(activeIncident.id, type);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Emergency Action"
        title="SOS Activation"
        subtitle="High-attention operational UI with live countdown and active incident controls."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <SectionCard title="Activation Console" subtitle="Focused emergency flow, optimized for speed.">
            <div className="space-y-5">
              <div className="rounded-[30px] bg-[linear-gradient(145deg,#fff1ef_0%,#fff7ef_42%,#ffffff_100%)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Current state</p>
                    <p className="mt-1 text-base font-semibold text-slate-950">
                      {sosStage === "idle" ? "Idle" : sosStage === "arming" ? "Arming" : sosStage === "countdown" ? "Countdown" : "Activated"}
                    </p>
                  </div>
                  <StatusBadge status={sosStage === "active" ? "tracking-active" : "pending"} />
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onMouseDown={beginSosHold}
                    onMouseUp={() => {
                      if (["arming", "countdown"].includes(sosStage)) cancelSosFlow();
                    }}
                    onMouseLeave={() => {
                      if (["arming", "countdown"].includes(sosStage)) cancelSosFlow();
                    }}
                    onTouchStart={beginSosHold}
                    onTouchEnd={() => {
                      if (["arming", "countdown"].includes(sosStage)) cancelSosFlow();
                    }}
                    className="relative flex h-64 w-64 items-center justify-center rounded-full"
                  >
                    <span
                      className="absolute inset-0 rounded-full border-[14px] border-red-100"
                      style={{
                        background: `conic-gradient(#FF3B30 ${ringProgress * 360}deg, rgba(255,59,48,0.08) 0deg)`,
                      }}
                    />
                    <span className="absolute h-52 w-52 rounded-full bg-white/85" />
                    <span className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[linear-gradient(145deg,#FF3B30_0%,#FF9500_100%)] text-white shadow-[0_20px_48px_rgba(255,59,48,0.28)]">
                      <span className="text-[40px] font-semibold leading-none">
                        {sosStage === "countdown" ? sosCountdown : activeIncident ? "LIVE" : "SOS"}
                      </span>
                      <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em]">
                        {sosStage === "countdown" ? "seconds" : "hold to arm"}
                      </span>
                    </span>
                  </button>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <label className="flex items-center justify-between rounded-2xl border border-white/70 bg-white px-3 py-3 text-sm">
                    <span>Silent Mode</span>
                    <Switch checked={settings.silentMode} onCheckedChange={(checked) => updateSettings({ silentMode: checked })} />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-white/70 bg-white px-3 py-3 text-sm">
                    <span>Fake Call</span>
                    <Switch
                      checked={settings.fakeCallShortcut}
                      onCheckedChange={(checked) => updateSettings({ fakeCallShortcut: checked })}
                    />
                  </label>
                </div>

                <div className="mt-4 rounded-2xl border border-white/70 bg-white px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-700">Countdown</span>
                    <span className="text-sm font-semibold text-slate-950">{settings.countdownSeconds}s</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    value={settings.countdownSeconds}
                    onChange={(event) => updateSettings({ countdownSeconds: Number(event.target.value) })}
                    className="mt-3 w-full accent-[#FF3B30]"
                  />
                </div>
              </div>

              <ActionBar className="justify-between">
                <Button variant="outline" className="rounded-full" onClick={cancelSosFlow}>
                  Cancel
                </Button>
                <Button
                  className="rounded-full bg-[linear-gradient(145deg,#FF3B30_0%,#FF9500_100%)] px-5 hover:opacity-95"
                  onClick={beginSosHold}
                >
                  Confirm / Arm SOS
                </Button>
              </ActionBar>
            </div>
          </SectionCard>

          {activeIncident ? (
            <SectionCard title="Active Incident" subtitle="Case timeline and operational controls.">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <div className="rounded-[24px] bg-slate-50/90 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-950">{activeIncident.id}</p>
                      <StatusBadge status={activeIncident.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-[#007AFF]" />
                        <span key={elapsedTick}>
                          {formatDistanceToNowStrict(new Date(activeIncident.createdAt), { addSuffix: false })}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#007AFF]" />
                        {activeIncident.location.address}
                      </span>
                    </div>
                  </div>

                  <SectionCard title="Timeline" className="border-slate-100 bg-slate-50/50 shadow-none">
                    {incidentEvents.length ? (
                      <TimelineList events={incidentEvents} />
                    ) : (
                      <div className="rounded-2xl bg-white px-3 py-4 text-sm text-slate-500">No live events yet.</div>
                    )}
                  </SectionCard>

                  <SectionCard title="Media evidence" className="border-slate-100 bg-slate-50/50 shadow-none">
                    <div className="grid gap-2 sm:grid-cols-3">
                      <Button variant="outline" className="justify-start rounded-2xl" onClick={() => handleEvidence("photo")}>
                        <Camera className="mr-2 h-4 w-4" />
                        Photo
                      </Button>
                      <Button variant="outline" className="justify-start rounded-2xl" onClick={() => handleEvidence("video")}>
                        <Video className="mr-2 h-4 w-4" />
                        Video
                      </Button>
                      <Button variant="outline" className="justify-start rounded-2xl" onClick={() => handleEvidence("voice")}>
                        <Mic className="mr-2 h-4 w-4" />
                        Voice
                      </Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {activeIncident.attachments.slice(0, 4).map((attachment) => (
                        <div key={attachment.id} className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-600">
                          <span className="font-semibold uppercase text-slate-900">{attachment.type}</span> · {attachment.label}
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>

                <div className="space-y-4">
                  <SectionCard title="Contact summary" className="border-slate-100 bg-slate-50/50 shadow-none">
                    <div className="space-y-2">
                      {activeIncident.notifiedContacts.map((status) => (
                        <div key={status.id} className="rounded-2xl bg-white px-3 py-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{status.contactName}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">
                                {channelLabelMap[status.channel] || status.channel}
                              </p>
                            </div>
                            <StatusBadge status={status.status} />
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
                            <span>{status.updatedAt ? new Date(status.updatedAt).toLocaleTimeString() : "Pending"}</span>
                            <Button variant="outline" size="sm" className="rounded-full" onClick={() => retryNotification(status.id)}>
                              Retry
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Incident metadata" className="border-slate-100 bg-slate-50/50 shadow-none">
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="rounded-2xl bg-white px-3 py-2">Type: {activeIncident.type}</div>
                      <div className="rounded-2xl bg-white px-3 py-2">Mode: {activeIncident.silentMode ? "Silent" : "Standard"}</div>
                      <div className="rounded-2xl bg-white px-3 py-2">Countdown: {activeIncident.countdownSeconds || settings.countdownSeconds}s</div>
                    </div>
                  </SectionCard>
                </div>
              </div>
            </SectionCard>
          ) : null}
        </div>

        <div className="space-y-4">
          <SectionCard title="Actions" subtitle="Clear emergency outcomes and escalation paths.">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start rounded-2xl"
                disabled={!activeIncident}
                onClick={() => activeIncident && escalateIncident(activeIncident.id)}
              >
                <Siren className="mr-2 h-4 w-4" />
                Escalate to authorities
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-2xl" disabled={!activeIncident}>
                <PhoneCall className="mr-2 h-4 w-4" />
                Trigger fake call
              </Button>
              <Button
                className="w-full rounded-2xl bg-[#34C759] hover:bg-[#2fad4e]"
                disabled={!activeIncident}
                onClick={() => setConfirmSafe(true)}
              >
                I’m Safe
              </Button>
            </div>
          </SectionCard>

          <SectionCard title="Escalation guidance" subtitle="Nearby support and next-step guidance.">
            <div className="space-y-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">Nearest police support: district control room</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">Nearest medical support: trauma-ready unit in radius</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">Keep voice / visual evidence attached when safe</div>
            </div>
          </SectionCard>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmSafe}
        onOpenChange={setConfirmSafe}
        title="Resolve this incident?"
        description="This marks the active incident as safe and moves it into resolved history."
        confirmLabel="Resolve Incident"
        onConfirm={() => {
          if (activeIncident) resolveIncident(activeIncident.id);
          setConfirmSafe(false);
        }}
      />
    </div>
  );
};

export default CitizenSosModule;
