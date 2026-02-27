import { DataTable, DataTableColumn } from "@/sos/components/data-table";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Volunteer } from "@/sos/models";

const columns: DataTableColumn<Volunteer>[] = [
  {
    key: "name",
    label: "Name",
    sortable: true,
    sortValue: (row) => row.name,
    render: (row) => row.name,
  },
  {
    key: "role",
    label: "Role",
    sortable: true,
    sortValue: (row) => row.role,
    render: (row) => row.role,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    sortValue: (row) => row.status,
    render: (row) => row.status,
  },
  {
    key: "skills",
    label: "Skills",
    render: (row) => row.skills.join(", "),
  },
  {
    key: "tasks",
    label: "Assigned tasks",
    sortable: true,
    sortValue: (row) => row.assignedTaskCount,
    render: (row) => row.assignedTaskCount,
  },
  {
    key: "shift",
    label: "Shift",
    sortable: true,
    sortValue: (row) => row.shift,
    render: (row) => row.shift,
  },
];

const NgoVolunteersPage = () => {
  const { volunteers } = useSosApp();

  return (
    <div className="space-y-4">
      <SectionTitle title="Volunteers / Team" subtitle="Roles, live status, skills, and shifts" />
      <DataTable
        rows={volunteers}
        columns={columns}
        rowKey={(row) => row.id}
        emptyTitle="No volunteers available"
        emptyDescription="Add team members to begin dispatch planning."
      />
    </div>
  );
};

export default NgoVolunteersPage;
