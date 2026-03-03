import { useState } from "react";
import { MapPin, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ActionBar from "@/web/components/ActionBar";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import { useSosWeb } from "@/web/context/SosWebContext";
import { MediaAttachmentType } from "@/web/types";

const spectatorTypes = ["injury", "harassment", "accident", "fire", "medical", "other"] as const;

const SpectatorAssistModule: React.FC = () => {
  const { createSpectatorIncident } = useSosWeb();
  const [alertType, setAlertType] = useState<(typeof spectatorTypes)[number]>("injury");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [attachments, setAttachments] = useState<MediaAttachmentType[]>([]);

  const toggleAttachment = (type: MediaAttachmentType) => {
    setAttachments((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]));
  };

  const submit = () => {
    if (!details.trim()) return;
    createSpectatorIncident({
      type: alertType,
      details,
      location,
      attachments,
    });
    setAlertType("injury");
    setLocation("");
    setDetails("");
    setAttachments([]);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Rapid Assist"
        title="Spectator Assist"
        subtitle="Fast reporting flow for someone else in immediate danger."
      />

      <SectionCard title="What happened?" subtitle="Start with the incident type. Add more details only if safe.">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {spectatorTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAlertType(type)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                  alertType === type
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-white/70 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-950">Location</p>
                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-3">
                  <MapPin className="h-4 w-4 text-[#007AFF]" />
                  <Input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Nearest landmark / area / district"
                    className="border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-950">Details</p>
                <Textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  rows={6}
                  className="mt-3 bg-white"
                  placeholder="What is happening right now? Keep it short and factual."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-950">Media</p>
                <div className="mt-3 grid gap-2">
                  {(["photo", "video", "voice"] as MediaAttachmentType[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={attachments.includes(type) ? "default" : "outline"}
                      className="justify-start rounded-2xl"
                      onClick={() => toggleAttachment(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                This creates a <span className="font-semibold">Spectator Alert</span> in incident history. Share only what
                you can safely verify.
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <ActionBar className="justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ShieldAlert className="h-4 w-4 text-[#FF3B30]" />
          Minimal first, expandable details after.
        </div>
        <Button
          className="rounded-full bg-[linear-gradient(145deg,#FF3B30_0%,#FF9500_100%)] px-5 hover:opacity-95"
          disabled={!details.trim()}
          onClick={submit}
        >
          Submit spectator alert
        </Button>
      </ActionBar>
    </div>
  );
};

export default SpectatorAssistModule;
