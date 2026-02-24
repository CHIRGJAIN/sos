import React from "react";
import { Link } from "react-router-dom";
import TransparencyBoard from "@/components/app/TransparencyBoard";
import { Card, CardContent } from "@/components/ui/card";

const TransparencyDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen gradient-bg px-3 pb-5 pt-4 sm:px-4 lg:px-6 lg:pb-6 lg:pt-5 xl:px-8">
      <div className="mx-auto w-full max-w-[1380px] space-y-5 rounded-3xl border border-primary/20 bg-popover/72 p-4 shadow-[0_16px_44px_hsl(26_40%_25%_/_0.2)] backdrop-blur-sm sm:p-5 lg:p-6 xl:p-8">
        <Card className="border-primary/20 bg-card/75">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <h1 className="font-serif text-3xl font-semibold">Public Transparency Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Real-time listing of donations received, used, and reservoir position.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/user/login"
                className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
              >
                User Login
              </Link>
              <Link
                to="/admin/login"
                className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
              >
                Admin Login
              </Link>
            </div>
          </CardContent>
        </Card>

        <TransparencyBoard />
      </div>
    </div>
  );
};

export default TransparencyDashboardPage;
