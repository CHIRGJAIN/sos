import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PillButton from "@/components/ui/PillButton";
import EmptyState from "@/components/ui/EmptyState";
import {
  Contribution,
  DonationTransaction,
  ReservoirLedgerEntry,
  Scope,
  contributions,
  donationTransactions,
  reservoirLedger,
} from "@/data/mockData";

type TransparencyTab = "RECEIVED" | "USED" | "RESERVOIR";

interface TransparencyBoardProps {
  adminView?: boolean;
}

const scopeOptions: Scope[] = ["DISTRICT", "STATE", "COUNTRY", "GLOBAL"];

const scopeLabel: Record<Scope, string> = {
  DISTRICT: "District",
  STATE: "State",
  COUNTRY: "Country",
  GLOBAL: "Global",
};

const currency = (amount: number) => `INR ${amount.toLocaleString()}`;

const receivedChannels: Array<{
  key: DonationTransaction["channel"];
  label: string;
}> = [
  { key: "PUBLIC", label: "Public" },
  { key: "BUSINESS_CONTRIBUTION", label: "Business Contributions (incl. advertising)" },
  { key: "GOVERNMENT", label: "Government (subsidies/grants/political)" },
];

const usedBuckets = [
  "Recipients",
  "NGO/Social Sector",
  "Movements",
  "Welfare",
  "Propaganda/Fulfillment",
] as const;

const reservoirSourceLabels: Record<string, string> = {
  ADS: "Company Ads / Promotions",
  MERCH: "Merchandise",
  FUNDRAISING: "Fundraising",
  PUBLIC_UNUSED: "Public Donations (unused/returned)",
  GOVT_GRANT: "Government Subsidies/Grants",
  BUSINESS_CSR: "Business CSR / Collaborations",
  INSURANCE_REIMBURSE: "Insurance Compensatory",
  PUBLIC_SECTOR_SURPLUS: "Public Sector Surplus/Welfare",
};

const usageBucketLabel = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized.includes("ngo") || normalized.includes("welfare")) return "NGO/Social Sector";
  if (normalized.includes("movement")) return "Movements";
  if (normalized.includes("propaganda") || normalized.includes("fulfillment")) return "Propaganda/Fulfillment";
  if (normalized.includes("recipient") || normalized.includes("medical")) return "Recipients";
  return "Welfare";
};

const TransparencyBoard: React.FC<TransparencyBoardProps> = ({ adminView = false }) => {
  const [scope, setScope] = useState<Scope>("DISTRICT");
  const [tab, setTab] = useState<TransparencyTab>("RECEIVED");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const receivedRows = useMemo(
    () => donationTransactions.filter((item) => item.scope === scope),
    [scope]
  );

  const usedRows = useMemo(
    () => contributions.filter((item) => item.scope === scope && item.direction === "MADE"),
    [scope]
  );

  const reservoirRows = useMemo(
    () => reservoirLedger.filter((item) => item.scope === scope),
    [scope]
  );

  const dataset = tab === "RECEIVED" ? receivedRows : tab === "USED" ? usedRows : reservoirRows;

  const selected = dataset.find((item) => item.id === selectedId) || null;

  const receivedBreakdown = useMemo(() => {
    const initial: Record<string, number> = {
      PUBLIC: 0,
      BUSINESS_CONTRIBUTION: 0,
      GOVERNMENT: 0,
    };
    return receivedRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.channel] = (acc[row.channel] || 0) + row.amount;
      return acc;
    }, initial);
  }, [receivedRows]);

  const usedBreakdown = useMemo(() => {
    const initial: Record<string, number> = {
      Recipients: 0,
      "NGO/Social Sector": 0,
      Movements: 0,
      Welfare: 0,
      "Propaganda/Fulfillment": 0,
    };
    return usedRows.reduce<Record<string, number>>((acc, row) => {
      const key = usageBucketLabel(row.for);
      const amount = Number((row.amount || "0").replace(/[^\d]/g, "")) || 0;
      acc[key] = (acc[key] || 0) + amount;
      return acc;
    }, initial);
  }, [usedRows]);

  const reservoirBreakdown = useMemo(() => {
    const initial: Record<string, number> = Object.keys(reservoirSourceLabels).reduce(
      (acc, key) => ({ ...acc, [key]: 0 }),
      {} as Record<string, number>
    );
    return reservoirRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.sourceType] = (acc[row.sourceType] || 0) + (row.direction === "CREDIT" ? row.amount : -row.amount);
      return acc;
    }, initial);
  }, [reservoirRows]);

  const totalReceived = receivedRows.reduce((sum, row) => sum + row.amount, 0);
  const totalUsed = usedRows.reduce(
    (sum, row) => sum + (Number((row.amount || "0").replace(/[^\d]/g, "")) || 0),
    0
  );
  const reservoirBalance = reservoirRows.reduce(
    (sum, row) => sum + (row.direction === "CREDIT" ? row.amount : -row.amount),
    0
  );

  return (
    <div className="space-y-5">
      <Card className="border-primary/20 bg-card/75">
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap gap-2">
            {scopeOptions.map((item) => (
              <PillButton key={item} active={scope === item} onClick={() => setScope(item)}>
                {scopeLabel[item]}
              </PillButton>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-primary/20 bg-popover/80 p-3">
              <p className="text-xs text-muted-foreground">Donations Received</p>
              <p className="mt-1 text-lg font-semibold">{currency(totalReceived)}</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-popover/80 p-3">
              <p className="text-xs text-muted-foreground">Donations Used</p>
              <p className="mt-1 text-lg font-semibold">{currency(totalUsed)}</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-popover/80 p-3">
              <p className="text-xs text-muted-foreground">Reservoir Balance</p>
              <p className="mt-1 text-lg font-semibold">{currency(reservoirBalance)}</p>
            </div>
          </div>
          {adminView && (
            <p className="text-xs text-muted-foreground">
              Admin view includes full channel/source breakdown and case-linked transaction details.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl">Transparency Lists</CardTitle>
            <div className="flex flex-wrap gap-2">
              <PillButton active={tab === "RECEIVED"} onClick={() => setTab("RECEIVED")}>
                Donations Received
              </PillButton>
              <PillButton active={tab === "USED"} onClick={() => setTab("USED")}>
                Donations Used
              </PillButton>
              <PillButton active={tab === "RESERVOIR"} onClick={() => setTab("RESERVOIR")}>
                Reservoir
              </PillButton>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {dataset.map((row) => (
              <button
                key={row.id}
                onClick={() => setSelectedId(row.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left ${
                  selectedId === row.id
                    ? "border-accent bg-accent/10"
                    : "border-primary/20 bg-popover/80 hover:bg-secondary/60"
                }`}
              >
                {tab === "RECEIVED" && (
                  <>
                    <p className="text-sm font-semibold">{(row as DonationTransaction).donorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {(row as DonationTransaction).channel} - {currency((row as DonationTransaction).amount)}
                    </p>
                  </>
                )}
                {tab === "USED" && (
                  <>
                    <p className="text-sm font-semibold">{(row as Contribution).to}</p>
                    <p className="text-xs text-muted-foreground">
                      {(row as Contribution).for} - {(row as Contribution).amount || "-"}
                    </p>
                  </>
                )}
                {tab === "RESERVOIR" && (
                  <>
                    <p className="text-sm font-semibold">{(row as ReservoirLedgerEntry).sourceType}</p>
                    <p className="text-xs text-muted-foreground">
                      {(row as ReservoirLedgerEntry).direction} - {currency((row as ReservoirLedgerEntry).amount)}
                    </p>
                  </>
                )}
              </button>
            ))}
            {dataset.length === 0 && (
              <EmptyState
                title="No records for selected scope"
                description="Try another scope filter to view received, used, and reservoir records."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-lg">Breakdown & Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-popover/80 p-3">
              <p className="text-xs text-muted-foreground">
                Scope Breakdown - {scopeLabel[scope]}
              </p>
              <div className="mt-2 space-y-1.5 text-sm">
                {tab === "RECEIVED" &&
                  receivedChannels.map(({ key, label }) => (
                    <p key={key}>
                      <span className="font-semibold">{label}:</span> {currency(receivedBreakdown[key] || 0)}
                    </p>
                  ))}
                {tab === "USED" &&
                  usedBuckets.map((bucket) => (
                    <p key={bucket}>
                      <span className="font-semibold">{bucket}:</span> {currency(usedBreakdown[bucket] || 0)}
                    </p>
                  ))}
                {tab === "RESERVOIR" &&
                  Object.keys(reservoirSourceLabels).map((key) => (
                    <p key={key}>
                      <span className="font-semibold">{reservoirSourceLabels[key]}:</span>{" "}
                      {currency(reservoirBreakdown[key] || 0)}
                    </p>
                  ))}
              </div>
            </div>

            {selected ? (
              <div className="rounded-xl border border-primary/20 bg-popover/80 p-3 text-sm">
                <p className="mb-2 text-xs text-muted-foreground">Selected Entry</p>
                <pre className="overflow-auto whitespace-pre-wrap break-words text-xs">
                  {JSON.stringify(selected, null, 2)}
                </pre>
              </div>
            ) : (
              <EmptyState
                title="Select a transparency row"
                description="Choose an item from the list to inspect complete metadata and references."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransparencyBoard;
