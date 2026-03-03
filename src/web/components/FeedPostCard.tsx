import { Bookmark, HandHeart, Heart, MessageCircle, Share2, ShieldCheck } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SocialPost } from "@/web/types";

interface FeedPostCardProps {
  post: SocialPost;
  liked: boolean;
  saved: boolean;
  supported: boolean;
  onLike: () => void;
  onSave: () => void;
  onSupport: () => void;
  onComment: () => void;
  onOpen: () => void;
}

const FeedPostCard: React.FC<FeedPostCardProps> = ({
  post,
  liked,
  saved,
  supported,
  onLike,
  onSave,
  onSupport,
  onComment,
  onOpen,
}) => {
  return (
    <article className="rounded-[28px] border border-white/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            {post.author.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-slate-950">{post.author.name}</p>
              {post.author.verified ? <ShieldCheck className="h-4 w-4 text-[#34C759]" /> : null}
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {post.author.role}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}
              {post.locationText ? ` · ${post.locationText}` : ""}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          #{post.postType || post.category}
        </span>
      </header>

      <div className="mt-3 flex flex-wrap gap-2">
        {post.isUrgent ? (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">Urgent</span>
        ) : null}
        {post.isNearby ? (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">Nearby</span>
        ) : null}
        {post.isVerified || post.author.verified ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            Verified
          </span>
        ) : null}
      </div>

      {post.title ? <h3 className="mt-3 text-base font-semibold text-slate-950">{post.title}</h3> : null}
      <p className="mt-2 text-sm leading-6 text-slate-700">{post.content}</p>

      {post.media?.length || post.imageUrl ? (
        <div className="mt-4 rounded-[22px] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {(post.media?.length ? post.media.slice(0, 2) : [{ id: "image-preview", type: "photo" as const }]).map((item) => (
              <div
                key={item.id}
                className="flex h-28 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
              >
                {item.type}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>{post.engagement.likes} reactions</span>
        <span>{post.engagement.comments} comments</span>
        <span>{post.engagement.shares} shares</span>
        <span>{post.engagement.supports} supporters</span>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2 border-t border-slate-100 pt-3">
        <Button variant="ghost" size="sm" className={cn("text-xs", liked && "text-red-700")} onClick={onLike}>
          <Heart className="mr-1 h-4 w-4" />
          Like
        </Button>
        <Button variant="ghost" size="sm" className="text-xs" onClick={onComment}>
          <MessageCircle className="mr-1 h-4 w-4" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <Share2 className="mr-1 h-4 w-4" />
          Share
        </Button>
        <Button variant="ghost" size="sm" className={cn("text-xs", supported && "text-orange-700")} onClick={onSupport}>
          <HandHeart className="mr-1 h-4 w-4" />
          Support
        </Button>
        <Button variant="ghost" size="sm" className={cn("text-xs", saved && "text-[#5856D6]")} onClick={onSave}>
          <Bookmark className="mr-1 h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="mt-2 flex justify-end">
        <Button variant="outline" size="sm" className="rounded-full" onClick={onOpen}>
          Open detail
        </Button>
      </div>
    </article>
  );
};

export default FeedPostCard;
