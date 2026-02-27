import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput, SectionTitle } from "@/sos/components/common";
import { useSosApp } from "@/sos/context/SosAppContext";

const SearchResultsPage = () => {
  const { incidents, ngos, conversations } = useSosApp();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { incidents: [], ngos: [], conversations: [] };

    return {
      incidents: incidents.filter(
        (incident) =>
          incident.id.toLowerCase().includes(q) ||
          incident.title.toLowerCase().includes(q) ||
          incident.location.area.toLowerCase().includes(q),
      ),
      ngos: ngos.filter((ngo) => ngo.name.toLowerCase().includes(q) || ngo.coverageAreas.some((area) => area.toLowerCase().includes(q))),
      conversations: conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(q) ||
        conversation.messages.some((message) => message.text.toLowerCase().includes(q)),
      ),
    };
  }, [conversations, incidents, ngos, query]);

  const total = results.incidents.length + results.ngos.length + results.conversations.length;

  return (
    <div className="space-y-4">
      <SectionTitle title="Search Results" subtitle="Global search across incidents, NGOs, and messages" />

      <SearchInput
        value={query}
        onChange={(value) => setParams(value ? { q: value } : {})}
        placeholder="Search by case ID, org name, location, message"
        className="w-full md:max-w-xl"
      />

      <p className="text-sm text-slate-500">{total} results</p>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Incidents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.incidents.length ? (
              results.incidents.map((incident) => (
                <Link
                  key={incident.id}
                  to={incident.assignedNgoIds.length ? `/ngo/requests/${incident.id}` : `/authority/requests/${incident.id}`}
                  className="block rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
                >
                  <p className="text-sm font-medium text-slate-800">{incident.id}</p>
                  <p className="text-xs text-slate-500">{incident.title}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">No matching incidents</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">NGOs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.ngos.length ? (
              results.ngos.map((ngo) => (
                <div key={ngo.id} className="rounded-xl border border-slate-200 p-2">
                  <p className="text-sm font-medium text-slate-800">{ngo.name}</p>
                  <p className="text-xs text-slate-500">Coverage: {ngo.coverageAreas.join(", ")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No matching organizations</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {results.conversations.length ? (
              results.conversations.map((conversation) => (
                <div key={conversation.id} className="rounded-xl border border-slate-200 p-2">
                  <p className="text-sm font-medium text-slate-800">{conversation.title}</p>
                  <p className="text-xs text-slate-500">{conversation.messages[conversation.messages.length - 1]?.text}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No matching messages</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchResultsPage;
