const SkeletonCard: React.FC<{ lines?: number; className?: string }> = ({ lines = 4, className }) => {
  return (
    <div className={`rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-sm ${className || ""}`}>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 animate-pulse rounded-full bg-slate-100 ${index === 0 ? "w-2/5" : index === lines - 1 ? "w-3/5" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
