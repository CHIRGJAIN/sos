import StatusChip from "@/web/components/StatusChip";

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  return <StatusChip status={severity} />;
};

export default SeverityBadge;
