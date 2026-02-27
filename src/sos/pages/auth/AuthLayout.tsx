import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe,_#e2e8f0_40%,_#f8fafc)]">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <section className="hidden rounded-3xl border border-white/60 bg-white/60 p-8 backdrop-blur lg:block">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            SOS Companion
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-900">
            Civic response coordination for Authorities and NGOs
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Real-time incident visibility, structured workflows, and collaboration threads in one place.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Critical incident tracking</p>
              <p className="text-2xl font-semibold text-slate-900">24/7</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Response entities</p>
              <p className="text-2xl font-semibold text-slate-900">48+</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">SLA monitoring</p>
              <p className="text-2xl font-semibold text-slate-900">Live</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-slate-500">Channels</p>
              <p className="text-2xl font-semibold text-slate-900">Unified</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <Outlet />
          <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
            <Link to="/auth/forgot-password" className="text-indigo-600 hover:underline">
              Need help signing in?
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
