import { Heart, MessageCircle, Share2, ShieldCheck, HandHeart, Bookmark } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSosWeb } from "@/web/context/SosWebContext";
import { SocialPost } from "@/web/types";

interface SocialPostCardProps {
  post: SocialPost;
  expanded: boolean;
  onToggleExpand: () => void;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({ post, expanded, onToggleExpand }) => {
  const {
    t,
    likedPostIds,
    savedPostIds,
    supportedPostIds,
    togglePostLike,
    togglePostSave,
    togglePostSupport,
  } = useSosWeb();

  const isLiked = likedPostIds.includes(post.id);
  const isSaved = savedPostIds.includes(post.id);
  const isSupported = supportedPostIds.includes(post.id);
  const shouldClamp = post.content.length > 160;
  const text = !expanded && shouldClamp ? `${post.content.slice(0, 160)}...` : post.content;

  const campaignProgress = post.campaign
    ? Math.min(100, Math.round((post.campaign.raisedAmount / post.campaign.goalAmount) * 100))
    : 0;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span>{post.author.name}</span>
            {post.author.verified ? <ShieldCheck className="h-4 w-4 text-emerald-600" /> : null}
          </div>
          <p className="text-xs text-slate-500">
            {formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}
            {post.locationText ? ` · ${post.locationText}` : ""}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          #{post.category}
        </span>
      </header>

      {post.title ? <h4 className="mt-3 text-sm font-semibold text-slate-800">{post.title}</h4> : null}

      <p className="mt-2 text-sm text-slate-700">{text}</p>
      {shouldClamp ? (
        <button onClick={onToggleExpand} className="mt-1 text-xs font-semibold text-orange-600">
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      {post.campaign ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-center justify-between text-xs text-emerald-700">
            <span>
              INR {post.campaign.raisedAmount.toLocaleString()} / INR {post.campaign.goalAmount.toLocaleString()}
            </span>
            <span>{campaignProgress}%</span>
          </div>
          <Progress className="mt-2 h-2 bg-emerald-100" value={campaignProgress} />
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <span>{post.engagement.likes} likes</span>
        <span>{post.engagement.comments} comments</span>
        <span>{post.engagement.shares} shares</span>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("text-xs", isSupported && "text-orange-700")}
          onClick={() => togglePostSupport(post.id)}
        >
          <HandHeart className="mr-1 h-3.5 w-3.5" />
          {t("citizen.social.support")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("text-xs", isLiked && "text-red-700")}
          onClick={() => togglePostLike(post.id)}
        >
          <Heart className="mr-1 h-3.5 w-3.5" />
          {isLiked ? "Liked" : "Like"}
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <MessageCircle className="mr-1 h-3.5 w-3.5" />
          {t("citizen.social.comment")}
        </Button>
        <Button variant="ghost" size="sm" className="text-xs">
          <Share2 className="mr-1 h-3.5 w-3.5" />
          {t("citizen.social.share")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("text-xs", isSaved && "text-indigo-700")}
          onClick={() => togglePostSave(post.id)}
        >
          <Bookmark className="mr-1 h-3.5 w-3.5" />
          {isSaved ? "Saved" : "Save"}
        </Button>
      </div>

      {post.commentsPreview.length ? (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {post.commentsPreview.slice(0, 2).map((comment) => (
            <div key={comment.id} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
              <span className="font-semibold">{comment.author}: </span>
              {comment.text}
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
};

export default SocialPostCard;