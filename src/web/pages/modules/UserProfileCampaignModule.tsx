import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Calendar, PlusCircle, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ConfirmationDialog from "@/web/components/ConfirmationDialog";
import ContactFormDialog from "@/web/components/ContactFormDialog";
import EmptyStateCard from "@/web/components/EmptyStateCard";
import IncidentCard from "@/web/components/IncidentCard";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import StatusBadge from "@/web/components/StatusBadge";
import { useSosWeb } from "@/web/context/SosWebContext";
import { CitizenCampaign, EmergencyContact, RevelationDraft, RevelationReport } from "@/web/types";

const categories: CitizenCampaign["category"][] = ["awareness", "relief", "legal", "medical", "community"];
const revelationCategories: RevelationReport["category"][] = [
  "abuse",
  "harassment",
  "molestation",
  "violence",
  "bullying",
  "stalking",
  "other",
];

const formatPriority = (priority: number) => {
  if (priority <= 1) return "High";
  if (priority === 2) return "Medium";
  return "Low";
};

const UserProfileCampaignModule: React.FC = () => {
  const {
    profile,
    updateProfile,
    contacts,
    addOrUpdateContact,
    removeContact,
    reorderContacts,
    settings,
    updateSettings,
    permissionsStatus,
    updatePermissionsStatus,
    safetyReadiness,
    incidents,
    draftReports,
    saveDraftReport,
    deleteDraftReport,
    submitRevelationReport,
    contributions,
    userCampaigns,
    createUserCampaign,
    updateUserCampaignStatus,
    language,
    setLanguage,
    demoRole,
    setDemoRole,
  } = useSosWeb();

  const [form, setForm] = useState(profile);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignSummary, setCampaignSummary] = useState("");
  const [campaignCategory, setCampaignCategory] = useState<CitizenCampaign["category"]>("awareness");
  const [targetAmount, setTargetAmount] = useState("50000");
  const [visibility, setVisibility] = useState<CitizenCampaign["visibility"]>("public");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editContact, setEditContact] = useState<EmergencyContact | null>(null);
  const [pendingDeleteContact, setPendingDeleteContact] = useState<EmergencyContact | null>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(draftReports[0]?.id ?? null);
  const [draftForm, setDraftForm] = useState<RevelationDraft | null>(draftReports[0] ?? null);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  useEffect(() => {
    if (!draftReports.length) {
      setSelectedDraftId(null);
      setDraftForm(null);
      return;
    }

    const nextId = selectedDraftId && draftReports.some((item) => item.id === selectedDraftId) ? selectedDraftId : draftReports[0].id;
    const nextDraft = draftReports.find((item) => item.id === nextId) ?? draftReports[0];
    setSelectedDraftId(nextId);
    setDraftForm(nextDraft);
  }, [draftReports, selectedDraftId]);

  const contributionSummary = useMemo(() => {
    return {
      total: userCampaigns.length,
      active: userCampaigns.filter((campaign) => campaign.status === "active").length,
      raised: userCampaigns.reduce((sum, campaign) => sum + campaign.raisedAmount, 0),
    };
  }, [userCampaigns]);

  const canMoveContact = (index: number, direction: "up" | "down") => {
    if (direction === "up") return index > 0;
    return index < contacts.length - 1;
  };

  const moveContact = (contactId: string, direction: "up" | "down") => {
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index < 0) return;
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= contacts.length) return;

    const nextIds = [...contacts.map((contact) => contact.id)];
    [nextIds[index], nextIds[nextIndex]] = [nextIds[nextIndex], nextIds[index]];
    reorderContacts(nextIds);
  };

  const handleCreateCampaign = () => {
    const amount = Number(targetAmount);
    if (!campaignTitle.trim() || !campaignSummary.trim() || Number.isNaN(amount) || amount <= 0) return;

    createUserCampaign({
      title: campaignTitle.trim(),
      summary: campaignSummary.trim(),
      category: campaignCategory,
      targetAmount: amount,
      visibility,
    });

    setCampaignTitle("");
    setCampaignSummary("");
    setCampaignCategory("awareness");
    setTargetAmount("50000");
    setVisibility("public");
  };

  const handleDraftSave = () => {
    if (!draftForm || !draftForm.description.trim()) return;
    saveDraftReport({
      ...draftForm,
      title: draftForm.title?.trim() || undefined,
      description: draftForm.description.trim(),
    });
  };

  const handleDraftSubmit = () => {
    if (!draftForm || !draftForm.description.trim()) return;

    submitRevelationReport({
      category: draftForm.category,
      severity: draftForm.severity,
      anonymous: draftForm.anonymous,
      includeLocation: draftForm.includeLocation,
      title: draftForm.title?.trim() || undefined,
      description: draftForm.description.trim(),
      attachments: draftForm.attachments,
      location: draftForm.includeLocation && draftForm.locationText
        ? { address: draftForm.locationText }
        : undefined,
    });
    deleteDraftReport(draftForm.id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Citizen Profile"
        title="Profile and Safety Workspace"
        subtitle="Personal setup, emergency readiness, draft reports, and contributions in one modular dashboard."
        actions={
          <Button className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800" onClick={() => updateProfile(form)}>
            Save profile
          </Button>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <SectionCard title="Profile header" subtitle="Trusted identity details used across alerts and reports.">
            <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="rounded-[28px] bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#7d7bff] px-5 py-6 text-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-2xl font-semibold">
                  {form.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase())
                    .join("") || "U"}
                </div>
                <p className="mt-4 text-xl font-semibold">{form.name || "Citizen User"}</p>
                <p className="mt-1 text-sm text-white/80">{form.phone || "+91"}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-white/75">Readiness</p>
                <p className="mt-2 text-3xl font-semibold">{safetyReadiness}%</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Full name" />
                <Input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" />
                <Input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone" />
                <Input value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} placeholder="Address" />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Emergency contacts"
            subtitle="Priority-based contacts used during SOS dispatch."
            actions={
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setEditContact(null);
                  setDialogOpen(true);
                }}
              >
                Add contact
              </Button>
            }
          >
            {contacts.length ? (
              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div key={contact.id} className="rounded-[28px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-950">{contact.name}</p>
                          <StatusBadge status={contact.activeForSos ? "tracking-active" : "pending"} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {contact.relation} • {contact.phone}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">Priority {contact.priority} ({formatPriority(contact.priority)})</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-600">
                          Active
                          <Switch
                            checked={contact.activeForSos}
                            onCheckedChange={(checked) => addOrUpdateContact({ ...contact, activeForSos: checked })}
                          />
                        </label>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => moveContact(contact.id, "up")}
                          disabled={!canMoveContact(index, "up")}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full"
                          onClick={() => moveContact(contact.id, "down")}
                          disabled={!canMoveContact(index, "down")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => {
                            setEditContact(contact);
                            setDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-[#FF3B30]"
                          onClick={() => setPendingDeleteContact(contact)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>

                    {contact.notes ? <p className="mt-3 text-sm text-slate-600">{contact.notes}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyStateCard title="No emergency contacts" description="Add trusted contacts so SOS can notify them immediately." />
            )}
          </SectionCard>

          <SectionCard title="Safety setup" subtitle="Permission readiness and configuration coverage.">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="rounded-[28px] bg-gradient-to-br from-emerald-50 to-white px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Readiness score</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{safetyReadiness}%</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                    <ShieldCheck className="h-5 w-5 text-emerald-700" />
                  </div>
                </div>
                <Progress className="mt-4 h-2.5 bg-emerald-100" value={safetyReadiness} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(permissionsStatus).map(([key, value]) => {
                  const permissionKey = key as keyof typeof permissionsStatus;
                  const badgeState = value === "granted" ? "delivered" : value === "prompt" ? "pending" : "failed";

                  return (
                    <div key={key} className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold capitalize text-slate-950">{key}</p>
                        <StatusBadge status={badgeState} />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 rounded-full"
                        onClick={() =>
                          updatePermissionsStatus({
                            [permissionKey]: value === "granted" ? "prompt" : "granted",
                          } as Partial<typeof permissionsStatus>)
                        }
                      >
                        {value === "granted" ? "Reset" : "Enable"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Safety settings" subtitle="Control how the SOS flow behaves before and during an incident.">
            <div className="grid gap-3 lg:grid-cols-2">
              {[
                { label: "Silent mode", value: settings.silentMode, key: "silentMode" },
                { label: "Auto-record", value: settings.autoRecord, key: "autoRecord" },
                { label: "Continuous location share", value: settings.continuousLocationShare, key: "continuousLocationShare" },
                { label: "Vibration", value: settings.vibration, key: "vibration" },
                { label: "Fake call shortcut", value: settings.fakeCallShortcut, key: "fakeCallShortcut" },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <Switch
                    checked={item.value}
                    onCheckedChange={(checked) => updateSettings({ [item.key]: checked } as Partial<typeof settings>)}
                  />
                </label>
              ))}

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-950">Countdown duration</p>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={settings.countdownSeconds}
                  onChange={(event) => updateSettings({ countdownSeconds: Number(event.target.value) })}
                  className="mt-3 w-full accent-[#FF3B30]"
                />
                <p className="mt-2 text-xs text-slate-500">{settings.countdownSeconds}s</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-950">Language</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant={language === "en" ? "default" : "outline"} className="rounded-full" onClick={() => setLanguage("en")}>
                    English
                  </Button>
                  <Button variant={language === "hi" ? "default" : "outline"} className="rounded-full" onClick={() => setLanguage("hi")}>
                    Hindi
                  </Button>
                </div>
                <select
                  className="mt-3 h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#007AFF]/25"
                  value={settings.distressLanguage}
                  onChange={(event) => updateSettings({ distressLanguage: event.target.value as typeof language })}
                >
                  <option value="en">Distress language: EN</option>
                  <option value="hi">Distress language: HI</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Distress history" subtitle="Latest incidents in a timeline-style list.">
            <div className="space-y-3">
              {incidents.slice(0, 4).map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Campaign studio" subtitle="Create and monitor citizen-led campaigns.">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-[24px] bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Total</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{contributionSummary.total}</p>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Active</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-700">{contributionSummary.active}</p>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Raised</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">INR {contributionSummary.raised.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {userCampaigns.map((campaign) => {
                    const progress = Math.min(100, Math.round((campaign.raisedAmount / campaign.targetAmount) * 100));

                    return (
                      <div key={campaign.id} className="rounded-[28px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-950">{campaign.title}</p>
                              <StatusBadge status={campaign.status === "active" ? "tracking-active" : campaign.status === "closed" ? "resolved" : "pending"} />
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{campaign.summary}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => updateUserCampaignStatus(campaign.id, campaign.status === "closed" ? "active" : "closed")}
                          >
                            {campaign.status === "closed" ? "Reopen" : "Close"}
                          </Button>
                        </div>

                        <Progress className="mt-4 h-2.5 bg-slate-100" value={progress} />
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                          <span>INR {campaign.raisedAmount.toLocaleString()} / INR {campaign.targetAmount.toLocaleString()}</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-950">Create campaign</p>
                <Input value={campaignTitle} onChange={(event) => setCampaignTitle(event.target.value)} placeholder="Campaign title" />
                <Textarea value={campaignSummary} onChange={(event) => setCampaignSummary(event.target.value)} rows={4} placeholder="Summary" />
                <select
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#007AFF]/25"
                  value={campaignCategory}
                  onChange={(event) => setCampaignCategory(event.target.value as CitizenCampaign["category"])}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Input type="number" min={1000} value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} placeholder="Target amount" />
                <select
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#007AFF]/25"
                  value={visibility}
                  onChange={(event) => setVisibility(event.target.value as CitizenCampaign["visibility"])}
                >
                  <option value="public">Public</option>
                  <option value="trusted">Trusted</option>
                </select>
                <Button className="w-full rounded-full" onClick={handleCreateCampaign} disabled={!campaignTitle.trim() || !campaignSummary.trim()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create campaign
                </Button>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Draft reports" subtitle="Edit, submit, or remove saved revelation drafts.">
            {draftForm ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {draftReports.map((draft) => (
                    <button
                      key={draft.id}
                      type="button"
                      onClick={() => {
                        setSelectedDraftId(draft.id);
                        setDraftForm(draft);
                      }}
                      className={`w-full rounded-[24px] border px-4 py-3 text-left transition ${
                        selectedDraftId === draft.id
                          ? "border-[#007AFF]/30 bg-[#007AFF]/5"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-950">{draft.title || draft.category}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(draft.updatedAt).toLocaleString()}</p>
                    </button>
                  ))}
                </div>

                <Input
                  value={draftForm.title || ""}
                  onChange={(event) => setDraftForm((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                  placeholder="Draft title"
                />
                <select
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#007AFF]/25"
                  value={draftForm.category}
                  onChange={(event) =>
                    setDraftForm((prev) =>
                      prev ? { ...prev, category: event.target.value as RevelationReport["category"] } : prev,
                    )
                  }
                >
                  {revelationCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Textarea
                  rows={5}
                  value={draftForm.description}
                  onChange={(event) => setDraftForm((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
                  placeholder="Description"
                />
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                    Anonymous
                    <Switch
                      checked={draftForm.anonymous}
                      onCheckedChange={(checked) => setDraftForm((prev) => (prev ? { ...prev, anonymous: checked } : prev))}
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                    Location
                    <Switch
                      checked={draftForm.includeLocation}
                      onCheckedChange={(checked) => setDraftForm((prev) => (prev ? { ...prev, includeLocation: checked } : prev))}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={draftForm.severity === level ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setDraftForm((prev) => (prev ? { ...prev, severity: level } : prev))}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <Input
                  value={draftForm.locationText || ""}
                  onChange={(event) => setDraftForm((prev) => (prev ? { ...prev, locationText: event.target.value } : prev))}
                  placeholder="Location note"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Button className="rounded-full" onClick={handleDraftSave}>
                    Save
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={handleDraftSubmit}>
                    Submit
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full text-[#FF3B30]"
                    onClick={() => deleteDraftReport(draftForm.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyStateCard title="No drafts saved" description="Saved revelation drafts will appear here for quick editing." />
            )}
          </SectionCard>

          <SectionCard title="Contributions" subtitle="Recent donations, volunteering, and campaign support.">
            <div className="space-y-3">
              {contributions.map((entry) => (
                <div key={entry.id} className="rounded-[24px] bg-slate-50 px-4 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{entry.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {entry.category}
                        {entry.amount ? ` • INR ${entry.amount}` : ""}
                      </p>
                    </div>
                    <StatusBadge
                      status={entry.status === "active" ? "tracking-active" : entry.status === "closed" ? "resolved" : "delivered"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Role switcher" subtitle="Demo-only role switching for the mock environment.">
            <div className="grid grid-cols-2 gap-2">
              {(["citizen", "authority", "ngo", "admin"] as const).map((role) => (
                <Button key={role} variant={demoRole === role ? "default" : "outline"} className="rounded-full" onClick={() => setDemoRole(role)}>
                  {role}
                </Button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <ContactFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialContact={editContact} />

      <ConfirmationDialog
        open={Boolean(pendingDeleteContact)}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteContact(null);
        }}
        title="Remove emergency contact?"
        description="This contact will be removed from your SOS notification order."
        confirmLabel="Remove"
        onConfirm={() => {
          if (pendingDeleteContact) {
            removeContact(pendingDeleteContact.id);
            setPendingDeleteContact(null);
          }
        }}
      />
    </div>
  );
};

export default UserProfileCampaignModule;
