import { Button } from "@/components/ui/button";
import { ErrorStateCard, SectionTitle } from "@/sos/components/common";

const ErrorStatePage = () => (
  <div className="mx-auto max-w-3xl space-y-4">
    <SectionTitle title="Error State UI" subtitle="Reference error state for failed network and action flows" />
    <ErrorStateCard
      title="Unable to load module"
      description="A simulated error state with retry action for consistent handling across pages."
      onRetry={() => undefined}
    />
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <Button variant="outline" className="rounded-full">Retry request</Button>
    </div>
  </div>
);

export default ErrorStatePage;

