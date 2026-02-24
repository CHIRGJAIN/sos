import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/ui/EmptyState";
import { districts, services, states } from "@/data/mockData";

const categories = [
  "Police Helpline",
  "Ambulance Helpline",
  "Firefighter Helpline",
  "Child Helpline",
  "Women Helpline",
  "Food Helpline",
  "Acid Helpline",
  "Welfare Helpline",
];

const ServicesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState(states[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(districts[states[0]]?.[0] || "");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const districtList = districts[selectedState] || [];

  const stateServices = useMemo(() => {
    return services.filter((item) => {
      const matchesState = item.state === selectedState;
      const matchesDistrict = !selectedDistrict || item.district === selectedDistrict;
      const matchesCategory = item.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch = `${item.category} ${item.helplineNumber} ${item.state} ${item.district} ${item.description}`
        .toLowerCase()
        .includes(q);
      return matchesState && matchesDistrict && matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory, selectedDistrict, selectedState]);

  const selectedService = stateServices[0] || null;

  return (
    <DashboardShell portal="user" title="Available Services">
      <div className="space-y-5">
        <Card className="border-primary/20 bg-card/75">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-popover px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by keyword, helpline, state, district"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <PillButton
                  key={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </PillButton>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[280px_320px_minmax(0,1fr)]">
          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-lg">States</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {states.map((state) => (
                <button
                  key={state}
                  onClick={() => {
                    setSelectedState(state);
                    setSelectedDistrict(districts[state]?.[0] || "");
                  }}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                    selectedState === state
                      ? "border-accent bg-accent/10"
                      : "border-primary/20 bg-popover/80 hover:bg-secondary/60"
                  }`}
                >
                  {state}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-lg">Districts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {districtList.map((district) => (
                <button
                  key={district}
                  onClick={() => setSelectedDistrict(district)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                    selectedDistrict === district
                      ? "border-accent bg-accent/10"
                      : "border-primary/20 bg-popover/80 hover:bg-secondary/60"
                  }`}
                >
                  {district}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/75">
            <CardHeader>
              <CardTitle className="text-lg">Service Detail</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedService ? (
                <div className="space-y-3 rounded-xl border border-primary/20 bg-popover/80 p-4">
                  <p className="text-sm">
                    <span className="font-semibold">Service: </span>
                    {selectedService.category}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">State: </span>
                    {selectedService.state}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">District: </span>
                    {selectedService.district}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Helpline Number: </span>
                    {selectedService.helplineNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Description: </span>
                    {selectedService.description}
                  </p>
                </div>
              ) : (
                <EmptyState
                  title="No service found"
                  description="Try changing category or district to find matching emergency services."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
};

export default ServicesPage;
