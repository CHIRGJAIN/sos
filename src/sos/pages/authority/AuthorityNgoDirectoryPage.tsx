import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, DataTableColumn } from "@/sos/components/data-table";
import { FilterBar, MultiSelect, SearchInput, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { NgoOrganization } from "@/sos/models";

const columns: DataTableColumn<NgoOrganization>[] = [
  {
    key: "name",
    label: "Organization",
    sortable: true,
    sortValue: (row) => row.name,
    render: (row) => row.name,
  },
  {
    key: "services",
    label: "Services",
    render: (row) => row.services.join(", "),
  },
  {
    key: "coverage",
    label: "Coverage",
    render: (row) => row.coverageAreas.join(", "),
  },
  {
    key: "availability",
    label: "Availability",
    sortable: true,
    sortValue: (row) => row.availability,
    render: (row) => row.availability,
  },
  {
    key: "capacity",
    label: "Capacity",
    sortable: true,
    sortValue: (row) => row.capacity,
    render: (row) => `${row.capacity}%`,
  },
  {
    key: "rating",
    label: "Reliability",
    sortable: true,
    sortValue: (row) => row.reliabilityScore,
    render: (row) => row.reliabilityScore.toFixed(1),
  },
];

const AuthorityNgoDirectoryPage = () => {
  const { ngos } = useSosApp();
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string[]>([]);

  const services = useMemo(() => {
    return Array.from(new Set(ngos.flatMap((ngo) => ngo.services))).sort();
  }, [ngos]);

  const rows = useMemo(() => {
    return ngos.filter((ngo) => {
      const matchesService = serviceFilter.length ? serviceFilter.some((service) => ngo.services.includes(service)) : true;
      if (!matchesService) return false;
      const q = query.toLowerCase().trim();
      if (!q) return true;
      return ngo.name.toLowerCase().includes(q) || ngo.coverageAreas.some((area) => area.toLowerCase().includes(q));
    });
  }, [ngos, query, serviceFilter]);

  return (
    <div className="space-y-4">
      <SectionTitle title="NGOs Directory" subtitle="Coverage, capacity, reliability, and assignment readiness" />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search NGO or coverage area" className="w-full md:w-[280px]" />
        <MultiSelect label="Services" options={services} selected={serviceFilter} onChange={setServiceFilter} />
      </FilterBar>

      <DataTable rows={rows} columns={columns} rowKey={(row) => row.id} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((ngo) => (
          <Card key={ngo.id} className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-base">{ngo.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p><span className="font-medium text-slate-700">Contact:</span> {ngo.contactPerson}</p>
              <p><span className="font-medium text-slate-700">Phone:</span> {ngo.contactPhone}</p>
              <p><span className="font-medium text-slate-700">Services:</span> {ngo.services.join(", ")}</p>
              <p><span className="font-medium text-slate-700">Coverage:</span> {ngo.coverageAreas.join(", ")}</p>
              <p><span className="font-medium text-slate-700">Availability:</span> {ngo.availability}</p>
              <p><span className="font-medium text-slate-700">Capacity:</span> {ngo.capacity}%</p>
              <div className="flex gap-2 pt-1">
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link to={`/authority/ngos/${ngo.id}`}>View profile</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-full"
                  onClick={() => toast.success(`Assignment initiated for ${ngo.name}`)}
                >
                  Assign case
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuthorityNgoDirectoryPage;
