import { useMemo, useState } from "react";
import { ArrowUpRight, HandCoins, HeartHandshake, PackageCheck, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterChips from "@/web/components/FilterChips";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import StatusBadge from "@/web/components/StatusBadge";
import { useSosWeb } from "@/web/context/SosWebContext";

type NgoView = "dashboard" | "requests" | "campaigns" | "resources" | "transparency";

interface NgoDashboardPanelProps {
  mode?: NgoView;
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

const NgoDashboardPanel: React.FC<NgoDashboardPanelProps> = ({ mode = "dashboard" }) => {
  const { ngoCampaigns, incidents, transparencyEntries } = useSosWeb();
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(ngoCampaigns[0]?.id || null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(incidents[0]?.id || null);

  const regions = useMemo(() => ["all", ...new Set(ngoCampaigns.map((item) => item.region))], [ngoCampaigns]);

  const filteredCampaigns = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ngoCampaigns.filter((campaign) => {
      const matchesRegion = regionFilter === "all" || campaign.region === regionFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? campaign.active : !campaign.active);
      const matchesQuery = !query || `${campaign.title} ${campaign.region} ${campaign.category}`.toLowerCase().includes(query);
      return matchesRegion && matchesStatus && matchesQuery;
    });
  }, [ngoCampaigns, regionFilter, search, statusFilter]);

  const requestQueue = useMemo(
    () =>
      incidents
        .filter((incident) => ["accepted", "waiting-response", "on-scene"].includes(incident.status))
        .sort((a, b) => (a.urgencyFlag === b.urgencyFlag ? 0 : a.urgencyFlag ? -1 : 1)),
    [incidents],
  );

  const selectedCampaign = filteredCampaigns.find((campaign) => campaign.id === selectedCampaignId) || filteredCampaigns[0] || null;
  const selectedRequest = requestQueue.find((incident) => incident.id === selectedRequestId) || requestQueue[0] || null;

  const allocationCards = [
    { label: "Medical kits", amount: "280 kits", status: "tracking-active", icon: PackageCheck, note: "Field deployment" },
    { label: "Meal support", amount: "540 packs", status: "tracking-active", icon: HeartHandshake, note: "Night ration line" },
    { label: "Emergency fund", amount: "INR 1,80,000", status: "pending", icon: HandCoins, note: "Awaiting release" },
  ] as const;

  const stats = [
    {
      label: "Live campaigns",
      value: ngoCampaigns.filter((campaign) => campaign.active).length,
      helper: "currently accepting requests",
      accent: "from-[#007AFF] to-[#66aefc]",
    },
    {
      label: "Open requests",
      value: ngoCampaigns.reduce((sum, campaign) => sum + campaign.requestsOpen, 0),
      helper: "citizen and district asks",
      accent: "from-[#FF9500] to-[#ffbc58]",
    },
    {
      label: "Volunteers",
      value: ngoCampaigns.reduce((sum, campaign) => sum + campaign.volunteersActive, 0),
      helper: "deployed in field",
      accent: "from-[#34C759] to-[#82e4a0]",
    },
    {
      label: "Audit items",
      value: transparencyEntries.filter((entry) => entry.verificationBadge !== "verified").length,
      helper: "pending proof review",
      accent: "from-[#5856D6] to-[#8a88ff]",
    },
  ];

  const activityFeed = [
    "District request approved for mobile trauma deployment.",
    "Volunteer pool re-routed to Mayur Vihar relief block.",
    "Proof packet uploaded for audit verification.",
    "Meal support queue expanded for night commuters.",
  ];

  const transparencyFeed = useMemo(() => {
    return [...transparencyEntries].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [transparencyEntries]);

  const renderDashboard = () => (
    <div className="space-y-6">
      <PageHeader
        eyebrow="NGO Operations"
        title="NGO Workspace"
        subtitle="Campaign management, request allocation, and impact visibility in a softer operations layout."
        actions={
          <Button className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
            Publish update
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <SectionCard key={stat.label} title={stat.label} className="overflow-hidden">
            <div className={`rounded-[22px] bg-gradient-to-br ${stat.accent} px-4 py-5 text-white`}>
              <p className="text-3xl font-semibold">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/80">{stat.helper}</p>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <SectionCard title="Workspace filters" subtitle="Quickly narrow the management view.">
            <div className="space-y-3">
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search campaigns" />
              <select
                value={regionFilter}
                onChange={(event) => setRegionFilter(event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#007AFF]/25"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === "all" ? "All regions" : region}
                  </option>
                ))}
              </select>
              <FilterChips
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { id: "all", label: "All" },
                  { id: "active", label: "Active" },
                  { id: "inactive", label: "Closed" },
                ]}
              />
            </div>
          </SectionCard>

          <SectionCard title="Activity feed" subtitle="Recent NGO-side actions.">
            <div className="space-y-3">
              {activityFeed.map((item, index) => (
                <div key={item} className="flex gap-3 rounded-3xl bg-slate-50 px-4 py-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item}</p>
                    <p className="mt-1 text-xs text-slate-500">{index + 1}h ago</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Campaign workspace" subtitle="Current campaigns and active demand.">
            <div className="space-y-3">
              {filteredCampaigns.slice(0, 3).map((campaign) => {
                const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

                return (
                  <div key={campaign.id} className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-slate-950">{campaign.title}</p>
                          <StatusBadge status={campaign.active ? "tracking-active" : "resolved"} />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{campaign.region} / {campaign.category}</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Open
                      </Button>
                    </div>

                    <div className="mt-4 h-2.5 rounded-full bg-slate-100">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-[#007AFF] to-[#5856D6]"
                        style={{ width: `${Math.max(progress, 8)}%` }}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                      <span>INR {campaign.raisedAmount.toLocaleString()} / INR {campaign.targetAmount.toLocaleString()}</span>
                      <span>{campaign.requestsOpen} open asks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Campaign requests" subtitle="Requests waiting on NGO support allocation.">
            <div className="space-y-3">
              {requestQueue.slice(0, 4).map((incident) => (
                <div key={incident.id} className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{incident.id}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">{incident.title}</p>
                    </div>
                    <StatusBadge status={incident.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-white px-2.5 py-1">{incident.type}</span>
                    <span className="rounded-full bg-white px-2.5 py-1">{incident.location.district || "District"}</span>
                    <span className="rounded-full bg-white px-2.5 py-1">{incident.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Allocation board" subtitle="Resource and fund release cards.">
            <div className="space-y-3">
              {allocationCards.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                        <item.icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.amount}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Team snapshot" subtitle="Fast operational counters.">
            <div className="space-y-3">
              {[
                { label: "Volunteer pods", value: "12 live", icon: Users2 },
                { label: "District partners", value: "8 linked", icon: HeartHandshake },
                { label: "Rapid fund reserve", value: "INR 6.2L", icon: HandCoins },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[24px] bg-slate-50 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white">
                    <item.icon className="h-4 w-4 text-slate-700" />
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

  const renderRequests = () => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="NGO Operations"
        title="Requests"
        subtitle="Dedicated request queue for incoming support asks and field escalation."
      />

      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Support queue" subtitle="Cases currently requiring NGO action.">
          <div className="space-y-3">
            {requestQueue.map((incident) => (
              <button
                key={incident.id}
                type="button"
                onClick={() => setSelectedRequestId(incident.id)}
                className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                  selectedRequest?.id === incident.id
                    ? "border-[#007AFF]/20 bg-[#007AFF]/5"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-950">{incident.id}</p>
                  <StatusBadge status={incident.status} />
                </div>
                <p className="mt-2 text-sm text-slate-700">{incident.title}</p>
                <p className="mt-1 text-xs text-slate-500">{incident.location.address}</p>
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={selectedRequest ? selectedRequest.id : "Request detail"} subtitle="View request context before allocating support.">
            {selectedRequest ? (
              <div className="space-y-4">
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={selectedRequest.status} />
                    <StatusBadge status={selectedRequest.severity} />
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-950">{selectedRequest.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{selectedRequest.description}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    District: {selectedRequest.location.district || "Unknown"}
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    Type: {selectedRequest.type}
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    Attachments: {selectedRequest.attachments.length}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-full">Assign volunteers</Button>
                  <Button variant="outline" className="rounded-full">Approve support</Button>
                  <Button variant="outline" className="rounded-full">Send update</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No requests available.</div>
            )}
          </SectionCard>

          <SectionCard title="Request activity" subtitle="Recent queue movement.">
            <div className="space-y-3">
              {requestQueue.slice(0, 4).map((incident) => (
                <div key={incident.id} className="rounded-[24px] bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-950">{incident.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatRelativeTime(incident.updatedAt)}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="NGO Operations"
        title="Campaigns"
        subtitle="Focused campaign management with filters, progress, and fundraising detail."
      />

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <SectionCard title="Campaign filters" subtitle="Narrow campaigns by region, status, or search.">
          <div className="space-y-3">
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search campaigns" />
            <select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#007AFF]/25"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region === "all" ? "All regions" : region}
                </option>
              ))}
            </select>
            <FilterChips
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "inactive", label: "Closed" },
              ]}
            />
          </div>
        </SectionCard>

        <SectionCard title="Campaign list" subtitle="Campaign inventory with quick progress scan.">
          <div className="space-y-3">
            {filteredCampaigns.map((campaign) => {
              const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

              return (
                <button
                  key={campaign.id}
                  type="button"
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className={`w-full rounded-[28px] border px-5 py-5 text-left transition ${
                    selectedCampaign?.id === campaign.id
                      ? "border-[#007AFF]/20 bg-[#007AFF]/5"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-950">{campaign.title}</p>
                        <StatusBadge status={campaign.active ? "tracking-active" : "resolved"} />
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{campaign.region} / {campaign.category}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{campaign.requestsOpen} asks</span>
                  </div>

                  <div className="mt-4 h-2.5 rounded-full bg-slate-100">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-[#007AFF] to-[#5856D6]"
                      style={{ width: `${Math.max(progress, 8)}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                    <span>INR {campaign.raisedAmount.toLocaleString()} / INR {campaign.targetAmount.toLocaleString()}</span>
                    <span>{campaign.volunteersActive} volunteers active</span>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title={selectedCampaign ? "Campaign detail" : "Campaign detail"} subtitle="Selected campaign summary and actions.">
          {selectedCampaign ? (
            <div className="space-y-4">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={selectedCampaign.active ? "tracking-active" : "resolved"} />
                </div>
                <p className="mt-3 text-base font-semibold text-slate-950">{selectedCampaign.title}</p>
                <p className="mt-2 text-sm text-slate-600">{selectedCampaign.region}</p>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                  Raised: INR {selectedCampaign.raisedAmount.toLocaleString()}
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                  Target: INR {selectedCampaign.targetAmount.toLocaleString()}
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                  Volunteers: {selectedCampaign.volunteersActive}
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full rounded-full">Publish update</Button>
                <Button variant="outline" className="w-full rounded-full">Adjust allocation</Button>
                <Button variant="outline" className="w-full rounded-full">View audit trail</Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">No campaigns match the current filter.</div>
          )}
        </SectionCard>
      </div>
    </div>
  );

  const renderAllocation = () => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="NGO Operations"
        title="Allocation"
        subtitle="Dedicated resource and fund allocation workspace for NGO operations."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SectionCard title="Allocation board" subtitle="Resource and fund release inventory.">
          <div className="grid gap-3 md:grid-cols-3">
            {allocationCards.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100">
                      <item.icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.amount}</p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-3 text-xs text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {requestQueue.slice(0, 5).map((incident) => (
              <div key={incident.id} className="rounded-[24px] bg-slate-50 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{incident.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{incident.location.district || "District"}</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full">
                    Allocate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Resource summary" subtitle="Operational counters and balance.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Medical inventory: 72% stocked</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Meal buffer: 3 active zones</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Funds awaiting approval: INR 1.8L</div>
            </div>
          </SectionCard>

          <SectionCard title="Quick actions" subtitle="Mock operational controls.">
            <div className="space-y-2">
              <Button className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">Approve release</Button>
              <Button variant="outline" className="w-full rounded-full">Assign volunteers</Button>
              <Button variant="outline" className="w-full rounded-full">Escalate shortage</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );

  const renderTransparency = () => (
    <div className="space-y-4">
      <PageHeader
        eyebrow="NGO Operations"
        title="Transparency"
        subtitle="Audit entries, proof counts, and verification states in a dedicated transparency view."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard title="Audit ledger" subtitle="Recent verified, pending, and flagged transparency entries.">
          <div className="space-y-3">
            {transparencyFeed.map((entry) => (
              <div key={entry.id} className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{entry.id}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{entry.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {entry.district}, {entry.state}
                    </p>
                  </div>
                  <StatusBadge status={entry.verificationBadge} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-50 px-2.5 py-1">{entry.category}</span>
                  <span className="rounded-full bg-slate-50 px-2.5 py-1">{entry.proofCount} proofs</span>
                  <span className="rounded-full bg-slate-50 px-2.5 py-1">{formatRelativeTime(entry.updatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Verification summary" subtitle="Quick status breakdown.">
            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Verified: {transparencyEntries.filter((entry) => entry.verificationBadge === "verified").length}
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Pending: {transparencyEntries.filter((entry) => entry.verificationBadge === "pending").length}
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
                Flagged: {transparencyEntries.filter((entry) => entry.verificationBadge === "flagged").length}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Proof actions" subtitle="Mock audit actions.">
            <div className="space-y-2">
              <Button className="w-full rounded-full">Upload proof packet</Button>
              <Button variant="outline" className="w-full rounded-full">Request clarification</Button>
              <Button variant="outline" className="w-full rounded-full">Export ledger</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );

  if (mode === "requests") return renderRequests();
  if (mode === "campaigns") return renderCampaigns();
  if (mode === "resources") return renderAllocation();
  if (mode === "transparency") return renderTransparency();
  return renderDashboard();
};

export default NgoDashboardPanel;
