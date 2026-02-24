import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-primary/20 bg-popover/65 p-6 text-center shadow-soft">
      <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default EmptyState;
