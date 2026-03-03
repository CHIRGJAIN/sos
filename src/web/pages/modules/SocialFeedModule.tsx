import { useMemo, useState } from "react";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FeedPostCard from "@/web/components/FeedPostCard";
import FilterChips from "@/web/components/FilterChips";
import PageHeader from "@/web/components/PageHeader";
import SectionCard from "@/web/components/SectionCard";
import { useSosWeb } from "@/web/context/SosWebContext";
import { MediaAttachmentType, SocialPost } from "@/web/types";

const filterValues = ["all", "verified", "relief", "medical", "awareness", "nearby", "saved"] as const;
const sortValues = ["newest", "urgent", "supported"] as const;
const postTypes: NonNullable<SocialPost["postType"]>[] = [
  "relief",
  "medical",
  "awareness",
  "food-support",
  "community-alert",
];

const SocialFeedModule: React.FC = () => {
  const {
    socialPosts,
    dashboardWidgets,
    likedPostIds,
    savedPostIds,
    supportedPostIds,
    togglePostLike,
    togglePostSave,
    togglePostSupport,
    addSocialPost,
    addSocialComment,
  } = useSosWeb();
  const [activeFilter, setActiveFilter] = useState<(typeof filterValues)[number]>("all");
  const [sortBy, setSortBy] = useState<(typeof sortValues)[number]>("newest");
  const [query, setQuery] = useState("");
  const [composerText, setComposerText] = useState("");
  const [composerTitle, setComposerTitle] = useState("");
  const [composerType, setComposerType] = useState<NonNullable<SocialPost["postType"]>>("relief");
  const [composerMedia, setComposerMedia] = useState<MediaAttachmentType[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(socialPosts[0]?.id || null);
  const [commentText, setCommentText] = useState("");

  const toggleComposerMedia = (type: MediaAttachmentType) => {
    setComposerMedia((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]));
  };

  const filteredPosts = useMemo(() => {
    const filtered = socialPosts.filter((post) => {
      const categoryMatch =
        activeFilter === "all" ||
        (activeFilter === "verified" ? !!post.isVerified || post.author.verified : false) ||
        (activeFilter === "nearby" ? !!post.isNearby : false) ||
        (activeFilter === "saved" ? savedPostIds.includes(post.id) : false) ||
        post.postType === activeFilter ||
        post.category === activeFilter;
      const q = query.trim().toLowerCase();
      const queryMatch =
        !q ||
        `${post.content} ${post.title || ""} ${(post.tags || []).join(" ")} ${post.locationText || ""}`
          .toLowerCase()
          .includes(q);
      return categoryMatch && queryMatch;
    });

    if (sortBy === "urgent") {
      return filtered.sort((a, b) => Number(!!b.isUrgent) - Number(!!a.isUrgent));
    }

    if (sortBy === "supported") {
      return filtered.sort((a, b) => b.engagement.supports - a.engagement.supports);
    }

    return filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [activeFilter, query, savedPostIds, socialPosts, sortBy]);

  const selectedPost = filteredPosts.find((post) => post.id === selectedPostId) || filteredPosts[0] || null;

  const publishPost = () => {
    if (!composerText.trim()) return;
    addSocialPost({
      content: composerText,
      title: composerTitle,
      postType: composerType,
      mediaTypes: composerMedia,
    });
    setComposerText("");
    setComposerTitle("");
    setComposerType("relief");
    setComposerMedia([]);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Community Network"
        title="Community Feed"
        subtitle="Facebook-style social cards with a tighter, feed-first information rhythm."
      />

      <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <SectionCard title="Feed shortcuts" subtitle="Fast pivots through the community graph.">
            <div className="space-y-2 text-sm">
              <button type="button" className="w-full rounded-2xl bg-slate-50 px-3 py-3 text-left" onClick={() => setActiveFilter("saved")}>
                Saved posts
              </button>
              <button type="button" className="w-full rounded-2xl bg-slate-50 px-3 py-3 text-left" onClick={() => setActiveFilter("verified")}>
                Verified updates
              </button>
              <button type="button" className="w-full rounded-2xl bg-slate-50 px-3 py-3 text-left" onClick={() => setActiveFilter("nearby")}>
                Nearby alerts
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Categories" subtitle="Shortcuts into common aid threads.">
            <div className="space-y-2 text-sm">
              {postTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className="w-full rounded-2xl bg-slate-50 px-3 py-3 text-left capitalize"
                  onClick={() => setActiveFilter(type as (typeof filterValues)[number])}
                >
                  {type.replace("-", " ")}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Feed toolbar" subtitle="Search, filter, and sort for faster scanning.">
            <div className="space-y-3">
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts, tags, or locations" />
              <FilterChips
                value={activeFilter}
                onChange={(value) => setActiveFilter(value as typeof activeFilter)}
                options={[
                  { id: "all", label: "All" },
                  { id: "verified", label: "Verified" },
                  { id: "relief", label: "Relief" },
                  { id: "medical", label: "Medical" },
                  { id: "awareness", label: "Awareness" },
                  { id: "nearby", label: "Nearby" },
                  { id: "saved", label: "Saved" },
                ]}
              />
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
              >
                <option value="newest">Newest</option>
                <option value="urgent">Most Urgent</option>
                <option value="supported">Most Supported</option>
              </select>
            </div>
          </SectionCard>

          <SectionCard title="Post composer" subtitle="What’s happening in your area?">
            <div className="space-y-3">
              <Input
                value={composerTitle}
                onChange={(event) => setComposerTitle(event.target.value)}
                placeholder="Optional title"
                className="rounded-2xl"
              />
              <Textarea
                value={composerText}
                onChange={(event) => setComposerText(event.target.value)}
                rows={4}
                className="rounded-2xl"
                placeholder="What’s happening in your area?"
              />
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                <select
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm"
                  value={composerType}
                  onChange={(event) => setComposerType(event.target.value as NonNullable<SocialPost["postType"]>)}
                >
                  {postTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-3 gap-2">
                  {(["photo", "video", "voice"] as MediaAttachmentType[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={composerMedia.includes(type) ? "default" : "outline"}
                      className="rounded-2xl"
                      onClick={() => toggleComposerMedia(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="rounded-full bg-[#007AFF] px-5 hover:bg-[#0069d9]"
                  disabled={!composerText.trim()}
                  onClick={publishPost}
                >
                  <Megaphone className="mr-2 h-4 w-4" />
                  Post
                </Button>
              </div>
            </div>
          </SectionCard>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                liked={likedPostIds.includes(post.id)}
                saved={savedPostIds.includes(post.id)}
                supported={supportedPostIds.includes(post.id)}
                onLike={() => togglePostLike(post.id)}
                onSave={() => togglePostSave(post.id)}
                onSupport={() => togglePostSupport(post.id)}
                onComment={() => setSelectedPostId(post.id)}
                onOpen={() => setSelectedPostId(post.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <SectionCard title={selectedPost ? "Post detail" : "Trends"} subtitle="Comments, supporters, and related signals.">
            {selectedPost ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                  <p className="text-sm font-semibold text-slate-900">{selectedPost.title || selectedPost.author.name}</p>
                  <p className="mt-2 text-sm text-slate-700">{selectedPost.content}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Comments</p>
                  <div className="mt-2 space-y-2">
                    {selectedPost.commentsPreview.length ? (
                      selectedPost.commentsPreview.map((comment) => (
                        <div key={comment.id} className="rounded-2xl bg-slate-50 px-3 py-3 text-xs text-slate-700">
                          <span className="font-semibold">{comment.author}: </span>
                          {comment.text}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-xs text-slate-500">No comments yet.</div>
                    )}
                  </div>
                  <Textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    rows={3}
                    className="mt-3 rounded-2xl"
                    placeholder="Add a comment"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      size="sm"
                      className="rounded-full"
                      disabled={!commentText.trim()}
                      onClick={() => {
                        addSocialComment(selectedPost.id, commentText);
                        setCommentText("");
                      }}
                    >
                      Add comment
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Supporters</p>
                  <div className="mt-2 space-y-2">
                    {selectedPost.supporters?.length ? (
                      selectedPost.supporters.map((supporter) => (
                        <div key={supporter.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                          <span className="font-semibold">{supporter.name}</span> · {supporter.type}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-slate-50 px-3 py-3 text-xs text-slate-500">No donor list for this post.</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 px-3 py-3 text-sm text-slate-500">Select a post to inspect details.</div>
            )}
          </SectionCard>

          <SectionCard title="Trending / resources" subtitle="Right-rail context, social platform style.">
            <div className="space-y-2">
              {dashboardWidgets.trendingTags.map((tag) => (
                <div key={tag} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  {tag}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default SocialFeedModule;
