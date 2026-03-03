import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ActionBar from "@/web/components/ActionBar";
import ConfirmationDialog from "@/web/components/ConfirmationDialog";
import EmptyStateCard from "@/web/components/EmptyStateCard";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import StatusBadge from "@/web/components/StatusBadge";
import { useSosWeb } from "@/web/context/SosWebContext";
import { MediaAttachmentType, RevelationDraft, RevelationReport } from "@/web/types";

const categories: Array<{ id: RevelationReport["category"]; label: string }> = [
  { id: "abuse", label: "Abuse" },
  { id: "harassment", label: "Harassment" },
  { id: "molestation", label: "Molestation" },
  { id: "violence", label: "Violence" },
  { id: "bullying", label: "Bullying" },
  { id: "stalking", label: "Stalking" },
  { id: "other", label: "Other" },
];

const severityLevels: Array<Extract<RevelationReport["severity"], "low" | "medium" | "high">> = ["low", "medium", "high"];

const createBlankDraft = (): RevelationDraft => ({
  id: `draft-${Date.now()}`,
  category: "other",
  severity: "medium",
  anonymous: true,
  includeLocation: false,
  title: "",
  description: "",
  attachments: [],
  locationText: "",
  updatedAt: new Date().toISOString(),
});

const RevelationModule: React.FC = () => {
  const { draftReports, revelationReports, saveDraftReport, deleteDraftReport, submitRevelationReport } = useSosWeb();
  const [form, setForm] = useState<RevelationDraft>(createBlankDraft());
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [submittedCaseId, setSubmittedCaseId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const attachedText = useMemo(() => {
    if (!form.attachments.length) return "No attachments yet";
    return form.attachments.map((item) => item.name).join(", ");
  }, [form.attachments]);

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!form.title?.trim()) nextErrors.title = "Title is required.";
    if (!form.description.trim()) nextErrors.description = "Description is required.";
    setErrors(nextErrors);
    return !Object.keys(nextErrors).length;
  };

  const addAttachment = (type: MediaAttachmentType) => {
    const file = {
      id: `att-${Date.now()}-${type}`,
      name: `${type}-${Date.now()}.${type === "photo" ? "jpg" : type === "video" ? "mp4" : "mp3"}`,
      type: type === "photo" ? "image/jpeg" : type === "video" ? "video/mp4" : "audio/mpeg",
      mediaType: type,
    };
    setForm((prev) => ({ ...prev, attachments: [...prev.attachments, file] }));
  };

  const onSaveDraft = () => {
    if (!validate()) return;
    saveDraftReport({ ...form, updatedAt: new Date().toISOString() });
  };

  const onSubmit = () => {
    if (!validate()) return;
    const reportId = submitRevelationReport({
      category: form.category,
      severity: form.severity,
      anonymous: form.anonymous,
      includeLocation: form.includeLocation,
      title: form.title,
      description: form.description,
      location: form.includeLocation
        ? {
            address: form.locationText?.trim() || "Reporter-shared location",
            area: form.locationText?.trim() || "Shared location",
            district: "Unknown district",
            state: "Unknown state",
          }
        : undefined,
      attachments: form.attachments,
    });
    setSubmittedCaseId(reportId);
    setForm(createBlankDraft());
    setErrors({});
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Anonymous / Assisted Reporting"
        title="Revelation Report"
        subtitle="Compose a structured anonymous report with draft-saving and attachment support."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard title="Report details" subtitle="Twitter-like compose density with form-card grouping.">
          <div className="space-y-5">
            <div>
              <Label className="text-xs uppercase tracking-[0.18em] text-slate-500">Category</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, category: category.id }))}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                      form.category === category.id
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "border-white/70 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-[0.18em] text-slate-500">Severity</Label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {severityLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, severity: level }))}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase transition-all ${
                        form.severity === level
                          ? "border-[#FF9500] bg-[#FF9500] text-white"
                          : "border-white/70 bg-white text-slate-600"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3">
                  <span className="text-sm text-slate-700">Anonymous</span>
                  <Switch checked={form.anonymous} onCheckedChange={(checked) => setForm((prev) => ({ ...prev, anonymous: checked }))} />
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3">
                  <span className="text-sm text-slate-700">Share location</span>
                  <Switch
                    checked={form.includeLocation}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, includeLocation: checked }))}
                  />
                </label>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-[0.18em] text-slate-500">Title</Label>
                <Input
                  value={form.title || ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className={`mt-2 rounded-2xl ${errors.title ? "border-red-400" : ""}`}
                  placeholder="Short case summary"
                />
                {errors.title ? <p className="mt-2 text-xs text-red-600">{errors.title}</p> : null}
              </div>

              {form.includeLocation ? (
                <div>
                  <Label className="text-xs uppercase tracking-[0.18em] text-slate-500">Location</Label>
                  <Input
                    value={form.locationText || ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, locationText: event.target.value }))}
                    className="mt-2 rounded-2xl"
                    placeholder="Landmark / area / district"
                  />
                </div>
              ) : null}
            </div>

            <div>
              <Label className="text-xs uppercase tracking-[0.18em] text-slate-500">Description</Label>
              <Textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={8}
                className={`mt-2 rounded-2xl ${errors.description ? "border-red-400" : ""}`}
                placeholder="Describe what happened. Include who, where, and what changed if known."
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                {errors.description ? <p className="text-xs text-red-600">{errors.description}</p> : <span />}
                <p className="text-xs text-slate-500">{form.description.length}/1000</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Attachments</p>
              <p className="mt-2 text-sm text-slate-600">{attachedText}</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {(["photo", "video", "voice"] as MediaAttachmentType[]).map((type) => (
                  <Button key={type} type="button" variant="outline" className="rounded-2xl" onClick={() => addAttachment(type)}>
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <ActionBar className="sticky bottom-4 mt-5 justify-between">
            <span className="text-sm text-slate-500">Drafts persist locally in this demo flow.</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full" onClick={onSaveDraft}>
                Save Draft
              </Button>
              <Button className="rounded-full bg-[#007AFF] hover:bg-[#0069d9]" onClick={onSubmit}>
                Submit
              </Button>
            </div>
          </ActionBar>

          {submittedCaseId ? (
            <div className="mt-4 rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Report submitted successfully. Generated Case ID: <span className="font-semibold">{submittedCaseId}</span>
            </div>
          ) : null}
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Guidelines" subtitle="Keep the report factual and safely scoped.">
            <div className="space-y-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">Use concise titles for faster triage.</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">If location is risky to share, keep it anonymous.</div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">Attachments are mock-only in this web demo.</div>
            </div>
          </SectionCard>

          <SectionCard title="Drafts" subtitle="Resume or remove saved reports.">
            {draftReports.length ? (
              <div className="space-y-2">
                {draftReports.map((draft) => (
                  <div key={draft.id} className="rounded-2xl bg-slate-50 px-3 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{draft.title || draft.id}</p>
                      <StatusBadge status={draft.severity} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-slate-500">{draft.description}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="rounded-full" onClick={() => setForm(draft)}>
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full text-red-700" onClick={() => setDeleteId(draft.id)}>
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyStateCard title="No drafts saved" description="Draft reports will appear here." />
            )}
          </SectionCard>

          <SectionCard title="Recent submissions" subtitle="Latest mock case IDs.">
            <div className="space-y-2">
              {revelationReports.slice(0, 4).map((report) => (
                <div key={report.id} className="rounded-2xl bg-slate-50 px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{report.id}</p>
                    <StatusBadge status={report.status === "submitted" ? "pending" : "delivered"} />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{report.title || report.category}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete this draft?"
        description="This permanently removes the saved draft from local storage."
        confirmLabel="Delete Draft"
        onConfirm={() => {
          if (deleteId) deleteDraftReport(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
};

export default RevelationModule;
