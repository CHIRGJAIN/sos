import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyStateCard, SectionTitle } from "@/sos/components/common";

const PlaceholderWorkspacePage: React.FC<{
  title: string;
  subtitle: string;
  description: string;
  bullets?: string[];
}> = ({ title, subtitle, description, bullets }) => {
  return (
    <div className="space-y-4">
      <SectionTitle title={title} subtitle={subtitle} />
      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Operational Module</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">{description}</p>
          {bullets?.length ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
      <EmptyStateCard
        title="No records currently"
        description="Data will populate as operations continue."
      />
    </div>
  );
};

export default PlaceholderWorkspacePage;
