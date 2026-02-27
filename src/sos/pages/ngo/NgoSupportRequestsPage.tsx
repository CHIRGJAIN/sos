import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const statusFlow: Array<"requested" | "acknowledged" | "approved" | "dispatched" | "received"> = [
  "requested",
  "acknowledged",
  "approved",
  "dispatched",
  "received",
];

const NgoSupportRequestsPage = () => {
  const { supportRequests, createSupportRequest, updateSupportRequestStatus, incidents, session } = useSosApp();
  const [incidentId, setIncidentId] = useState(incidents[0]?.id || "");
  const [type, setType] = useState<"volunteers" | "ambulance" | "food" | "medical-kits" | "transport" | "shelter">("volunteers");
  const [note, setNote] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!incidentId || !note.trim()) {
      toast.error("Incident and note are required.");
      return;
    }
    createSupportRequest({
      incidentId,
      requestedByNgoId: "ngo-01",
      type,
      note: note.trim(),
    });
    toast.success("Support request created");
    setNote("");
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Support Requests" subtitle="Request additional help from authority or partner NGOs" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Create request</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="space-y-1">
                <Label>Incident</Label>
                <Select value={incidentId} onValueChange={setIncidentId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incidents.map((incident) => (
                      <SelectItem key={incident.id} value={incident.id}>{incident.id} - {incident.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Request type</Label>
                <Select value={type} onValueChange={(value) => setType(value as typeof type)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteers">Additional volunteers</SelectItem>
                    <SelectItem value="ambulance">Ambulance</SelectItem>
                    <SelectItem value="food">Food supply</SelectItem>
                    <SelectItem value="medical-kits">Medical kits</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="shelter">Shelter coordination</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Details</Label>
                <Textarea value={note} onChange={(event) => setNote(event.target.value)} className="min-h-24" />
              </div>
              <Button type="submit" className="w-full rounded-full">Submit request</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Status tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {supportRequests.map((request) => (
              <div key={request.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">{request.incidentId} • {request.type}</p>
                <p className="text-xs text-slate-500">{request.note}</p>
                <p className="text-xs text-slate-500">Created {formatDateTime(request.createdAt)} by {session?.organization}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {statusFlow.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={request.status === status ? "default" : "outline"}
                      className="h-7 rounded-full px-2 text-[11px]"
                      onClick={() => {
                        updateSupportRequestStatus(request.id, status);
                        toast.success(`Status changed to ${status}`);
                      }}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NgoSupportRequestsPage;
