import StatusChip from "@/web/components/StatusChip";

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return <StatusChip status={status} />;
};

export default StatusBadge;
