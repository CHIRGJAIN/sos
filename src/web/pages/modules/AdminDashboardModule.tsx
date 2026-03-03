import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import FilterChips from "@/web/components/FilterChips";
import SectionCard from "@/web/components/SectionCard";
import StatusChip from "@/web/components/StatusChip";
import { useSosWeb } from "@/web/context/SosWebContext";

const AdminDashboardModule: React.FC = () => {
  const { t, revelationReports, socialPosts, transparencyEntries } = useSosWeb();
  const [queueFilter, setQueueFilter] = useState("all");

  const moderationQueue = useMemo(() => {
    const rows = [
      ...revelationReports.map((report) => ({ id: report.id, type: "revelation", status: report.status, title: report.title || report.category })),
      ...socialPosts.slice(0, 6).map((post) => ({ id: post.id, type: "social", status: post.author.verified ? "verified" : "pending", title: post.content.slice(0, 72) })),
    ];

    if (queueFilter === "all") return rows;
    return rows.filter((row) => row.type === queueFilter);
  }, [queueFilter, revelationReports, socialPosts]);

  const flaggedTransparency = transparencyEntries.filter((entry) => entry.verificationBadge === "flagged");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <SectionCard title={t("admin.queue")}> 
          <p className="text-2xl font-semibold text-slate-800">{moderationQueue.length}</p>
        </SectionCard>
        <SectionCard title={t("admin.flagged")}> 
          <p className="text-2xl font-semibold text-red-700">{flaggedTransparency.length}</p>
        </SectionCard>
        <SectionCard title={t("admin.ngoVerify")}> 
          <p className="text-2xl font-semibold text-orange-700">7</p>
        </SectionCard>
        <SectionCard title={t("admin.transparency")}> 
          <p className="text-2xl font-semibold text-blue-700">
            {transparencyEntries.filter((entry) => entry.verificationBadge === "pending").length}
          </p>
        </SectionCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SectionCard title={t("admin.queue")}> 
          <div className="space-y-3">
            <FilterChips
              value={queueFilter}
              onChange={setQueueFilter}
              options={[
                { id: "all", label: "All" },
                { id: "revelation", label: "Revelation" },
                { id: "social", label: "Social" },
              ]}
            />
            <div className="space-y-2">
              {moderationQueue.map((row) => (
                <div key={row.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase text-slate-600">{row.type}</p>
                    <StatusChip status={row.status === "verified" ? "delivered" : row.status === "pending" ? "pending" : "failed"} />
                  </div>
                  <p className="mt-1 text-sm text-slate-800">{row.title}</p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline">Review</Button>
                    <Button size="sm" variant="outline">Approve</Button>
                    <Button size="sm" variant="outline" className="text-red-700">Flag</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title={t("admin.ngoVerify")}> 
            <div className="space-y-2 text-sm text-slate-700">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">Urban Relief Network - documents pending</div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">North Medics Collective - field audit requested</div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">SafeTransit NGO - ready for approval</div>
            </div>
          </SectionCard>

          <SectionCard title={t("admin.transparency")}> 
            <div className="space-y-2 text-sm text-slate-700">
              {transparencyEntries
                .filter((entry) => entry.verificationBadge !== "verified")
                .map((entry) => (
                  <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="font-semibold">{entry.title}</p>
                    <p className="text-xs text-slate-500">{entry.district}</p>
                  </div>
                ))}
            </div>
          </SectionCard>

          <SectionCard title="Platform metrics">
            <div className="space-y-2 text-xs text-slate-700">
              <p className="rounded-lg bg-slate-50 px-3 py-2">Daily active users: 12,840</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">Median incident acknowledgment: 6m 22s</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">False-positive reports this week: 3.1%</p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardModule;