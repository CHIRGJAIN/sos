import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import EmptyStateCard from "@/web/components/EmptyStateCard";
import FilterChips from "@/web/components/FilterChips";
import SectionCard from "@/web/components/SectionCard";
import StatusChip from "@/web/components/StatusChip";
import { useSosWeb } from "@/web/context/SosWebContext";

const TransparencyModule: React.FC = () => {
  const { t, transparencyEntries, ngoCampaigns } = useSosWeb();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("all");

  const districts = useMemo(
    () => ["all", ...new Set(transparencyEntries.map((item) => item.district))],
    [transparencyEntries],
  );

  const filtered = useMemo(() => {
    return transparencyEntries.filter((entry) => {
      const categoryMatch = category === "all" || entry.category === category;
      const districtMatch = district === "all" || entry.district === district;
      const q = query.toLowerCase().trim();
      const queryMatch = !q || `${entry.title} ${entry.district} ${entry.state}`.toLowerCase().includes(q);
      return categoryMatch && districtMatch && queryMatch;
    });
  }, [category, district, query, transparencyEntries]);

  return (
    <div className="space-y-4">
      <SectionCard title={t("citizen.transparency.title")}> 
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Entries</p>
            <p className="text-2xl font-semibold text-slate-800">{transparencyEntries.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Verified</p>
            <p className="text-2xl font-semibold text-emerald-700">
              {transparencyEntries.filter((item) => item.verificationBadge === "verified").length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-2xl font-semibold text-amber-700">
              {transparencyEntries.filter((item) => item.verificationBadge === "pending").length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Flagged</p>
            <p className="text-2xl font-semibold text-red-700">
              {transparencyEntries.filter((item) => item.verificationBadge === "flagged").length}
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard title="Transparency ledger"> 
          <div className="space-y-3">
            <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_180px_180px]">
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("nav.searchPlaceholder")} />
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
              >
                {districts.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All districts" : item}
                  </option>
                ))}
              </select>
              <FilterChips
                value={category}
                onChange={setCategory}
                options={[
                  { id: "all", label: "All" },
                  { id: "contribution", label: "Contribution" },
                  { id: "allocation", label: "Allocation" },
                  { id: "distribution", label: "Distribution" },
                  { id: "audit", label: "Audit" },
                ]}
              />
            </div>

            {filtered.length ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Title</th>
                      <th className="px-3 py-2 text-left">District</th>
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-left">Value</th>
                      <th className="px-3 py-2 text-left">Proof</th>
                      <th className="px-3 py-2 text-left">Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((entry) => (
                      <tr key={entry.id} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-medium text-slate-700">{entry.title}</td>
                        <td className="px-3 py-2">{entry.district}</td>
                        <td className="px-3 py-2">{entry.category}</td>
                        <td className="px-3 py-2">
                          {entry.amount ? `INR ${entry.amount.toLocaleString()}` : entry.quantity || "-"}
                        </td>
                        <td className="px-3 py-2">{entry.proofCount}</td>
                        <td className="px-3 py-2">
                          <StatusChip
                            status={
                              entry.verificationBadge === "verified"
                                ? "delivered"
                                : entry.verificationBadge === "pending"
                                  ? "pending"
                                  : "failed"
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyStateCard title={t("common.noResults")} description={t("citizen.transparency.title")} />
            )}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Campaign progress summaries"> 
            <div className="space-y-3">
              {ngoCampaigns.map((campaign) => {
                const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));
                return (
                  <div key={campaign.id} className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-sm font-semibold text-emerald-800">{campaign.title}</p>
                    <p className="text-xs text-emerald-700">{campaign.region}</p>
                    <Progress className="mt-2 h-2 bg-emerald-100" value={progress} />
                    <p className="mt-1 text-xs text-emerald-700">{progress}% funded</p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Resource allocation snapshot">
            <div className="space-y-2">
              {transparencyEntries
                .filter((entry) => ["allocation", "distribution"].includes(entry.category))
                .slice(0, 4)
                .map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                    <p className="font-semibold">{entry.title}</p>
                    <p>{entry.quantity || "N/A"}</p>
                  </div>
                ))}
            </div>
          </SectionCard>

          <SectionCard title="Audit widgets">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              <p className="mb-2 flex items-center gap-1 font-semibold">
                <BarChart3 className="h-3.5 w-3.5" />
                Civic Transparency Index
              </p>
              <div className="space-y-1">
                <p>Verification coverage: 78%</p>
                <p>On-time disclosures: 71%</p>
                <p>Flagged anomalies: 4 districts</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default TransparencyModule;