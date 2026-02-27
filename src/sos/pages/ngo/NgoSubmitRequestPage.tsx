import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";
import { IncidentCategory, Priority, SupportRequest } from "@/sos/models";

const schema = z.object({
  title: z.string().min(4, "Title is required"),
  description: z.string().min(12, "Description is required"),
  area: z.string().min(2, "Area is required"),
  district: z.string().min(2, "District is required"),
  city: z.string().min(2, "City is required"),
  category: z.enum(["medical", "fire", "disaster", "women-safety", "child-help", "food-support", "rescue", "shelter"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  supportType: z.enum(["volunteers", "ambulance", "food", "medical-kits", "transport", "shelter"]),
  note: z.string().min(6, "Support note is required"),
});

const NgoSubmitRequestPage = () => {
  const { createIncident, createSupportRequest, ngos } = useSosApp();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    title: "",
    description: "",
    area: "",
    district: "",
    city: "",
    category: "medical" as IncidentCategory,
    priority: "high" as Priority,
    supportType: "volunteers" as SupportRequest["type"],
    note: "",
  });

  const ngoId = ngos[0]?.id || "NGO-1";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const incident = createIncident({
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        priority: parsed.data.priority,
        source: "app",
        location: {
          area: parsed.data.area,
          district: parsed.data.district,
          city: parsed.data.city,
          lat: 40.71,
          lng: -74.0,
        },
      });

      createSupportRequest({
        incidentId: incident.id,
        requestedByNgoId: ngoId,
        type: parsed.data.supportType,
        note: parsed.data.note,
      });

      toast.success("Request submitted successfully", {
        description: `${incident.id} created and sent to authority queue.`,
      });

      setValues({
        title: "",
        description: "",
        area: "",
        district: "",
        city: "",
        category: "medical",
        priority: "high",
        supportType: "volunteers",
        note: "",
      });
      setErrors({});
      setSubmitting(false);
    }, 750);
  };

  return (
    <div className="space-y-4">
      <SectionTitle title="Submit New Request" subtitle="Create a new incident report and support request for authority" />

      <Card className="rounded-2xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Request form</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-1 sm:col-span-2">
              <Label>Title</Label>
              <Input
                value={values.title}
                onChange={(event) => setValues((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Short incident title"
              />
              {errors.title ? <p className="text-xs text-red-600">{errors.title}</p> : null}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={values.description}
                onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Describe incident details and urgency"
              />
              {errors.description ? <p className="text-xs text-red-600">{errors.description}</p> : null}
            </div>

            <div className="space-y-1">
              <Label>Area</Label>
              <Input value={values.area} onChange={(event) => setValues((prev) => ({ ...prev, area: event.target.value }))} />
              {errors.area ? <p className="text-xs text-red-600">{errors.area}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>District</Label>
              <Input value={values.district} onChange={(event) => setValues((prev) => ({ ...prev, district: event.target.value }))} />
              {errors.district ? <p className="text-xs text-red-600">{errors.district}</p> : null}
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input value={values.city} onChange={(event) => setValues((prev) => ({ ...prev, city: event.target.value }))} />
              {errors.city ? <p className="text-xs text-red-600">{errors.city}</p> : null}
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={values.category} onValueChange={(value) => setValues((prev) => ({ ...prev, category: value as IncidentCategory }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="disaster">Disaster</SelectItem>
                  <SelectItem value="women-safety">Women Safety</SelectItem>
                  <SelectItem value="child-help">Child Help</SelectItem>
                  <SelectItem value="food-support">Food Support</SelectItem>
                  <SelectItem value="rescue">Rescue</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Priority</Label>
              <Select value={values.priority} onValueChange={(value) => setValues((prev) => ({ ...prev, priority: value as Priority }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Support needed</Label>
              <Select
                value={values.supportType}
                onValueChange={(value) =>
                  setValues((prev) => ({ ...prev, supportType: value as SupportRequest["type"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volunteers">Volunteers</SelectItem>
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="medical-kits">Medical Kits</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label>Support note</Label>
              <Textarea
                value={values.note}
                onChange={(event) => setValues((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="What support is needed and why?"
              />
              {errors.note ? <p className="text-xs text-red-600">{errors.note}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" className="rounded-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoSubmitRequestPage;

