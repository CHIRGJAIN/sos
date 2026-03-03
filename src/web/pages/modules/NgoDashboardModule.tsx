import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EmptyStateCard from "@/web/components/EmptyStateCard";
import FilterChips from "@/web/components/FilterChips";
import SectionCard from "@/web/components/SectionCard";
import StatusChip from "@/web/components/StatusChip";
import { useSosWeb } from "@/web/context/SosWebContext";

const NgoDashboardModule: React.FC = () => {
  const { t, incidents, ngoCampaigns, transparencyEntries, socialPosts } = useSosWeb();
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [composer, setComposer] = useState("");
  const [search, setSearch] = useState("");

  const regions = useMemo(() => ["all", ...new Set(ngoCampaigns.map((item) => item.region))], [ngoCampaigns]);

  const filteredCampaigns = useMemo(() => {
    return ngoCampaigns.filter((campaign) => {
      const regionMatch = regionFilter === "all" || campaign.region === regionFilter;
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" ? campaign.active : !campaign.active);
      const q = search.toLowerCase().trim();
      const queryMatch = !q || `${campaign.title} ${campaign.region}`.toLowerCase().includes(q);
      return regionMatch && statusMatch && queryMatch;
    });
  }, [ngoCampaigns, regionFilter, search, statusFilter]);

  const incomingRequests = incidents.filter((incident) => ["accepted", "waiting-response"].includes(incident.status));
  const activeTasks = incidents.filter((incident) => ["en-route", "on-scene"].includes(incident.status));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <SectionCard title={t("ngo.summary.campaigns")}> 
          <p className="text-2xl font-semibold text-slate-800">{ngoCampaigns.filter((item) => item.active).length}</p>
        </SectionCard>
        <SectionCard title={t("ngo.summary.requests")}> 
          <p className="text-2xl font-semibold text-orange-700">{incomingRequests.length}</p>
        </SectionCard>
        <SectionCard title={t("ngo.summary.tasks")}> 
          <p className="text-2xl font-semibold text-blue-700">{activeTasks.length}</p>
        </SectionCard>
        <SectionCard title={t("ngo.summary.resources")}> 
          <p className="text-2xl font-semibold text-emerald-700">
            {transparencyEntries.filter((item) => item.category === "allocation").length}
          </p>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard title="Campaign and request filters"> 
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px]">
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("nav.searchPlaceholder")} />
              <select
                value={regionFilter}
                onChange={(event) => setRegionFilter(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === "all" ? "All regions" : region}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
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

          <SectionCard title="Active campaigns / relief drives"> 
            {filteredCampaigns.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredCampaigns.map((campaign) => {
                  const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));
                  return (
                    <div key={campaign.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-800">{campaign.title}</p>
                      <p className="text-xs text-slate-500">{campaign.region}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <StatusChip status={campaign.active ? "delivered" : "pending"} />
                        <span className="text-xs text-slate-600">{campaign.category}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">INR {campaign.raisedAmount.toLocaleString()} / INR {campaign.targetAmount.toLocaleString()}</p>
                      <p className="text-xs text-slate-600">Volunteers {campaign.volunteersActive} • Open requests {campaign.requestsOpen}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyStateCard title={t("common.noResults")} description={t("ngo.summary.campaigns")} />
            )}
          </SectionCard>

          <SectionCard title={t("ngo.feed.composer")}> 
            <Textarea
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              rows={3}
              placeholder={t("ngo.feed.composer")}
            />
            <div className="mt-2 flex justify-end">
              <Button disabled={!composer.trim()}>{t("nav.createPost")}</Button>
            </div>
          </SectionCard>

          <SectionCard title="Impact feed">
            <div className="space-y-2">
              {socialPosts
                .filter((post) => post.author.role === "ngo")
                .slice(0, 4)
                .map((post) => (
                  <div key={post.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <p className="text-xs font-semibold text-slate-700">{post.author.name}</p>
                    <p className="line-clamp-2 text-xs text-slate-600">{post.content}</p>
                  </div>
                ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Incoming aid/support requests">
            <div className="space-y-2">
              {incomingRequests.slice(0, 6).map((incident) => (
                <div key={incident.id} className="rounded-lg border border-orange-200 bg-orange-50 p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-orange-800">{incident.id}</p>
                    <StatusChip status={incident.status} />
                  </div>
                  <p className="text-xs text-orange-700">{incident.location.address}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Active response tasks">
            <div className="space-y-2">
              {activeTasks.slice(0, 6).map((task) => (
                <div key={task.id} className="rounded-lg border border-blue-200 bg-blue-50 p-2.5">
                  <p className="text-xs font-semibold text-blue-800">{task.id}</p>
                  <p className="text-xs text-blue-700">{task.title}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Donation / contribution overview">
            <div className="space-y-2 text-xs text-slate-700">
              <p className="rounded-lg bg-slate-50 px-3 py-2">This month raised: INR 7,38,000</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">Disbursed to active cases: INR 4,92,000</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">Pending proofs: 5 entries</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboardModule;