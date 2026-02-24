import React from "react";
import { cn } from "@/lib/utils";

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const PillButton: React.FC<PillButtonProps> = ({
  active = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-accent bg-accent text-accent-foreground shadow-soft"
          : "border-primary/20 bg-popover text-foreground hover:bg-secondary/60",
        className
      )}
    >
      {children}
    </button>
  );
};

export default PillButton;
