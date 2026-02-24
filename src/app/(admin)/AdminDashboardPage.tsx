import React from "react";
import { Link } from "react-router-dom";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  businessAdCampaigns,
  incidentCases,
  ngoOrganizations,
  reservoirLedger,
  revelationCases,
} from "@/data/mockData";

const AdminDashboardPage: React.FC = () => {
  const totalDistress = incidentCases.length;
  const activeNgos = ngoOrganizations.filter((item) => item.verificationStatus === "VERIFIED").length;
  const openRevelations = revelationCases.filter((item) => item.status !== "CLOSED").length;
  const reservoirBalance = reservoirLedger.reduce(
    (sum, item) => sum + (item.direction === "CREDIT" ? item.amount : -item.amount),
    0
  );
  const activeBusinessCampaigns = businessAdCampaigns.filter((item) => item.status === "ACTIVE").length;

  return (
    <DashboardShell portal="admin" title="Admin Dashboard">
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle>Total Distress Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{totalDistress}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle>Verified NGOs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeNgos}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle>Open Revelations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{openRevelations}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle>Reservoir Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">INR {reservoirBalance.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle>Active Ad Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{activeBusinessCampaigns}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle>Admin Workflows</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              to="/admin/transparency"
              className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
            >
              Open Transparency Dashboard
            </Link>
            <Link
              to="/admin/revelations"
              className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
            >
              Manage Revelations
            </Link>
            <Link
              to="/business/dashboard"
              className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
            >
              Business Promotions
            </Link>
            <Link
              to="/authority/dashboard"
              className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
            >
              Authority Case Inbox
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default AdminDashboardPage;
