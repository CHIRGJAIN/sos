import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import FilterChips from "@/web/components/FilterChips";
import PageHeader from "@/web/components/PageHeader";
import ResourceCard from "@/web/components/ResourceCard";
import SectionCard from "@/web/components/SectionCard";
import { useSosWeb } from "@/web/context/SosWebContext";
import { ResourceEntry } from "@/web/types";

const categoryOptions: Array<{ id: ResourceEntry["category"] | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "helpline", label: "Helplines" },
  { id: "shelter", label: "Shelters" },
  { id: "legal", label: "Legal Aid" },
  { id: "medical", label: "Medical" },
  { id: "psychosocial", label: "Psychosocial Support" },
];

const ResourcesModule: React.FC = () => {
  const { resources, favoriteResourceIds, toggleResourceFavorite } = useSosWeb();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ResourceEntry["category"] | "all">("all");
  const [region, setRegion] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceEntry | null>(null);

  const regions = useMemo(() => ["all", ...new Set(resources.map((item) => item.district))], [resources]);

  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const categoryMatch = category === "all" || resource.category === category;
      const regionMatch = region === "all" || resource.district === region;
      const favoriteMatch = !showFavoritesOnly || favoriteResourceIds.includes(resource.id);
      const q = query.trim().toLowerCase();
      const queryMatch =
        !q ||
        `${resource.name} ${resource.address} ${resource.district} ${resource.state} ${resource.phone || ""}`
          .toLowerCase()
          .includes(q);
      return categoryMatch && regionMatch && favoriteMatch && queryMatch;
    });
  }, [category, favoriteResourceIds, query, region, resources, showFavoritesOnly]);

  const copyValue = (resource: ResourceEntry) => {
    navigator.clipboard.writeText(resource.phone || resource.address);
    toast.success("Copied to clipboard.");
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Utility Directory"
        title="Resources"
        subtitle="Professional utility-first directory for helplines, shelters, and legal support."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${viewMode === "cards" ? "bg-slate-950 text-white" : "bg-white text-slate-600"}`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${viewMode === "list" ? "bg-slate-950 text-white" : "bg-white text-slate-600"}`}
            >
              List
            </button>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SectionCard title="Directory" subtitle="Searchable, filterable, and easy to scan.">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search names, phones, districts" />
              <select
                className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
              >
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All districts" : item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterChips value={category} onChange={(value) => setCategory(value as ResourceEntry["category"] | "all")} options={categoryOptions} />
              <Button variant={showFavoritesOnly ? "default" : "outline"} className="rounded-full" onClick={() => setShowFavoritesOnly((prev) => !prev)}>
                Favorites
              </Button>
            </div>

            {viewMode === "cards" ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    favorite={favoriteResourceIds.includes(resource.id)}
                    onFavorite={() => toggleResourceFavorite(resource.id)}
                    onView={() => setSelectedResource(resource)}
                    onCopy={() => copyValue(resource)}
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/95">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <span>Name</span>
                  <span>Category</span>
                  <span>Area</span>
                  <span>Contact</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {filtered.map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      onClick={() => setSelectedResource(resource)}
                      className="grid w-full grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50"
                    >
                      <span className="font-semibold text-slate-950">{resource.name}</span>
                      <span className="text-slate-500">{resource.category}</span>
                      <span className="text-slate-500">{resource.district}</span>
                      <span className="text-slate-500">{resource.phone || "-"}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Pinned helplines" subtitle="Always visible utility shortcuts.">
            <div className="space-y-2">
              {resources
                .filter((resource) => resource.category === "helpline")
                .slice(0, 2)
                .map((resource) => (
                  <div key={resource.id} className="rounded-2xl bg-slate-50 px-3 py-3">
                    <p className="text-sm font-semibold text-slate-900">{resource.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{resource.phone}</p>
                  </div>
                ))}
            </div>
          </SectionCard>

          <SectionCard title="Saved resources" subtitle="Favorited tools for quick recall.">
            <div className="space-y-2">
              {resources
                .filter((resource) => favoriteResourceIds.includes(resource.id))
                .slice(0, 4)
                .map((resource) => (
                  <div key={resource.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900">{resource.name}</p>
                    <p className="mt-1 text-slate-500">{resource.district}</p>
                  </div>
                ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
        <DialogContent className="rounded-[28px] border-white/70 bg-white/95 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedResource?.name}</DialogTitle>
          </DialogHeader>
          {selectedResource ? (
            <div className="space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="font-semibold text-slate-900">{selectedResource.category}</p>
                <p className="mt-1">{selectedResource.address}</p>
              </div>
              <p>Phone: {selectedResource.phone || "Not listed"}</p>
              <p>Availability: {selectedResource.availability}</p>
              <p className="text-xs text-slate-500">{selectedResource.notes || "No additional notes."}</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourcesModule;
