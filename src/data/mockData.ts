export type Scope = "DISTRICT" | "STATE" | "COUNTRY" | "GLOBAL";
export type ReporterRole = "VICTIM" | "SPECTATOR";
export type IncidentSignalType = "SOS" | "MEDIA";
export type IncidentLifecycleStatus =
  | "SUBMITTED"
  | "AUTHORITY_VISIT"
  | "POLICE_MEDIA_UPLOADED"
  | "SERVICE_PROVIDED"
  | "VERIFIED"
  | "SOCIAL_POSTED"
  | "CLOSED";
export type ResolutionOutcome = "WITH_DONATION" | "WITHOUT_DONATION";
export type UploadedByRole = "USER" | "POLICE" | "AUTHORITY";
export type MediaType = "PHOTO" | "VIDEO" | "DOC";
export type DonationType = "COVERAGE_BASED" | "INCIDENTAL";
export type DonorType = "PUBLIC" | "BUSINESS" | "GOVERNMENT" | "INSURANCE" | "PUBLIC_SECTOR";
export type ReservoirSourceType =
  | "ADS"
  | "MERCH"
  | "FUNDRAISING"
  | "PUBLIC_UNUSED"
  | "GOVT_GRANT"
  | "BUSINESS_CSR"
  | "INSURANCE_REIMBURSE"
  | "PUBLIC_SECTOR_SURPLUS";
export type LedgerDirection = "CREDIT" | "DEBIT";
export type RevelationType = "CORPORATE" | "PUBLIC" | "CSF";
export type RevelationStatus = "SUBMITTED" | "UNDER_REVIEW" | "VERIFIED" | "PUBLISHED" | "CLOSED";

export interface IncidentCategory {
  id: string;
  name: string;
  group: "CRIME" | "SERVICE";
  defaultAuthority: string;
}

export interface IncidentCase {
  id: string;
  signalType: IncidentSignalType;
  reporterRole: ReporterRole;
  reporterUserId: string;
  victimUserId?: string;
  scope: Scope;
  categoryId: string;
  description: string;
  geoLat: number;
  geoLng: number;
  addressText: string;
  status: IncidentLifecycleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceMedia {
  id: string;
  caseId: string;
  uploadedByRole: UploadedByRole;
  mediaType: MediaType;
  durationSec?: number;
  url: string;
  hash?: string;
  verifiedStatus: "PENDING" | "VERIFIED" | "REJECTED";
  verifiedById?: string;
  verifiedAt?: string;
}

export interface AuthorityVerification {
  id: string;
  caseId: string;
  visitOnScene: boolean;
  visitAt?: string;
  officerId: string;
  officerMediaId?: string;
  verificationResult: "PENDING" | "VERIFIED" | "REJECTED";
  remarks?: string;
  serviceProvided: boolean;
  serviceTypeId?: string;
  serviceProvidedAt?: string;
  resolutionOutcome?: ResolutionOutcome;
  postedToSocial: boolean;
  postedAt?: string;
}

export interface DonationTransaction {
  id: string;
  scope: Scope;
  donationType: DonationType;
  donorType: DonorType;
  donorId?: string;
  donorName: string;
  amount: number;
  currency: string;
  caseId?: string;
  campaignId?: string;
  insurancePolicyRef?: string;
  reimbursedToReservoir: boolean;
  channel: "PUBLIC" | "BUSINESS_CONTRIBUTION" | "GOVERNMENT";
  createdAt: string;
}

export interface ReservoirLedgerEntry {
  id: string;
  scope: Scope;
  sourceType: ReservoirSourceType;
  sourceRef?: string;
  direction: LedgerDirection;
  amount: number;
  linkedCaseId?: string;
  note: string;
  createdAt: string;
}

export interface BusinessAdCampaign {
  id: string;
  businessId: string;
  businessName: string;
  scope: Scope;
  minFee: number;
  paidAmount: number;
  csrContributionPct: number;
  linkedCause: string;
  startAt: string;
  endAt: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
}

export interface NgoServiceLog {
  id: string;
  title: string;
  fundsUsed: number;
  serviceProvided: string;
  outcome: string;
  reportedAt: string;
}

export interface NGO {
  id: string;
  name: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  documents: string[];
  categories: string[];
  partnershipTypes: string[];
  activityLogs: NgoServiceLog[];
  corporateDonations: number;
  employeeVolunteers: number;
}

export interface RevelationCase {
  id: string;
  type: RevelationType;
  subtype: string;
  title: string;
  description: string;
  anonymityRequested: boolean;
  evidenceIds: string[];
  status: RevelationStatus;
  legalSupportRequested: boolean;
  psychologicalSupportRequested: boolean;
  assignedAdminId?: string;
  createdAt: string;
}

export interface DistressSignal {
  id: string;
  type: "SOS" | "MEDIA";
  geoLocation: string;
  for?: string;
  mediaType?: string;
  mediaUrl?: string;
  dateTime: string;
  feedback?: string;
  reporterRole?: ReporterRole;
  categoryId?: string;
  verificationStatus?: IncidentLifecycleStatus;
  resolutionOutcome?: ResolutionOutcome;
}

export interface Contribution {
  id: string;
  direction: "MADE" | "RECEIVED";
  to: string;
  for: string;
  dateTime: string;
  amount?: string;
  type?: string;
  description?: string;
  scope?: Scope;
  donationType?: DonationType;
  donorType?: DonorType;
  linkedCaseId?: string;
  linkedCampaignId?: string;
  reimbursedToReservoir?: boolean;
  insurancePolicyRef?: string;
  donorChannel?: "PUBLIC" | "BUSINESS_CONTRIBUTION" | "GOVERNMENT";
}

export interface Service {
  id: string;
  state: string;
  district: string;
  category: string;
  helplineNumber: string;
  description: string;
}

export interface NgoPost {
  id: string;
  title: string;
  category: string;
  images: string[];
  goalAmount: number;
  raisedAmount: number;
  description: string;
  linkedCaseId?: string;
}

export interface SocialPost {
  id: string;
  images: string[];
  caption: string;
  location: string;
  dateTime: string;
  likes: number;
  linkedCaseId?: string;
}

export interface Complaint {
  id: string;
  text: string;
  mediaUrl?: string;
  geoLocation: string;
  createdAt: string;
}

export const incidentCategories: IncidentCategory[] = [
  { id: "CAT-1", name: "Police Helpline", group: "SERVICE", defaultAuthority: "Police Control Room" },
  { id: "CAT-2", name: "Ambulance Helpline", group: "SERVICE", defaultAuthority: "Emergency Medical" },
  { id: "CAT-3", name: "Road Accident", group: "CRIME", defaultAuthority: "Traffic Authority" },
  { id: "CAT-4", name: "Women Helpline", group: "SERVICE", defaultAuthority: "Women Safety Cell" },
  { id: "CAT-5", name: "Corruption / Misuse", group: "CRIME", defaultAuthority: "Anti Corruption" },
  { id: "CAT-6", name: "Food/Welfare Emergency", group: "SERVICE", defaultAuthority: "Welfare Office" },
];

export const incidentCases: IncidentCase[] = [
  {
    id: "IC-1",
    signalType: "SOS",
    reporterRole: "VICTIM",
    reporterUserId: "user-1001",
    scope: "DISTRICT",
    categoryId: "CAT-1",
    description: "Violence reported near market road.",
    geoLat: 28.6139,
    geoLng: 77.209,
    addressText: "Connaught Place, New Delhi",
    status: "VERIFIED",
    createdAt: "2026-01-15T10:30:00Z",
    updatedAt: "2026-01-15T13:10:00Z",
  },
  {
    id: "IC-2",
    signalType: "MEDIA",
    reporterRole: "SPECTATOR",
    reporterUserId: "user-1002",
    victimUserId: "user-1020",
    scope: "STATE",
    categoryId: "CAT-3",
    description: "Road accident captured by nearby spectator.",
    geoLat: 19.076,
    geoLng: 72.8777,
    addressText: "Andheri Flyover, Mumbai",
    status: "SERVICE_PROVIDED",
    createdAt: "2026-01-14T09:15:00Z",
    updatedAt: "2026-01-14T11:45:00Z",
  },
  {
    id: "IC-3",
    signalType: "SOS",
    reporterRole: "VICTIM",
    reporterUserId: "user-1003",
    scope: "COUNTRY",
    categoryId: "CAT-2",
    description: "Medical emergency requiring ambulance.",
    geoLat: 12.9716,
    geoLng: 77.5946,
    addressText: "MG Road, Bengaluru",
    status: "SOCIAL_POSTED",
    createdAt: "2026-01-13T18:45:00Z",
    updatedAt: "2026-01-13T20:20:00Z",
  },
  {
    id: "IC-4",
    signalType: "MEDIA",
    reporterRole: "SPECTATOR",
    reporterUserId: "user-1011",
    victimUserId: "user-1038",
    scope: "GLOBAL",
    categoryId: "CAT-5",
    description: "Evidence of public fund misuse shared.",
    geoLat: 22.5726,
    geoLng: 88.3639,
    addressText: "Kolkata Municipal Zone 4",
    status: "AUTHORITY_VISIT",
    createdAt: "2026-01-12T07:30:00Z",
    updatedAt: "2026-01-12T09:00:00Z",
  },
  {
    id: "IC-5",
    signalType: "SOS",
    reporterRole: "VICTIM",
    reporterUserId: "user-1018",
    scope: "DISTRICT",
    categoryId: "CAT-4",
    description: "Women safety distress call from bus stand.",
    geoLat: 17.385,
    geoLng: 78.4867,
    addressText: "Secunderabad Bus Stand",
    status: "POLICE_MEDIA_UPLOADED",
    createdAt: "2026-01-11T16:00:00Z",
    updatedAt: "2026-01-11T17:12:00Z",
  },
  {
    id: "IC-6",
    signalType: "MEDIA",
    reporterRole: "VICTIM",
    reporterUserId: "user-1040",
    scope: "STATE",
    categoryId: "CAT-6",
    description: "Food and shelter request with supporting media.",
    geoLat: 26.9124,
    geoLng: 75.7873,
    addressText: "Jaipur Outer Colony",
    status: "SUBMITTED",
    createdAt: "2026-01-10T13:20:00Z",
    updatedAt: "2026-01-10T13:20:00Z",
  },
];

export const evidenceMedias: EvidenceMedia[] = [
  { id: "EM-1", caseId: "IC-1", uploadedByRole: "USER", mediaType: "PHOTO", url: "/placeholder.svg", verifiedStatus: "VERIFIED", verifiedById: "officer-12", verifiedAt: "2026-01-15T11:20:00Z" },
  { id: "EM-2", caseId: "IC-1", uploadedByRole: "POLICE", mediaType: "VIDEO", durationSec: 35, url: "/placeholder.svg", verifiedStatus: "VERIFIED", verifiedById: "officer-12", verifiedAt: "2026-01-15T12:40:00Z" },
  { id: "EM-3", caseId: "IC-2", uploadedByRole: "USER", mediaType: "VIDEO", durationSec: 18, url: "/placeholder.svg", verifiedStatus: "VERIFIED", verifiedById: "officer-28", verifiedAt: "2026-01-14T10:20:00Z" },
  { id: "EM-4", caseId: "IC-2", uploadedByRole: "POLICE", mediaType: "PHOTO", url: "/placeholder.svg", verifiedStatus: "VERIFIED", verifiedById: "officer-28", verifiedAt: "2026-01-14T10:45:00Z" },
  { id: "EM-5", caseId: "IC-3", uploadedByRole: "USER", mediaType: "DOC", url: "/placeholder.svg", verifiedStatus: "PENDING" },
  { id: "EM-6", caseId: "IC-5", uploadedByRole: "POLICE", mediaType: "PHOTO", url: "/placeholder.svg", verifiedStatus: "PENDING" },
  { id: "EM-7", caseId: "IC-4", uploadedByRole: "AUTHORITY", mediaType: "PHOTO", url: "/placeholder.svg", verifiedStatus: "PENDING" },
];

export const authorityVerifications: AuthorityVerification[] = [
  { id: "AV-1", caseId: "IC-1", visitOnScene: true, visitAt: "2026-01-15T11:00:00Z", officerId: "officer-12", officerMediaId: "EM-2", verificationResult: "VERIFIED", remarks: "Victim stabilized and moved to secure zone.", serviceProvided: true, serviceTypeId: "CAT-1", serviceProvidedAt: "2026-01-15T12:50:00Z", resolutionOutcome: "WITH_DONATION", postedToSocial: true, postedAt: "2026-01-15T13:05:00Z" },
  { id: "AV-2", caseId: "IC-2", visitOnScene: true, visitAt: "2026-01-14T10:05:00Z", officerId: "officer-28", officerMediaId: "EM-4", verificationResult: "VERIFIED", remarks: "Ambulance service completed.", serviceProvided: true, serviceTypeId: "CAT-2", serviceProvidedAt: "2026-01-14T10:55:00Z", resolutionOutcome: "WITHOUT_DONATION", postedToSocial: false },
  { id: "AV-3", caseId: "IC-3", visitOnScene: true, visitAt: "2026-01-13T19:05:00Z", officerId: "officer-40", officerMediaId: "EM-5", verificationResult: "VERIFIED", remarks: "Medical support provided and family informed.", serviceProvided: true, serviceTypeId: "CAT-2", serviceProvidedAt: "2026-01-13T19:30:00Z", resolutionOutcome: "WITH_DONATION", postedToSocial: true, postedAt: "2026-01-13T20:20:00Z" },
  { id: "AV-4", caseId: "IC-4", visitOnScene: true, visitAt: "2026-01-12T08:40:00Z", officerId: "officer-09", officerMediaId: "EM-7", verificationResult: "PENDING", remarks: "Evidence under integrity review.", serviceProvided: false, postedToSocial: false },
  { id: "AV-5", caseId: "IC-5", visitOnScene: true, visitAt: "2026-01-11T16:30:00Z", officerId: "officer-55", officerMediaId: "EM-6", verificationResult: "PENDING", remarks: "Awaiting second officer verification.", serviceProvided: true, serviceTypeId: "CAT-4", serviceProvidedAt: "2026-01-11T16:50:00Z", resolutionOutcome: "WITHOUT_DONATION", postedToSocial: false },
  { id: "AV-6", caseId: "IC-6", visitOnScene: false, officerId: "officer-18", verificationResult: "PENDING", serviceProvided: false, postedToSocial: false },
];

export const donationTransactions: DonationTransaction[] = [
  { id: "DT-1", scope: "DISTRICT", donationType: "COVERAGE_BASED", donorType: "PUBLIC", donorName: "Local Citizens Group", amount: 5000, currency: "INR", caseId: "IC-1", reimbursedToReservoir: false, channel: "PUBLIC", createdAt: "2026-01-15T10:50:00Z" },
  { id: "DT-2", scope: "STATE", donationType: "INCIDENTAL", donorType: "BUSINESS", donorId: "biz-22", donorName: "Swift Retail Pvt Ltd", amount: 20000, currency: "INR", campaignId: "BC-1", reimbursedToReservoir: false, channel: "BUSINESS_CONTRIBUTION", createdAt: "2026-01-14T09:40:00Z" },
  { id: "DT-3", scope: "COUNTRY", donationType: "COVERAGE_BASED", donorType: "GOVERNMENT", donorName: "State Relief Department", amount: 120000, currency: "INR", caseId: "IC-3", reimbursedToReservoir: false, channel: "GOVERNMENT", createdAt: "2026-01-13T11:00:00Z" },
  { id: "DT-4", scope: "GLOBAL", donationType: "INCIDENTAL", donorType: "PUBLIC_SECTOR", donorName: "Urban Welfare Board", amount: 45000, currency: "INR", caseId: "IC-4", reimbursedToReservoir: false, channel: "GOVERNMENT", createdAt: "2026-01-12T14:00:00Z" },
  { id: "DT-5", scope: "DISTRICT", donationType: "COVERAGE_BASED", donorType: "INSURANCE", donorName: "SecureLife Insurance", amount: 10000, currency: "INR", caseId: "IC-1", insurancePolicyRef: "POLICY-IC1-7782", reimbursedToReservoir: true, channel: "BUSINESS_CONTRIBUTION", createdAt: "2026-01-16T08:15:00Z" },
];

export const reservoirLedger: ReservoirLedgerEntry[] = [
  { id: "RL-1", scope: "DISTRICT", sourceType: "ADS", sourceRef: "BC-1", direction: "CREDIT", amount: 12000, note: "Business ad fee contribution", createdAt: "2026-01-14T09:45:00Z" },
  { id: "RL-2", scope: "STATE", sourceType: "MERCH", direction: "CREDIT", amount: 5000, note: "Campaign merchandise surplus", createdAt: "2026-01-13T12:10:00Z" },
  { id: "RL-3", scope: "COUNTRY", sourceType: "FUNDRAISING", direction: "CREDIT", amount: 18000, note: "Online fundraising event", createdAt: "2026-01-12T17:30:00Z" },
  { id: "RL-4", scope: "DISTRICT", sourceType: "PUBLIC_UNUSED", direction: "CREDIT", amount: 2600, note: "Unused public donation returned", createdAt: "2026-01-11T09:00:00Z" },
  { id: "RL-5", scope: "GLOBAL", sourceType: "GOVT_GRANT", direction: "CREDIT", amount: 45000, note: "Public emergency grant", createdAt: "2026-01-10T11:00:00Z" },
  { id: "RL-6", scope: "COUNTRY", sourceType: "BUSINESS_CSR", sourceRef: "BC-2", direction: "CREDIT", amount: 25000, note: "Corporate CSR collaboration", createdAt: "2026-01-09T13:40:00Z" },
  { id: "RL-7", scope: "DISTRICT", sourceType: "INSURANCE_REIMBURSE", sourceRef: "POLICY-IC1-7782", direction: "CREDIT", amount: 10000, linkedCaseId: "IC-1", note: "Insurance reimbursement returned to reservoir", createdAt: "2026-01-16T08:40:00Z" },
  { id: "RL-8", scope: "STATE", sourceType: "PUBLIC_SECTOR_SURPLUS", direction: "CREDIT", amount: 9200, note: "Public sector welfare surplus", createdAt: "2026-01-08T16:00:00Z" },
];

export const businessAdCampaigns: BusinessAdCampaign[] = [
  { id: "BC-1", businessId: "biz-22", businessName: "Swift Retail Pvt Ltd", scope: "STATE", minFee: 15000, paidAmount: 22000, csrContributionPct: 18, linkedCause: "IC-2", startAt: "2026-01-14", endAt: "2026-02-14", status: "ACTIVE" },
  { id: "BC-2", businessId: "biz-91", businessName: "Metro Telecom CSR", scope: "COUNTRY", minFee: 35000, paidAmount: 52000, csrContributionPct: 24, linkedCause: "Reservoir", startAt: "2026-01-10", endAt: "2026-04-10", status: "ACTIVE" },
  { id: "BC-3", businessId: "biz-31", businessName: "GreenFuel Ventures", scope: "DISTRICT", minFee: 8000, paidAmount: 9000, csrContributionPct: 12, linkedCause: "IC-6", startAt: "2026-01-08", endAt: "2026-02-01", status: "COMPLETED" },
];

export const ngoOrganizations: NGO[] = [
  {
    id: "NGO-1",
    name: "Red Cross Rapid Response",
    verificationStatus: "VERIFIED",
    documents: ["registration.pdf", "compliance-2026.pdf"],
    categories: [
      "Direct service",
      "Indirect social fulfillment/cause",
      "Corporate CSR partnerships",
    ],
    partnershipTypes: ["Corporate CSR", "Public welfare"],
    corporateDonations: 180000,
    employeeVolunteers: 92,
    activityLogs: [
      { id: "NGO-LOG-1", title: "Flood response deployment", fundsUsed: 42000, serviceProvided: "Emergency shelter and food", outcome: "213 families supported", reportedAt: "2026-01-14T16:00:00Z" },
      { id: "NGO-LOG-2", title: "Medical camp operation", fundsUsed: 18000, serviceProvided: "On-site medical checks", outcome: "147 cases treated", reportedAt: "2026-01-12T12:30:00Z" },
    ],
  },
];

export const revelationCases: RevelationCase[] = [
  { id: "REV-1", type: "CORPORATE", subtype: "LABOR_EXPLOITATION", title: "Factory labor abuse", description: "Workers denied protective equipment and overtime pay.", anonymityRequested: true, evidenceIds: ["EM-5"], status: "UNDER_REVIEW", legalSupportRequested: true, psychologicalSupportRequested: false, assignedAdminId: "admin-1", createdAt: "2026-01-12T08:15:00Z" },
  { id: "REV-2", type: "CORPORATE", subtype: "ENVIRONMENTAL_DAMAGE", title: "Chemical discharge near river", description: "Industrial waste observed in local water channel.", anonymityRequested: false, evidenceIds: ["EM-5"], status: "VERIFIED", legalSupportRequested: true, psychologicalSupportRequested: false, assignedAdminId: "admin-2", createdAt: "2026-01-11T06:30:00Z" },
  { id: "REV-3", type: "PUBLIC", subtype: "GENDER_BASED_VIOLENCE", title: "Harassment at transit terminal", description: "Multiple harassment incidents reported by commuters.", anonymityRequested: true, evidenceIds: ["EM-6"], status: "PUBLISHED", legalSupportRequested: true, psychologicalSupportRequested: true, assignedAdminId: "admin-1", createdAt: "2026-01-10T17:40:00Z" },
  { id: "REV-4", type: "CSF", subtype: "DEVELOPMENT_GRANT_MISUSE", title: "Development grant diverted", description: "Local project funds allegedly routed to shell vendors.", anonymityRequested: true, evidenceIds: ["EM-6"], status: "SUBMITTED", legalSupportRequested: true, psychologicalSupportRequested: false, createdAt: "2026-01-09T15:10:00Z" },
];

export const distressSignals: DistressSignal[] = incidentCases.map((item) => {
  const verification = authorityVerifications.find((entry) => entry.caseId === item.id);
  const userMedia = evidenceMedias.find((media) => media.caseId === item.id && media.uploadedByRole === "USER");
  return {
    id: item.id,
    type: item.signalType,
    geoLocation: `${item.geoLat.toFixed(4)}N, ${item.geoLng.toFixed(4)}E`,
    for: item.reporterRole === "VICTIM" ? "Self" : "Victim Support",
    mediaType: userMedia?.mediaType || (item.signalType === "MEDIA" ? "PHOTO" : undefined),
    mediaUrl: userMedia?.url,
    dateTime: item.createdAt.replace("T", " ").replace("Z", ""),
    feedback: verification?.remarks || "Awaiting authority review",
    reporterRole: item.reporterRole,
    categoryId: item.categoryId,
    verificationStatus: item.status,
    resolutionOutcome: verification?.resolutionOutcome,
  };
});

export const contributions: Contribution[] = [
  { id: "CT-1", direction: "MADE", to: "Red Cross Rapid Response", for: "Flood Relief", dateTime: "2026-01-15 10:00", amount: "INR 5,000", type: "Monetary", description: "Direct contribution for active emergency case.", scope: "DISTRICT", donationType: "COVERAGE_BASED", donorType: "PUBLIC", linkedCaseId: "IC-1", reimbursedToReservoir: false, donorChannel: "PUBLIC" },
  { id: "CT-2", direction: "RECEIVED", to: "User Emergency Wallet", for: "Medical Emergency", dateTime: "2026-01-14 12:30", amount: "INR 10,000", type: "Monetary", description: "Coverage-based incident support.", scope: "STATE", donationType: "COVERAGE_BASED", donorType: "GOVERNMENT", linkedCaseId: "IC-3", reimbursedToReservoir: false, donorChannel: "GOVERNMENT" },
  { id: "CT-3", direction: "MADE", to: "Urban Welfare Collective", for: "Food and Shelter", dateTime: "2026-01-13 08:00", amount: "INR 2,500", type: "Incidental", description: "On-site assistance for temporary shelter.", scope: "DISTRICT", donationType: "INCIDENTAL", donorType: "PUBLIC", linkedCaseId: "IC-6", reimbursedToReservoir: false, donorChannel: "PUBLIC" },
  { id: "CT-4", direction: "RECEIVED", to: "Business CSR Pool", for: "Women Safety Intervention", dateTime: "2026-01-12 15:00", amount: "INR 25,000", type: "CSR", description: "Corporate donation linked to campaign.", scope: "COUNTRY", donationType: "COVERAGE_BASED", donorType: "BUSINESS", linkedCaseId: "IC-5", linkedCampaignId: "BC-2", reimbursedToReservoir: false, donorChannel: "BUSINESS_CONTRIBUTION" },
  { id: "CT-5", direction: "MADE", to: "Insurance Reservoir Return", for: "Insurance Reimbursement", dateTime: "2026-01-11 09:45", amount: "INR 10,000", type: "Insurance", description: "Recovered insurance payout credited back to reservoir.", scope: "DISTRICT", donationType: "COVERAGE_BASED", donorType: "INSURANCE", linkedCaseId: "IC-1", reimbursedToReservoir: true, insurancePolicyRef: "POLICY-IC1-7782", donorChannel: "BUSINESS_CONTRIBUTION" },
  { id: "CT-6", direction: "RECEIVED", to: "Public Sector Welfare", for: "Disaster Readiness", dateTime: "2026-01-10 11:20", amount: "INR 8,000", type: "Grant", description: "Public sector surplus redirected to emergency pool.", scope: "STATE", donationType: "INCIDENTAL", donorType: "PUBLIC_SECTOR", linkedCampaignId: "BC-3", reimbursedToReservoir: false, donorChannel: "GOVERNMENT" },
];

export const services: Service[] = [
  { id: "1", state: "Delhi", district: "New Delhi", category: "Police Helpline", helplineNumber: "100", description: "Emergency police response for all types of crime and safety concerns." },
  { id: "2", state: "Delhi", district: "New Delhi", category: "Ambulance Helpline", helplineNumber: "108", description: "Free emergency ambulance service available 24/7." },
  { id: "3", state: "Maharashtra", district: "Mumbai", category: "Firefighter Helpline", helplineNumber: "101", description: "Fire brigade emergency response service." },
  { id: "4", state: "Karnataka", district: "Bangalore", category: "Child Helpline", helplineNumber: "1098", description: "Child protection and welfare helpline for children in need." },
  { id: "5", state: "Tamil Nadu", district: "Chennai", category: "Women Helpline", helplineNumber: "1091", description: "Women safety and distress helpline operated by police." },
  { id: "6", state: "West Bengal", district: "Kolkata", category: "Food Helpline", helplineNumber: "1967", description: "Food distribution and hunger relief helpline." },
  { id: "7", state: "Uttar Pradesh", district: "Lucknow", category: "Acid Helpline", helplineNumber: "1800-103-1098", description: "Support for acid attack survivors." },
  { id: "8", state: "Rajasthan", district: "Jaipur", category: "Welfare Helpline", helplineNumber: "181", description: "General welfare and social security assistance." },
  { id: "9", state: "Gujarat", district: "Ahmedabad", category: "Police Helpline", helplineNumber: "100", description: "Emergency police assistance." },
  { id: "10", state: "Madhya Pradesh", district: "Bhopal", category: "Ambulance Helpline", helplineNumber: "108", description: "Emergency medical transport." },
];

export const ngoPosts: NgoPost[] = [
  { id: "1", title: "Kerala Flood Relief Fund", category: "Disaster Relief", images: ["/placeholder.svg"], goalAmount: 500000, raisedAmount: 325000, description: "Help families affected by floods in Kerala.", linkedCaseId: "IC-1" },
  { id: "2", title: "Education for Rural Children", category: "Education", images: ["/placeholder.svg"], goalAmount: 200000, raisedAmount: 150000, description: "Provide quality education in remote villages." },
  { id: "3", title: "Clean Water Initiative", category: "Health", images: ["/placeholder.svg"], goalAmount: 300000, raisedAmount: 89000, description: "Install water purifiers in tribal areas." },
  { id: "4", title: "Women Empowerment Drive", category: "Women", images: ["/placeholder.svg"], goalAmount: 150000, raisedAmount: 120000, description: "Skill training for underprivileged women.", linkedCaseId: "IC-5" },
  { id: "5", title: "Animal Rescue Operations", category: "Animal Welfare", images: ["/placeholder.svg"], goalAmount: 180000, raisedAmount: 96000, description: "Emergency treatment and shelter for rescued animals.", linkedCaseId: "IC-2" },
  { id: "6", title: "Urban Green Belt Restoration", category: "Environment", images: ["/placeholder.svg"], goalAmount: 260000, raisedAmount: 113000, description: "Community-led plantation and water body cleanup program.", linkedCaseId: "IC-4" },
];

export const socialPosts: SocialPost[] = [
  { id: "1", images: ["/placeholder.svg"], caption: "Community kitchen serving 500+ meals today! #SOS #Help", location: "New Delhi", dateTime: "2026-01-15 12:00", likes: 234, linkedCaseId: "IC-1" },
  { id: "2", images: ["/placeholder.svg"], caption: "Volunteers distributing blankets to homeless. #WinterRelief", location: "Mumbai", dateTime: "2026-01-14 18:00", likes: 189, linkedCaseId: "IC-2" },
  { id: "3", images: ["/placeholder.svg"], caption: "Medical camp in rural Bihar. Free checkups for all.", location: "Patna", dateTime: "2026-01-13 10:00", likes: 312 },
  { id: "4", images: ["/placeholder.svg"], caption: "Blood donation drive at city center. Be a hero today!", location: "Bangalore", dateTime: "2026-01-12 09:00", likes: 456, linkedCaseId: "IC-3" },
];

export const complaints: Complaint[] = revelationCases.slice(0, 3).map((item) => ({
  id: item.id,
  text: item.description,
  mediaUrl: "/placeholder.svg",
  geoLocation: "28.6139N, 77.2090E",
  createdAt: item.createdAt,
}));

export const states = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "West Bengal", "Uttar Pradesh", "Rajasthan", "Gujarat", "Madhya Pradesh"];

export const districts: Record<string, string[]> = {
  Delhi: ["New Delhi", "North Delhi", "South Delhi"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bangalore", "Mysore", "Hubli"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior"],
};
