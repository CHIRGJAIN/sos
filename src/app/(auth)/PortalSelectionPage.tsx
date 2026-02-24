import React from "react";
import { Link } from "react-router-dom";
import { Portal, useAuth } from "@/contexts/AuthContext";

interface PortalCard {
  portal: Portal;
  title: string;
  subtitle: string;
  loginPath: string;
}

const portalCards: PortalCard[] = [
  {
    portal: "user",
    title: "User Dashboard",
    subtitle: "SOS, Distress, Services, Social and Profile",
    loginPath: "/user/login",
  },
  {
    portal: "ngo",
    title: "NGO Dashboard",
    subtitle: "NGO feed, campaigns, verification and service reports",
    loginPath: "/ngo/login",
  },
  {
    portal: "authority",
    title: "Authority Dashboard",
    subtitle: "Incident inbox, on-scene verification and resolution timeline",
    loginPath: "/authority/login",
  },
  {
    portal: "business",
    title: "Business Dashboard",
    subtitle: "Ad campaigns, CSR contribution and trust transparency",
    loginPath: "/business/login",
  },
  {
    portal: "resource",
    title: "Resource Dashboard",
    subtitle: "Donations used/received and reservoir ledger transparency",
    loginPath: "/resource/login",
  },
  {
    portal: "admin",
    title: "Admin Dashboard",
    subtitle: "Transparency controls, revelations queue and governance tools",
    loginPath: "/admin/login",
  },
];

const PortalSelectionPage: React.FC = () => {
  const { getDemoCredentials } = useAuth();

  return (
    <div className="portal-shell-center">
      <div className="portal-panel phone-container lg:grid lg:grid-cols-[1.05fr_1fr]">
        <div className="hidden border-r border-primary/20 bg-[linear-gradient(160deg,hsl(24_95%_53%_/_0.88)_0%,hsl(20_88%_45%_/_0.78)_45%,hsl(30_70%_75%_/_0.62)_100%)] p-10 text-white lg:flex lg:flex-col lg:justify-end">
          <h2 className="font-serif text-4xl font-semibold leading-tight">Choose Dashboard Login</h2>
          <p className="mt-4 max-w-md text-sm text-white/90">
            Each dashboard has a different login and password. Accounts are isolated per portal.
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[880px] flex-1 flex-col px-6 py-8 lg:px-8 lg:py-10">
          <h1 className="mb-2 font-serif text-2xl font-bold lg:text-3xl">Portal Login Selector</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Select a dashboard to continue with its dedicated credentials.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {portalCards.map((item) => {
              const creds = getDemoCredentials(item.portal);
              return (
                <div
                  key={item.portal}
                  className="rounded-2xl border border-primary/20 bg-popover/80 p-4 shadow-soft"
                >
                  <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
                  <p className="mt-3 rounded-lg border border-primary/20 bg-secondary/60 px-3 py-2 text-xs">
                    Login: <span className="font-medium">{creds.email}</span>
                    <br />
                    Password: <span className="font-medium">{creds.password}</span>
                  </p>
                  <Link
                    to={item.loginPath}
                    className="mt-3 inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
                  >
                    Open {item.portal} login
                  </Link>
                </div>
              );
            })}
          </div>

          <Link to="/user/start" className="mt-5 text-sm font-medium text-accent underline">
            Back to mobile OTP start
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortalSelectionPage;
