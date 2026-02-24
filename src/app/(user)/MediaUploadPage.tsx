import React, { useState } from "react";
import { Upload } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReporterRole, incidentCategories } from "@/data/mockData";

const MediaUploadPage: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const [reporterRole, setReporterRole] = useState<ReporterRole>("VICTIM");
  const [categoryId, setCategoryId] = useState(incidentCategories[0]?.id || "");

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const category = incidentCategories.find((item) => item.id === categoryId);
    alert(
      `Media upload recorded!\nReporter Role: ${reporterRole}\nCategory: ${category?.name || "-"}\nFile: ${
        file.name
      }\nTime: ${new Date().toLocaleString()}`
    );
  };

  return (
    <DashboardShell portal="user" title="Media Upload">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-2xl">Upload Evidence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Reporter Role</span>
                <select
                  value={reporterRole}
                  onChange={(event) => setReporterRole(event.target.value as ReporterRole)}
                  className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
                >
                  <option value="VICTIM">Victim</option>
                  <option value="SPECTATOR">Spectator (reporting for victim)</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Crime / Service Category</span>
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
                >
                  {incidentCategories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-popover/65">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
                <Upload className="h-10 w-10 text-accent" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Upload images or videos as evidence for your distress signal
              </p>
              {fileName && <p className="mt-2 text-sm font-medium">{fileName}</p>}
            </div>
            <label className="inline-flex cursor-pointer items-center rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-soft">
              Choose File
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default MediaUploadPage;
