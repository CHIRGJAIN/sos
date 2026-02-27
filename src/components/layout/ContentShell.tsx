import React from "react";
import { cn } from "@/lib/utils";

interface ContentShellProps {
  children: React.ReactNode;
  className?: string;
}

const ContentShell: React.FC<ContentShellProps> = ({ children, className }) => {
  return (
    <main className="px-3 pb-4 pt-3 sm:px-4 lg:px-6 lg:pb-5 lg:pt-4 xl:px-8">
      <div
        className={cn(
          "mx-auto min-h-[calc(100dvh-84px-2rem)] w-full max-w-[1480px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-5 lg:p-6 xl:p-7",
          className
        )}
      >
        {children}
      </div>
    </main>
  );
};

export default ContentShell;
