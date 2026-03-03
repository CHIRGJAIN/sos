import { useMemo, useState } from "react";
import { Activity, AlertTriangle, BarChart3, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import StatusBadge from "@/web/components/StatusBadge";
import { useSosWeb } from "@/web/context/SosWebContext";

type AdminView = "dashboard" | "queue" | "verification" | "transparency";

interface AdminDashboardPanelProps {
  mode?: AdminView;
}

const formatRelativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / (1000 * 60)));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

const AdminDashboardPanel: React.FC<AdminDashboardPanelProps> = ({ mode = "dashboard" }) => {
  const { incidents, revelationReports, transparencyEntries, socialPosts, ngoCampaigns } = useSosWeb();
  const [query, setQuery] = useState("");
  const [selectedModerationId, setSelectedModerationId] = useState<string | null>(null);
  const [selectedVerificationId, setSelectedVerificationId] = useState<string | null>(incidents[0]?.id || null);
  const [selectedOversightId, setSelectedOversightId] = useState<string | null>(transparencyEntries[0]?.id || null);

  const activeIncidents = incidents.filter((incident) => !["resolved", "cancelled"].includes(incident.status));
  const flaggedTransparency = transparencyEntries.filter((entry) => entry.verificationBadge === "flagged");
  const pendingModeration = revelationReports.length + socialPosts.filter((post) => !post.author.verified).length;
  const userRows = [
    { id: "usr-1", name: "Ananya Sharma", role: "Citizen", state: "UP", status: "tracking-active" },
    { id: "usr-2", name: "SafeStreets Delhi", role: "NGO", state: "Delhi", status: "delivered" },
    { id: "usr-3", name: "Command Desk 4", role: "Authority", state: "Delhi", status: "pending" },
    { id: "usr-4", name: "Admin Audit", role: "Admin", state: "National", status: "delivered" },
    { id: "usr-5", name: "Northeast Medics", role: "NGO", state: "Delhi", status: "tracking-active" },
  ] as const;

  const kpis = [
    {
      label: "Users in system",
      value: 12840,
      delta: "+8.4%",
      icon: Users,
      accent: "bg-[#007AFF]/10 text-[#007AFF]",
    },
    {
      label: "Active incidents",
      value: activeIncidents.length,
      delta: `${activeIncidents.filter((item) => item.urgencyFlag).length} urgent`,
      icon: AlertTriangle,
      accent: "bg-[#FF3B30]/10 text-[#FF3B30]",
    },
    {
      label: "Moderation queue",
      value: pendingModeration,
      delta: `${flaggedTransparency.length} flagged`,
      icon: ShieldCheck,
      accent: "bg-[#FF9500]/10 text-[#FF9500]",
    },
    {
      label: "NGO campaigns",
      value: ngoCampaigns.length,
      delta: `${ngoCampaigns.filter((item) => item.active).length} live`,
      icon: Activity,
      accent: "bg-[#5856D6]/10 text-[#5856D6]",
    },
  ];

  const moderationQueue = useMemo(() => {
    const items = [
      ...revelationReports.map((report) => ({
        id: report.id,
        label: report.title || report.category,
        type: "Revelation",
        status: report.status === "flagged" ? "failed" : "pending",
        meta: report.severity,
        description: report.description,
        createdAt: report.createdAt,
      })),
      ...socialPosts
        .filter((post) => !post.author.verified)
        .map((post) => ({
          id: post.id,
          label: post.title || post.content.slice(0, 48),
          type: "Community post",
          status: "pending",
          meta: post.author.role,
          description: post.content,
          createdAt: post.createdAt,
        })),
      ...flaggedTransparency.map((entry) => ({
        id: entry.id,
        label: entry.title,
        type: "Audit",
        status: "failed",
        meta: entry.district,
        description: `${entry.category} entry with ${entry.proofCount} proofs attached.`,
        createdAt: entry.updatedAt,
      })),
    ];

    const q = query.trim().toLowerCase();
    return items.filter((item) => !q || `${item.id} ${item.label} ${item.type} ${item.meta}`.toLowerCase().includes(q));
  }, [flaggedTransparency, query, revelationReports, socialPosts]);

  const selectedModeration =
    moderationQueue.find((item) => item.id === selectedModerationId) || moderationQueue[0] || null;

  const verificationQueue = useMemo(() => {
    const q = query.trim().toLowerCase();
    return incidents.filter((incident) => {
      const needsReview =
        !incident.verificationFlags.authorityVerified ||
        !incident.verificationFlags.evidenceReviewed ||
        incident.attachments.length > 0;
      if (!needsReview) return false;
      return !q || `${incident.id} ${incident.title} ${incident.location.address} ${incident.location.district}`.toLowerCase().includes(q);
    });
  }, [incidents, query]);

  const selectedVerification =
    verificationQueue.find((item) => item.id === selectedVerificationId) || verificationQueue[0] || null;

  const oversightFeed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...transparencyEntries]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .filter((entry) => !q || `${entry.id} ${entry.title} ${entry.district} ${entry.state}`.toLowerCase().includes(q));
  }, [query, transparencyEntries]);

  const selectedOversight =
    oversightFeed.find((item) => item.id === selectedOversightId) || oversightFeed[0] || null;

  const renderDashboard = () => (
    <div className="space-y-6">
      <PageHeader
        eyebrow="System Oversight"
        title="Admin Dashboard"
        subtitle="Executive monitoring, moderation, and role-level visibility with a clean oversight layout."
        actions={<Button className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">Export snapshot</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <SectionCard key={kpi.label} title={kpi.label}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold text-slate-950">{kpi.value.toLocaleString()}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{kpi.delta}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${kpi.accent}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <SectionCard title="Incident oversight" subtitle="Executive view of live operations and response load.">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: "Live acknowledgements", value: `${activeIncidents.length} cases` },
                { label: "Median acknowledgement", value: "6m 22s" },
                { label: "False-positive rate", value: "3.1%" },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {kpis.map((metric) => {
                const max = Math.max(...kpis.map((item) => item.value), 1);
                const width = Math.max(8, Math.round((metric.value / max) * 100));

                return (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-700">
                      <span>{metric.label}</span>
                      <span>{metric.value.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-slate-900 via-[#007AFF] to-[#5856D6]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="User management" subtitle="Dense oversight table for role visibility and health.">
            <div className="overflow-hidden rounded-[28px] border border-slate-200">
              <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span>User</span>
                <span>Role</span>
                <span>Region</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {userRows.map((user) => (
                  <div key={user.id} className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr] gap-3 px-4 py-4 text-sm text-slate-700">
                    <div>
                      <p className="font-semibold text-slate-950">{user.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{user.id}</p>
                    </div>
                    <span>{user.role}</span>
                    <span>{user.state}</span>
                    <span>
                      <StatusBadge status={user.status} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Moderation queue" subtitle="Reports and audits that require review or escalation.">
            <div className="space-y-3">
              {moderationQueue.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{item.type}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{item.label}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-white px-2.5 py-1">{item.id}</span>
                    <span className="rounded-full bg-white px-2.5 py-1">{item.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="System health" subtitle="Executive health cards with quick summaries.">
            <div className="space-y-3">
              {[
                { label: "API relay health", value: "Mock 99.4%", tone: "text-emerald-600" },
                { label: "Queued notifications", value: "14 pending", tone: "text-amber-600" },
                { label: "Escalation backlog", value: "3 critical", tone: "text-[#FF3B30]" },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <p className={`mt-2 text-lg font-semibold ${item.tone}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Flagged reports" subtitle="Immediate attention items.">
            <div className="space-y-3">
              {activeIncidents
                .filter((incident) => incident.urgencyFlag)
                .slice(0, 4)
                .map((incident) => (
                  <div key={incident.id} className="rounded-[24px] bg-[#FF3B30]/[0.06] px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{incident.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {incident.location.district || "District"} / {incident.severity}
                        </p>
                      </div>
                      <StatusBadge status={incident.status} />
                    </div>
                  </div>
                ))}
            </div>
          </SectionCard>

          <SectionCard title="Oversight actions" subtitle="Mock controls for leadership actions.">
            <div className="space-y-2">
              <Button className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">Open audit room</Button>
              <Button variant="outline" className="w-full rounded-full">Freeze flagged account</Button>
              <Button variant="outline" className="w-full rounded-full">Export moderation log</Button>
              <Button variant="outline" className="w-full rounded-full">Review escalation policy</Button>
            </div>
          </SectionCard>

          <SectionCard title="Activity snapshot" subtitle="Quick cross-role trend read.">
            <div className="space-y-3">
              {[
                { label: "Authority acknowledgements", value: "38 today" },
                { label: "Citizen posts published", value: `${socialPosts.length} live` },
                { label: "Flagged audits", value: `${flaggedTransparency.length} active` },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[24px] bg-slate-50 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                    <BarChart3 className="h-4 w-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="System Oversight"
        title="Moderation"
        subtitle="Review reported revelations, unverified posts, and flagged audits in one moderation queue."
      />

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Moderation queue" subtitle="Search and review moderation items.">
          <div className="space-y-3">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ID, label, or type" />
            <div className="space-y-3">
              {moderationQueue.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedModerationId(item.id)}
                  className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                    selectedModeration?.id === item.id
                      ? "border-[#007AFF]/20 bg-[#007AFF]/5"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-950">{item.id}</p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.type} / {item.meta}</p>
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={selectedModeration ? selectedModeration.label : "Moderation detail"} subtitle="Selected moderation item and actions.">
            {selectedModeration ? (
              <div className="space-y-4">
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={selectedModeration.status} />
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-950">{selectedModeration.label}</p>
                  <p className="mt-2 text-sm text-slate-600">{selectedModeration.description}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Type: {selectedModeration.type}</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Meta: {selectedModeration.meta}</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">{formatRelativeTime(selectedModeration.createdAt)}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-full">Approve</Button>
                  <Button variant="outline" className="rounded-full">Flag for review</Button>
                  <Button variant="outline" className="rounded-full">Remove</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No moderation items match the current filter.</div>
            )}
          </SectionCard>

          <SectionCard title="Moderation summary" subtitle="Queue pressure and outcomes.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Queue size: {moderationQueue.length}</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Pending revelations: {revelationReports.length}</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Unverified posts: {socialPosts.filter((post) => !post.author.verified).length}</div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="System Oversight"
        title="Verification"
        subtitle="Review incident verification state, evidence readiness, and escalation quality."
      />

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Verification queue" subtitle="Cases needing admin-side verification review.">
          <div className="space-y-3">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search case ID or location" />
            <div className="space-y-3">
              {verificationQueue.map((incident) => (
                <button
                  key={incident.id}
                  type="button"
                  onClick={() => setSelectedVerificationId(incident.id)}
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
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={selectedVerification ? selectedVerification.id : "Verification detail"} subtitle="Selected incident verification details.">
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
                    Evidence reviewed: {selectedVerification.verificationFlags.evidenceReviewed ? "Yes" : "No"}
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    Attachments: {selectedVerification.attachments.length}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-full">Mark verified</Button>
                  <Button variant="outline" className="rounded-full">Request evidence</Button>
                  <Button variant="outline" className="rounded-full">Escalate audit</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No verification cases available.</div>
            )}
          </SectionCard>

          <SectionCard title="Verification summary" subtitle="Admin review counters.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Total in queue: {verificationQueue.length}
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Fully verified: {incidents.filter((item) => item.verificationFlags.authorityVerified && item.verificationFlags.evidenceReviewed).length}
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Evidence pending: {incidents.filter((item) => !item.verificationFlags.evidenceReviewed).length}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );

  const renderOversight = () => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="System Oversight"
        title="Oversight"
        subtitle="Transparency ledger, flagged audits, and system-wide oversight controls."
      />

      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Oversight ledger" subtitle="Audit and transparency records across districts.">
          <div className="space-y-3">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search audit ID or district" />
            <div className="space-y-3">
              {oversightFeed.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelectedOversightId(entry.id)}
                  className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                    selectedOversight?.id === entry.id
                      ? "border-[#007AFF]/20 bg-[#007AFF]/5"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-950">{entry.id}</p>
                    <StatusBadge status={entry.verificationBadge} />
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{entry.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{entry.district}, {entry.state}</p>
                </button>
              ))}
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={selectedOversight ? selectedOversight.title : "Oversight detail"} subtitle="Selected audit entry with system-level context.">
            {selectedOversight ? (
              <div className="space-y-4">
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={selectedOversight.verificationBadge} />
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-950">{selectedOversight.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{selectedOversight.district}, {selectedOversight.state}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Category: {selectedOversight.category}</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Proofs: {selectedOversight.proofCount}</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">{formatRelativeTime(selectedOversight.updatedAt)}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-full">Export ledger</Button>
                  <Button variant="outline" className="rounded-full">Request audit note</Button>
                  <Button variant="outline" className="rounded-full">Flag for escalation</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No oversight entries found.</div>
            )}
          </SectionCard>

          <SectionCard title="Oversight summary" subtitle="Platform-wide audit state.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Verified entries: {transparencyEntries.filter((item) => item.verificationBadge === "verified").length}
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Pending entries: {transparencyEntries.filter((item) => item.verificationBadge === "pending").length}
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Flagged entries: {flaggedTransparency.length}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );

  if (mode === "queue") return renderModeration();
  if (mode === "verification") return renderVerification();
  if (mode === "transparency") return renderOversight();
  return renderDashboard();
};

export default AdminDashboardPanel;
