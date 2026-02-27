import { Button } from "@/components/ui/button";
import { EmptyStateCard, SectionTitle } from "@/sos/components/common";

const EmptyStatePage = () => (
  <div className="mx-auto max-w-3xl space-y-4">
    <SectionTitle title="Empty State UI" subtitle="Reference empty state for frontend workflows with no records" />
    <EmptyStateCard
      title="No data available"
      description="This screen demonstrates how empty records should be presented across modules."
      action={<Button className="rounded-full">Create first record</Button>}
    />
  </div>
);

export default EmptyStatePage;

