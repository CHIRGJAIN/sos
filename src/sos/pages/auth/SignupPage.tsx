import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSosApp } from "@/sos/context/SosAppContext";
import { Role } from "@/sos/models";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useSosApp();
  const [role, setRole] = useState<Role>("ngo");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = signup(role, name, email, password);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    navigate("/auth/profile-setup");
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">Create Account</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">Join SOS platform</h2>
      <p className="mt-1 text-sm text-slate-500">Register as Authority or NGO.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <Label className="text-sm">Role</Label>
          <RadioGroup value={role} onValueChange={(value) => setRole(value as Role)} className="mt-2 grid grid-cols-2 gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3">
              <RadioGroupItem value="authority" id="signup-authority" />
              <span className="text-sm">Authority</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3">
              <RadioGroupItem value="ngo" id="signup-ngo" />
              <span className="text-sm">NGO</span>
            </label>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full rounded-full">
          Create account
        </Button>
      </form>

      <p className="mt-4 text-xs text-slate-500">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-medium text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
