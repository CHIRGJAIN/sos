import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const nextStatusMap = {
  requested: "acknowledged",
  acknowledged: "approved",
  approved: "dispatched",
  dispatched: "received",
  received: "received",
} as const;

const AuthorityResourceRequestsPage = () => {
  const { supportRequests, updateSupportRequestStatus } = useSosApp();

  return (
    <div className="space-y-4">
      <SectionTitle title="Resource Requests" subtitle="Review, approve, and dispatch support demands from NGO teams" />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {supportRequests.map((request) => {
          const nextStatus = nextStatusMap[request.status];
          return (
            <Card key={request.id} className="rounded-2xl border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-base">
                  <span>{request.incidentId}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                    {request.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>Request type: {request.type}</p>
                <p>NGO ID: {request.requestedByNgoId}</p>
                <p className="text-xs text-slate-500">{request.note}</p>
                <p className="text-xs text-slate-500">Created: {formatDateTime(request.createdAt)}</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={request.status === "received"}
                    onClick={() => {
                      updateSupportRequestStatus(request.id, nextStatus);
                      toast.success(`${request.id} moved to ${nextStatus}`);
                    }}
                  >
                    Move to {nextStatus}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full">Open Case</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AuthorityResourceRequestsPage;

