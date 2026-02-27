import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilterToolbar, MultiSelect, SearchInput, SectionTitle, StatCardCompact } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const AuthorityRespondersPage = () => {
  const { volunteers } = useSosApp();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);

  const roles = useMemo(() => Array.from(new Set(volunteers.map((v) => v.role))).sort(), [volunteers]);

  const filtered = useMemo(() => {
    return volunteers.filter((volunteer) => {
      if (statusFilter.length && !statusFilter.includes(volunteer.status)) return false;
      if (roleFilter.length && !roleFilter.includes(volunteer.role)) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return volunteer.name.toLowerCase().includes(q) || volunteer.organizationId.toLowerCase().includes(q);
    });
  }, [query, roleFilter, statusFilter, volunteers]);

  const available = volunteers.filter((item) => item.status === "available").length;
  const onMission = volunteers.filter((item) => item.status === "on-mission").length;
  const offline = volunteers.filter((item) => item.status === "offline").length;

  return (
    <div className="space-y-4">
      <SectionTitle title="Responders / Teams" subtitle="Manage responder readiness, assignment load, and shift visibility" />

      <div className="grid gap-2 sm:grid-cols-3">
        <StatCardCompact label="Available" value={String(available)} tone="success" />
        <StatCardCompact label="On Mission" value={String(onMission)} />
        <StatCardCompact label="Offline" value={String(offline)} tone="critical" />
      </div>

      <FilterToolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search responder or organization" className="w-full bg-white md:w-[320px]" />
        <MultiSelect label="Status" options={["available", "on-mission", "offline"]} selected={statusFilter} onChange={setStatusFilter} />
        <MultiSelect label="Role" options={roles} selected={roleFilter} onChange={setRoleFilter} />
      </FilterToolbar>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((volunteer) => (
          <Card key={volunteer.id} className="rounded-2xl border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span>{volunteer.name}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] uppercase text-slate-600">
                  {volunteer.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>Role: {volunteer.role}</p>
              <p>Skills: {volunteer.skills.join(", ")}</p>
              <p>Shift: {volunteer.shift}</p>
              <p>Assigned tasks: {volunteer.assignedTaskCount}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button size="sm" className="rounded-full">Assign Team</Button>
                <Button size="sm" variant="outline" className="rounded-full">Open Contact</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AuthorityRespondersPage;

