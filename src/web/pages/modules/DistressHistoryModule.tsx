import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import EmptyStateCard from "@/web/components/EmptyStateCard";
import FilterChips from "@/web/components/FilterChips";
import SectionCard from "@/web/components/SectionCard";
import StatusChip from "@/web/components/StatusChip";
import TimelineList from "@/web/components/TimelineList";
import { useSosWeb } from "@/web/context/SosWebContext";

const DistressHistoryModule: React.FC = () => {
  const { t, incidents, timeline } = useSosWeb();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(incidents[0]?.id || null);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active"
          ? !["resolved", "cancelled"].includes(incident.status)
          : statusFilter === "resolved"
            ? incident.status === "resolved"
            : incident.status === "cancelled");

      const typeMatch = typeFilter === "all" || incident.type === typeFilter;
      const q = query.trim().toLowerCase();
      const queryMatch =
        !q ||
        `${incident.id} ${incident.title} ${incident.location.address} ${incident.location.area}`
          .toLowerCase()
          .includes(q);

      return statusMatch && typeMatch && queryMatch;
    });
  }, [incidents, query, statusFilter, typeFilter]);

  const selectedIncident =
    filteredIncidents.find((incident) => incident.id === selectedId) || filteredIncidents[0] || null;

  const selectedTimeline = selectedIncident
    ? timeline.filter((item) => item.incidentId === selectedIncident.id)
    : [];

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <SectionCard title={t("citizen.history.title")}> 
        <div className="space-y-3">
          <FilterChips
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { id: "all", label: t("citizen.history.filter.all") },
              { id: "active", label: t("citizen.history.filter.active") },
              { id: "resolved", label: t("citizen.history.filter.resolved") },
              { id: "cancelled", label: t("citizen.history.filter.cancelled") },
            ]}
          />

          <FilterChips
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { id: "all", label: t("citizen.history.type.all") },
              { id: "sos", label: t("citizen.history.type.sos") },
              { id: "spectator-alert", label: t("citizen.history.type.spectator-alert") },
              { id: "report", label: t("citizen.history.type.report") },
            ]}
          />

          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`${t("common.search")} case ID / type / location`}
          />

          {filteredIncidents.length ? (
            <div className="space-y-2">
              {filteredIncidents.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedId(incident.id)}
                  className={`w-full rounded-xl border p-3 text-left ${
                    selectedIncident?.id === incident.id
                      ? "border-orange-300 bg-orange-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{incident.id}</p>
                    <StatusChip status={incident.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{incident.title}</p>
                  <p className="text-xs text-slate-500">{incident.location.address}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusChip status={incident.severity} />
                    <StatusChip status={incident.type} />
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() ? (
            <EmptyStateCard title={t("common.noResults")} description={t("citizen.history.title")} />
          ) : (
            <EmptyStateCard title={t("common.empty")} description={t("citizen.history.title")} />
          )}
        </div>
      </SectionCard>

      <div className="space-y-4">
        <SectionCard title={selectedIncident ? selectedIncident.id : t("authority.detail")}> 
          {selectedIncident ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">{t("common.status")}</p>
                <StatusChip status={selectedIncident.status} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-medium text-slate-700">{selectedIncident.location.address}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Contacts notified</p>
                <p className="font-medium text-slate-700">{selectedIncident.notifiedContacts.length}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Attachments</p>
                <p className="font-medium text-slate-700">{selectedIncident.attachments.length}</p>
              </div>
              {selectedIncident.authorityAssignee ? (
                <div>
                  <p className="text-xs text-slate-500">Responder</p>
                  <p className="font-medium text-slate-700">{selectedIncident.authorityAssignee.name}</p>
                  <p className="text-xs text-slate-500">{selectedIncident.authorityAssignee.station}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyStateCard title={t("common.empty")} description={t("citizen.history.title")} />
          )}
        </SectionCard>

        <SectionCard title={t("common.timeline")}> 
          {selectedTimeline.length ? (
            <TimelineList events={selectedTimeline} />
          ) : (
            <EmptyStateCard title={t("common.empty")} description={t("common.timeline")} />
          )}
        </SectionCard>
      </div>
    </div>
  );
};

export default DistressHistoryModule;