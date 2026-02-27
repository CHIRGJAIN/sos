import React from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import DashboardShell from "@/components/layout/DashboardShell";

const formatDateTime = (date: Date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

const HomePage: React.FC = () => {
  const createSosEvent = (geoLocation: string) => {
    const now = new Date();
    toast.success("SOS Distress Signal Created", {
      description: `Location: ${geoLocation} | Time: ${formatDateTime(now)}`,
    });
  };

  const handleSOS = () => {
    if (!navigator.geolocation) {
      createSosEvent("Unknown");
      return;
    }

    toast.info("Capturing live location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const geo = `${pos.coords.latitude.toFixed(4)}N, ${pos.coords.longitude.toFixed(4)}E`;
        createSosEvent(geo);
      },
      () => {
        createSosEvent("Unknown");
      }
    );
  };

  return (
    <DashboardShell portal="user" title="SOS" contentClassName="!p-2 sm:!p-5">
      <div className="flex min-h-[calc(100dvh-190px)] items-center justify-center px-1 sm:px-0">
        <div className="w-full max-w-[24rem] sm:max-w-[26rem]">
          <div className="rounded-[999px] bg-[rgba(251,146,60,0.2)] p-3 shadow-[0_20px_60px_rgba(239,68,68,0.25)] sm:p-7">
            <button
              onClick={handleSOS}
              className="flex aspect-square w-full flex-col items-center justify-center rounded-[999px] border-[8px] border-orange-100 bg-[radial-gradient(circle_at_30%_25%,#fdba74_0%,#f97316_40%,#dc2626_100%)] text-white shadow-[0_28px_64px_rgba(220,38,38,0.35)] transition-transform hover:scale-[1.01] active:scale-95 sm:border-[10px]"
            >
              <ShieldAlert className="mb-3 h-8 w-8 sm:h-9 sm:w-9" />
              <span className="font-serif text-5xl font-bold tracking-wide sm:text-6xl">SOS</span>
              <span className="mt-2 text-[10px] uppercase tracking-[0.16em] sm:text-xs sm:tracking-[0.18em]">
                Emergency Distress Signal
              </span>
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default HomePage;
