import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSosApp } from "@/sos/context/SosAppContext";

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { completeProfile, session } = useSosApp();
  const [organization, setOrganization] = useState(session?.organization || "");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [about, setAbout] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = completeProfile(organization);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Profile setup completed");
    navigate(session?.role === "authority" ? "/authority/dashboard" : "/ngo/dashboard");
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">Organization Setup</p>
      <h2 className="mt-1 text-2xl font-semibold text-slate-900">Complete profile</h2>
      <p className="mt-1 text-sm text-slate-500">Add organization details before entering operations workspace.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="org-name">Organization name</Label>
          <Input id="org-name" value={organization} onChange={(event) => setOrganization(event.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-location">Primary location</Label>
          <Input id="org-location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="District, city" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-contact">Emergency contact</Label>
          <Input id="org-contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="+1-202-555-0100" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="org-about">About / services</Label>
          <Textarea
            id="org-about"
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            placeholder="Services, capacity, and response specialties"
            className="min-h-[90px]"
          />
        </div>

        <Button type="submit" className="w-full rounded-full">
          Save and continue
        </Button>
      </form>
    </div>
  );
};

export default ProfileSetupPage;
