import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertBadge } from "@/sos/components/badges";
import { FilterBar, MapPreviewCard, SearchInput, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const NgoNearbyRequestsPage = () => {
  const { incidents } = useSosApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [distance, setDistance] = useState("15");

  const rows = useMemo(() => {
    return incidents
      .filter((incident) => ["open", "verified"].includes(incident.status))
      .filter((incident) => (category === "all" ? true : incident.category === category))
      .filter((incident) => (priority === "all" ? true : incident.priority === priority))
      .filter((incident) => {
        const q = query.toLowerCase().trim();
        if (!q) return true;
        return incident.id.toLowerCase().includes(q) || incident.location.area.toLowerCase().includes(q);
      })
      .slice(0, 8);
  }, [category, incidents, priority, query]);

  return (
    <div className="space-y-4">
      <SectionTitle title="Nearby Requests" subtitle="List and map layout for nearby demand and assignment opportunities" />

      <FilterBar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search nearby requests" className="w-full md:w-[280px]" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-44 rounded-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="medical">Medical</SelectItem>
            <SelectItem value="fire">Fire</SelectItem>
            <SelectItem value="disaster">Disaster</SelectItem>
            <SelectItem value="women-safety">Women safety</SelectItem>
            <SelectItem value="child-help">Child help</SelectItem>
            <SelectItem value="food-support">Food support</SelectItem>
            <SelectItem value="rescue">Rescue</SelectItem>
            <SelectItem value="shelter">Shelter</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-40 rounded-full">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={distance} onValueChange={setDistance}>
          <SelectTrigger className="w-36 rounded-full">
            <SelectValue placeholder="Distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 km</SelectItem>
            <SelectItem value="15">15 km</SelectItem>
            <SelectItem value="25">25 km</SelectItem>
            <SelectItem value="40">40 km</SelectItem>
          </SelectContent>
        </Select>
      </FilterBar>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          {rows.map((incident) => (
            <div key={incident.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{incident.id}</p>
                  <p className="text-sm text-slate-600">{incident.title}</p>
                </div>
                <AlertBadge priority={incident.priority} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{incident.location.area}, {incident.location.district} • {incident.category}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" className="rounded-full" onClick={() => toast.success(`Interest submitted for ${incident.id}`)}>
                  Accept interest
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success("Authority contact opened")}>Contact authority</Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success(`${incident.id} added to watchlist`)}>Watchlist</Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success("Assignment request sent")}>Request assignment</Button>
              </div>
            </div>
          ))}
        </div>

        <MapPreviewCard
          points={rows.map((incident, index) => ({
            label: `${incident.id} ${incident.location.area}`,
            top: `${18 + index * 9}%`,
            left: `${28 + (index % 3) * 20}%`,
            priority: incident.priority,
          }))}
        />
      </div>
    </div>
  );
};

export default NgoNearbyRequestsPage;
