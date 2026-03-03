import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FilterChips from "@/web/components/FilterChips";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import StatusBadge from "@/web/components/StatusBadge";
import TimelineList from "@/web/components/TimelineList";
import { useSosWeb } from "@/web/context/SosWebContext";
import { IncidentRecord, IncidentStatus } from "@/web/types";

type AuthorityView = "dashboard" | "queue" | "analytics" | "broadcast" | "verification";

interface AuthorityDashboardModuleProps {
  mode?: AuthorityView;
}

const getQueueFilter = (incident: IncidentRecord, filter: string) => {
  if (filter === "all") return true;
  if (filter === "new") return ["alert-sent", "waiting-response"].includes(incident.status);
  if (filter === "urgent") return incident.urgencyFlag || incident.severity === "critical";
  if (filter === "assigned") return ["accepted", "en-route", "on-scene"].includes(incident.status);
  if (filter === "resolved") return incident.status === "resolved";
  return true;
};

const formatRelativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / (1000 * 60)));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

const AuthorityDashboardModule: React.FC<AuthorityDashboardModuleProps> = ({ mode = "dashboard" }) => {
  const { incidents, timeline, updateIncidentStatus } = useSosWeb();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("new");
  const [selectedId, setSelectedId] = useState<string | null>(incidents[0]?.id || null);
  const [broadcastScope, setBroadcastScope] = useState<"citywide" | "district" | "targeted">("district");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [recentBroadcasts, setRecentBroadcasts] = useState<
    Array<{ id: string; title: string; audience: string; createdAt: string }>
  >([]);

  const filteredQueue = useMemo(() => {
    return incidents
      .filter((incident) => {
        const filterMatch = getQueueFilter(incident, statusFilter);
        const q = query.toLowerCase().trim();
        const queryMatch =
          !q ||
          `${incident.id} ${incident.title} ${incident.location.address} ${incident.location.district}`
            .toLowerCase()
            .includes(q);
        return filterMatch && queryMatch;
      })
      .sort((a, b) => {
        if (a.urgencyFlag === b.urgencyFlag) return 0;
        return a.urgencyFlag ? -1 : 1;
      });
  }, [incidents, query, statusFilter]);

  const selectedIncident = filteredQueue.find((incident) => incident.id === selectedId) || filteredQueue[0] || null;
  const selectedTimeline = selectedIncident ? timeline.filter((item) => item.incidentId === selectedIncident.id) : [];

  const verificationQueue = useMemo(() => {
    return incidents.filter(
      (incident) =>
        !incident.verificationFlags.authorityVerified ||
        !incident.verificationFlags.evidenceReviewed ||
        incident.attachments.length > 0,
    );
  }, [incidents]);

  const selectedVerification =
    verificationQueue.find((incident) => incident.id === selectedId) || verificationQueue[0] || null;
  const verificationTimeline = selectedVerification
    ? timeline.filter((item) => item.incidentId === selectedVerification.id)
    : [];

  const analyticsSummary = useMemo(() => {
    const severityBuckets = {
      critical: incidents.filter((incident) => incident.severity === "critical").length,
      high: incidents.filter((incident) => incident.severity === "high").length,
      medium: incidents.filter((incident) => incident.severity === "medium").length,
      low: incidents.filter((incident) => incident.severity === "low").length,
    };

    const districtMap = incidents.reduce<Record<string, number>>((acc, incident) => {
      const key = incident.location.district || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const districtLoad = Object.entries(districtMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const liveCases = incidents.filter((incident) => !["resolved", "cancelled"].includes(incident.status));
    const urgentCases = incidents.filter((incident) => incident.urgencyFlag).length;

    return {
      severityBuckets,
      districtLoad,
      liveCases: liveCases.length,
      urgentCases,
      resolvedCases: incidents.filter((incident) => incident.status === "resolved").length,
    };
  }, [incidents]);

  const queueStats = useMemo(() => {
    return {
      total: incidents.length,
      urgent: incidents.filter((incident) => incident.urgencyFlag).length,
      assigned: incidents.filter((incident) => ["accepted", "en-route", "on-scene"].includes(incident.status)).length,
      resolved: incidents.filter((incident) => incident.status === "resolved").length,
    };
  }, [incidents]);

  const setStatus = (status: IncidentStatus) => {
    if (!selectedIncident) return;
    updateIncidentStatus(selectedIncident.id, status);
  };

  const markVerificationComplete = () => {
    if (!selectedVerification) return;
    updateIncidentStatus(selectedVerification.id, selectedVerification.status === "waiting-response" ? "accepted" : selectedVerification.status);
  };

  const sendBroadcast = () => {
    const message = broadcastMessage.trim();
    if (!message) return;

    setRecentBroadcasts((prev) => [
      {
        id: `bc-${Date.now()}`,
        title: message,
        audience: broadcastScope,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setBroadcastMessage("");
  };

  const renderQueueWorkspace = (showOverview: boolean) => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Authority Operations"
        title={showOverview ? "Control Room" : "Case Queue"}
        subtitle={
          showOverview
            ? "Live triage overview with queue movement and case detail."
            : "Dedicated queue management for new, urgent, assigned, and resolved cases."
        }
      />

      {showOverview ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total cases", value: queueStats.total, tone: "text-slate-950" },
            { label: "Urgent", value: queueStats.urgent, tone: "text-[#FF3B30]" },
            { label: "Assigned", value: queueStats.assigned, tone: "text-[#007AFF]" },
            { label: "Resolved", value: queueStats.resolved, tone: "text-emerald-600" },
          ].map((item) => (
            <SectionCard key={item.label} title={item.label}>
              <p className={`text-3xl font-semibold ${item.tone}`}>{item.value}</p>
            </SectionCard>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <SectionCard title="Case queue" subtitle="Dense authority queue with rapid pivots.">
          <div className="space-y-3">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search case ID, title, location" />
            <FilterChips
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: "new", label: "New" },
                { id: "urgent", label: "Urgent" },
                { id: "assigned", label: "Assigned" },
                { id: "resolved", label: "Resolved" },
                { id: "all", label: "All" },
              ]}
            />
            <div className="overflow-hidden rounded-[24px] border border-slate-100">
              <div className="grid grid-cols-[1.1fr_1fr_1.1fr_0.8fr] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>Case</span>
                <span>Severity</span>
                <span>Location</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredQueue.map((incident) => (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() => setSelectedId(incident.id)}
                    className={`grid w-full grid-cols-[1.1fr_1fr_1.1fr_0.8fr] gap-3 px-4 py-3 text-left text-sm transition ${
                      selectedIncident?.id === incident.id ? "bg-[#007AFF]/5" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">{incident.id}</p>
                      <p className="truncate text-xs text-slate-500">{incident.type}</p>
                    </div>
                    <div className="text-xs text-slate-600">
                      <StatusBadge status={incident.severity} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs text-slate-600">{incident.location.area || incident.location.address}</p>
                    </div>
                    <div className="text-xs text-slate-600">
                      <StatusBadge status={incident.status} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={selectedIncident ? selectedIncident.id : "Case detail"} subtitle="Operational split-view detail.">
            {selectedIncident ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={selectedIncident.status} />
                      <StatusBadge status={selectedIncident.severity} />
                    </div>
                    <p className="mt-3 text-base font-semibold text-slate-950">{selectedIncident.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{selectedIncident.description}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Location</p>
                      <p className="mt-2 font-medium text-slate-900">{selectedIncident.location.address}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Assignee</p>
                      <p className="mt-2 font-medium text-slate-900">{selectedIncident.authorityAssignee?.name || "Unassigned"}</p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-4">
                    <Button size="sm" className="rounded-full" onClick={() => setStatus("accepted")}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus("en-route")}>
                      En Route
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus("on-scene")}>
                      On Scene
                    </Button>
                    <Button size="sm" variant="destructive" className="rounded-full" onClick={() => setStatus("resolved")}>
                      Resolve
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Verification flags</p>
                    <div className="mt-2 space-y-2">
                      <p>Authority verified: {selectedIncident.verificationFlags.authorityVerified ? "Yes" : "No"}</p>
                      <p>NGO linked: {selectedIncident.verificationFlags.ngoLinked ? "Yes" : "No"}</p>
                      <p>Evidence reviewed: {selectedIncident.verificationFlags.evidenceReviewed ? "Yes" : "No"}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Attachments</p>
                    <div className="mt-2 space-y-2">
                      {selectedIncident.attachments.length ? (
                        selectedIncident.attachments.map((attachment) => (
                          <div key={attachment.id} className="rounded-xl bg-white px-3 py-2 text-xs text-slate-600">
                            {attachment.type} / {attachment.label}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500">No attachments</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No case selected.</div>
            )}
          </SectionCard>

          <SectionCard title="Case timeline" subtitle="Live sequence of field and system updates.">
            {selectedTimeline.length ? (
              <TimelineList events={selectedTimeline} />
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No timeline events yet.</div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    const maxSeverity = Math.max(
      analyticsSummary.severityBuckets.critical,
      analyticsSummary.severityBuckets.high,
      analyticsSummary.severityBuckets.medium,
      analyticsSummary.severityBuckets.low,
      1,
    );
    const maxDistrict = Math.max(...analyticsSummary.districtLoad.map((item) => item[1]), 1);

    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow="Authority Operations"
          title="Analytics"
          subtitle="Response load, severity mix, and district demand in a dedicated insights view."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <SectionCard title="Live cases">
            <p className="text-3xl font-semibold text-slate-950">{analyticsSummary.liveCases}</p>
          </SectionCard>
          <SectionCard title="Urgent cases">
            <p className="text-3xl font-semibold text-[#FF3B30]">{analyticsSummary.urgentCases}</p>
          </SectionCard>
          <SectionCard title="Resolved today">
            <p className="text-3xl font-semibold text-emerald-600">{analyticsSummary.resolvedCases}</p>
          </SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <SectionCard title="Severity distribution" subtitle="Current incident mix.">
            <div className="space-y-4">
              {([
                ["critical", analyticsSummary.severityBuckets.critical, "from-[#FF3B30] to-[#ff8a80]"],
                ["high", analyticsSummary.severityBuckets.high, "from-[#FF9500] to-[#ffd08a]"],
                ["medium", analyticsSummary.severityBuckets.medium, "from-[#007AFF] to-[#7bb6ff]"],
                ["low", analyticsSummary.severityBuckets.low, "from-emerald-500 to-emerald-300"],
              ] as const).map(([label, value, gradient]) => (
                <div key={label}>
                  <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
                    <span className="capitalize">{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                    <div
                      className={`h-2.5 rounded-full bg-gradient-to-r ${gradient}`}
                      style={{ width: `${Math.max(10, Math.round((value / maxSeverity) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Operational snapshot" subtitle="Quick response benchmarks.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Median acknowledgement: 6m 22s</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Escalation rate: 18%</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Verified cases: {incidents.filter((item) => item.verificationFlags.authorityVerified).length}</div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="District load" subtitle="Top districts by current case volume.">
          <div className="space-y-4">
            {analyticsSummary.districtLoad.map(([district, count]) => (
              <div key={district}>
                <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
                  <span>{district}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-slate-900 to-[#007AFF]"
                    style={{ width: `${Math.max(10, Math.round((count / maxDistrict) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  };

  const renderBroadcast = () => {
    const defaultFeed = incidents
      .filter((incident) => incident.urgencyFlag)
      .slice(0, 4)
      .map((incident) => ({
        id: `seed-${incident.id}`,
        title: incident.title,
        audience: incident.location.district || "district",
        createdAt: incident.updatedAt,
      }));

    const feed = [...recentBroadcasts, ...defaultFeed];

    return (
      <div className="space-y-4">
        <PageHeader
          eyebrow="Authority Operations"
          title="Broadcast"
          subtitle="Compose district or citywide alerts without opening the case queue."
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <SectionCard title="Compose alert" subtitle="Mock public safety broadcast controls.">
            <div className="space-y-4">
              <FilterChips
                value={broadcastScope}
                onChange={(value) => setBroadcastScope(value as typeof broadcastScope)}
                options={[
                  { id: "district", label: "District" },
                  { id: "citywide", label: "Citywide" },
                  { id: "targeted", label: "Targeted" },
                ]}
              />
              <Textarea
                rows={6}
                value={broadcastMessage}
                onChange={(event) => setBroadcastMessage(event.target.value)}
                placeholder="Draft a public advisory, reroute notice, or emergency instruction."
              />
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-full" onClick={sendBroadcast} disabled={!broadcastMessage.trim()}>
                  Queue broadcast
                </Button>
                <Button variant="outline" className="rounded-full" onClick={() => setBroadcastMessage("")}>
                  Clear
                </Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Audience targeting" subtitle="Mock reach and validation hints.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Scope: {broadcastScope}</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Estimated reach: {broadcastScope === "citywide" ? "1.2M users" : broadcastScope === "district" ? "240K users" : "Targeted cohort"}</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Approval: Mock auto-approved for authority role</div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Recent broadcasts" subtitle="Latest queued advisories and seeded urgent alerts.">
          <div className="space-y-3">
            {feed.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Audience: {item.audience} / {formatRelativeTime(item.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status="delivered" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  };

  const renderVerification = () => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Authority Operations"
        title="Verification"
        subtitle="Evidence, flags, and authority review in a dedicated verification view."
      />

      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Verification queue" subtitle="Cases requiring evidence or flag review.">
          <div className="space-y-3">
            {verificationQueue.map((incident) => (
              <button
                key={incident.id}
                type="button"
                onClick={() => setSelectedId(incident.id)}
                className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                  selectedVerification?.id === incident.id
                    ? "border-[#007AFF]/20 bg-[#007AFF]/5"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-950">{incident.id}</p>
                  <StatusBadge status={incident.severity} />
                </div>
                <p className="mt-2 text-sm text-slate-700">{incident.title}</p>
                <p className="mt-1 text-xs text-slate-500">{incident.location.address}</p>
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={selectedVerification ? selectedVerification.id : "Verification detail"} subtitle="Review evidence and verification flags.">
            {selectedVerification ? (
              <div className="space-y-4">
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={selectedVerification.status} />
                    <StatusBadge status={selectedVerification.severity} />
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-950">{selectedVerification.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{selectedVerification.description}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    Authority verified: {selectedVerification.verificationFlags.authorityVerified ? "Yes" : "No"}
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    NGO linked: {selectedVerification.verificationFlags.ngoLinked ? "Yes" : "No"}
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    Evidence reviewed: {selectedVerification.verificationFlags.evidenceReviewed ? "Yes" : "No"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Attachments</p>
                  <div className="mt-2 space-y-2">
                    {selectedVerification.attachments.length ? (
                      selectedVerification.attachments.map((attachment) => (
                        <div key={attachment.id} className="rounded-xl bg-white px-3 py-2 text-xs text-slate-600">
                          {attachment.type} / {attachment.label}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl bg-white px-3 py-2 text-xs text-slate-500">No attachments</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-full" onClick={markVerificationComplete}>
                    Mark reviewed
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={() => updateIncidentStatus(selectedVerification.id, "accepted")}>
                    Accept for action
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No verification cases available.</div>
            )}
          </SectionCard>

          <SectionCard title="Verification timeline" subtitle="Recent review activity.">
            {verificationTimeline.length ? (
              <TimelineList events={verificationTimeline} />
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No timeline events yet.</div>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );

  if (mode === "queue") return renderQueueWorkspace(false);
  if (mode === "analytics") return renderAnalytics();
  if (mode === "broadcast") return renderBroadcast();
  if (mode === "verification") return renderVerification();
  return renderQueueWorkspace(true);
};

export default AuthorityDashboardModule;
