import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  FileText,
  Gift,
  LogOut,
  MapPin,
  MessageSquareWarning,
  User,
} from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { getUser, logout } = useAuth();
  const user = getUser("user");

  const menuItems = [
    { icon: User, label: "Personal Details", path: "/user/personal-detail" },
    { icon: Gift, label: "Contributions", path: "/user/contributions" },
    { icon: AlertTriangle, label: "Distress Signal Count", path: "/user/distress" },
    { icon: MapPin, label: "Services Near", path: "/user/services" },
    { icon: MessageSquareWarning, label: "Complaint / Revelation", path: "/user/revelation" },
    { icon: FileText, label: "Terms & Conditions", path: "#" },
  ];

  return (
    <DashboardShell portal="user" title="Profile">
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <Card className="border-primary/20 bg-card/75">
          <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-popover bg-secondary">
              <User className="h-14 w-14 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold">{user?.name || "User Name"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email || "user@sos.app"}</p>
            <p className="mt-4 rounded-full border border-primary/20 px-4 py-1 text-xs text-muted-foreground">
              User ID: SOS-00124
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-xl">Account & Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              { label: "Name", value: user?.name || "Rajesh Kumar" },
              { label: "Mobile", value: "+91 9876543210" },
              { label: "Emergency Contact", value: "+91 9123456789" },
              { label: "Address", value: "123 Main Street, New Delhi, 110001" },
              { label: "KYC", value: "Aadhaar Verified" },
              { label: "Status", value: "Active" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-primary/20 bg-popover/80 p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-sm font-medium">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-lg">Navigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => item.path !== "#" && navigate(item.path)}
                  className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-popover/80 px-3 py-2.5 text-left text-sm hover:bg-secondary/65"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                logout("user");
                navigate("/user/start");
              }}
              className="mt-2 flex w-full items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2.5 text-left text-sm font-medium text-accent hover:bg-accent/20"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default ProfilePage;
