import React, { useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/ui/EmptyState";
import {
  authorityVerifications,
  distressSignals,
  evidenceMedias,
  incidentCases,
  incidentCategories,
} from "@/data/mockData";

type WindowFilter = "24h" | "7d" | "30d";

const DistressPage: React.FC = () => {
  const [tab, setTab] = useState<"SOS" | "MEDIA">("SOS");
  const [windowFilter, setWindowFilter] = useState<WindowFilter>("30d");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const enrichedSignals = useMemo(() => {
    return distressSignals.map((signal) => {
      const caseItem = incidentCases.find((item) => item.id === signal.id);
      const category = incidentCategories.find((item) => item.id === caseItem?.categoryId);
      const verification = authorityVerifications.find((item) => item.caseId === signal.id);
      const userMedia = evidenceMedias.filter(
        (item) => item.caseId === signal.id && item.uploadedByRole === "USER"
      );
      const policeMedia = evidenceMedias.filter(
        (item) =>
          item.caseId === signal.id &&
          (item.uploadedByRole === "POLICE" || item.uploadedByRole === "AUTHORITY")
      );

      return {
        ...signal,
        addressText: caseItem?.addressText || signal.geoLocation,
        categoryName: category?.name || signal.categoryId || "-",
        serviceProvided: verification?.serviceProvided || false,
        policeMedia,
        userMedia,
        verificationRemarks: verification?.remarks || signal.feedback || "Awaiting review",
        verificationResult: verification?.verificationResult || "PENDING",
      };
    });
  }, []);

  const filteredSignals = useMemo(() => {
    const byType = enrichedSignals.filter((item) => item.type === tab);
    const byWindow =
      windowFilter === "24h" ? byType.slice(0, 2) : windowFilter === "7d" ? byType.slice(0, 4) : byType;

    return byWindow.filter((item) =>
      `${item.geoLocation} ${item.dateTime} ${item.mediaType || ""} ${item.categoryName}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [enrichedSignals, query, tab, windowFilter]);

  const selected = filteredSignals.find((item) => item.id === selectedId) || null;

  return (
    <DashboardShell portal="user" title="Distress Signal Count">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,38%)]">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader className="space-y-4">
            <CardTitle className="text-xl">Signals</CardTitle>
            <div className="flex flex-wrap gap-2">
              <PillButton active={tab === "SOS"} onClick={() => setTab("SOS")}>
                SOS
              </PillButton>
              <PillButton active={tab === "MEDIA"} onClick={() => setTab("MEDIA")}>
                Media Upload
              </PillButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["24h", "7d", "30d"] as WindowFilter[]).map((item) => (
                <PillButton
                  key={item}
                  active={windowFilter === item}
                  onClick={() => setWindowFilter(item)}
                >
                  Last {item}
                </PillButton>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-popover px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by date or location"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredSignals.map((item) => (
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
                  <p className="text-sm font-semibold">{item.type}</p>
                  <p className="text-xs text-muted-foreground">{item.dateTime}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.geoLocation}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Reporter: {item.reporterRole || "-"} | Category: {item.categoryName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Verification: {item.verificationResult}
                </p>
              </button>
            ))}
            {filteredSignals.length === 0 && (
              <EmptyState
                title="No signals found"
                description="Adjust your search query or time filter to find distress records."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-xl">{tab === "SOS" ? "SOS Detail" : "Media Upload Detail"}</CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="space-y-3 rounded-xl border border-primary/20 bg-popover/80 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  <span className="font-medium">{selected.dateTime}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Geo-location / Address</p>
                  <p className="text-sm font-medium">{selected.geoLocation}</p>
                  <p className="text-xs text-muted-foreground">{selected.addressText}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reporter Role</p>
                  <p className="text-sm font-medium">{selected.reporterRole || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{selected.categoryName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Verification Status</p>
                  <p className="text-sm font-medium">
                    {selected.verificationStatus || "SUBMITTED"} / {selected.verificationResult}
                  </p>
                </div>
                {selected.type === "SOS" ? (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">For</p>
                      <p className="text-sm font-medium">{selected.for || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Police Evidence</p>
                      <p className="text-sm font-medium">
                        {selected.policeMedia.length
                          ? selected.policeMedia.map((item) => `${item.mediaType} (${item.id})`).join(", ")
                          : "Not uploaded"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Service Provided</p>
                      <p className="text-sm font-medium">{selected.serviceProvided ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Resolution Outcome</p>
                      <p className="text-sm font-medium">{selected.resolutionOutcome || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Feedback</p>
                      <p className="text-sm font-medium">{selected.verificationRemarks}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">Media Type</p>
                      <p className="text-sm font-medium">{selected.mediaType || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Media Preview</p>
                      <div className="mt-2 rounded-lg border border-primary/20 bg-secondary/60 p-3 text-sm">
                        {selected.mediaUrl || "No media available"}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Police Evidence</p>
                      <p className="text-sm font-medium">
                        {selected.policeMedia.length
                          ? selected.policeMedia.map((item) => `${item.mediaType} (${item.id})`).join(", ")
                          : "Not uploaded"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Service Provided</p>
                      <p className="text-sm font-medium">{selected.serviceProvided ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Resolution Outcome</p>
                      <p className="text-sm font-medium">{selected.resolutionOutcome || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Feedback</p>
                      <p className="text-sm font-medium">{selected.verificationRemarks}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <EmptyState
                title="Select a distress record"
                description="Choose an item from the left panel to view date, time, geo-location, media, and feedback."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default DistressPage;
