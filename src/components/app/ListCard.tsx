import React from 'react';

interface ListCardProps {
  index: number;
  fields: { label: string; value: string }[];
  onClick?: () => void;
}

const ListCard: React.FC<ListCardProps> = ({ index, fields, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-3 rounded-pill border border-primary/20 bg-card/80 px-5 py-3 text-left shadow-card transition-all hover:shadow-neumorphic active:scale-[0.98] lg:px-6 lg:py-4"
    >
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold font-serif text-accent lg:h-8 lg:w-8">
        {index}
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        {fields.map((f) => (
          <p key={f.label} className="truncate text-xs lg:text-sm">
            <span className="font-semibold text-foreground">{f.label}: </span>
            <span className="text-muted-foreground">{f.value}</span>
          </p>
        ))}
      </div>
    </button>
  );
};

export default ListCard;
