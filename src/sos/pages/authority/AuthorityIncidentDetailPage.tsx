import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import {
  ActivityThread,
  AvatarStack,
  CommentComposer,
  DashboardCard,
  EmptyStateCard,
  MapPreviewCard,
  MetadataRow,
  SectionTitle,
} from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { IncidentStatus, incidentStatusTransitionMap } from "@/sos/models";
import { formatDateTime } from "@/sos/utils";

const AuthorityIncidentDetailPage = () => {
  const { incidentId = "" } = useParams();
  const navigate = useNavigate();
  const { incidents, ngos, timeline, addIncidentUpdate, assignNgo, updateIncidentStatus } = useSosApp();

  const [selectedNgo, setSelectedNgo] = useState("");
  const [status, setStatus] = useState<IncidentStatus>("assigned");
  const [actionNote, setActionNote] = useState("");

  const incident = incidents.find((entry) => entry.id === incidentId);
  const incidentTimeline = timeline.filter((entry) => entry.incidentId === incidentId);

  const assignedNgos = useMemo(() => {
    return ngos.filter((ngo) => incident?.assignedNgoIds.includes(ngo.id));
  }, [incident?.assignedNgoIds, ngos]);

  if (!incident) {
    return (
      <div className="space-y-4">
        <SectionTitle title="Incident Detail" subtitle="Case not found" />
        <EmptyStateCard
          title="Incident not found"
          description="The requested case could not be loaded."
          action={<Button onClick={() => navigate("/authority/requests")}>Back to requests</Button>}
        />
      </div>
    );
  }

  const allowedTransitions = incidentStatusTransitionMap[incident.status];

  const submitAction = () => {
    if (!allowedTransitions.includes(status)) {
      toast.error(`Transition not allowed from ${incident.status} to ${status}`);
      return;
    }

    const result = updateIncidentStatus(
      incident.id,
      status,
      actionNote || `Incident ${incident.id} updated to ${status} from detail page.`,
    );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    if (selectedNgo) {
      const assignResult = assignNgo(incident.id, selectedNgo);
      if (!assignResult.success) {
        toast.error(assignResult.message);
      }
    }

    if (actionNote.trim()) {
      addIncidentUpdate(incident.id, actionNote.trim());
      setActionNote("");
    }

    toast.success("Incident workflow updated");
  };

  return (
    <div className="space-y-4">
      <SectionTitle title={`Incident ${incident.id}`} subtitle="Timeline, notes, assignments, and audit actions" />

      <Card className="rounded-2xl border-slate-200">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-slate-500">Severity</p>
            <AlertBadge priority={incident.priority} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <StatusBadge status={incident.status} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="text-sm font-medium text-slate-700">{incident.location.area}, {incident.location.district}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Source</p>
            <p className="text-sm font-medium text-slate-700">{incident.source}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <DashboardCard title="Timeline Feed" description="Chronological operational updates">
            <ActivityThread entries={incidentTimeline} />
          </DashboardCard>

          <CommentComposer
            placeholder="Post inter-department note, mention @ngo, @team"
            onSubmit={(value) => {
              addIncidentUpdate(incident.id, value);
              toast.success("Update posted");
            }}
            buttonLabel="Post note"
          />

          <DashboardCard title="NGO Responses Thread" description="Assigned NGO operations">
            <div className="space-y-2">
              {assignedNgos.length ? (
                assignedNgos.map((ngo) => (
                  <div key={ngo.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">{ngo.name}</p>
                    <p className="text-xs text-slate-500">{ngo.contactPerson} • {ngo.contactPhone}</p>
                    <p className="mt-1 text-xs text-slate-600">Availability: {ngo.availability} • Capacity {ngo.capacity}%</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No NGO assigned.</p>
              )}
            </div>
          </DashboardCard>

          <DashboardCard title="Evidence Gallery" description="Attached media and documents">
            <div className="grid gap-2 sm:grid-cols-3">
              {incident.attachments.map((file, index) => (
                <div key={`${file}-${index}`} className="h-24 rounded-xl border border-slate-200 bg-slate-100" />
              ))}
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-4">
          <DashboardCard title="Action Panel" description="Assign / reassign / escalate / close">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Assign NGO</Label>
                <Select value={selectedNgo} onValueChange={setSelectedNgo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select NGO" />
                  </SelectTrigger>
                  <SelectContent>
                    {ngos.map((ngo) => (
                      <SelectItem key={ngo.id} value={ngo.id}>
                        {ngo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Status transition</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as IncidentStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedTransitions.map((next) => (
                      <SelectItem key={next} value={next}>{next}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Note</Label>
                <Textarea value={actionNote} onChange={(event) => setActionNote(event.target.value)} className="min-h-20" />
              </div>

              <Button className="w-full rounded-full" onClick={submitAction}>
                Apply updates
              </Button>
            </div>
          </DashboardCard>

          <DashboardCard title="SLA Timer">
            <MetadataRow label="SLA target" value={`${incident.slaMinutes} mins`} />
            <MetadataRow label="Current ETA" value={`${incident.etaMinutes} mins`} />
            <MetadataRow label="Last updated" value={formatDateTime(incident.updatedAt)} />
          </DashboardCard>

          <DashboardCard title="Contact Panel">
            <MetadataRow label="Reporter source" value={incident.source} />
            <MetadataRow label="Assigned team" value={incident.assignedTeam} />
            <MetadataRow label="Assigned NGOs" value={<AvatarStack names={assignedNgos.map((ngo) => ngo.name)} />} />
          </DashboardCard>

          <DashboardCard title="Map Preview">
            <MapPreviewCard points={[{ label: incident.location.area, top: "45%", left: "52%", priority: incident.priority }]} />
          </DashboardCard>

          <DashboardCard title="Audit Trail">
            <div className="space-y-2 text-xs text-slate-600">
              {incidentTimeline.slice(0, 5).map((entry) => (
                <div key={entry.id}>
                  <p className="font-medium text-slate-700">{entry.actor}</p>
                  <p>{entry.content}</p>
                  <p className="text-slate-400">{formatDateTime(entry.createdAt)}</p>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default AuthorityIncidentDetailPage;

