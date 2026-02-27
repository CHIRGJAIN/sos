import { Link } from "react-router-dom";
import { DataTable, DataTableColumn } from "@/sos/components/data-table";
import { AlertBadge, StatusBadge } from "@/sos/components/badges";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Incident } from "@/sos/models";
import { formatDateTime } from "@/sos/utils";

const columns: DataTableColumn<Incident>[] = [
  {
    key: "id",
    label: "Case",
    sortable: true,
    sortValue: (row) => row.id,
    render: (row) => (
      <Link to={`/ngo/requests/${row.id}`} className="text-indigo-600 hover:underline">
        {row.id}
      </Link>
    ),
  },
  {
    key: "title",
    label: "Title",
    sortable: true,
    sortValue: (row) => row.title,
    render: (row) => row.title,
  },
  {
    key: "priority",
    label: "Priority",
    sortable: true,
    sortValue: (row) => row.priority,
    render: (row) => <AlertBadge priority={row.priority} />,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    sortValue: (row) => row.status,
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "location",
    label: "Location",
    sortable: true,
    sortValue: (row) => row.location.district,
    render: (row) => `${row.location.area}, ${row.location.district}`,
  },
  {
    key: "updated",
    label: "Updated",
    sortable: true,
    sortValue: (row) => row.updatedAt,
    render: (row) => formatDateTime(row.updatedAt),
  },
];

const NgoAssignedCasesPage = () => {
  const { incidents } = useSosApp();
  const rows = incidents.filter((incident) => incident.assignedNgoIds.length > 0);

  return (
    <div className="space-y-4">
      <SectionTitle title="Assigned Cases" subtitle="Track all assigned and active NGO cases" />
      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(row) => row.id}
        emptyTitle="No assigned cases"
        emptyDescription="Authority assignments will appear here."
      />
    </div>
  );
};

export default NgoAssignedCasesPage;
