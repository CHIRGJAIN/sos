import SkeletonCard from "@/web/components/SkeletonCard";

const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonCard key={index} lines={3 + (index % 2)} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
