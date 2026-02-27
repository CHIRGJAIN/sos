import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { DataTable, DataTableColumn } from "@/sos/components/data-table";
import { FilterBar, SearchInput, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Incident } from "@/sos/models";
import { formatDateTime } from "@/sos/utils";

const columns: DataTableColumn<Incident>[] = [
  {
    key: "id",
    label: "Case ID",
    sortable: true,
    sortValue: (row) => row.id,
    render: (row) => row.id,
  },
  {
    key: "priority",
    label: "Severity",
    sortable: true,
    sortValue: (row) => row.priority,
    render: (row) => <AlertBadge priority={row.priority} />,
  },
  {
    key: "location",
    label: "Location",
    sortable: true,
    sortValue: (row) => row.location.district,
    render: (row) => `${row.location.area}, ${row.location.district}`,
  },
  {
    key: "source",
    label: "Source",
    sortable: true,
    sortValue: (row) => row.source,
    render: (row) => row.source,
  },
  {
    key: "created",
    label: "Reported",
    sortable: true,
    sortValue: (row) => row.createdAt,
    render: (row) => formatDateTime(row.createdAt),
  },
];

const AuthorityVerifyReportsPage = () => {
  const { incidents, verifyReport, assignNgo, ngos } = useSosApp();
  const [selectedId, setSelectedId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [source, setSource] = useState("all");
  const [verificationAction, setVerificationAction] = useState<"verified" | "duplicate" | "false" | "need-info">("verified");
  const [verificationNote, setVerificationNote] = useState("");
  const [assignAfterVerify, setAssignAfterVerify] = useState("");

  const queue = useMemo(() => {
    return incidents
      .filter((incident) => incident.verificationStatus === "pending")
      .filter((incident) => (severity === "all" ? true : incident.priority === severity))
      .filter((incident) => (source === "all" ? true : incident.source === source))
      .filter((incident) => {
        const q = query.toLowerCase().trim();
        if (!q) return true;
        return (
          incident.id.toLowerCase().includes(q) ||
          incident.location.area.toLowerCase().includes(q) ||
          incident.location.district.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [incidents, query, severity, source]);

  const selectedReport = queue.find((incident) => incident.id === selectedId) || queue[0];

  const submitVerification = () => {
    if (!selectedReport) return;
    const result = verifyReport(selectedReport.id, verificationAction, verificationNote.trim());
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    if (verificationAction === "verified" && assignAfterVerify) {
      const assignResult = assignNgo(selectedReport.id, assignAfterVerify);
      if (assignResult.success) {
        toast.success(assignResult.message);
      }
    }

    toast.success(result.message);
    setVerificationNote("");
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Verify Reports" subtitle="Queue review, verification notes, and immediate assignment" />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search by report ID or location" className="w-full md:w-[280px]" />
        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger className="w-40 rounded-full border-slate-300">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-44 rounded-full border-slate-300">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All source</SelectItem>
            <SelectItem value="app">App</SelectItem>
            <SelectItem value="citizen">Citizen</SelectItem>
            <SelectItem value="call-center">Call center</SelectItem>
            <SelectItem value="officer">Officer</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Unverified queue ({queue.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={queue}
              columns={columns}
              rowKey={(row) => row.id}
              emptyTitle="No unverified reports"
              emptyDescription="Incoming queue is clear."
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {queue.map((incident) => (
                <Button
                  key={incident.id}
                  variant={selectedReport?.id === incident.id ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedId(incident.id)}
                >
                  {incident.id}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Report Detail & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedReport ? (
              <>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{selectedReport.id}</p>
                    <AlertBadge priority={selectedReport.priority} />
                    <StatusBadge status={selectedReport.status} />
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{selectedReport.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{selectedReport.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {selectedReport.location.area}, {selectedReport.location.district} • {selectedReport.source}
                  </p>
                </div>

                <div className="space-y-1">
                  <Label>Verification action</Label>
                  <Select value={verificationAction} onValueChange={(value) => setVerificationAction(value as typeof verificationAction)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="duplicate">Duplicate</SelectItem>
                      <SelectItem value="false">False report</SelectItem>
                      <SelectItem value="need-info">Need more info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Verification notes</Label>
                  <Textarea value={verificationNote} onChange={(event) => setVerificationNote(event.target.value)} className="min-h-24" />
                </div>

                <div className="space-y-1">
                  <Label>Assign after verification</Label>
                  <Select value={assignAfterVerify} onValueChange={setAssignAfterVerify}>
                    <SelectTrigger>
                      <SelectValue placeholder="Optional NGO assignment" />
                    </SelectTrigger>
                    <SelectContent>
                      {ngos.map((ngo) => (
                        <SelectItem key={ngo.id} value={ngo.id}>{ngo.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full rounded-full" onClick={submitVerification}>
                  Submit verification
                </Button>
              </>
            ) : (
              <p className="text-sm text-slate-500">No report selected.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthorityVerifyReportsPage;
