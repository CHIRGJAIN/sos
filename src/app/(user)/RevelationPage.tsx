import React, { useMemo, useState } from "react";
import { Camera, Image, Mic } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PillButton from "@/components/ui/PillButton";
import { revelationCases } from "@/data/mockData";

const subtypeByType = {
  CORPORATE: [
    "LABOR_EXPLOITATION",
    "ENVIRONMENTAL_DAMAGE",
    "FRAUD",
    "HARASSMENT_DISCRIMINATION",
  ],
  PUBLIC: ["HUMAN_RIGHTS_VIOLATION", "GENDER_BASED_VIOLENCE", "MARGINALIZED_GROUPS_SUPPORT"],
  CSF: [
    "STATE_FUNDS_CORRUPTION",
    "DEVELOPMENT_GRANT_MISUSE",
    "MIDDLEMAN_CORRUPTION",
  ],
} as const;

type RevelationType = keyof typeof subtypeByType;

const RevelationPage: React.FC = () => {
  const [type, setType] = useState<RevelationType>("CORPORATE");
  const [subtype, setSubtype] = useState(subtypeByType.CORPORATE[0]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [anonymityRequested, setAnonymityRequested] = useState(true);
  const [legalSupportRequested, setLegalSupportRequested] = useState(false);
  const [psychologicalSupportRequested, setPsychologicalSupportRequested] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  const fakeGeo = "28.6139N, 77.2090E";

  const recentQueue = useMemo(() => revelationCases.slice(0, 4), []);

  const handleTypeChange = (value: RevelationType) => {
    setType(value);
    setSubtype(subtypeByType[value][0]);
  };

  const handleEvidenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).map((file) => file.name);
    setEvidenceFiles(files);
  };

  const submitForm = () => {
    if (!text.trim()) return;
    setSubmitted(true);
  };

  const resetForm = () => {
    setTitle("");
    setText("");
    setEvidenceFiles([]);
    setAnonymityRequested(true);
    setLegalSupportRequested(false);
    setPsychologicalSupportRequested(false);
    setSubmitted(false);
  };

  return (
    <DashboardShell portal="user" title="Revelation / Complaint">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl">Complaint Form</CardTitle>
            <div className="flex flex-wrap gap-2">
              {(["CORPORATE", "PUBLIC", "CSF"] as RevelationType[]).map((value) => (
                <PillButton key={value} active={type === value} onClick={() => handleTypeChange(value)}>
                  {value}
                </PillButton>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Case Type</span>
                <input
                  value={type}
                  readOnly
                  className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs text-muted-foreground">Subtype</span>
                <select
                  value={subtype}
                  onChange={(event) => setSubtype(event.target.value)}
                  className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
                >
                  {subtypeByType[type].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs text-muted-foreground">Title</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Short revelation title"
                  className="w-full rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </label>
            </div>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Describe the complaint/revelation in detail..."
              className="min-h-[220px] w-full rounded-xl border border-primary/20 bg-popover/80 p-4 text-sm outline-none focus:border-accent"
            />

            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-primary/20 bg-popover px-3 py-2 text-sm">
                <Mic className="h-4 w-4" />
                Mic
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-primary/20 bg-popover px-3 py-2 text-sm">
                <Camera className="h-4 w-4" />
                Camera
              </button>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-primary/20 bg-popover px-3 py-2 text-sm">
                <Image className="h-4 w-4" />
                Gallery / Docs
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleEvidenceUpload}
                />
              </label>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <label className="flex items-center gap-2 rounded-lg border border-primary/20 bg-popover px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={anonymityRequested}
                  onChange={(event) => setAnonymityRequested(event.target.checked)}
                />
                Anonymous submission
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-primary/20 bg-popover px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={legalSupportRequested}
                  onChange={(event) => setLegalSupportRequested(event.target.checked)}
                />
                Legal support
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-primary/20 bg-popover px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={psychologicalSupportRequested}
                  onChange={(event) => setPsychologicalSupportRequested(event.target.checked)}
                />
                Psychological support
              </label>
            </div>

            <button
              onClick={submitForm}
              className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground"
            >
              Submit Complaint
            </button>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-lg">Submission Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-primary/20 bg-popover/80 p-4 text-sm">
              <p>
                <span className="font-semibold">Category:</span> {type}
              </p>
              <p>
                <span className="font-semibold">Subtype:</span> {subtype}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {date}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {time}
              </p>
              <p>
                <span className="font-semibold">Geo-location:</span> {fakeGeo}
              </p>
              <p>
                <span className="font-semibold">Anonymity:</span> {anonymityRequested ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold">Evidence:</span>{" "}
                {evidenceFiles.length ? evidenceFiles.join(", ") : "Not attached"}
              </p>
              <p>
                <span className="font-semibold">Legal Support:</span>{" "}
                {legalSupportRequested ? "Requested" : "Not requested"}
              </p>
              <p>
                <span className="font-semibold">Psychological Support:</span>{" "}
                {psychologicalSupportRequested ? "Requested" : "Not requested"}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Complaint:</span> {text || "No text provided yet"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Lifecycle status on submit: SUBMITTED</p>
            </div>

            <div className="rounded-xl border border-primary/20 bg-popover/80 p-4">
              <p className="mb-2 text-xs text-muted-foreground">Recent revelation queue</p>
              <div className="space-y-2 text-sm">
                {recentQueue.map((item) => (
                  <div key={item.id} className="rounded-lg border border-primary/20 bg-secondary/50 p-2">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.type}/{item.subtype} - {item.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl border-2 border-primary/25 bg-popover p-6 shadow-2xl">
            <h2 className="font-serif text-2xl font-semibold text-accent">
              Complaint Submitted Successfully
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Category:</span> {type}
              </p>
              <p>
                <span className="font-semibold">Subtype:</span> {subtype}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {date}
              </p>
              <p>
                <span className="font-semibold">Time:</span> {time}
              </p>
              <p>
                <span className="font-semibold">Geo-location:</span> {fakeGeo}
              </p>
              <p>
                <span className="font-semibold">Media:</span>{" "}
                {evidenceFiles.length ? evidenceFiles.join(", ") : "Not attached"}
              </p>
              <p>
                <span className="font-semibold">Complaint:</span> {text}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              Submit New Complaint
            </button>
          </div>
        </div>
      )}
    </DashboardShell>
  );
};

export default RevelationPage;
