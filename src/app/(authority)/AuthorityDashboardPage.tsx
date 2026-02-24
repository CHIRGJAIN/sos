import React, { useMemo, useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import EmptyState from "@/components/ui/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AuthorityVerification,
  EvidenceMedia,
  Scope,
  SocialPost,
  authorityVerifications,
  evidenceMedias,
  incidentCases,
  incidentCategories,
  socialPosts,
} from "@/data/mockData";

const scopeOptions: Scope[] = ["DISTRICT", "STATE", "COUNTRY", "GLOBAL"];

const formatDate = (iso: string) => iso.replace("T", " ").replace("Z", "");

const AuthorityDashboardPage: React.FC = () => {
  const [scope, setScope] = useState<Scope>("DISTRICT");
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [verificationState, setVerificationState] =
    useState<AuthorityVerification[]>(authorityVerifications);
  const [extraMedia, setExtraMedia] = useState<EvidenceMedia[]>([]);
  const [resolutionChoice, setResolutionChoice] = useState<"WITH_DONATION" | "WITHOUT_DONATION">(
    "WITHOUT_DONATION"
  );
  const [timelinePosts, setTimelinePosts] = useState<SocialPost[]>(socialPosts);
  const [notice, setNotice] = useState("");

  const scopedCases = useMemo(
    () => incidentCases.filter((item) => item.scope === scope),
    [scope]
  );

  const selectedCase =
    scopedCases.find((item) => item.id === selectedCaseId) || scopedCases[0] || null;

  const category = incidentCategories.find((item) => item.id === selectedCase?.categoryId);

  const caseMedia = useMemo(() => {
    if (!selectedCase) return [];
    return [...evidenceMedias, ...extraMedia].filter((item) => item.caseId === selectedCase.id);
  }, [extraMedia, selectedCase]);

  const userEvidence = caseMedia.filter((item) => item.uploadedByRole === "USER");
  const policeEvidence = caseMedia.filter(
    (item) => item.uploadedByRole === "POLICE" || item.uploadedByRole === "AUTHORITY"
  );

  const verification = selectedCase
    ? verificationState.find((item) => item.caseId === selectedCase.id)
    : undefined;

  const updateVerification = (updater: (current: AuthorityVerification) => AuthorityVerification) => {
    if (!selectedCase) return;
    setVerificationState((prev) => {
      const index = prev.findIndex((item) => item.caseId === selectedCase.id);
      if (index === -1) {
        const base: AuthorityVerification = {
          id: `AV-${selectedCase.id}`,
          caseId: selectedCase.id,
          visitOnScene: false,
          officerId: "officer-local",
          verificationResult: "PENDING",
          serviceProvided: false,
          postedToSocial: false,
        };
        return [...prev, updater(base)];
      }
      const copy = [...prev];
      copy[index] = updater(copy[index]);
      return copy;
    });
  };

  const addPoliceEvidence = () => {
    if (!selectedCase) return;
    const now = new Date().toISOString();
    const id = `EM-AUTH-${Date.now()}`;
    const media: EvidenceMedia = {
      id,
      caseId: selectedCase.id,
      uploadedByRole: "POLICE",
      mediaType: "PHOTO",
      url: "/placeholder.svg",
      verifiedStatus: "PENDING",
    };
    setExtraMedia((prev) => [media, ...prev]);
    updateVerification((current) => ({ ...current, officerMediaId: id }));
    setNotice("Police evidence uploaded for second-layer verification.");
  };

  const markVisitOnScene = () => {
    const now = new Date().toISOString();
    updateVerification((current) => ({ ...current, visitOnScene: true, visitAt: now }));
    setNotice("Case marked as visited on scene.");
  };

  const markServiceProvided = () => {
    const now = new Date().toISOString();
    updateVerification((current) => ({
      ...current,
      serviceProvided: true,
      serviceProvidedAt: now,
      serviceTypeId: selectedCase?.categoryId,
      resolutionOutcome: resolutionChoice,
    }));
    setNotice("Service marked as provided.");
  };

  const markVerified = () => {
    if (!userEvidence.length || !policeEvidence.length) {
      setNotice("Dual evidence required: at least one USER media and one POLICE media.");
      return;
    }
    updateVerification((current) => ({ ...current, verificationResult: "VERIFIED" }));
    setNotice("Case marked as verified.");
  };

  const postResolutionToSocial = () => {
    if (!selectedCase || !verification) return;
    if (verification.verificationResult !== "VERIFIED" || !verification.serviceProvided) {
      setNotice("Post to social is enabled only after verification and service provided.");
      return;
    }
    const now = new Date().toISOString();
    updateVerification((current) => ({ ...current, postedToSocial: true, postedAt: now }));
    setTimelinePosts((prev) => [
      {
        id: `AUTO-${Date.now()}`,
        images: ["/placeholder.svg"],
        caption: `Case ${selectedCase.id} resolved: ${verification.resolutionOutcome || "WITHOUT_DONATION"}`,
        location: selectedCase.addressText,
        dateTime: now.replace("T", " ").replace("Z", ""),
        likes: 0,
        linkedCaseId: selectedCase.id,
      },
      ...prev,
    ]);
    setNotice("Resolution posted to social feed for transparency.");
  };

  const caseTimeline = selectedCase
    ? [
        { key: "user", label: "User/Spectator media submitted", done: userEvidence.length > 0 },
        { key: "visit", label: "Authority visited on scene", done: Boolean(verification?.visitOnScene) },
        { key: "police", label: "Police media uploaded", done: policeEvidence.length > 0 },
        { key: "service", label: "Service provided", done: Boolean(verification?.serviceProvided) },
        { key: "verified", label: "Case verified", done: verification?.verificationResult === "VERIFIED" },
        { key: "social", label: "Posted to social", done: Boolean(verification?.postedToSocial) },
      ]
    : [];

  return (
    <DashboardShell portal="authority" title="Authority Case Inbox">
      <div className="space-y-5">
        <Card className="border-primary/20 bg-card/75">
          <CardContent className="flex flex-wrap gap-2 p-4">
            {scopeOptions.map((item) => (
              <PillButton key={item} active={scope === item} onClick={() => setScope(item)}>
                {item}
              </PillButton>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-xl">Nearby Cases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {scopedCases.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCaseId(item.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left ${
                    selectedCase?.id === item.id
                      ? "border-accent bg-accent/10"
                      : "border-primary/20 bg-popover/80 hover:bg-secondary/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{item.id}</p>
                    <p className="text-xs text-muted-foreground">{item.status}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.addressText}</p>
                  <p className="text-xs text-muted-foreground">
                    Reporter: {item.reporterRole} - {item.signalType}
                  </p>
                </button>
              ))}
              {scopedCases.length === 0 && (
                <EmptyState
                  title="No cases in selected scope"
                  description="Switch scope to load incident inbox from district/state/country/global."
                />
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-xl">Case Detail & Verification</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCase ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-primary/20 bg-popover/80 p-4 text-sm">
                    <p>
                      <span className="font-semibold">Case:</span> {selectedCase.id}
                    </p>
                    <p>
                      <span className="font-semibold">Category:</span> {category?.name || selectedCase.categoryId}
                    </p>
                    <p>
                      <span className="font-semibold">Description:</span> {selectedCase.description}
                    </p>
                    <p>
                      <span className="font-semibold">Created:</span> {formatDate(selectedCase.createdAt)}
                    </p>
                    <p>
                      <span className="font-semibold">Evidence:</span> USER {userEvidence.length} / POLICE{" "}
                      {policeEvidence.length}
                    </p>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-popover/80 p-4">
                    <p className="mb-2 text-xs text-muted-foreground">Case Timeline</p>
                    <div className="space-y-2 text-sm">
                      {caseTimeline.map((item) => (
                        <p key={item.key} className={item.done ? "text-emerald-700" : "text-muted-foreground"}>
                          {item.done ? "Completed" : "Pending"} - {item.label}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <button
                      onClick={markVisitOnScene}
                      className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
                    >
                      Mark Visit On Scene
                    </button>
                    <button
                      onClick={addPoliceEvidence}
                      className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
                    >
                      Upload Police Media
                    </button>
                    <div className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm">
                      <p className="mb-1 text-xs text-muted-foreground">Resolution Outcome</p>
                      <div className="flex gap-2">
                        <PillButton
                          active={resolutionChoice === "WITH_DONATION"}
                          onClick={() => setResolutionChoice("WITH_DONATION")}
                        >
                          With Donation
                        </PillButton>
                        <PillButton
                          active={resolutionChoice === "WITHOUT_DONATION"}
                          onClick={() => setResolutionChoice("WITHOUT_DONATION")}
                        >
                          Without Donation
                        </PillButton>
                      </div>
                    </div>
                    <button
                      onClick={markServiceProvided}
                      className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
                    >
                      Mark Service Provided
                    </button>
                    <button
                      onClick={markVerified}
                      className="rounded-xl border border-primary/20 bg-popover px-3 py-2 text-sm font-medium"
                    >
                      Mark Verified
                    </button>
                    <button
                      onClick={postResolutionToSocial}
                      className="rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
                    >
                      Post Resolution to Social
                    </button>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-popover/80 p-3 text-sm">
                    <p className="text-xs text-muted-foreground">Verification Snapshot</p>
                    <p>
                      Verification: <span className="font-semibold">{verification?.verificationResult || "PENDING"}</span>
                    </p>
                    <p>
                      Service Provided: <span className="font-semibold">{verification?.serviceProvided ? "Yes" : "No"}</span>
                    </p>
                    <p>
                      Posted to Social: <span className="font-semibold">{verification?.postedToSocial ? "Yes" : "No"}</span>
                    </p>
                    <p>
                      Linked social posts:{" "}
                      <span className="font-semibold">
                        {timelinePosts.filter((item) => item.linkedCaseId === selectedCase.id).length}
                      </span>
                    </p>
                  </div>

                  {notice && <p className="text-sm text-foreground/80">{notice}</p>}
                </div>
              ) : (
                <EmptyState
                  title="Select a case"
                  description="Choose an incident from inbox to review media, verification and service actions."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default AuthorityDashboardPage;
