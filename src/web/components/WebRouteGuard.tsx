import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { DemoRole } from "@/web/types";
import { useSosWeb } from "@/web/context/SosWebContext";

const roleRouteMap: Record<DemoRole, string> = {
  citizen: "/user/home",
  authority: "/authority/dashboard",
  ngo: "/ngo/dashboard",
  admin: "/admin/dashboard",
};

interface RequireWebRoleAuthProps {
  role: DemoRole;
  children: React.ReactElement;
}

export const RequireWebRoleAuth: React.FC<RequireWebRoleAuthProps> = ({ role, children }) => {
  const { authSession } = useSosWeb();
  const location = useLocation();

  if (!authSession.isAuthenticated || !authSession.otpVerified) {
    return (
      <Navigate
        to={`/login?role=${role}`}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (authSession.currentRole !== role) {
    return <Navigate to={roleRouteMap[authSession.currentRole]} replace />;
  }

  return children;
};

export const RedirectIfWebAuthenticated: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { authSession } = useSosWeb();

  if (authSession.isAuthenticated && authSession.otpVerified) {
    return <Navigate to={roleRouteMap[authSession.currentRole]} replace />;
  }

  return children;
};
