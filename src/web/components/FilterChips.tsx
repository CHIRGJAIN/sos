import { cn } from "@/lib/utils";

interface FilterChipOption {
  id: string;
  label: string;
}

interface FilterChipsProps {
  options: FilterChipOption[];
  value: string;
  onChange: (id: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ options, value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full border px-3.5 py-2 text-xs font-semibold transition-all",
            value === option.id
              ? "border-slate-950 bg-slate-950 text-white shadow-[0_10px_20px_rgba(15,23,42,0.12)]"
              : "border-white/70 bg-white/95 text-slate-600 shadow-sm hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-950",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;
