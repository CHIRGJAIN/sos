import React from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import TransparencyBoard from "@/components/app/TransparencyBoard";

const AdminTransparencyPage: React.FC = () => {
  return (
    <DashboardShell portal="admin" title="Admin Transparency">
      <TransparencyBoard adminView />
    </DashboardShell>
  );
};

export default AdminTransparencyPage;
