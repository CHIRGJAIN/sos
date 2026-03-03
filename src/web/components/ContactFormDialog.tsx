import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { EmergencyContact } from "@/web/types";
import { useSosWeb } from "@/web/context/SosWebContext";

interface ContactFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContact?: EmergencyContact | null;
}

const createEmptyContact = (): EmergencyContact => ({
  id: `ct-${Date.now()}`,
  name: "",
  phone: "",
  altPhone: "",
  relation: "Family",
  priority: 1,
  activeForSos: true,
  notes: "",
});

const ContactFormDialog: React.FC<ContactFormDialogProps> = ({ open, onOpenChange, initialContact }) => {
  const { t, contacts, addOrUpdateContact } = useSosWeb();
  const [form, setForm] = useState<EmergencyContact>(createEmptyContact());

  useEffect(() => {
    if (!open) return;
    if (initialContact) {
      setForm(initialContact);
      return;
    }
    setForm({ ...createEmptyContact(), priority: contacts.length + 1 });
  }, [open, initialContact, contacts.length]);

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    addOrUpdateContact({
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      relation: form.relation.trim() || "Contact",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialContact ? t("common.edit") : t("citizen.contacts.add")}</DialogTitle>
          <DialogDescription>{t("citizen.contacts.title")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1">
            <Label>{t("citizen.contacts.name")}</Label>
            <Input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="grid gap-1">
            <Label>{t("citizen.contacts.phone")}</Label>
            <Input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </div>
          <div className="grid gap-1">
            <Label>{t("citizen.contacts.altPhone")}</Label>
            <Input
              value={form.altPhone || ""}
              onChange={(event) => setForm((prev) => ({ ...prev, altPhone: event.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>{t("citizen.contacts.relation")}</Label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={form.relation}
                onChange={(event) => setForm((prev) => ({ ...prev, relation: event.target.value }))}
              >
                {["Family", "Friend", "Guardian", "Police", "Neighbor", "Other"].map((relation) => (
                  <option key={relation} value={relation}>
                    {relation}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1">
              <Label>{t("citizen.contacts.priority")}</Label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                value={form.priority}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, priority: Number(event.target.value) || 1 }))
                }
              >
                <option value={1}>1 - High</option>
                <option value={2}>2 - Medium</option>
                <option value={3}>3 - Low</option>
              </select>
            </div>
          </div>
          <div className="grid gap-1">
            <Label>{t("citizen.contacts.notes")}</Label>
            <Textarea
              rows={3}
              value={form.notes || ""}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
          </div>
          <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-sm text-slate-700">{t("citizen.contacts.active")}</span>
            <Switch
              checked={form.activeForSos}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, activeForSos: checked }))}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={submit} disabled={!form.name.trim() || !form.phone.trim()}>
            {t("common.save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
