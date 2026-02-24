import React from "react";
import { cn } from "@/lib/utils";

interface ContentShellProps {
  children: React.ReactNode;
  className?: string;
}

const ContentShell: React.FC<ContentShellProps> = ({ children, className }) => {
  return (
    <main className="px-3 pb-5 pt-4 sm:px-4 lg:px-6 lg:pb-6 lg:pt-5 xl:px-8">
      <div
        className={cn(
          "mx-auto min-h-[calc(100dvh-72px-2.5rem)] w-full max-w-[1380px] rounded-3xl border border-primary/20 bg-popover/72 p-4 shadow-[0_16px_44px_hsl(26_40%_25%_/_0.2)] backdrop-blur-sm sm:p-5 lg:p-6 xl:p-8",
          className
        )}
      >
        {children}
      </div>
    </main>
  );
};

export default ContentShell;
