import { useMemo, useState } from "react";
import { BadgeCheck, HeartHandshake, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FilterChips from "@/web/components/FilterChips";
import NgoCard from "@/web/components/NgoCard";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import { useSosWeb } from "@/web/context/SosWebContext";

const NgoDirectoryModule: React.FC = () => {
  const { ngoDirectory, ngoCampaigns, followedNgoIds, toggleNgoFollow } = useSosWeb();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "district" | "state" | "national" | "global">("all");
  const [selectedId, setSelectedId] = useState<string | null>(ngoDirectory[0]?.id || null);

  const filteredNgos = useMemo(() => {
    return ngoDirectory.filter((ngo) => {
      const scopeMatch = scope === "all" || ngo.scope === scope;
      const searchValue = query.trim().toLowerCase();
      const queryMatch =
        !searchValue ||
        `${ngo.name} ${ngo.category} ${ngo.location} ${ngo.description}`.toLowerCase().includes(searchValue);
      return scopeMatch && queryMatch;
    });
  }, [ngoDirectory, query, scope]);

  const selectedNgo = filteredNgos.find((ngo) => ngo.id === selectedId) || filteredNgos[0] || null;
  const selectedCampaigns = selectedNgo ? ngoCampaigns.filter((campaign) => selectedNgo.campaigns.includes(campaign.id)) : [];

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Community Partners"
        title="NGO Directory"
        subtitle="Facebook-style discovery and profile layout for civic support organizations."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard title="Browse NGOs" subtitle="Search, filter, and compare by scope and funding progress.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_320px]">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none ring-0"
                placeholder="Search NGOs, categories, or regions"
              />
              <FilterChips
                value={scope}
                onChange={(value) => setScope(value as typeof scope)}
                options={[
                  { id: "all", label: "All" },
                  { id: "district", label: "District" },
                  { id: "state", label: "State" },
                  { id: "national", label: "National" },
                  { id: "global", label: "Global" },
                ]}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {filteredNgos.map((ngo) => (
                <NgoCard
                  key={ngo.id}
                  ngo={ngo}
                  isFollowed={followedNgoIds.includes(ngo.id)}
                  active={selectedNgo?.id === ngo.id}
                  onFollow={() => toggleNgoFollow(ngo.id)}
                  onOpen={() => setSelectedId(ngo.id)}
                />
              ))}
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          {selectedNgo ? (
            <>
              <SectionCard title="NGO Profile" subtitle="Profile-page inspired summary.">
                <div className="space-y-4">
                  <div className="rounded-[24px] bg-[linear-gradient(145deg,#eef2ff_0%,#f8fafc_100%)] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-base font-semibold text-white">
                        {selectedNgo.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-slate-950">{selectedNgo.name}</p>
                          <BadgeCheck className="h-4 w-4 text-[#34C759]" />
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{selectedNgo.category}</p>
                        <p className="mt-1 text-xs text-slate-500">{selectedNgo.location}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-700">{selectedNgo.description}</p>
                  </div>

                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-2 text-sm text-slate-600">
                      <span>Fundraising</span>
                      <span>
                        INR {selectedNgo.fundraising.raised.toLocaleString()} / INR {selectedNgo.fundraising.goal.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      className="mt-3 h-2 bg-slate-200"
                      value={Math.min(100, Math.round((selectedNgo.fundraising.raised / selectedNgo.fundraising.goal) * 100))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Button className="rounded-full bg-[#34C759] hover:bg-[#2fad4e]">
                      <HeartHandshake className="mr-2 h-4 w-4" />
                      Donate / Support
                    </Button>
                    <Button variant="outline" className="rounded-full" onClick={() => toggleNgoFollow(selectedNgo.id)}>
                      {followedNgoIds.includes(selectedNgo.id) ? "Unfollow" : "Follow"}
                    </Button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Campaigns" subtitle="Linked public campaigns.">
                <div className="space-y-2">
                  {selectedCampaigns.length ? (
                    selectedCampaigns.map((campaign) => {
                      const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));
                      return (
                        <div key={campaign.id} className="rounded-2xl bg-slate-50 px-3 py-3">
                          <p className="text-sm font-semibold text-slate-900">{campaign.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{campaign.region}</p>
                          <Progress className="mt-3 h-2 bg-slate-200" value={progress} />
                          <p className="mt-2 text-xs text-slate-500">
                            INR {campaign.raisedAmount.toLocaleString()} / INR {campaign.targetAmount.toLocaleString()}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-500">No linked campaigns in this profile.</div>
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Contact" subtitle="Direct support contact points.">
                <div className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3">
                    <Phone className="h-4 w-4 text-[#007AFF]" />
                    <span>{selectedNgo.contactPhone}</span>
                  </div>
                  {selectedNgo.contactEmail ? <div className="rounded-2xl bg-slate-50 px-3 py-3">{selectedNgo.contactEmail}</div> : null}
                </div>
              </SectionCard>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NgoDirectoryModule;
