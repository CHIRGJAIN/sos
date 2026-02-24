import React from "react";
import { useSearchParams } from "react-router-dom";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/ui/EmptyState";
import { districts } from "@/data/mockData";

const DistrictsPage: React.FC = () => {
  const [params] = useSearchParams();
  const state = params.get("state") || "Delhi";
  const districtList = districts[state] || [];

  return (
    <DashboardShell portal="user" title={`Districts - ${state}`}>
      <Card className="border-primary/20 bg-card/75">
        <CardHeader>
          <CardTitle className="text-xl">{state} District List</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {districtList.map((district) => (
            <div
              key={district}
              className="rounded-xl border border-primary/20 bg-popover/80 px-4 py-3 text-sm font-medium"
            >
              {district}
            </div>
          ))}
          {districtList.length === 0 && (
            <div className="sm:col-span-2 xl:col-span-3">
              <EmptyState
                title="No districts found"
                description="Try selecting a different state to view district coverage."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
};

export default DistrictsPage;
