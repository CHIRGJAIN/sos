interface EmptyStateCardProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ title, description, action }) => {
  return (
    <div className="rounded-[26px] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] px-5 py-10 text-center shadow-sm">
      <p className="text-base font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
};

export default EmptyStateCard;
