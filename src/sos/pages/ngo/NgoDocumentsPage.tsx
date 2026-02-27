import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterToolbar, SearchInput, SectionTitle } from "@/sos/components/common";
import { Pagination } from "@/sos/components/pagination";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const PAGE_SIZE = 10;

const NgoDocumentsPage = () => {
  const { incidents } = useSosApp();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const documents = useMemo(() => {
    return incidents
      .flatMap((incident) =>
        incident.attachments.map((attachment, index) => ({
          id: `${incident.id}-${index}`,
          incidentId: incident.id,
          title: `${incident.id} Evidence ${index + 1}`,
          path: attachment,
          uploadedAt: incident.updatedAt,
          status: incident.status,
        })),
      )
      .filter((doc) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return doc.incidentId.toLowerCase().includes(q) || doc.title.toLowerCase().includes(q);
      })
      .sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  }, [incidents, query]);

  const pageRows = documents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <SectionTitle title="Documents & Records" subtitle="All attached evidence files and records linked to NGO cases" />

      <FilterToolbar>
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Search by case ID or file title"
          className="w-full bg-white md:w-[320px]"
        />
      </FilterToolbar>

      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pageRows.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">{doc.title}</p>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600">
                  {doc.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">Case: {doc.incidentId}</p>
              <p className="text-xs text-slate-500">Updated: {formatDateTime(doc.uploadedAt)}</p>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full">Preview</Button>
                <Button size="sm" variant="outline" className="rounded-full">Download</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Pagination page={page} pageSize={PAGE_SIZE} total={documents.length} onPageChange={setPage} />
    </div>
  );
};

export default NgoDocumentsPage;

