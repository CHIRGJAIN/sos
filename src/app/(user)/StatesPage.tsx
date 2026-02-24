import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { states } from "@/data/mockData";

const StatesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardShell portal="user" title="States Directory">
      <Card className="border-primary/20 bg-card/75">
        <CardHeader>
          <CardTitle className="text-xl">Available States</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {states.map((state) => (
            <button
              key={state}
              onClick={() => navigate(`/user/services/districts?state=${state}`)}
              className="rounded-xl border border-primary/20 bg-popover/80 px-4 py-3 text-left text-sm font-medium hover:bg-secondary/60"
            >
              {state}
            </button>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
};

export default StatesPage;
