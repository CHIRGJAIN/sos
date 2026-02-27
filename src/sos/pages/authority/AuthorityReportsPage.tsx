import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { FilterToolbar, MultiSelect, SearchInput, SectionTitle } from "@/sos/components/common";
import { Pagination } from "@/sos/components/pagination";
import { useSosApp } from "@/sos/context/SosAppContext";
import { formatDateTime } from "@/sos/utils";

const PAGE_SIZE = 8;

const AuthorityReportsPage = () => {
  const { incidents } = useSosApp();
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return incidents
      .filter((incident) => (statuses.length ? statuses.includes(incident.status) : true))
      .filter((incident) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          incident.id.toLowerCase().includes(q) ||
          incident.title.toLowerCase().includes(q) ||
          incident.location.district.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [incidents, query, statuses]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <SectionTitle title="Reports & Complaints" subtitle="All reported incidents with verification and resolution status" />

      <FilterToolbar>
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Search report ID, title, district"
          className="w-full bg-white md:w-[320px]"
        />
        <MultiSelect
          label="Status"
          options={["open", "verified", "assigned", "in-progress", "resolved", "closed"]}
          selected={statuses}
          onChange={(value) => {
            setStatuses(value);
            setPage(1);
          }}
        />
      </FilterToolbar>

      <div className="space-y-2">
        {pageRows.map((report) => (
          <div key={report.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{report.id} - {report.title}</p>
                <p className="text-sm text-slate-600">{report.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <AlertBadge priority={report.priority} />
                <StatusBadge status={report.status} />
              </div>
            </div>
            <div className="mt-2 grid gap-1 text-xs text-slate-500 sm:grid-cols-3">
              <span>Category: {report.category}</span>
              <span>District: {report.location.district}</span>
              <span>Created: {formatDateTime(report.createdAt)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" className="rounded-full">
                <Link to={`/authority/reports/${report.id}`}>View Report</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to={`/authority/requests/${report.id}`}>Open Case</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
    </div>
  );
};

export default AuthorityReportsPage;

