import { Photo, StatusPill } from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { useLocalState } from "@/hooks/use-local-state";
import type { GrowerPost } from "@/lib/role-data";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  Send,
  Share2,
  UserPlus,
  UserRoundCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SAMPLE_COMMENTS: Record<string, string[]> = {
  p1: ["New leaf looks so healthy 🌿", "My monstera is still sulking!"],
  p2: ["Basil grows so fast on a balcony.", "Try mint in the same box."],
  p3: ["Beautiful terrace setup.", "What mix are you using?"],
  p4: ["Repotting day is always satisfying.", "Roots look great."],
  p5: ["Succulents forgive everything.", "Lovely colours."],
  p6: ["Rain does half the work.", "Wish we got that rain here."],
};

/** One post in the Home Grower plant community feed. */
export function GrowerPostCard({ post }: { post: GrowerPost }) {
  const [liked, setLiked] = useLocalState<string[]>("grower:liked-posts", []);
  const [saved, setSaved] = useLocalState<string[]>("grower:saved-posts", []);
  const [following, setFollowing] = useLocalState<string[]>("grower:following", []);
  const [comments, setComments] = useLocalState<Record<string, string[]>>(
    "grower:comments",
    SAMPLE_COMMENTS,
  );
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const isLiked = liked.includes(post.id);
  const isSaved = saved.includes(post.id);
  const isFollowing = post.following || following.includes(post.id);
  const postComments = comments[post.id] ?? [];

  function toggle(list: string[], id: string) {
    return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#EAF0EA] bg-card shadow-[0_1px_3px_rgba(20,40,20,0.06)]">
      <header className="flex items-center gap-3 p-4">
        <img
          src={post.avatar}
          alt=""
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {post.author}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {post.location} · {post.timeAgo}
          </p>
        </div>
        <Button
          size="sm"
          variant={isFollowing ? "ghost" : "outline"}
          onClick={() => setFollowing((list) => toggle(list, post.id))}
          className={cn(
            "h-9 rounded-full px-3 text-xs font-semibold",
            isFollowing && "text-muted-foreground",
          )}
        >
          {isFollowing ? (
            <>
              <UserRoundCheck className="size-3.5" /> Following
            </>
          ) : (
            <>
              <UserPlus className="size-3.5" /> Follow
            </>
          )}
        </Button>
      </header>

      <div className="relative">
        <Photo src={post.image} alt={post.caption} ratio="aspect-[4/3]" />
        <span className="absolute left-3 top-3">
          <StatusPill
            label={post.plant}
            tone="green"
            className="border-transparent bg-white/95 backdrop-blur"
          />
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm leading-6 text-foreground">{post.caption}</p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={isLiked}
            onClick={() => setLiked((list) => toggle(list, post.id))}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold transition-colors",
              isLiked
                ? "border-primary/30 bg-accent text-accent-foreground"
                : "border-[#EAF0EA] text-muted-foreground hover:text-foreground",
            )}
          >
            <Heart
              className="size-3.5"
              fill={isLiked ? "currentColor" : "none"}
            />
            Like · {post.likes + (isLiked ? 1 : 0)}
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#EAF0EA] px-3 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageCircle className="size-3.5" />
            Comment · {post.comments + postComments.length}
          </button>
          <button
            type="button"
            aria-pressed={isSaved}
            onClick={() =>
              setSaved((list) => {
                const next = toggle(list, post.id);
                toast.success(
                  next.includes(post.id) ? "Saved to your collection" : "Removed from saved",
                );
                return next;
              })
            }
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold transition-colors",
              isSaved
                ? "border-primary/30 bg-accent text-accent-foreground"
                : "border-[#EAF0EA] text-muted-foreground hover:text-foreground",
            )}
          >
            <Bookmark className="size-3.5" fill={isSaved ? "currentColor" : "none"} />
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              toast.success("Post link copied to share");
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#EAF0EA] px-3 text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <Share2 className="size-3.5" />
            Share
          </button>
        </div>

        {open ? (
          <div className="flex flex-col gap-3 rounded-xl bg-surface-2 p-3.5">
            <ul className="flex flex-col gap-2.5">
              {postComments.length === 0 ? (
                <li className="text-xs text-muted-foreground">
                  No comments yet — add the first one.
                </li>
              ) : (
                postComments.map((comment, index) => (
                  <li key={`${index}-${comment}`} className="text-[13px] leading-5">
                    <span className="font-semibold text-foreground">You</span>{" "}
                    <span className="text-muted-foreground">{comment}</span>
                  </li>
                ))
              )}
            </ul>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                const text = draft.trim();
                if (!text) return;
                setComments((current) => ({
                  ...current,
                  [post.id]: [...(current[post.id] ?? []), text],
                }));
                setDraft("");
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Add a comment about this plant"
                className="h-11 flex-1 rounded-xl border border-[#DDE6DD] bg-card px-3.5 text-sm outline-none focus:border-primary"
              />
              <Button
                type="submit"
                size="sm"
                className="h-11 rounded-xl px-4 text-sm font-semibold"
                disabled={!draft.trim()}
              >
                <Send className="size-3.5" />
                Post
              </Button>
            </form>
          </div>
        ) : null}
      </div>
    </article>
  );
}
