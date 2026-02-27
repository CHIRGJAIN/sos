import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { EmptyStateCard, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const NgoTasksPage = () => {
  const { incidents, updateIncidentStatus, addIncidentUpdate } = useSosApp();
  const tasks = incidents.filter((incident) => incident.assignedNgoIds.length > 0);

  return (
    <div className="space-y-4">
      <SectionTitle title="Assigned Tasks" subtitle="Operational tasks allocated to NGO teams with quick updates" />

      <div className="grid gap-3 lg:grid-cols-2">
        {tasks.length ? (
          tasks.map((task) => (
            <Card key={task.id} className="rounded-2xl border-slate-200">
              <CardHeader>
                <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                  <span>{task.id} - {task.title}</span>
                  <div className="flex gap-2">
                    <AlertBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>{task.description}</p>
                <div className="grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
                  <span>Area: {task.location.area}</span>
                  <span>District: {task.location.district}</span>
                  <span>ETA: {task.etaMinutes} mins</span>
                  <span>SLA: {task.slaMinutes} mins</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      const result = updateIncidentStatus(task.id, "in-progress", "Task acknowledged by NGO team.");
                      if (!result.success) {
                        toast.error(result.message);
                        return;
                      }
                      toast.success(result.message);
                    }}
                  >
                    Start Task
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      const result = updateIncidentStatus(task.id, "resolved", "Task marked complete by NGO.");
                      if (!result.success) {
                        toast.error(result.message);
                        return;
                      }
                      toast.success(result.message);
                    }}
                  >
                    Mark Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => {
                      addIncidentUpdate(task.id, "NGO requested clarification from authority.");
                      toast.success("Update posted to timeline.");
                    }}
                  >
                    Request Clarification
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="lg:col-span-2">
            <EmptyStateCard title="No tasks assigned" description="Authority assignments will show up here." />
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoTasksPage;

