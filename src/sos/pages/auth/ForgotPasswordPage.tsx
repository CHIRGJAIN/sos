import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Reset link generated", {
      description: "Demo mode: use OTP flow to continue.",
    });
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Account Recovery</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">Forgot password</h2>
      <p className="mt-1 text-sm text-slate-500">Enter account email to get recovery instructions.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="recover-email">Email</Label>
          <Input
            id="recover-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@organization.org"
            required
          />
        </div>

        <Button type="submit" className="w-full rounded-full">
          Send recovery link
        </Button>
      </form>

      <div className="mt-4 text-xs text-slate-500">
        <Link to="/auth/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
