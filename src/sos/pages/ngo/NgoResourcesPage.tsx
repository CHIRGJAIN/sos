import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { clampPercent, formatDateTime } from "@/sos/utils";

const schema = z.object({
  available: z.coerce.number().int().min(0),
  reserved: z.coerce.number().int().min(0),
});

const NgoResourcesPage = () => {
  const { resources, updateResourceItem } = useSosApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [available, setAvailable] = useState("0");
  const [reserved, setReserved] = useState("0");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedResource = useMemo(
    () => resources.find((resource) => resource.id === selectedId),
    [resources, selectedId],
  );

  const openEditor = (id: string) => {
    const resource = resources.find((entry) => entry.id === id);
    if (!resource) return;
    setSelectedId(id);
    setAvailable(String(resource.available));
    setReserved(String(resource.reserved));
    setErrors({});
    setDialogOpen(true);
  };

  const submit = () => {
    const parsed = schema.safeParse({ available, reserved });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    const result = updateResourceItem(selectedId, parsed.data.available, parsed.data.reserved);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Resources & Inventory" subtitle="Stock levels, reservations, and low-stock warnings" />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => {
          const total = resource.available + resource.reserved;
          const level = clampPercent((resource.available / Math.max(total, 1)) * 100);
          const low = resource.available <= resource.minThreshold;

          return (
            <Card key={resource.id} className={`rounded-2xl border ${low ? "border-amber-200 bg-amber-50" : "border-slate-200"}`}>
              <CardHeader>
                <CardTitle className="text-base">{resource.resource}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-slate-600">Available: {resource.available} {resource.unit}</p>
                <p className="text-sm text-slate-500">Reserved: {resource.reserved} {resource.unit}</p>
                <Progress value={level} className="h-2" />
                <p className="text-xs text-slate-500">Threshold: {resource.minThreshold} {resource.unit}</p>
                <p className="text-xs text-slate-400">Updated: {formatDateTime(resource.updatedAt)}</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="rounded-full" onClick={() => openEditor(resource.id)}>
                    Add / Update
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success(`Reserved ${resource.resource} for case`)}>
                    Reserve for case
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Resource usage history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          {resources.map((resource) => (
            <div key={`${resource.id}-history`} className="rounded-xl border border-slate-200 bg-slate-50 p-2">
              <p className="font-medium text-slate-700">{resource.resource}</p>
              <p>Reserved {resource.reserved} {resource.unit}, available {resource.available} {resource.unit}</p>
              <p className="text-xs text-slate-400">Last update {formatDateTime(resource.updatedAt)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update inventory item</DialogTitle>
            <DialogDescription>{selectedResource?.resource}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Available</Label>
              <Input value={available} onChange={(event) => setAvailable(event.target.value)} />
              {errors.available ? <p className="text-xs text-red-600">{errors.available}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>Reserved</Label>
              <Input value={reserved} onChange={(event) => setReserved(event.target.value)} />
              {errors.reserved ? <p className="text-xs text-red-600">{errors.reserved}</p> : null}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NgoResourcesPage;
