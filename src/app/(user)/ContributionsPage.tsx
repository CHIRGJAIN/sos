import React, { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/ui/EmptyState";
import { contributions, donationTransactions } from "@/data/mockData";

const ContributionsPage: React.FC = () => {
  const [tab, setTab] = useState<"MADE" | "RECEIVED">("MADE");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const contributionStats = useMemo(() => {
    const made = contributions.filter((item) => item.direction === "MADE").length;
    const received = contributions.filter((item) => item.direction === "RECEIVED").length;
    const recent = contributions.slice(0, 3).length;
    const madeValue = contributions
      .filter((item) => item.direction === "MADE")
      .reduce((sum, item) => sum + (Number((item.amount || "0").replace(/[^\d]/g, "")) || 0), 0);
    const receivedValue = donationTransactions.reduce((sum, item) => sum + item.amount, 0);
    return { made, received, recent, madeValue, receivedValue };
  }, []);

  const filtered = useMemo(() => {
    const dataset = contributions.filter((item) => item.direction === tab);
    const ordered = [...dataset].sort((a, b) =>
      sortOrder === "newest"
        ? b.dateTime.localeCompare(a.dateTime)
        : a.dateTime.localeCompare(b.dateTime)
    );
    return ordered;
  }, [sortOrder, tab]);

  const selected = filtered.find((item) => item.id === selectedId) || null;

  return (
    <DashboardShell portal="user" title="Contributions">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Made</p>
              <p className="mt-1 text-2xl font-semibold">{contributionStats.made}</p>
              <p className="text-xs text-muted-foreground">INR {contributionStats.madeValue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Received</p>
              <p className="mt-1 text-2xl font-semibold">{contributionStats.received}</p>
              <p className="text-xs text-muted-foreground">
                INR {contributionStats.receivedValue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Recent (7 days)</p>
              <p className="mt-1 text-2xl font-semibold">{contributionStats.recent}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,38%)]">
          <Card className="border-primary/20 bg-card/75">
            <CardHeader className="space-y-4">
              <CardTitle className="text-xl">Contribution History</CardTitle>
              <div className="flex flex-wrap gap-2">
                <PillButton active={tab === "MADE"} onClick={() => setTab("MADE")}>
                  Made
                </PillButton>
                <PillButton active={tab === "RECEIVED"} onClick={() => setTab("RECEIVED")}>
                  Received
                </PillButton>
                <PillButton
                  className="ml-auto"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
                  }
                >
                  Sort: {sortOrder === "newest" ? "Newest" : "Oldest"}
                </PillButton>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                    selectedId === item.id
                      ? "border-accent bg-accent/10"
                      : "border-primary/20 bg-popover/80 hover:bg-secondary/65"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{item.to}</p>
                    <p className="text-xs text-muted-foreground">{item.dateTime}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">For: {item.for}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-xl">Contribution Detail</CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <div className="space-y-3 rounded-xl border border-primary/20 bg-popover/80 p-4">
                  <p className="text-sm">
                    <span className="font-semibold">Amount: </span>
                    {selected.amount || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Type: </span>
                    {selected.type || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">To: </span>
                    {selected.to}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">For: </span>
                    {selected.for}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Date/Time: </span>
                    {selected.dateTime}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Description: </span>
                    {selected.description || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Scope: </span>
                    {selected.scope || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Donation Type: </span>
                    {selected.donationType || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Donor Type: </span>
                    {selected.donorType || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Donor Channel: </span>
                    {selected.donorChannel || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Linked Case: </span>
                    {selected.linkedCaseId || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Linked Campaign: </span>
                    {selected.linkedCampaignId || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Insurance Ref: </span>
                    {selected.insurancePolicyRef || "-"}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Reimbursed to Reservoir: </span>
                    {selected.reimbursedToReservoir ? "Yes" : "No"}
                  </p>
                </div>
              ) : (
                <EmptyState
                  title="Choose a contribution"
                  description="Select any contribution from the list to review the full details."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ContributionsPage;
