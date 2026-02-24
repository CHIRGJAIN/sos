import React, { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/ui/EmptyState";
import {
  Scope,
  contributions,
  donationTransactions,
  reservoirLedger,
} from "@/data/mockData";

type ResourceTab = "Resources Used" | "Resources Received" | "Reservoir";

const scopeOptions: Scope[] = ["DISTRICT", "STATE", "COUNTRY", "GLOBAL"];

const ResourceHandlePage: React.FC = () => {
  const [tab, setTab] = useState<ResourceTab>("Resources Used");
  const [scope, setScope] = useState<Scope>("DISTRICT");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const resourcesUsed = useMemo(
    () => contributions.filter((item) => item.direction === "MADE" && item.scope === scope),
    [scope]
  );

  const resourcesReceived = useMemo(
    () => donationTransactions.filter((item) => item.scope === scope),
    [scope]
  );

  const reservoirRows = useMemo(
    () => reservoirLedger.filter((item) => item.scope === scope),
    [scope]
  );

  const tabFiltered = useMemo(() => {
    if (tab === "Resources Used") return resourcesUsed;
    if (tab === "Resources Received") return resourcesReceived;
    return reservoirRows;
  }, [reservoirRows, resourcesReceived, resourcesUsed, tab]);

  const selected = tabFiltered.find((item) => item.id === selectedId) || null;

  const receivedBreakdown = resourcesReceived.reduce<Record<string, number>>((acc, item) => {
    acc[item.channel] = (acc[item.channel] || 0) + item.amount;
    return acc;
  }, {});

  const usedBreakdown = resourcesUsed.reduce<Record<string, number>>((acc, item) => {
    const key = item.for;
    const amount = Number((item.amount || "0").replace(/[^\d]/g, "")) || 0;
    acc[key] = (acc[key] || 0) + amount;
    return acc;
  }, {});

  const reservoirBreakdown = reservoirRows.reduce<Record<string, number>>((acc, item) => {
    acc[item.sourceType] = (acc[item.sourceType] || 0) + (item.direction === "CREDIT" ? item.amount : -item.amount);
    return acc;
  }, {});

  const totalReceived = resourcesReceived.reduce((sum, item) => sum + item.amount, 0);
  const totalUsed = resourcesUsed.reduce(
    (sum, item) => sum + (Number((item.amount || "0").replace(/[^\d]/g, "")) || 0),
    0
  );
  const reservoirBalance = reservoirRows.reduce(
    (sum, item) => sum + (item.direction === "CREDIT" ? item.amount : -item.amount),
    0
  );

  const exportCsv = () => {
    if (!tabFiltered.length) return;
    const headers = Array.from(
      new Set(tabFiltered.flatMap((item) => Object.keys(item as Record<string, unknown>)))
    );
    const rows = [
      headers,
      ...tabFiltered.map((item) =>
        headers.map((header) => String((item as Record<string, unknown>)[header] ?? ""))
      ),
    ];
    const csv = rows
      .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resource-transparency-${tab.toLowerCase().replaceAll(" ", "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardShell portal="resource" title="Resource Transparency">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Donations Received</p>
              <p className="mt-1 text-2xl font-semibold">INR {totalReceived.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Donations Used</p>
              <p className="mt-1 text-2xl font-semibold">INR {totalUsed.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Reservoir Balance</p>
              <p className="mt-1 text-2xl font-semibold">INR {reservoirBalance.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-card/75">
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap gap-2">
              {scopeOptions.map((item) => (
                <PillButton key={item} active={scope === item} onClick={() => setScope(item)}>
                  {item}
                </PillButton>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(["Resources Used", "Resources Received", "Reservoir"] as ResourceTab[]).map((label) => (
                <PillButton key={label} active={tab === label} onClick={() => setTab(label)}>
                  {label}
                </PillButton>
              ))}
              <button
                onClick={exportCsv}
                className="ml-auto rounded-lg border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
              >
                Export CSV
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-xl">Resource List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tabFiltered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left ${
                    selectedId === item.id
                      ? "border-accent bg-accent/10"
                      : "border-primary/20 bg-popover/80 hover:bg-secondary/65"
                  }`}
                >
                  {"donorName" in item && (
                    <>
                      <p className="text-sm font-semibold">{item.donorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.channel} | INR {item.amount.toLocaleString()}
                      </p>
                    </>
                  )}
                  {"to" in item && (
                    <>
                      <p className="text-sm font-semibold">{item.to}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.for} | {item.amount || "-"}
                      </p>
                    </>
                  )}
                  {"sourceType" in item && (
                    <>
                      <p className="text-sm font-semibold">{item.sourceType}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.direction} | INR {item.amount.toLocaleString()}
                      </p>
                    </>
                  )}
                </button>
              ))}
              {tabFiltered.length === 0 && (
                <EmptyState
                  title="No records for selected scope"
                  description="Switch scope or tab to inspect resources received, used, or reservoir ledger."
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-xl">Breakdown & Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-primary/20 bg-popover/80 p-3 text-sm">
                <p className="mb-1 text-xs text-muted-foreground">Scope Breakdown</p>
                {tab === "Resources Received" &&
                  Object.entries(receivedBreakdown).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold">{key}:</span> INR {value.toLocaleString()}
                    </p>
                  ))}
                {tab === "Resources Used" &&
                  Object.entries(usedBreakdown).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold">{key}:</span> INR {value.toLocaleString()}
                    </p>
                  ))}
                {tab === "Reservoir" &&
                  Object.entries(reservoirBreakdown).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-semibold">{key}:</span> INR {value.toLocaleString()}
                    </p>
                  ))}
              </div>

              {selected ? (
                <div className="rounded-xl border border-primary/20 bg-popover/80 p-3 text-sm">
                  <pre className="overflow-auto whitespace-pre-wrap break-words text-xs">
                    {JSON.stringify(selected, null, 2)}
                  </pre>
                </div>
              ) : (
                <EmptyState
                  title="No item selected"
                  description="Select a row from the resource list to inspect amount, source type, and references."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ResourceHandlePage;
