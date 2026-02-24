import React, { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import EmptyState from "@/components/ui/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BusinessAdCampaign,
  Scope,
  businessAdCampaigns,
  donationTransactions,
  reservoirLedger,
} from "@/data/mockData";

const scopeOptions: Scope[] = ["DISTRICT", "STATE", "COUNTRY", "GLOBAL"];

const BusinessDashboardPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<BusinessAdCampaign[]>(businessAdCampaigns);
  const [scope, setScope] = useState<Scope>("STATE");
  const [selectedId, setSelectedId] = useState<string | null>(businessAdCampaigns[0]?.id || null);
  const [form, setForm] = useState({
    businessName: "",
    minFee: "15000",
    paidAmount: "18000",
    csrContributionPct: "15",
    linkedCause: "Reservoir",
  });

  const filteredCampaigns = useMemo(
    () => campaigns.filter((item) => item.scope === scope),
    [campaigns, scope]
  );

  const selected = filteredCampaigns.find((item) => item.id === selectedId) || null;

  const adPaidTotal = filteredCampaigns.reduce((sum, item) => sum + item.paidAmount, 0);
  const csrContributionTotal = filteredCampaigns.reduce(
    (sum, item) => sum + item.paidAmount * (item.csrContributionPct / 100),
    0
  );
  const trustBadge =
    csrContributionTotal >= 50000 ? "Platinum Trust" : csrContributionTotal >= 20000 ? "Gold Trust" : "Standard";

  const linkedReservoirCredits = reservoirLedger
    .filter((item) => item.sourceType === "ADS" || item.sourceType === "BUSINESS_CSR")
    .reduce((sum, item) => sum + item.amount, 0);

  const linkedBusinessDonations = donationTransactions
    .filter((item) => item.donorType === "BUSINESS")
    .reduce((sum, item) => sum + item.amount, 0);

  const createCampaign = () => {
    if (!form.businessName.trim()) return;
    const now = new Date();
    const id = `BC-NEW-${now.getTime()}`;
    const minFee = Number(form.minFee) || 0;
    const paidAmount = Number(form.paidAmount) || 0;
    const csrContributionPct = Number(form.csrContributionPct) || 0;

    const newCampaign: BusinessAdCampaign = {
      id,
      businessId: `biz-${now.getTime()}`,
      businessName: form.businessName.trim(),
      scope,
      minFee,
      paidAmount,
      csrContributionPct,
      linkedCause: form.linkedCause.trim() || "Reservoir",
      startAt: now.toISOString().slice(0, 10),
      endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      status: paidAmount >= minFee ? "ACTIVE" : "DRAFT",
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setSelectedId(newCampaign.id);
    setForm((prev) => ({ ...prev, businessName: "" }));
  };

  return (
    <DashboardShell portal="business" title="Business Promotion">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Ads Paid</p>
              <p className="mt-1 text-xl font-semibold">INR {adPaidTotal.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">CSR to Cause/Reservoir</p>
              <p className="mt-1 text-xl font-semibold">INR {Math.round(csrContributionTotal).toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Reservoir Credits (Ads + CSR)</p>
              <p className="mt-1 text-xl font-semibold">INR {linkedReservoirCredits.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Trust Badge</p>
              <p className="mt-1 text-xl font-semibold">{trustBadge}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader className="space-y-4">
            <CardTitle className="text-xl">Create Ad Campaign</CardTitle>
            <div className="flex flex-wrap gap-2">
              {scopeOptions.map((item) => (
                <PillButton key={item} active={scope === item} onClick={() => setScope(item)}>
                  {item}
                </PillButton>
              ))}
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-5">
            <input
              value={form.businessName}
              onChange={(event) => setForm((prev) => ({ ...prev, businessName: event.target.value }))}
              placeholder="Business name"
              className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={form.minFee}
              onChange={(event) => setForm((prev) => ({ ...prev, minFee: event.target.value }))}
              placeholder="Minimum fee"
              className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={form.paidAmount}
              onChange={(event) => setForm((prev) => ({ ...prev, paidAmount: event.target.value }))}
              placeholder="Paid amount"
              className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <input
              value={form.csrContributionPct}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, csrContributionPct: event.target.value }))
              }
              placeholder="CSR %"
              className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              <input
                value={form.linkedCause}
                onChange={(event) => setForm((prev) => ({ ...prev, linkedCause: event.target.value }))}
                placeholder="Linked cause"
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <button
                onClick={createCampaign}
                className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
              >
                Create
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-xl">Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredCampaigns.map((item) => {
                const contribution = Math.round(item.paidAmount * (item.csrContributionPct / 100));
                const meetsFee = item.paidAmount >= item.minFee;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left ${
                      selectedId === item.id
                        ? "border-accent bg-accent/10"
                        : "border-primary/20 bg-popover/80 hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{item.businessName}</p>
                      <p className="text-xs text-muted-foreground">{item.status}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Scope: {item.scope} | Paid: INR {item.paidAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSR Contribution: INR {contribution.toLocaleString()} ({item.csrContributionPct}%)
                    </p>
                    <p className={`text-xs ${meetsFee ? "text-emerald-700" : "text-destructive"}`}>
                      {meetsFee ? "Minimum advertising fee satisfied" : "Below minimum advertising fee"}
                    </p>
                  </button>
                );
              })}
              {filteredCampaigns.length === 0 && (
                <EmptyState
                  title="No campaigns in this scope"
                  description="Create a campaign for district/state/country/global promotion."
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-lg">Campaign Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <div className="space-y-3 rounded-xl border border-primary/20 bg-popover/80 p-4 text-sm">
                  <p>
                    <span className="font-semibold">Business:</span> {selected.businessName}
                  </p>
                  <p>
                    <span className="font-semibold">Scope:</span> {selected.scope}
                  </p>
                  <p>
                    <span className="font-semibold">Minimum Fee:</span> INR {selected.minFee.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Paid Amount:</span> INR {selected.paidAmount.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">CSR %:</span> {selected.csrContributionPct}%
                  </p>
                  <p>
                    <span className="font-semibold">CSR Contribution:</span> INR{" "}
                    {Math.round(selected.paidAmount * (selected.csrContributionPct / 100)).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold">Linked Cause:</span> {selected.linkedCause}
                  </p>
                  <p>
                    <span className="font-semibold">Business Contributions (all):</span> INR{" "}
                    {linkedBusinessDonations.toLocaleString()}
                  </p>
                  <p className="rounded-lg border border-primary/20 bg-secondary/50 px-3 py-2">
                    Public trust note: this campaign contributes part of ad fee to social cause/reservoir and
                    appears in transparency dashboards.
                  </p>
                </div>
              ) : (
                <EmptyState
                  title="Select a campaign"
                  description="Choose a campaign to review fee, scope, CSR contribution and trust details."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default BusinessDashboardPage;
