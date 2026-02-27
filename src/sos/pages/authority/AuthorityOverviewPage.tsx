import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ConfirmationDialog,
  EmptyStateCard,
  ErrorStateCard,
  FilterToolbar,
  SearchInput,
  SectionTitle,
  SkeletonBlock,
  StatCardCompact,
} from "@/sos/components/common";
import { ComposerCard, FeedTabs, IncidentListItem } from "@/sos/components/feed";
import { useSosApp } from "@/sos/context/SosAppContext";
import { incidentStatusTransitionMap, IncidentStatus } from "@/sos/models";

const tabs = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "open", label: "Open" },
  { value: "assigned", label: "Assigned" },
  { value: "in-progress", label: "In Progress" },
];

const incidentSchema = z.object({
  title: z.string().min(4, "Title is required"),
  description: z.string().min(10, "Description is required"),
  area: z.string().min(2, "Area is required"),
  district: z.string().min(2, "District is required"),
  city: z.string().min(2, "City is required"),
  category: z.enum(["medical", "fire", "disaster", "women-safety", "child-help", "food-support", "rescue", "shelter"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
});

const AuthorityOverviewPage = () => {
  const navigate = useNavigate();
  const { incidents, ngos, updateIncidentStatus, addIncidentUpdate, createIncident } = useSosApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "priority" | "sla">("latest");
  const [visibleCount, setVisibleCount] = useState(6);
  const [pendingTransition, setPendingTransition] = useState<{ incidentId: string; nextStatus: IncidentStatus } | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerAction, setComposerAction] = useState("");
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    area: "",
    district: "",
    city: "",
    category: "medical",
    priority: "high",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setError(false);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((incident) => {
        if (activeTab === "critical") return incident.priority === "critical";
        if (activeTab === "all") return true;
        return incident.status === activeTab;
      })
      .filter((incident) => {
        const q = query.toLowerCase().trim();
        if (!q) return true;
        return (
          incident.id.toLowerCase().includes(q) ||
          incident.title.toLowerCase().includes(q) ||
          incident.location.area.toLowerCase().includes(q) ||
          incident.location.district.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "latest") return +new Date(b.updatedAt) - +new Date(a.updatedAt);
        if (sortBy === "oldest") return +new Date(a.updatedAt) - +new Date(b.updatedAt);
        if (sortBy === "sla") return a.slaMinutes - b.slaMinutes;
        const rank = { critical: 0, high: 1, medium: 2, low: 3 };
        return rank[a.priority] - rank[b.priority];
      });
  }, [activeTab, incidents, query, sortBy]);

  const visibleIncidents = filteredIncidents.slice(0, visibleCount);

  const summary = useMemo(() => {
    const open = incidents.filter((incident) => ["open", "verified", "assigned", "in-progress"].includes(incident.status)).length;
    const critical = incidents.filter((incident) => incident.priority === "critical" && incident.status !== "closed").length;
    const assigned = incidents.filter((incident) => incident.status === "assigned").length;
    const avgResponse = Math.round(incidents.reduce((sum, incident) => sum + incident.etaMinutes, 0) / incidents.length);
    const activeNgos = ngos.filter((ngo) => ngo.availability !== "offline").length;
    const pendingVerifications = incidents.filter((incident) => incident.verificationStatus === "pending").length;
    return { open, critical, assigned, avgResponse, activeNgos, pendingVerifications };
  }, [incidents, ngos]);

  const tabCounts = tabs.map((tab) => {
    if (tab.value === "all") return { ...tab, count: incidents.length };
    if (tab.value === "critical") {
      return { ...tab, count: incidents.filter((incident) => incident.priority === "critical").length };
    }
    return { ...tab, count: incidents.filter((incident) => incident.status === tab.value).length };
  });

  const handleCardAction = (incidentId: string, action: string) => {
    if (action === "Add Note" || action === "Open timeline") {
      addIncidentUpdate(incidentId, `${action} logged by authority dashboard.`);
      toast.success("Timeline updated");
      return;
    }

    if (action === "Share to command channel") {
      toast.success("Shared to command channel");
      return;
    }

    const incident = incidents.find((entry) => entry.id === incidentId);
    if (!incident) return;

    const actionMap: Record<string, IncidentStatus> = {
      Verify: "verified",
      "Mark In Progress": "in-progress",
      Resolve: "resolved",
      Escalate: "assigned",
      "Assign NGO": "assigned",
    };

    const nextStatus = actionMap[action];
    if (!nextStatus) {
      toast.info(`${action} executed`);
      return;
    }

    if (!incidentStatusTransitionMap[incident.status].includes(nextStatus)) {
      toast.error(`Cannot move from ${incident.status} to ${nextStatus}`);
      return;
    }

    setPendingTransition({ incidentId, nextStatus });
  };

  const confirmTransition = () => {
    if (!pendingTransition) return;
    const result = updateIncidentStatus(
      pendingTransition.incidentId,
      pendingTransition.nextStatus,
      `Status changed to ${pendingTransition.nextStatus} from dashboard feed action.`,
    );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setPendingTransition(null);
  };

  const submitComposer = () => {
    const parsed = incidentSchema.safeParse(formValues);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    const incident = createIncident({
      title: formValues.title,
      description: formValues.description,
      category: parsed.data.category,
      priority: parsed.data.priority,
      source: "officer",
      location: {
        area: formValues.area,
        district: formValues.district,
        city: formValues.city,
        lat: 38.88,
        lng: -77.02,
      },
    });

    addIncidentUpdate(incident.id, `${composerAction} initiated.`);
    toast.success(`${composerAction} submitted`, { description: `${incident.id} created successfully.` });
    setComposerOpen(false);
    setFormValues({
      title: "",
      description: "",
      area: "",
      district: "",
      city: "",
      category: "medical",
      priority: "high",
    });
    setErrors({});
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <SectionTitle
        title="Authority Dashboard Overview"
        subtitle="Incident command feed with verification, assignment, and escalation actions"
      />

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        <StatCardCompact label="Open Incidents" value={String(summary.open)} />
        <StatCardCompact label="Critical" value={String(summary.critical)} tone="critical" meta="Needs immediate attention" />
        <StatCardCompact label="Assigned" value={String(summary.assigned)} />
        <StatCardCompact label="Avg Response" value={`${summary.avgResponse}m`} />
        <StatCardCompact label="Active NGOs" value={String(summary.activeNgos)} tone="success" />
        <StatCardCompact label="Pending Verify" value={String(summary.pendingVerifications)} />
      </div>

      <ComposerCard
        title="Quick Actions"
        actions={[
          "Create Emergency Broadcast",
          "Create Incident Manually",
          "Assign Request",
          "Post Advisory Update",
          "Request NGO Support",
        ]}
        compact
        onActionClick={(action) => {
          setComposerAction(action);
          setComposerOpen(true);
        }}
      />

      <FilterToolbar className="gap-2.5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search incident ID, area, district"
          className="w-full bg-white md:w-[300px]"
        />
        <FeedTabs tabs={tabCounts} value={activeTab} onValueChange={setActiveTab} compact />
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="h-9 w-full rounded-xl border-slate-200 bg-white sm:ml-auto sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest updated</SelectItem>
            <SelectItem value="oldest">Oldest updated</SelectItem>
            <SelectItem value="priority">Priority first</SelectItem>
            <SelectItem value="sla">Shortest SLA</SelectItem>
          </SelectContent>
        </Select>
      </FilterToolbar>

      {loading ? <SkeletonBlock rows={5} /> : null}
      {!loading && error ? <ErrorStateCard onRetry={() => setError(false)} /> : null}

      {!loading && !error ? (
        <div className="space-y-3">
          {visibleIncidents.length ? (
            <div className="space-y-2.5">
              {visibleIncidents.map((incident) => (
                <IncidentListItem
                  key={incident.id}
                  incident={incident}
                  role="authority"
                  onAction={(action) => handleCardAction(incident.id, action)}
                  onViewCase={() => navigate(`/authority/requests/${incident.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyStateCard
              title="No incidents found"
              description="Adjust filters or clear search to view incidents."
            />
          )}

          {visibleCount < filteredIncidents.length ? (
            <div className="flex justify-center">
              <Button variant="secondary" className="rounded-full bg-slate-100 text-slate-700" onClick={() => setVisibleCount((prev) => prev + 4)}>
                Load more updates
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <ConfirmationDialog
        open={!!pendingTransition}
        onOpenChange={(open) => {
          if (!open) setPendingTransition(null);
        }}
        title="Confirm status transition"
        description={`Move incident ${pendingTransition?.incidentId || ""} to ${pendingTransition?.nextStatus || ""}?`}
        onConfirm={confirmTransition}
        confirmLabel="Confirm transition"
      />

      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>{composerAction || "Create action"}</DialogTitle>
            <DialogDescription>Provide incident and location details.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <Label>Title</Label>
              <Input
                value={formValues.title}
                onChange={(event) => setFormValues((prev) => ({ ...prev, title: event.target.value }))}
              />
              {errors.title ? <p className="text-xs text-red-600">{errors.title}</p> : null}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formValues.description}
                onChange={(event) => setFormValues((prev) => ({ ...prev, description: event.target.value }))}
              />
              {errors.description ? <p className="text-xs text-red-600">{errors.description}</p> : null}
            </div>

            <div className="space-y-1">
              <Label>Area</Label>
              <Input value={formValues.area} onChange={(event) => setFormValues((prev) => ({ ...prev, area: event.target.value }))} />
              {errors.area ? <p className="text-xs text-red-600">{errors.area}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>District</Label>
              <Input
                value={formValues.district}
                onChange={(event) => setFormValues((prev) => ({ ...prev, district: event.target.value }))}
              />
              {errors.district ? <p className="text-xs text-red-600">{errors.district}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input value={formValues.city} onChange={(event) => setFormValues((prev) => ({ ...prev, city: event.target.value }))} />
              {errors.city ? <p className="text-xs text-red-600">{errors.city}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={formValues.category}
                onValueChange={(value) => setFormValues((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="disaster">Disaster</SelectItem>
                  <SelectItem value="women-safety">Women Safety</SelectItem>
                  <SelectItem value="child-help">Child Help</SelectItem>
                  <SelectItem value="food-support">Food Support</SelectItem>
                  <SelectItem value="rescue">Rescue</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={formValues.priority}
                onValueChange={(value) => setFormValues((prev) => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setComposerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitComposer}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthorityOverviewPage;
