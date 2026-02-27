import { FormEvent, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Role } from "@/sos/models";

const REMEMBER_KEY = "sos-remember-auth";

const credentialsByRole: Record<Role, { id: string; password: string }> = {
  authority: { id: "authority@sos.gov", password: "authority123" },
  ngo: { id: "ngo@sos.org", password: "ngo123" },
};

const otherDashboardLogins = [
  { label: "User Dashboard", path: "/user/login" },
  { label: "Admin Dashboard", path: "/admin/login" },
  { label: "Resource Dashboard", path: "/resource/login" },
  { label: "Business Dashboard", path: "/business/login" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useSosApp();

  const [role, setRole] = useState<Role>("authority");
  const [identifier, setIdentifier] = useState(credentialsByRole.authority.id);
  const [password, setPassword] = useState(credentialsByRole.authority.password);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem(REMEMBER_KEY);
    if (!remembered) return;
    try {
      const parsed = JSON.parse(remembered) as { role: Role; identifier: string; password: string };
      if (parsed?.role && parsed?.identifier && parsed?.password) {
        setRole(parsed.role);
        setIdentifier(parsed.identifier);
        setPassword(parsed.password);
        setRemember(true);
      }
    } catch {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }, []);

  useEffect(() => {
    const queryRole = searchParams.get("role");
    if (queryRole !== "authority" && queryRole !== "ngo") return;
    setRole(queryRole);
    setIdentifier(credentialsByRole[queryRole].id);
    setPassword(credentialsByRole[queryRole].password);
    setError("");
  }, [searchParams]);

  const helperText = useMemo(
    () => `Demo: ${credentialsByRole[role].id} / ${credentialsByRole[role].password}`,
    [role],
  );

  const normalizeIdentifier = (value: string): string => {
    const raw = value.trim().toLowerCase();
    if (!raw) return "";
    if (raw.includes("@")) return raw;
    const domain = role === "authority" ? "sos.gov" : "sos.org";
    return `${raw}@${domain}`;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Email or username is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const normalizedIdentifier = normalizeIdentifier(identifier);
      const result = login(role, normalizedIdentifier, password);

      if (!result.success) {
        setError(result.message);
        setSubmitting(false);
        return;
      }

      if (remember) {
        localStorage.setItem(
          REMEMBER_KEY,
          JSON.stringify({
            role,
            identifier,
            password,
          }),
        );
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      toast.success("Signed in successfully");
      navigate(role === "authority" ? "/authority/dashboard" : "/ngo/dashboard");
    }, 700);
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Sign In</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">Access SOS Dashboard</h2>
      <p className="mt-1 text-sm text-slate-500">
        Sign in as Authority or NGO to access your operational workspace.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <Label className="text-sm">Role</Label>
          <RadioGroup
            value={role}
            onValueChange={(value) => {
              const nextRole = value as Role;
              setRole(nextRole);
              setIdentifier(credentialsByRole[nextRole].id);
              setPassword(credentialsByRole[nextRole].password);
              setError("");
            }}
            className="mt-2 grid grid-cols-2 gap-2"
          >
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3">
              <RadioGroupItem value="authority" id="authority-role" />
              <span className="text-sm">Authority</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3">
              <RadioGroupItem value="ngo" id="ngo-role" />
              <span className="text-sm">NGO</span>
            </label>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="identifier">Email or Username</Label>
          <Input
            id="identifier"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="authority@sos.gov or authority"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:bg-slate-100"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600">
            <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(Boolean(checked))} />
            Remember me
          </label>
          <Link to="/auth/forgot-password" className="text-indigo-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">{helperText}</p>

        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

        <Button type="submit" className="w-full rounded-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Other Dashboard Logins
            </p>
            <Link to="/login" className="text-xs font-medium text-indigo-600 hover:underline">
              View all
            </Link>
          </div>
          <p className="mt-1 text-xs text-slate-500">Use these for non-Authority/NGO dashboards.</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {otherDashboardLogins.map((item) => (
              <Button
                key={item.path}
                asChild
                variant="outline"
                size="sm"
                className="justify-start rounded-lg bg-white text-slate-700"
              >
                <Link to={item.path}>{item.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        New to SOS?{" "}
        <Link to="/auth/signup" className="font-medium text-indigo-600 hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
