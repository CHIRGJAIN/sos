import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const levels = [
  { label: "District", description: "Focus local incidents and district-level response teams." },
  { label: "State", description: "Escalate to state-wide command and relief operations." },
  { label: "National", description: "Broadcast high-priority disasters for national support." },
  { label: "Global", description: "Open visibility for international NGOs and partners." },
];

const DSNGSelectionPage: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  return (
    <DashboardShell portal="user" title="DSNG Selection">
      <div className="mx-auto w-full max-w-4xl">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-2xl">Select Operational Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              {levels.map((level, index) => (
                <button
                  key={level.label}
                  onClick={() => setSelected(index)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    selected === index
                      ? "border-accent bg-accent/10 shadow-soft"
                      : "border-primary/20 bg-popover/80 hover:bg-secondary/65"
                  }`}
                >
                  <p className="font-serif text-xl font-semibold">{level.label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{level.description}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate("/ngo/feed")}
              className="w-full rounded-xl bg-accent py-3 text-base font-semibold text-accent-foreground shadow-soft"
            >
              Continue to NGO Feed
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default DSNGSelectionPage;
