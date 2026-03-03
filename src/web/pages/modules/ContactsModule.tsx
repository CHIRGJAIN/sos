import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ContactFormDialog from "@/web/components/ContactFormDialog";
import EmptyStateCard from "@/web/components/EmptyStateCard";
import FilterChips from "@/web/components/FilterChips";
import SectionCard from "@/web/components/SectionCard";
import { useSosWeb } from "@/web/context/SosWebContext";
import { EmergencyContact } from "@/web/types";

const ContactsModule: React.FC = () => {
  const { t, contacts, addOrUpdateContact, removeContact, reorderContacts } = useSosWeb();
  const [view, setView] = useState<"table" | "cards">("table");
  const [query, setQuery] = useState("");
  const [relationFilter, setRelationFilter] = useState("all");
  const [editContact, setEditContact] = useState<EmergencyContact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const relations = useMemo(() => {
    return ["all", ...new Set(contacts.map((item) => item.relation || "Contact"))];
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const relationMatch = relationFilter === "all" || contact.relation === relationFilter;
      const q = query.toLowerCase();
      const queryMatch =
        !q || `${contact.name} ${contact.phone} ${contact.relation}`.toLowerCase().includes(q);
      return relationMatch && queryMatch;
    });
  }, [contacts, query, relationFilter]);

  const shiftPriority = (id: string, direction: "up" | "down") => {
    const sorted = [...contacts].sort((a, b) => a.priority - b.priority);
    const index = sorted.findIndex((item) => item.id === id);
    if (index < 0) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    [sorted[index], sorted[swapIndex]] = [sorted[swapIndex], sorted[index]];
    reorderContacts(sorted.map((item) => item.id));
  };

  const toggleActive = (contact: EmergencyContact, activeForSos: boolean) => {
    addOrUpdateContact({ ...contact, activeForSos });
  };

  return (
    <SectionCard
      title={t("citizen.contacts.title")}
      actions={
        <Button
          onClick={() => {
            setEditContact(null);
            setDialogOpen(true);
          }}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {t("citizen.contacts.add")}
        </Button>
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
            {t("citizen.contacts.table")}
          </Button>
          <Button variant={view === "cards" ? "default" : "outline"} size="sm" onClick={() => setView("cards")}>
            {t("citizen.contacts.cards")}
          </Button>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`${t("common.search")} ${t("citizen.contacts.name")}`}
            className="ml-auto max-w-xs"
          />
        </div>

        <FilterChips
          value={relationFilter}
          onChange={setRelationFilter}
          options={relations.map((item) => ({
            id: item,
            label: item === "all" ? t("citizen.history.filter.all") : item,
          }))}
        />

        {!contacts.length ? (
          <EmptyStateCard
            title={t("common.empty")}
            description="Add at least two trusted contacts to improve SOS readiness."
            action={
              <Button
                onClick={() => {
                  setEditContact(null);
                  setDialogOpen(true);
                }}
              >
                {t("citizen.contacts.add")}
              </Button>
            }
          />
        ) : !filteredContacts.length ? (
          <EmptyStateCard title={t("common.noResults")} description={t("citizen.contacts.title")} />
        ) : view === "table" ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">{t("citizen.contacts.name")}</th>
                  <th className="px-3 py-2 text-left">{t("citizen.contacts.phone")}</th>
                  <th className="px-3 py-2 text-left">{t("citizen.contacts.relation")}</th>
                  <th className="px-3 py-2 text-left">{t("citizen.contacts.priority")}</th>
                  <th className="px-3 py-2 text-left">{t("citizen.contacts.active")}</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-medium text-slate-800">{contact.name}</td>
                    <td className="px-3 py-2 text-slate-600">{contact.phone}</td>
                    <td className="px-3 py-2 text-slate-600">{contact.relation}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs">{contact.priority}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => shiftPriority(contact.id, "up")}> 
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => shiftPriority(contact.id, "down")}> 
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Switch
                        checked={contact.activeForSos}
                        onCheckedChange={(checked) => toggleActive(contact, checked)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditContact(contact); setDialogOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600" onClick={() => setDeleteId(contact.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{contact.name}</p>
                    <p className="text-xs text-slate-500">{contact.relation}</p>
                  </div>
                  <Switch
                    checked={contact.activeForSos}
                    onCheckedChange={(checked) => toggleActive(contact, checked)}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-700">{contact.phone}</p>
                <p className="text-xs text-slate-500">Priority {contact.priority}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => { setEditContact(contact); setDialogOpen(true); }}>
                    <Pencil className="mr-1 h-3.5 w-3.5" />{t("common.edit")}
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-700" onClick={() => setDeleteId(contact.id)}>
                    <Trash2 className="mr-1 h-3.5 w-3.5" />{t("common.delete")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ContactFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialContact={editContact}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("common.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the contact from SOS notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) removeContact(deleteId);
                setDeleteId(null);
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
};

export default ContactsModule;