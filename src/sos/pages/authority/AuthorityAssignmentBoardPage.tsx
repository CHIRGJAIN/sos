import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge } from "@/sos/components/badges";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { AssignmentCard } from "@/sos/models";

const columns: Array<{ key: AssignmentCard["column"]; label: string }> = [
  { key: "unassigned", label: "Unassigned" },
  { key: "assigned", label: "Assigned" },
  { key: "acknowledged", label: "Acknowledged" },
  { key: "in-progress", label: "In Progress" },
  { key: "waiting-resource", label: "Waiting Resource" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
];

const nextColumnMap: Record<AssignmentCard["column"], AssignmentCard["column"]> = {
  unassigned: "assigned",
  assigned: "acknowledged",
  acknowledged: "in-progress",
  "in-progress": "resolved",
  "waiting-resource": "in-progress",
  resolved: "closed",
  closed: "closed",
};

const AuthorityAssignmentBoardPage = () => {
  const { assignmentBoard, moveAssignmentCard } = useSosApp();

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Assignment Board"
        subtitle="Kanban-style incident flow across assignment and response stages"
      />

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1280px] grid-cols-7 gap-3">
          {columns.map((column) => {
            const cards = assignmentBoard.filter((card) => card.column === column.key);
            return (
              <Card key={column.key} className="rounded-2xl border-slate-200 bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-700">
                    {column.label} ({cards.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {cards.map((card) => (
                    <div key={card.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800">{card.incidentId}</p>
                        <AlertBadge priority={card.priority} />
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-700">{card.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{card.location}</p>
                      <p className="text-xs text-slate-500">Assigned: {card.assignedTo}</p>
                      <p className="text-xs text-slate-500">ETA {card.etaMinutes}m • {card.updatesCount} updates</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full rounded-full text-xs"
                        disabled={card.column === "closed"}
                        onClick={() => {
                          moveAssignmentCard(card.id, nextColumnMap[card.column]);
                          toast.success(`${card.incidentId} moved to ${nextColumnMap[card.column]}`);
                        }}
                      >
                        Move to next stage
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuthorityAssignmentBoardPage;
