import { Navigate, Route, Routes } from "react-router-dom";
import {
  RedirectIfAuthenticated as LegacyRedirectIfAuthenticated,
  RequirePortalAuth,
} from "@/components/layout/PortalRouteGuards";
import LegacyPortalLoginPage from "@/app/(auth)/LoginPage";
import StartPage from "@/app/(user)/StartPage";
import VerifyPage from "@/app/(user)/VerifyPage";
import ResourceHandlePage from "@/app/(resource)/ResourceHandlePage";
import BusinessDashboardPage from "@/app/(business)/BusinessDashboardPage";
import BusinessResourcesPage from "@/app/(business)/BusinessResourcesPage";
import PortalWorkspacePage from "@/web/pages/PortalWorkspacePage";
import WebLoginPage from "@/web/pages/WebLoginPage";
import { RedirectIfWebAuthenticated, RequireWebRoleAuth } from "@/web/components/WebRouteGuard";
import NotFoundPage from "@/sos/pages/NotFoundPage";

const SosRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <RedirectIfWebAuthenticated>
            <WebLoginPage />
          </RedirectIfWebAuthenticated>
        }
      />

      <Route path="/user/login" element={<Navigate to="/login?role=citizen" replace />} />
      <Route path="/ngo/login" element={<Navigate to="/login?role=ngo" replace />} />
      <Route path="/authority/login" element={<Navigate to="/login?role=authority" replace />} />
      <Route path="/admin/login" element={<Navigate to="/login?role=admin" replace />} />

      <Route
        path="/resource/login"
        element={
          <LegacyRedirectIfAuthenticated portal="resource">
            <LegacyPortalLoginPage portal="resource" title="Resource Portal" redirectTo="/resource/handle" />
          </LegacyRedirectIfAuthenticated>
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

      <Route path="/user/start" element={<StartPage />} />
      <Route path="/user/verify" element={<VerifyPage />} />

      <Route
        path="/user/home"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="dashboard" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/sos"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="sos" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/incident"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="incident" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/spectator"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="spectator" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/distress"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="history" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/contacts"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="contacts" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/social"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="social" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/resources"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="resources" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/ngos"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="ngos" />
          </RequireWebRoleAuth>
        }
      />
      <Route path="/user/services" element={<Navigate to="/user/resources" replace />} />
      <Route
        path="/user/revelation"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="revelation" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/transparency"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="transparency" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/contributions"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="transparency" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/settings"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="settings" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/user/profile"
        element={
          <RequireWebRoleAuth role="citizen">
            <PortalWorkspacePage role="citizen" module="profile" />
          </RequireWebRoleAuth>
        }
      />

      <Route
        path="/authority/dashboard"
        element={
          <RequireWebRoleAuth role="authority">
            <PortalWorkspacePage role="authority" module="dashboard" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/authority/queue"
        element={
          <RequireWebRoleAuth role="authority">
            <PortalWorkspacePage role="authority" module="queue" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/authority/analytics"
        element={
          <RequireWebRoleAuth role="authority">
            <PortalWorkspacePage role="authority" module="analytics" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/authority/broadcast"
        element={
          <RequireWebRoleAuth role="authority">
            <PortalWorkspacePage role="authority" module="broadcast" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/authority/verification"
        element={
          <RequireWebRoleAuth role="authority">
            <PortalWorkspacePage role="authority" module="verification" />
          </RequireWebRoleAuth>
        }
      />

      <Route
        path="/ngo/dashboard"
        element={
          <RequireWebRoleAuth role="ngo">
            <PortalWorkspacePage role="ngo" module="dashboard" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/ngo/requests"
        element={
          <RequireWebRoleAuth role="ngo">
            <PortalWorkspacePage role="ngo" module="requests" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/ngo/campaigns"
        element={
          <RequireWebRoleAuth role="ngo">
            <PortalWorkspacePage role="ngo" module="campaigns" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/ngo/resources"
        element={
          <RequireWebRoleAuth role="ngo">
            <PortalWorkspacePage role="ngo" module="resources" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/ngo/transparency"
        element={
          <RequireWebRoleAuth role="ngo">
            <PortalWorkspacePage role="ngo" module="transparency" />
          </RequireWebRoleAuth>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <RequireWebRoleAuth role="admin">
            <PortalWorkspacePage role="admin" module="dashboard" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/admin/queue"
        element={
          <RequireWebRoleAuth role="admin">
            <PortalWorkspacePage role="admin" module="queue" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/admin/verification"
        element={
          <RequireWebRoleAuth role="admin">
            <PortalWorkspacePage role="admin" module="verification" />
          </RequireWebRoleAuth>
        }
      />
      <Route
        path="/admin/transparency"
        element={
          <RequireWebRoleAuth role="admin">
            <PortalWorkspacePage role="admin" module="transparency" />
          </RequireWebRoleAuth>
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

      <Route path="/transparency" element={<Navigate to="/user/transparency" replace />} />
      <Route path="/transparency/*" element={<Navigate to="/user/transparency" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default SosRoutes;
