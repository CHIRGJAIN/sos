import React, { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/ui/EmptyState";
import { ngoOrganizations, ngoPosts } from "@/data/mockData";

const categories = [
  "All",
  "Disaster Relief",
  "Education",
  "Health",
  "Women",
  "Animal Welfare",
  "Environment",
];

const NgoFeedPage: React.FC = () => {
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(ngoPosts[0]?.id || null);
  const [raisedOverrides, setRaisedOverrides] = useState<Record<string, number>>({});

  const ngo = ngoOrganizations[0];

  const filtered = useMemo(
    () => (category === "All" ? ngoPosts : ngoPosts.filter((post) => post.category === category)),
    [category]
  );

  const selected = filtered.find((item) => item.id === selectedId) || null;

  const donateToPost = (id: string) => {
    setRaisedOverrides((prev) => ({ ...prev, [id]: (prev[id] || 0) + 2000 }));
  };

  const getRaised = (id: string, base: number) => base + (raisedOverrides[id] || 0);

  const totalGoal = filtered.reduce((sum, item) => sum + item.goalAmount, 0);
  const totalRaised = filtered.reduce((sum, item) => sum + getRaised(item.id, item.raisedAmount), 0);

  return (
    <DashboardShell portal="ngo" title="NGO Feed">
      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((item) => (
              <PillButton
                key={item}
                active={category === item}
                className="w-full text-left"
                onClick={() => setCategory(item)}
              >
                {item}
              </PillButton>
            ))}
            <div className="mt-4 rounded-xl border border-primary/20 bg-popover/80 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Quick Donate Stats</p>
              <p className="mt-1 font-semibold">Raised: INR {(totalRaised / 1000).toFixed(0)}K</p>
              <p className="text-muted-foreground">Goal: INR {(totalGoal / 1000).toFixed(0)}K</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-xl">Campaign Feed</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {filtered.map((post) => {
              const raised = getRaised(post.id, post.raisedAmount);
              const percent = Math.min(100, Math.round((raised / post.goalAmount) * 100));

              return (
                <div
                  key={post.id}
                  className={`overflow-hidden rounded-xl border bg-popover/85 shadow-soft ${
                    selectedId === post.id ? "border-accent" : "border-primary/20"
                  }`}
                >
                  <button onClick={() => setSelectedId(post.id)} className="w-full text-left">
                    <div className="relative h-44 bg-secondary/70">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Heart className="h-12 w-12 text-muted-foreground/35" />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-serif text-base font-semibold">{post.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{post.description}</p>
                      <div className="mt-3 h-2 rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>INR {(raised / 1000).toFixed(0)}K raised</span>
                        <span>{percent}%</span>
                      </div>
                    </div>
                  </button>
                  <div className="px-3 pb-3">
                    <button
                      onClick={() => donateToPost(post.id)}
                      className="w-full rounded-lg bg-accent py-2 text-sm font-semibold text-accent-foreground"
                    >
                      Donate
                    </button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-lg">Selected Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="space-y-3 rounded-xl border border-primary/20 bg-popover/80 p-4">
                <div className="h-44 rounded-lg bg-secondary/70" />
                <p className="font-semibold">{selected.title}</p>
                <p className="text-sm text-muted-foreground">{selected.description}</p>
                <p className="text-sm">
                  <span className="font-semibold">Category: </span>
                  {selected.category}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Goal: </span>INR {selected.goalAmount.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Raised: </span>
                  INR {getRaised(selected.id, selected.raisedAmount).toLocaleString()}
                </p>
                {selected.linkedCaseId && (
                  <p className="text-sm">
                    <span className="font-semibold">Linked Case: </span>
                    {selected.linkedCaseId}
                  </p>
                )}

                <div className="rounded-xl border border-primary/20 bg-secondary/50 p-3 text-sm">
                  <p className="text-xs text-muted-foreground">NGO Verification & CSR Partnerships</p>
                  <p className="mt-1">
                    <span className="font-semibold">NGO:</span> {ngo?.name || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Verification:</span> {ngo?.verificationStatus || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Documents:</span>{" "}
                    {ngo?.documents?.length ? ngo.documents.join(", ") : "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Partnership Types:</span>{" "}
                    {ngo?.partnershipTypes?.length ? ngo.partnershipTypes.join(", ") : "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Corporate Donations:</span> INR{" "}
                    {(ngo?.corporateDonations || 0).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Employee Volunteers:</span>{" "}
                    {ngo?.employeeVolunteers || 0}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Real-time service reports</p>
                  {ngo?.activityLogs?.map((log) => (
                    <div key={log.id} className="rounded-lg border border-primary/20 bg-secondary/45 p-2 text-xs">
                      <p className="font-semibold">{log.title}</p>
                      <p>Funds used: INR {log.fundsUsed.toLocaleString()}</p>
                      <p>Service: {log.serviceProvided}</p>
                      <p>Outcome: {log.outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                title="No campaign selected"
                description="Pick a campaign from the feed to view detailed donation information."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default NgoFeedPage;
