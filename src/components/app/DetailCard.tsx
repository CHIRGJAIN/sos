import React from 'react';

interface DetailCardProps {
  title: string;
  fields: { label: string; value: string }[];
  onClose?: () => void;
}

const DetailCard: React.FC<DetailCardProps> = ({ title, fields, onClose }) => {
  return (
    <div className="rounded-lg border-2 border-primary/30 bg-popover p-5 shadow-neumorphic lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-foreground lg:text-xl">{title}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xl text-muted-foreground hover:text-foreground"
            aria-label="Close detail"
          >
            x
          </button>
        )}
      </div>
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.label}>
            <span className="text-sm font-semibold text-foreground lg:text-base">{field.label}: </span>
            <span className="text-sm text-muted-foreground lg:text-base">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailCard;
