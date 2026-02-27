import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import {
  ActivityThread,
  CommentComposer,
  EmptyStateCard,
  MapPreviewCard,
  SectionTitle,
} from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const checklistItems = [
  "Dispatch team confirmed",
  "Site safety assessed",
  "Beneficiary count updated",
  "Resource usage logged",
  "Authority notified",
];

const NgoCaseDetailPage = () => {
  const { caseId = "" } = useParams();
  const navigate = useNavigate();
  const { incidents, timeline, addIncidentUpdate, updateIncidentStatus, createSupportRequest } = useSosApp();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [completionNote, setCompletionNote] = useState("");

  const incident = incidents.find((entry) => entry.id === caseId);
  const thread = useMemo(() => timeline.filter((entry) => entry.incidentId === caseId), [caseId, timeline]);

  if (!incident) {
    return (
      <div className="space-y-4">
        <SectionTitle title="Case Detail" subtitle="Case unavailable" />
        <EmptyStateCard
          title="Case not found"
          description="The selected case does not exist in current assignment scope."
          action={<Button onClick={() => navigate("/ngo/requests")}>Back to requests</Button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionTitle title={`Case ${incident.id}`} subtitle="Execution checklist, timeline, and completion report" />

      <Card className="rounded-2xl border-slate-200">
        <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Priority</p>
            <AlertBadge priority={incident.priority} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <StatusBadge status={incident.status} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="text-sm text-slate-700">{incident.location.area}, {incident.location.district}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Assigned scope</p>
            <p className="text-sm text-slate-700">{incident.category}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Authority Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{incident.description}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Timeline of actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityThread entries={thread} />
            </CardContent>
          </Card>

          <CommentComposer
            placeholder="Post NGO status update, attach outcome details"
            onSubmit={(value) => {
              addIncidentUpdate(incident.id, value);
              toast.success("Status update posted");
            }}
            buttonLabel="Publish update"
          />

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Upload proof / media</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="inline-flex cursor-pointer rounded-full border border-slate-300 px-3 py-1.5 text-sm">
                Upload photo/doc
                <input
                  type="file"
                  className="hidden"
                  onChange={() => toast.success("Attachment queued in UI mode")}
                />
              </label>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <MapPreviewCard points={[{ label: incident.location.area, top: "42%", left: "48%", priority: incident.priority }]} />

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Task checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {checklistItems.map((item) => (
                <label key={item} className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-50">
                  <Checkbox
                    checked={checked[item] || false}
                    onCheckedChange={(value) => setChecked((prev) => ({ ...prev, [item]: Boolean(value) }))}
                  />
                  <span className="text-sm text-slate-700">{item}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Request support / escalation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  createSupportRequest({
                    incidentId: incident.id,
                    requestedByNgoId: "ngo-01",
                    type: "medical-kits",
                    note: "Need extra medical kits for ongoing response.",
                  });
                  toast.success("Support request submitted");
                }}
              >
                Request medical kits
              </Button>
              <Button variant="outline" className="w-full rounded-full" onClick={() => toast.success("Escalation sent to authority")}>Escalate case</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">Mark completed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Completion summary</Label>
              <Textarea value={completionNote} onChange={(event) => setCompletionNote(event.target.value)} className="min-h-24" />
              <Button
                className="w-full rounded-full"
                onClick={() => {
                  const result = updateIncidentStatus(incident.id, "resolved", completionNote || "NGO marked case complete");
                  if (!result.success) {
                    toast.error(result.message);
                    return;
                  }
                  toast.success("Case marked completed");
                }}
              >
                Submit completion report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NgoCaseDetailPage;
