import { DataTable, DataTableColumn } from "@/sos/components/data-table";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { AuditLogEntry, Role } from "@/sos/models";
import { formatDateTime } from "@/sos/utils";

const columns: DataTableColumn<AuditLogEntry>[] = [
  {
    key: "time",
    label: "Time",
    sortable: true,
    sortValue: (row) => row.createdAt,
    render: (row) => formatDateTime(row.createdAt),
  },
  {
    key: "actor",
    label: "Actor",
    sortable: true,
    sortValue: (row) => row.actor,
    render: (row) => row.actor,
  },
  {
    key: "action",
    label: "Action",
    sortable: true,
    sortValue: (row) => row.action,
    render: (row) => row.action,
  },
  {
    key: "entity",
    label: "Entity",
    sortable: true,
    sortValue: (row) => row.entityId,
    render: (row) => `${row.entityType} / ${row.entityId}`,
  },
  {
    key: "details",
    label: "Details",
    render: (row) => row.details,
  },
];

const AuditLogsPage: React.FC<{ role: Role }> = ({ role }) => {
  const { auditLogs } = useSosApp();
  const rows = auditLogs.filter((log) => log.visibleTo.includes(role));

  return (
    <div className="space-y-4">
      <SectionTitle title="Audit Logs" subtitle="Who changed what and when" />
      <DataTable rows={rows} columns={columns} rowKey={(row) => row.id} emptyTitle="No audit entries" />
    </div>
  );
};

export default AuditLogsPage;
