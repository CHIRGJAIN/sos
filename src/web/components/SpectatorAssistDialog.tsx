import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSosWeb } from "@/web/context/SosWebContext";
import { MediaAttachmentType } from "@/web/types";

interface SpectatorAssistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const spectatorTypes = ["injury", "harassment", "accident", "fire", "medical", "other"] as const;

const SpectatorAssistDialog: React.FC<SpectatorAssistDialogProps> = ({ open, onOpenChange }) => {
  const { createSpectatorIncident } = useSosWeb();
  const [alertType, setAlertType] = useState<(typeof spectatorTypes)[number]>("injury");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
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
    setDetails("");
    setLocation("");
    setAttachments([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Spectator Assist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={alertType}
            onChange={(event) => setAlertType(event.target.value as typeof alertType)}
          >
            {spectatorTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <Input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Nearest landmark / location"
          />

          <Textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={5}
            placeholder="What is happening? Share concise details."
          />

          <div className="grid grid-cols-3 gap-2">
            {(["photo", "video", "voice"] as MediaAttachmentType[]).map((type) => (
              <Button
                key={type}
                type="button"
                variant={attachments.includes(type) ? "default" : "outline"}
                onClick={() => toggleAttachment(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!details.trim()}>
              Submit alert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpectatorAssistDialog;
