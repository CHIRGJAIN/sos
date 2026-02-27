import { Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import AuthLayout from "@/sos/pages/auth/AuthLayout";
import SignupPage from "@/sos/pages/auth/SignupPage";
import ForgotPasswordPage from "@/sos/pages/auth/ForgotPasswordPage";
import OtpPage from "@/sos/pages/auth/OtpPage";
import ProfileSetupPage from "@/sos/pages/auth/ProfileSetupPage";
import ProfilePage from "@/sos/pages/shared/ProfilePage";
import SettingsPage from "@/sos/pages/shared/SettingsPage";
import HelpPage from "@/sos/pages/shared/HelpPage";
import SearchResultsPage from "@/sos/pages/shared/SearchResultsPage";
import NotificationsPage from "@/sos/pages/shared/NotificationsPage";
import AuditLogsPage from "@/sos/pages/shared/AuditLogsPage";
import EmptyStatePage from "@/sos/pages/shared/EmptyStatePage";
import ErrorStatePage from "@/sos/pages/shared/ErrorStatePage";
import UnauthorizedPage from "@/sos/pages/UnauthorizedPage";
import NotFoundPage from "@/sos/pages/NotFoundPage";
import { AppShell } from "@/sos/components/layout";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Role } from "@/sos/models";
import AuthorityOverviewPage from "@/sos/pages/authority/AuthorityOverviewPage";
import AuthorityIncidentFeedPage from "@/sos/pages/authority/AuthorityIncidentFeedPage";
import AuthorityIncidentDetailPage from "@/sos/pages/authority/AuthorityIncidentDetailPage";
import AuthorityVerifyReportsPage from "@/sos/pages/authority/AuthorityVerifyReportsPage";
import AuthorityAssignmentBoardPage from "@/sos/pages/authority/AuthorityAssignmentBoardPage";
import AuthorityNgoDirectoryPage from "@/sos/pages/authority/AuthorityNgoDirectoryPage";
import AuthorityNgoProfilePage from "@/sos/pages/authority/AuthorityNgoProfilePage";
import AuthorityBroadcastAlertsPage from "@/sos/pages/authority/AuthorityBroadcastAlertsPage";
import AuthorityAnalyticsPage from "@/sos/pages/authority/AuthorityAnalyticsPage";
import AuthorityCommunicationPage from "@/sos/pages/authority/AuthorityCommunicationPage";
import AuthorityRespondersPage from "@/sos/pages/authority/AuthorityRespondersPage";
import AuthorityEscalationsPage from "@/sos/pages/authority/AuthorityEscalationsPage";
import AuthorityResourceRequestsPage from "@/sos/pages/authority/AuthorityResourceRequestsPage";
import AuthorityAreaMonitoringPage from "@/sos/pages/authority/AuthorityAreaMonitoringPage";
import AuthorityReportsPage from "@/sos/pages/authority/AuthorityReportsPage";
import AuthorityReportDetailPage from "@/sos/pages/authority/AuthorityReportDetailPage";
import NgoOverviewPage from "@/sos/pages/ngo/NgoOverviewPage";
import NgoAssignedCasesPage from "@/sos/pages/ngo/NgoAssignedCasesPage";
import NgoNearbyRequestsPage from "@/sos/pages/ngo/NgoNearbyRequestsPage";
import NgoResponseFeedPage from "@/sos/pages/ngo/NgoResponseFeedPage";
import NgoVolunteersPage from "@/sos/pages/ngo/NgoVolunteersPage";
import NgoResourcesPage from "@/sos/pages/ngo/NgoResourcesPage";
import NgoSupportRequestsPage from "@/sos/pages/ngo/NgoSupportRequestsPage";
import NgoCommunicationPage from "@/sos/pages/ngo/NgoCommunicationPage";
import NgoReportsPage from "@/sos/pages/ngo/NgoReportsPage";
import NgoPerformancePage from "@/sos/pages/ngo/NgoPerformancePage";
import NgoOrganizationProfilePage from "@/sos/pages/ngo/NgoOrganizationProfilePage";
import NgoCaseDetailPage from "@/sos/pages/ngo/NgoCaseDetailPage";
import NgoSubmitRequestPage from "@/sos/pages/ngo/NgoSubmitRequestPage";
import NgoDocumentsPage from "@/sos/pages/ngo/NgoDocumentsPage";
import NgoStatusTrackingPage from "@/sos/pages/ngo/NgoStatusTrackingPage";
import NgoTasksPage from "@/sos/pages/ngo/NgoTasksPage";
import {
  RedirectIfAuthenticated as LegacyRedirectIfAuthenticated,
  RequirePortalAuth,
} from "@/components/layout/PortalRouteGuards";
import LegacyPortalLoginPage from "@/app/(auth)/LoginPage";
import PortalSelectionPage from "@/app/(auth)/PortalSelectionPage";
import StartPage from "@/app/(user)/StartPage";
import VerifyPage from "@/app/(user)/VerifyPage";
import HomePage from "@/app/(user)/HomePage";
import DistressPage from "@/app/(user)/DistressPage";
import ContributionsPage from "@/app/(user)/ContributionsPage";
import LegacyUserProfilePage from "@/app/(user)/ProfilePage";
import PersonalDetailPage from "@/app/(user)/PersonalDetailPage";
import ServicesPage from "@/app/(user)/ServicesPage";
import StatesPage from "@/app/(user)/StatesPage";
import DistrictsPage from "@/app/(user)/DistrictsPage";
import DSNGSelectionPage from "@/app/(user)/DSNGSelectionPage";
import SocialPage from "@/app/(user)/SocialPage";
import RevelationPage from "@/app/(user)/RevelationPage";
import MediaUploadPage from "@/app/(user)/MediaUploadPage";
import ResourceHandlePage from "@/app/(resource)/ResourceHandlePage";
import AdminDashboardPage from "@/app/(admin)/AdminDashboardPage";
import AdminTransparencyPage from "@/app/(admin)/AdminTransparencyPage";
import AdminRevelationsPage from "@/app/(admin)/AdminRevelationsPage";
import BusinessDashboardPage from "@/app/(business)/BusinessDashboardPage";
import BusinessResourcesPage from "@/app/(business)/BusinessResourcesPage";
import TransparencyDashboardPage from "@/app/(transparency)/TransparencyDashboardPage";

const RequireAuth = () => {
  const { session } = useSosApp();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const RedirectIfSosAuthenticated = () => {
  const { session } = useSosApp();
  const location = useLocation();
  if (location.pathname === "/auth/profile-setup") {
    return <Outlet />;
  }
  if (!session) return <Outlet />;
  return <Navigate to={session.role === "authority" ? "/authority/dashboard" : "/ngo/dashboard"} replace />;
};

const RequireRole: React.FC<{ role: Role }> = ({ role }) => {
  const { session } = useSosApp();
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  if (session.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

const RoleAwareShell = () => {
  const { session } = useSosApp();
  if (!session) return <Navigate to="/login" replace />;
  return <AppShell role={session.role} />;
};

const AuthorityRequestAlias = () => {
  const { incidentId } = useParams();
  return <Navigate to={incidentId ? `/authority/requests/${incidentId}` : "/authority/requests"} replace />;
};

const NgoRequestAlias = () => {
  const { caseId } = useParams();
  return <Navigate to={caseId ? `/ngo/requests/${caseId}` : "/ngo/requests"} replace />;
};

const SosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<RedirectIfSosAuthenticated />}>
        <Route path="/signin" element={<Navigate to="/login" replace />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Navigate to="/login" replace />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="otp" element={<OtpPage />} />
          <Route path="profile-setup" element={<ProfileSetupPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<RoleAwareShell />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/system/empty-state" element={<EmptyStatePage />} />
          <Route path="/system/error-state" element={<ErrorStatePage />} />
        </Route>
      </Route>

      <Route element={<RequireRole role="authority" />}>
        <Route path="/authority" element={<AppShell role="authority" />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<AuthorityOverviewPage />} />
          <Route path="requests" element={<AuthorityIncidentFeedPage />} />
          <Route path="requests/:incidentId" element={<AuthorityIncidentDetailPage />} />
          <Route path="ngos" element={<AuthorityNgoDirectoryPage />} />
          <Route path="ngos/:ngoId" element={<AuthorityNgoProfilePage />} />
          <Route path="approvals" element={<AuthorityVerifyReportsPage />} />
          <Route path="reports" element={<AuthorityReportsPage />} />
          <Route path="reports/:reportId" element={<AuthorityReportDetailPage />} />
          <Route path="announcements" element={<AuthorityBroadcastAlertsPage />} />
          <Route path="assignments" element={<AuthorityAssignmentBoardPage />} />
          <Route path="responders" element={<AuthorityRespondersPage />} />
          <Route path="escalations" element={<AuthorityEscalationsPage />} />
          <Route path="resource-requests" element={<AuthorityResourceRequestsPage />} />
          <Route path="area-monitoring" element={<AuthorityAreaMonitoringPage />} />
          <Route path="analytics" element={<AuthorityAnalyticsPage />} />
          <Route path="messages" element={<AuthorityCommunicationPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="audit-logs" element={<AuditLogsPage role="authority" />} />

          <Route path="overview" element={<Navigate to="/authority/dashboard" replace />} />
          <Route path="incidents" element={<Navigate to="/authority/requests" replace />} />
          <Route path="incidents/:incidentId" element={<AuthorityRequestAlias />} />
          <Route path="verify-reports" element={<Navigate to="/authority/approvals" replace />} />
          <Route path="assignment-board" element={<Navigate to="/authority/assignments" replace />} />
          <Route path="broadcasts" element={<Navigate to="/authority/announcements" replace />} />
          <Route path="communication" element={<Navigate to="/authority/messages" replace />} />
        </Route>
      </Route>

      <Route element={<RequireRole role="ngo" />}>
        <Route path="/ngo" element={<AppShell role="ngo" />}>
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<NgoOverviewPage />} />
          <Route path="requests" element={<NgoAssignedCasesPage />} />
          <Route path="requests/:caseId" element={<NgoCaseDetailPage />} />
          <Route path="submit" element={<NgoSubmitRequestPage />} />
          <Route path="documents" element={<NgoDocumentsPage />} />
          <Route path="status-tracking" element={<NgoStatusTrackingPage />} />
          <Route path="tasks" element={<NgoTasksPage />} />
          <Route path="nearby-requests" element={<NgoNearbyRequestsPage />} />
          <Route path="response-feed" element={<NgoResponseFeedPage />} />
          <Route path="resources" element={<NgoResourcesPage />} />
          <Route path="support-requests" element={<NgoSupportRequestsPage />} />
          <Route path="messages" element={<NgoCommunicationPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="reports" element={<NgoReportsPage />} />
          <Route path="performance" element={<NgoPerformancePage />} />
          <Route path="profile" element={<NgoOrganizationProfilePage />} />
          <Route path="team" element={<NgoVolunteersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          <Route path="audit-logs" element={<AuditLogsPage role="ngo" />} />

          <Route path="overview" element={<Navigate to="/ngo/dashboard" replace />} />
          <Route path="assigned-cases" element={<Navigate to="/ngo/requests" replace />} />
          <Route path="cases/:caseId" element={<NgoRequestAlias />} />
          <Route path="volunteers" element={<Navigate to="/ngo/team" replace />} />
          <Route path="communication" element={<Navigate to="/ngo/messages" replace />} />
        </Route>
      </Route>

      <Route path="/login" element={<PortalSelectionPage />} />
      <Route
        path="/ngo/login"
        element={
          <LegacyRedirectIfAuthenticated portal="ngo">
            <LegacyPortalLoginPage portal="ngo" title="NGO Portal" redirectTo="/ngo/dashboard" />
          </LegacyRedirectIfAuthenticated>
        }
      />
      <Route
        path="/authority/login"
        element={
          <LegacyRedirectIfAuthenticated portal="authority">
            <LegacyPortalLoginPage portal="authority" title="Authority Portal" redirectTo="/authority/dashboard" />
          </LegacyRedirectIfAuthenticated>
        }
      />

      <Route path="/user/start" element={<StartPage />} />
      <Route path="/user/verify" element={<VerifyPage />} />
      <Route
        path="/user/login"
        element={
          <LegacyRedirectIfAuthenticated portal="user">
            <LegacyPortalLoginPage portal="user" title="User Portal" redirectTo="/user/home" />
          </LegacyRedirectIfAuthenticated>
        }
      />
      <Route
        path="/user/home"
        element={
          <RequirePortalAuth portal="user">
            <HomePage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/distress"
        element={
          <RequirePortalAuth portal="user">
            <DistressPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/contributions"
        element={
          <RequirePortalAuth portal="user">
            <ContributionsPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/profile"
        element={
          <RequirePortalAuth portal="user">
            <LegacyUserProfilePage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/personal-detail"
        element={
          <RequirePortalAuth portal="user">
            <PersonalDetailPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/services"
        element={
          <RequirePortalAuth portal="user">
            <ServicesPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/services/states"
        element={
          <RequirePortalAuth portal="user">
            <StatesPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/services/districts"
        element={
          <RequirePortalAuth portal="user">
            <DistrictsPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/dsng-selection"
        element={
          <RequirePortalAuth portal="user">
            <DSNGSelectionPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/social"
        element={
          <RequirePortalAuth portal="user">
            <SocialPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/revelation"
        element={
          <RequirePortalAuth portal="user">
            <RevelationPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/user/media-upload"
        element={
          <RequirePortalAuth portal="user">
            <MediaUploadPage />
          </RequirePortalAuth>
        }
      />

      <Route
        path="/admin/login"
        element={
          <LegacyRedirectIfAuthenticated portal="admin">
            <LegacyPortalLoginPage portal="admin" title="Admin Portal" redirectTo="/admin/dashboard" />
          </LegacyRedirectIfAuthenticated>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RequirePortalAuth portal="admin">
            <AdminDashboardPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/admin/transparency/*"
        element={
          <RequirePortalAuth portal="admin">
            <AdminTransparencyPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/admin/revelations/*"
        element={
          <RequirePortalAuth portal="admin">
            <AdminRevelationsPage />
          </RequirePortalAuth>
        }
      />

      <Route
        path="/resource/login"
        element={
          <LegacyRedirectIfAuthenticated portal="resource">
            <LegacyPortalLoginPage portal="resource" title="Resource Portal" redirectTo="/resource/handle" />
          </LegacyRedirectIfAuthenticated>
        }
      />
      <Route
        path="/resource/handle"
        element={
          <RequirePortalAuth portal="resource">
            <ResourceHandlePage />
          </RequirePortalAuth>
        }
      />

      <Route
        path="/business/login"
        element={
          <LegacyRedirectIfAuthenticated portal="business">
            <LegacyPortalLoginPage portal="business" title="Business Portal" redirectTo="/business/dashboard" />
          </LegacyRedirectIfAuthenticated>
        }
      />
      <Route
        path="/business/dashboard"
        element={
          <RequirePortalAuth portal="business">
            <BusinessDashboardPage />
          </RequirePortalAuth>
        }
      />
      <Route
        path="/business/resources"
        element={
          <RequirePortalAuth portal="business">
            <BusinessResourcesPage />
          </RequirePortalAuth>
        }
      />

      <Route path="/transparency/*" element={<TransparencyDashboardPage />} />

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default SosRoutes;
