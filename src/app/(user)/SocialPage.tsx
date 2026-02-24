import React, { useMemo, useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import PillButton from "@/components/ui/PillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/ui/EmptyState";
import { socialPosts } from "@/data/mockData";

const SocialPage: React.FC = () => {
  const locations = useMemo(
    () => ["All", ...Array.from(new Set(socialPosts.map((item) => item.location)))],
    []
  );
  const [activeLocation, setActiveLocation] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(socialPosts[0]?.id || null);

  const filtered = useMemo(
    () =>
      activeLocation === "All"
        ? socialPosts
        : socialPosts.filter((item) => item.location === activeLocation),
    [activeLocation]
  );

  const selected = filtered.find((item) => item.id === selectedId) || null;

  return (
    <DashboardShell portal="user" title="Social Media">
      <div className="grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)_360px]">
        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {locations.map((location) => (
              <PillButton
                key={location}
                active={activeLocation === location}
                className="w-full text-left"
                onClick={() => setActiveLocation(location)}
              >
                {location}
              </PillButton>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-xl">Community Feed</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {filtered.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelectedId(post.id)}
                className={`overflow-hidden rounded-xl border bg-popover/85 text-left shadow-soft transition-all ${
                  selectedId === post.id
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-primary/20 hover:-translate-y-0.5"
                }`}
              >
                <div className="relative h-44 bg-secondary/70">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Share2 className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <p className="line-clamp-2 text-sm">{post.caption}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.location}</span>
                    <span>{post.dateTime}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      Reply
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/75">
          <CardHeader>
            <CardTitle className="text-lg">Post Detail</CardTitle>
          </CardHeader>
          <CardContent>
            {selected ? (
              <div className="space-y-3 rounded-xl border border-primary/20 bg-popover/80 p-4">
                <div className="relative h-52 rounded-lg bg-secondary/70">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Share2 className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                </div>
                <p className="text-sm">{selected.caption}</p>
                <p className="text-xs text-muted-foreground">Date: {selected.dateTime}</p>
                <p className="text-xs text-muted-foreground">Location: {selected.location}</p>
                <p className="text-xs text-muted-foreground">Likes: {selected.likes}</p>
              </div>
            ) : (
              <EmptyState
                title="No post selected"
                description="Select any post from the feed to view complete details."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default SocialPage;
