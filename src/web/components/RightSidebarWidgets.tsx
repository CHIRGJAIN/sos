import { AlertTriangle, BadgeCheck, Building2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSosWeb } from "@/web/context/SosWebContext";

interface RightSidebarWidgetsProps {
  children?: React.ReactNode;
  embedded?: boolean;
}

const RightSidebarWidgets: React.FC<RightSidebarWidgetsProps> = ({ children, embedded = false }) => {
  const { dashboardWidgets, resources, ngoDirectory } = useSosWeb();

  return (
    <aside className={embedded ? "h-full" : "sticky top-4 hidden h-[calc(100vh-2rem)] xl:block"}>
      <ScrollArea className="h-full">
        <div className="space-y-4 pr-1">
          {children}

          <section className="rounded-[26px] border border-white/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <AlertTriangle className="h-4 w-4 text-[#FF3B30]" />
              Urgent district alerts
            </div>
            <div className="mt-3 space-y-2">
              {dashboardWidgets.urgentAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {alert.title}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[26px] border border-white/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Building2 className="h-4 w-4 text-[#007AFF]" />
              Nearby resources
            </div>
            <div className="mt-3 space-y-2">
              {resources.slice(0, 3).map((resource) => (
                <div key={resource.id} className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-900">{resource.name}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{resource.phone || resource.address}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[26px] border border-white/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <BadgeCheck className="h-4 w-4 text-[#34C759]" />
              NGO highlights
            </div>
            <div className="mt-3 space-y-2">
              {ngoDirectory.slice(0, 3).map((ngo) => (
                <div key={ngo.id} className="rounded-2xl bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold text-slate-900">{ngo.name}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{ngo.category}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[26px] border border-white/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Sparkles className="h-4 w-4 text-[#5856D6]" />
              Quick helplines
            </div>
            <div className="mt-3 space-y-2">
              {resources
                .filter((resource) => resource.category === "helpline")
                .slice(0, 2)
                .map((resource) => (
                  <div key={resource.id} className="rounded-2xl bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold text-slate-900">{resource.name}</p>
                    <p className="mt-1 text-[11px] text-slate-500">{resource.phone || "No number"}</p>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default RightSidebarWidgets;
