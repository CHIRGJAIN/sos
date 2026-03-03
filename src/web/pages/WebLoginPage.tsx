import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ShieldAlert, Smartphone } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSosWeb } from "@/web/context/SosWebContext";
import { DemoRole } from "@/web/types";

const roleRouteMap: Record<DemoRole, string> = {
  citizen: "/user/home",
  authority: "/authority/dashboard",
  ngo: "/ngo/dashboard",
  admin: "/admin/dashboard",
};

const labels = {
  en: {
    title: "Trinix SOS Command Center",
    subtitle: "Mock mobile OTP access for citizen and role dashboards",
    mobileLabel: "Indian mobile number",
    otpLabel: "Enter OTP",
    otpHint: "Use any 6 digits. Verification is mocked locally.",
    sendOtp: "Send OTP",
    verify: "Verify and continue",
    change: "Change number",
    role: "Continue as",
    roleList: {
      citizen: "Citizen",
      authority: "Authority",
      ngo: "NGO",
      admin: "Admin",
    },
    errorMobile: "Enter a valid 10-digit Indian mobile number.",
    errorOtp: "Enter a 6-digit OTP.",
    sample: "Demo mode only. No SMS is sent.",
  },
  hi: {
    title: "ट्रिनिक्स SOS कमांड सेंटर",
    subtitle: "नागरिक और भूमिका डैशबोर्ड के लिए मॉक मोबाइल OTP लॉगिन",
    mobileLabel: "भारतीय मोबाइल नंबर",
    otpLabel: "OTP दर्ज करें",
    otpHint: "कोई भी 6 अंक दर्ज करें। सत्यापन लोकल मॉक है।",
    sendOtp: "OTP भेजें",
    verify: "सत्यापित करें",
    change: "नंबर बदलें",
    role: "भूमिका चुनें",
    roleList: {
      citizen: "नागरिक",
      authority: "प्राधिकरण",
      ngo: "NGO",
      admin: "एडमिन",
    },
    errorMobile: "मान्य 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।",
    errorOtp: "6-अंकीय OTP दर्ज करें।",
    sample: "केवल डेमो मोड। कोई SMS नहीं भेजा जाता।",
  },
} as const;

const WebLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { authSession, language, setLanguage, loginWithMockOtp } = useSosWeb();
  const [selectedRole, setSelectedRole] = useState<DemoRole>("citizen");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const copy = labels[language];

  useEffect(() => {
    const searchRole = searchParams.get("role");
    if (searchRole && ["citizen", "authority", "ngo", "admin"].includes(searchRole)) {
      setSelectedRole(searchRole as DemoRole);
    }
  }, [searchParams]);

  useEffect(() => {
    if (authSession.isAuthenticated && authSession.otpVerified) {
      navigate(roleRouteMap[authSession.currentRole], { replace: true });
    }
  }, [authSession, navigate]);

  const fromPath = useMemo(() => {
    return (location.state as { from?: string } | undefined)?.from;
  }, [location.state]);

  const sanitizedMobile = mobile.replace(/\D/g, "").slice(0, 10);

  const sendOtp = () => {
    if (sanitizedMobile.length !== 10) {
      setError(copy.errorMobile);
      return;
    }
    setError("");
    setStep("otp");
  };

  const verifyOtp = () => {
    if (otp.replace(/\D/g, "").length !== 6) {
      setError(copy.errorOtp);
      return;
    }
    setError("");
    loginWithMockOtp(sanitizedMobile, selectedRole);
    navigate(fromPath || roleRouteMap[selectedRole], { replace: true });
  };

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top_right,#ffe1dc_0%,#fff7f5_34%,#eef5ff_70%,#f8fafc_100%)] px-4 py-8"
      style={{
        fontFamily:
          language === "hi"
            ? "'Noto Sans Devanagari', 'Nirmala UI', system-ui, sans-serif"
            : "system-ui, sans-serif",
      }}
    >
      <div className="mx-auto grid max-w-5xl gap-6 rounded-[32px] border border-white/70 bg-white/90 p-4 shadow-2xl shadow-orange-100 backdrop-blur md:grid-cols-[1.05fr_0.95fr] md:p-8">
        <section className="rounded-[28px] bg-[linear-gradient(145deg,#FF3B30_0%,#FF9500_52%,#007AFF_100%)] p-6 text-white md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">SOS</p>
              <p className="text-lg font-semibold">Command Center</p>
            </div>
          </div>
          <h1 className="mt-8 text-3xl font-semibold leading-tight md:text-4xl">{copy.title}</h1>
          <p className="mt-4 max-w-md text-sm text-white/85">{copy.subtitle}</p>
          <div className="mt-8 rounded-3xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/70">{copy.role}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(["citizen", "authority", "ngo", "admin"] as DemoRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left text-sm transition",
                    selectedRole === role
                      ? "border-white bg-white text-slate-900"
                      : "border-white/20 bg-white/5 text-white",
                  )}
                >
                  {copy.roleList[role]}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-white/80">
            <Smartphone className="h-4 w-4" />
            {copy.sample}
          </div>
        </section>

        <section className="flex flex-col justify-center rounded-[28px] bg-white px-2 py-2 md:px-4">
          <div className="mb-6 flex justify-end gap-2">
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              EN
            </Button>
            <Button
              variant={language === "hi" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("hi")}
            >
              HI
            </Button>
          </div>

          {step === "mobile" ? (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-600">{copy.mobileLabel}</p>
                <div className="mt-2 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="mr-3 text-base font-semibold text-slate-700">+91</span>
                  <Input
                    value={sanitizedMobile}
                    onChange={(event) => setMobile(event.target.value)}
                    inputMode="numeric"
                    maxLength={10}
                    className="border-none bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <Button
                className="h-12 w-full rounded-2xl bg-[#FF3B30] hover:bg-[#e7342b]"
                onClick={sendOtp}
              >
                {copy.sendOtp}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-slate-600">{copy.otpLabel}</p>
                <Input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  maxLength={6}
                  className="mt-2 h-12 rounded-2xl border-slate-200 text-center text-xl tracking-[0.5em]"
                  placeholder="123456"
                />
                <p className="mt-2 text-xs text-slate-500">{copy.otpHint}</p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button variant="outline" className="h-12 rounded-2xl" onClick={() => setStep("mobile")}>
                  {copy.change}
                </Button>
                <Button
                  className="h-12 rounded-2xl bg-[#007AFF] hover:bg-[#0069d9]"
                  onClick={verifyOtp}
                >
                  {copy.verify}
                </Button>
              </div>
            </div>
          )}

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </section>
      </div>
    </div>
  );
};

export default WebLoginPage;
