import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Portal, useAuth } from "@/contexts/AuthContext";

interface GuardProps {
  portal: Portal;
  children: React.ReactElement;
}

export const RequirePortalAuth: React.FC<GuardProps> = ({ portal, children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn(portal)) {
    return <Navigate to={`/${portal}/login`} replace state={{ from: location.pathname }} />;
  }

  return children;
};

export const RedirectIfAuthenticated: React.FC<GuardProps> = ({ portal, children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn(portal)) {
    const redirectMap: Record<Portal, string> = {
      user: "/user/home",
      ngo: "/ngo/feed",
      admin: "/admin/dashboard",
      resource: "/resource/handle",
      authority: "/authority/dashboard",
      business: "/business/dashboard",
    };
    return <Navigate to={redirectMap[portal]} replace />;
  }

  return children;
};
