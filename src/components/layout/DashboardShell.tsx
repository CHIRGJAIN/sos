import React, { useState } from "react";
import { Portal } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ContentShell from "./ContentShell";

interface DashboardShellProps {
  portal: Portal;
  title: string;
  children: React.ReactNode;
  contentClassName?: string;
}

const DashboardShell: React.FC<DashboardShellProps> = ({
  portal,
  title,
  children,
  contentClassName,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar
        portal={portal}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          "min-h-screen transition-[padding-left] duration-200",
          collapsed ? "lg:pl-[92px]" : "lg:pl-[292px]"
        )}
      >
        <Topbar
          portal={portal}
          title={title}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />
        <ContentShell className={contentClassName}>{children}</ContentShell>
      </div>
    </div>
  );
};

export default DashboardShell;
