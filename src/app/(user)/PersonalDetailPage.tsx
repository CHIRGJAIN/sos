import React, { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PersonalDetailPage: React.FC = () => {
  const [form, setForm] = useState({
    name: "Rajesh Kumar",
    mobile: "+91 9876543210",
    emergencyContact: "+91 9123456789",
    address: "123 Main Street, New Delhi",
    district: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    kyc: "Aadhaar Verified",
  });
  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <DashboardShell portal="user" title="Personal Detail">
      <Card className="border-primary/20 bg-card/75">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">Name</span>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">Mobile Number</span>
              <input
                value={form.mobile}
                onChange={(e) => update("mobile", e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">Emergency Contact</span>
              <input
                value={form.emergencyContact}
                onChange={(e) => update("emergencyContact", e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">KYC Details</span>
              <input
                value={form.kyc}
                onChange={(e) => update("kyc", e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs text-muted-foreground">Address</span>
              <input
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">District</span>
              <input
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">State</span>
              <input
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-muted-foreground">Pincode</span>
              <input
                value={form.pincode}
                onChange={(e) => update("pincode", e.target.value)}
                className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSaved(true)}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Save Updates
            </button>
            {saved && <span className="text-sm text-emerald-700">Details saved successfully.</span>}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
};

export default PersonalDetailPage;
