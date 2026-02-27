import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">The requested route does not exist in this SOS workspace.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/login">Go to login</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
