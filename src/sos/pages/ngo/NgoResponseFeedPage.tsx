import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertBadge } from "@/sos/components/badges";
import { FeedCard } from "@/sos/components/feed";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const NgoResponseFeedPage = () => {
  const navigate = useNavigate();
  const { incidents, broadcasts, resources, addIncidentUpdate } = useSosApp();
  const assigned = incidents.filter((incident) => incident.assignedNgoIds.length > 0).slice(0, 6);
  const lowStock = resources.filter((resource) => resource.available <= resource.minThreshold).slice(0, 3);

  return (
    <div className="space-y-4">
      <SectionTitle title="Response Feed" subtitle="Cases, authority alerts, team updates, and inventory signals" />

      <div className="space-y-3">
        {assigned.map((incident) => (
          <FeedCard
            key={incident.id}
            incident={incident}
            role="ngo"
            onAction={(action) => {
              addIncidentUpdate(incident.id, `NGO action from response feed: ${action}`);
              toast.success(`${action} saved`);
            }}
            onViewCase={() => navigate(`/ngo/requests/${incident.id}`)}
          />
        ))}

        {broadcasts.map((broadcast) => (
          <Card key={broadcast.id} className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Authority Broadcast: {broadcast.title}</span>
                <AlertBadge priority={broadcast.severity} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{broadcast.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" className="rounded-full">Acknowledge</Button>
                <Button size="sm" variant="outline" className="rounded-full">Dispatch</Button>
                <Button size="sm" variant="outline" className="rounded-full">Request backup</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {lowStock.map((resource) => (
          <Card key={resource.id} className="rounded-2xl border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-amber-700">Inventory Alert: {resource.resource}</p>
                <AlertBadge priority="medium" />
              </div>
              <p className="mt-1 text-sm text-amber-700">
                Available {resource.available} {resource.unit} - Min threshold {resource.minThreshold}
              </p>
              <Button size="sm" className="mt-2 rounded-full">Request refill</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NgoResponseFeedPage;

