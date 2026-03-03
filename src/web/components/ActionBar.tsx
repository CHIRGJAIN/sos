import { cn } from "@/lib/utils";

interface ActionBarProps {
  children: React.ReactNode;
  className?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-[22px] border border-white/70 bg-white/90 p-3 shadow-[0_10px_28px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default ActionBar;
