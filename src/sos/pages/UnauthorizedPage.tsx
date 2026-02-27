import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UnauthorizedPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Unauthorized</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Access denied</h1>
      <p className="mt-2 text-sm text-slate-600">You do not have permission to open this workspace.</p>
      <Button asChild className="mt-6 rounded-full">
        <Link to="/login">Back to login</Link>
      </Button>
    </div>
  </div>
);

export default UnauthorizedPage;
