import { AppShell } from "@/components/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MoreHorizontal,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground",
        className,
      )}
    >
      {name.trim().slice(0, 1).toUpperCase() || "G"}
    </span>
  );
}

export default function NurseryFeed() {
  const { user } = useAuth();
  const { profile } = useFarmerProfile();
  const posts = useQuery(api.posts.listFeed, { limit: 40 });
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const [composerOpen, setComposerOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName =
    profile?.displayName || user?.name || "PlantGuard Grower";

  function pickFile(next: File | null) {
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  function resetComposer() {
    setFile(null);
    setPreview(null);
    setCaption("");
    setLocation("");
  }

  async function publish() {
    if (!file) {
      toast.error("Choose a photo to share.");
      return;
    }
    setPublishing(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("upload failed");
      const { storageId } = (await response.json()) as {
        storageId: Id<"_storage">;
      };
      await createPost({
        caption,
        imageId: storageId,
        location: location.trim() || undefined,
      });
      toast.success("Shared to your feed");
      resetComposer();
      setComposerOpen(false);
    } catch {
      toast.error("Couldn't publish your post. Please try again.");
    } finally {
      setPublishing(false);
    }
  }

  const composerCard = (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[0_1px_3px_rgba(20,40,20,0.06)]">
      <Avatar name={displayName} />
      <button
        type="button"
        onClick={() => setComposerOpen(true)}
        className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        Share a photo of your nursery…
      </button>
      <Button
        className="h-11 shrink-0 rounded-xl px-4 font-semibold"
        onClick={() => setComposerOpen(true)}
      >
        <Upload className="size-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    </div>
  );

  return (
    <AppShell
      active="feed"
      title="Feed"
      subtitle="See what other nurseries and growers are sharing."
    >
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
        {composerCard}

        {posts === undefined ? (
          <div className="flex flex-col gap-5">
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <ImageIcon className="size-6" />
            </span>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                No posts yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Be the first to share your nursery — a new batch of saplings, a
                flowering display, or a proud greenhouse.
              </p>
            </div>
            <Button
              className="h-11 rounded-xl px-5"
              onClick={() => setComposerOpen(true)}
            >
              <Upload className="size-4" />
              Share a post
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-5">
            {posts.map((post) => (
              <li
                key={post._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(20,40,20,0.06)]"
              >
                {/* Header */}
                <div className="flex items-center gap-3 p-4">
                  <Avatar name={post.authorName} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {post.authorName}
                      </span>
                      <Badge
                        className={cn(
                          "h-6 gap-1 border-transparent px-2 text-[11px]",
                          post.authorRole === "nursery"
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        {post.authorRole === "nursery" ? "Nursery" : "Farmer"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                      {post.location ? (
                        <>
                          <span aria-hidden>·</span>
                          <MapPin className="size-3" />
                          {post.location}
                        </>
                      ) : null}
                    </p>
                  </div>
                  {post.isMine ? (
                    <DeletePost postId={post._id} />
                  ) : (
                    <span className="flex size-9 items-center justify-center text-muted-foreground">
                      <MoreHorizontal className="size-4" />
                    </span>
                  )}
                </div>

                {/* Image */}
                <div className="bg-surface-3">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.caption || "Nursery post"}
                      className="max-h-[560px] w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-8" />
                    </div>
                  )}
                </div>

                {/* Action bar */}
                <div className="flex flex-col gap-2 p-4">
                  <LikeButton
                    postId={post._id}
                    likedByMe={post.likedByMe}
                    likeCount={post.likeCount}
                  />
                  {post.caption ? (
                    <p className="text-sm leading-6 text-foreground">
                      <span className="mr-1.5 font-semibold">
                        {post.authorName}
                      </span>
                      {post.caption}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Composer */}
      <Dialog
        open={composerOpen}
        onOpenChange={(open) => {
          setComposerOpen(open);
          if (!open) resetComposer();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Share a post</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
                preview
                  ? "border-transparent"
                  : "aspect-square border-border bg-surface-2 hover:border-primary/40",
              )}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Selected preview"
                  className="max-h-[420px] w-full object-cover"
                />
              ) : (
                <span className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="size-8" />
                  <span className="text-sm font-medium">
                    Tap to choose a photo
                  </span>
                </span>
              )}
            </button>
            {preview ? (
              <Button
                variant="outline"
                className="h-10 w-fit rounded-xl"
                onClick={() => fileInputRef.current?.click()}
              >
                Change photo
              </Button>
            ) : null}

            <div className="flex flex-col gap-2">
              <Label htmlFor="caption" className="text-sm font-medium">
                Caption
              </Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Say something about this post…"
                maxLength={400}
                rows={3}
                className="resize-none rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={
                  profile?.location
                    ? `${profile.location.city}, ${profile.location.state}`
                    : "e.g. Nursery name, city"
                }
                className="h-11 rounded-xl text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setComposerOpen(false)}
              disabled={publishing}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-xl font-semibold"
              onClick={publish}
              disabled={publishing || !file}
            >
              {publishing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sharing…
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Share
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function LikeButton({
  postId,
  likedByMe,
  likeCount,
}: {
  postId: Id<"posts">;
  likedByMe: boolean;
  likeCount: number;
}) {
  const toggleLike = useMutation(api.posts.toggleLike);
  return (
    <button
      type="button"
      onClick={() => void toggleLike({ postId })}
      aria-pressed={likedByMe}
      aria-label={likedByMe ? "Unlike post" : "Like post"}
      className="flex w-fit items-center gap-2 text-sm font-semibold transition-colors"
    >
      <Heart
        className={cn(
          "size-6 transition-colors",
          likedByMe ? "fill-[#E53935] text-[#E53935]" : "text-foreground",
        )}
        strokeWidth={likedByMe ? 0 : 1.8}
      />
      <span className={likedByMe ? "text-[#E53935]" : "text-foreground"}>
        {likeCount}
      </span>
    </button>
  );
}

function DeletePost({ postId }: { postId: Id<"posts"> }) {
  const removePost = useMutation(api.posts.removePost);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-9 rounded-full text-muted-foreground"
          aria-label="Post options"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the photo and caption from the feed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-11 rounded-xl">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-11 gap-2 rounded-xl bg-danger text-white hover:bg-[#B71C1C]"
            onClick={() => void removePost({ postId })}
          >
            <Trash2 className="size-4" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
