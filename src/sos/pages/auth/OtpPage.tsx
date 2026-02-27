import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Role } from "@/sos/models";

const OtpPage = () => {
  const navigate = useNavigate();
  const { requestOtp, verifyOtp, login } = useSosApp();
  const [role, setRole] = useState<Role>("ngo");
  const [target, setTarget] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = requestOtp(target, role);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOtpSent(true);
  };

  const verify = () => {
    const result = verifyOtp(otp);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    const fallbackLogin = login(role, role === "authority" ? "authority@sos.gov" : "ngo@sos.org", role === "authority" ? "authority123" : "ngo123");
    if (!fallbackLogin.success) {
      toast.error("OTP verified but auto-login failed.");
      return;
    }

    toast.success("OTP verified. Logged in.");
    navigate(role === "authority" ? "/authority/dashboard" : "/ngo/dashboard");
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">OTP Verification</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">Login with OTP</h2>
      <p className="mt-1 text-sm text-slate-500">Demo code: 123456</p>

      <form className="mt-6 space-y-4" onSubmit={sendOtp}>
        <div>
          <Label className="text-sm">Role</Label>
          <RadioGroup value={role} onValueChange={(value) => setRole(value as Role)} className="mt-2 grid grid-cols-2 gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3">
              <RadioGroupItem value="authority" id="otp-authority" />
              <span className="text-sm">Authority</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3">
              <RadioGroupItem value="ngo" id="otp-ngo" />
              <span className="text-sm">NGO</span>
            </label>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="otp-target">Email or mobile</Label>
          <Input
            id="otp-target"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
            placeholder="authority@sos.gov or +12025550101"
            required
          />
        </div>

        <Button type="submit" className="w-full rounded-full">
          Send OTP
        </Button>
      </form>

      {otpSent ? (
        <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          <Label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-indigo-700">Enter OTP</Label>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={verify} className="mt-3 w-full rounded-full">
            Verify OTP
          </Button>
        </div>
      ) : null}

      <div className="mt-4 text-xs text-slate-500">
        <Link to="/auth/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default OtpPage;
