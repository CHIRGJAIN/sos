import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarStack, MetadataRow, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const ProfilePage = () => {
  const { session, ngos } = useSosApp();
  const teamNames = ngos.map((ngo) => ngo.contactPerson);

  return (
    <div className="space-y-4">
      <SectionTitle title="Profile" subtitle="Organization and account details" />

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Organization Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input defaultValue={session?.name || ""} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={session?.email || ""} />
            </div>
            <div className="space-y-2">
              <Label>Organization</Label>
              <Input defaultValue={session?.organization || ""} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input defaultValue={session?.role || ""} disabled />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>About</Label>
              <Textarea defaultValue="Operational response unit coordinating emergency support and civic interventions." className="min-h-24" />
            </div>
            <div className="sm:col-span-2">
              <Button className="rounded-full">Save changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Team Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetadataRow label="Active members" value={teamNames.length} />
            <MetadataRow label="Verified status" value="Verified" />
            <MetadataRow label="Response level" value="High readiness" />
            <AvatarStack names={teamNames} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

