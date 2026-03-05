import { useNavigate } from "react-router-dom";

const CitizenDashboardModule: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100dvh-8.5rem)] w-full items-center justify-center overflow-hidden lg:min-h-[calc(100dvh-6.5rem)]">
      <button
        type="button"
        onClick={() => navigate("/user/incident")}
        className="relative flex aspect-square w-full max-w-[calc(100dvh-7rem)] items-center justify-center rounded-full"
        aria-label="Open active incident"
      >
        <span className="absolute inset-0 rounded-full border border-red-200 bg-red-500/5 animate-pulse" />
        <span className="absolute inset-[12%] rounded-full border border-red-200 bg-red-500/10 animate-pulse [animation-delay:150ms]" />
        <span className="absolute inset-[24%] rounded-full border border-red-100 bg-red-500/10 [animation:pulse_2s_ease-in-out_infinite]" />
        <span className="relative flex h-[40%] w-[40%] items-center justify-center rounded-full bg-[linear-gradient(145deg,#FF3B30_0%,#FF9500_100%)] text-[clamp(2.5rem,7vw,5.5rem)] font-bold tracking-[0.2em] text-white shadow-[0_22px_60px_rgba(255,59,48,0.34)]">
          SOS
        </span>
      </button>
    </div>
  );
};

export default CitizenDashboardModule;
