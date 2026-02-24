import React, { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import EmptyState from "@/components/ui/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevelationCase, evidenceMedias, revelationCases } from "@/data/mockData";

type TypeFilter = "ALL" | "CORPORATE" | "PUBLIC" | "CSF";

const AdminRevelationsPage: React.FC = () => {
  const [cases, setCases] = useState<RevelationCase[]>(revelationCases);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(revelationCases[0]?.id || null);
  const [anonymized, setAnonymized] = useState<Record<string, boolean>>({});
  const [supportNotes, setSupportNotes] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => (typeFilter === "ALL" ? cases : cases.filter((item) => item.type === typeFilter)),
    [cases, typeFilter]
  );

  const selected = filtered.find((item) => item.id === selectedId) || null;

  const selectedEvidence = selected
    ? evidenceMedias.filter((media) => selected.evidenceIds.includes(media.id))
    : [];

  const updateStatus = (status: RevelationCase["status"]) => {
    if (!selected) return;
    setCases((prev) => prev.map((item) => (item.id === selected.id ? { ...item, status } : item)));
  };

  return (
    <DashboardShell portal="admin" title="Revelation Admin">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader className="space-y-4">
            <CardTitle className="text-xl">Revelation Queue</CardTitle>
            <div className="flex flex-wrap gap-2">
              {(["ALL", "CORPORATE", "PUBLIC", "CSF"] as TypeFilter[]).map((item) => (
                <PillButton key={item} active={typeFilter === item} onClick={() => setTypeFilter(item)}>
                  {item}
                </PillButton>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left ${
                  selected?.id === item.id
                    ? "border-accent bg-accent/10"
                    : "border-primary/20 bg-popover/80 hover:bg-secondary/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.type} / {item.subtype}
                </p>
                <p className="text-xs text-muted-foreground">
                  Legal: {item.legalSupportRequested ? "Yes" : "No"} | Psychological:{" "}
                  {item.psychologicalSupportRequested ? "Yes" : "No"}
                </p>
              </button>
            ))}
            {filtered.length === 0 && (
              <EmptyState
                title="No revelations found"
                description="Adjust category filter to inspect corporate, public, or CSF cases."
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-xl">Evidence & Publish Controls</CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-primary/20 bg-popover/80 p-4 text-sm">
                  <p>
                    <span className="font-semibold">Case ID:</span> {selected.id}
                  </p>
                  <p>
                    <span className="font-semibold">Type/Subtype:</span> {selected.type} / {selected.subtype}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {selected.status}
                  </p>
                  <p>
                    <span className="font-semibold">Anonymity Requested:</span>{" "}
                    {selected.anonymityRequested ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-semibold">Reporter Visible:</span>{" "}
                    {anonymized[selected.id] ? "No (anonymized)" : "Yes"}
                  </p>
                </div>

                <div className="rounded-xl border border-primary/20 bg-popover/80 p-4 text-sm">
                  <p className="mb-2 text-xs text-muted-foreground">Evidence Viewer</p>
                  {selectedEvidence.length ? (
                    <div className="space-y-2">
                      {selectedEvidence.map((media) => (
                        <div key={media.id} className="rounded-lg border border-primary/20 bg-secondary/50 p-3">
                          <p>
                            <span className="font-semibold">{media.id}</span> - {media.mediaType} ({media.uploadedByRole})
                          </p>
                          <p className="text-xs text-muted-foreground">URL: {media.url}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No linked evidence files.</p>
                  )}
                </div>

                <div className="grid gap-2 md:grid-cols-2">
                  <button
                    onClick={() =>
                      setAnonymized((prev) => ({ ...prev, [selected.id]: !prev[selected.id] }))
                    }
                    className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
                  >
                    {anonymized[selected.id] ? "Unmask Reporter" : "Anonymize Reporter"}
                  </button>
                  <button
                    onClick={() => updateStatus("VERIFIED")}
                    className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
                  >
                    Mark Verified
                  </button>
                  <button
                    onClick={() => updateStatus("PUBLISHED")}
                    className="rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
                  >
                    Mark Published
                  </button>
                  <button
                    onClick={() => updateStatus("CLOSED")}
                    className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
                  >
                    Close Case
                  </button>
                </div>

                <div className="rounded-xl border border-primary/20 bg-popover/80 p-3">
                  <p className="mb-1 text-xs text-muted-foreground">
                    Legal/Psychological support references and notes
                  </p>
                  <textarea
                    value={supportNotes[selected.id] || ""}
                    onChange={(event) =>
                      setSupportNotes((prev) => ({ ...prev, [selected.id]: event.target.value }))
                    }
                    placeholder="Attach legal aid contact, psychological support references, admin notes..."
                    className="min-h-[120px] w-full rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>
            ) : (
              <EmptyState
                title="Select a revelation case"
                description="Choose a queue item to review evidence, anonymize reporter, and publish lifecycle updates."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default AdminRevelationsPage;
