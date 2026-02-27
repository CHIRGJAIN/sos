import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { FilterToolbar, SearchInput, SectionTitle } from "@/sos/components/common";
import { Pagination } from "@/sos/components/pagination";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const PAGE_SIZE = 8;

const NgoReportsPage = () => {
  const { incidents } = useSosApp();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    return incidents
      .filter((incident) => incident.assignedNgoIds.length > 0)
      .filter((incident) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return incident.id.toLowerCase().includes(q) || incident.title.toLowerCase().includes(q);
      })
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [incidents, query]);

  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <SectionTitle title="Reports Submitted" subtitle="Track case reports and completion updates shared with authority" />

      <FilterToolbar>
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Search case ID or report title"
          className="w-full bg-white md:w-[320px]"
        />
      </FilterToolbar>

      <div className="space-y-2">
        {pageRows.map((incident) => (
          <Card key={incident.id} className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                <span>{incident.id} - {incident.title}</span>
                <div className="flex gap-2">
                  <AlertBadge priority={incident.priority} />
                  <StatusBadge status={incident.status} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>{incident.description}</p>
              <div className="grid gap-1 text-xs text-slate-500 sm:grid-cols-3">
                <span>Comments: {incident.commentsCount}</span>
                <span>Updates: {incident.updatesCount}</span>
                <span>Updated: {formatDateTime(incident.updatedAt)}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full">Open Report</Button>
                <Button size="sm" variant="outline" className="rounded-full">Download PDF</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} total={rows.length} onPageChange={setPage} />
    </div>
  );
};

export default NgoReportsPage;

