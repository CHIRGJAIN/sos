import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  RedirectIfAuthenticated,
  RequirePortalAuth,
} from "@/components/layout/PortalRouteGuards";

import StartPage from "./app/(user)/StartPage";
import VerifyPage from "./app/(user)/VerifyPage";
import HomePage from "./app/(user)/HomePage";
import DistressPage from "./app/(user)/DistressPage";
import ContributionsPage from "./app/(user)/ContributionsPage";
import ProfilePage from "./app/(user)/ProfilePage";
import PersonalDetailPage from "./app/(user)/PersonalDetailPage";
import ServicesPage from "./app/(user)/ServicesPage";
import StatesPage from "./app/(user)/StatesPage";
import DistrictsPage from "./app/(user)/DistrictsPage";
import DSNGSelectionPage from "./app/(user)/DSNGSelectionPage";
import SocialPage from "./app/(user)/SocialPage";
import RevelationPage from "./app/(user)/RevelationPage";
import MediaUploadPage from "./app/(user)/MediaUploadPage";

import NgoFeedPage from "./app/(ngo)/NgoFeedPage";
import ResourceHandlePage from "./app/(resource)/ResourceHandlePage";
import AdminDashboardPage from "./app/(admin)/AdminDashboardPage";
import AdminTransparencyPage from "./app/(admin)/AdminTransparencyPage";
import AdminRevelationsPage from "./app/(admin)/AdminRevelationsPage";
import AuthorityDashboardPage from "./app/(authority)/AuthorityDashboardPage";
import BusinessDashboardPage from "./app/(business)/BusinessDashboardPage";
import BusinessResourcesPage from "./app/(business)/BusinessResourcesPage";
import TransparencyDashboardPage from "./app/(transparency)/TransparencyDashboardPage";
import LoginPage from "./app/(auth)/LoginPage";
import PortalSelectionPage from "./app/(auth)/PortalSelectionPage";
import NotFound from "./app/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/user/login" replace />} />
            <Route path="/login" element={<PortalSelectionPage />} />

            <Route path="/user/start" element={<StartPage />} />
            <Route path="/user/verify" element={<VerifyPage />} />
            <Route
              path="/user/login"
              element={
                <RedirectIfAuthenticated portal="user">
                  <LoginPage portal="user" title="User Portal" redirectTo="/user/home" />
                </RedirectIfAuthenticated>
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
                  <ProfilePage />
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
              path="/ngo/login"
              element={
                <RedirectIfAuthenticated portal="ngo">
                  <LoginPage portal="ngo" title="NGO Portal" redirectTo="/ngo/feed" />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/ngo/feed"
              element={
                <RequirePortalAuth portal="ngo">
                  <NgoFeedPage />
                </RequirePortalAuth>
              }
            />

            <Route
              path="/admin/login"
              element={
                <RedirectIfAuthenticated portal="admin">
                  <LoginPage portal="admin" title="Admin Portal" redirectTo="/admin/dashboard" />
                </RedirectIfAuthenticated>
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
                <RedirectIfAuthenticated portal="resource">
                  <LoginPage
                    portal="resource"
                    title="Resource Portal"
                    redirectTo="/resource/handle"
                  />
                </RedirectIfAuthenticated>
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
              path="/authority/login"
              element={
                <RedirectIfAuthenticated portal="authority">
                  <LoginPage
                    portal="authority"
                    title="Authority Portal"
                    redirectTo="/authority/dashboard"
                  />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path="/authority/dashboard"
              element={
                <RequirePortalAuth portal="authority">
                  <AuthorityDashboardPage />
                </RequirePortalAuth>
              }
            />
            <Route path="/authority" element={<Navigate to="/authority/dashboard" replace />} />

            <Route
              path="/business/login"
              element={
                <RedirectIfAuthenticated portal="business">
                  <LoginPage
                    portal="business"
                    title="Business Portal"
                    redirectTo="/business/dashboard"
                  />
                </RedirectIfAuthenticated>
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
            <Route path="/business" element={<Navigate to="/business/dashboard" replace />} />

            <Route path="/transparency/*" element={<TransparencyDashboardPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
