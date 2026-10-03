import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

/** Short-lived upload URL used to store a feed photo. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

/** Resolve a display name and role for the post author. */
async function resolveAuthor(
  ctx: QueryCtx | MutationCtx,
  userId: Awaited<ReturnType<typeof getAuthUserId>>,
) {
  if (userId === null) {
    return { authorName: "PlantGuard Grower", authorRole: "farmer" as const };
  }
  const profile = await ctx.db
    .query("farmerProfiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();
  const user = await ctx.db.get(userId);
  return {
    authorName:
      profile?.displayName ?? user?.name ?? "PlantGuard Grower",
    authorRole: profile?.role ?? ("farmer" as const),
  };
}

/** Publish a new post to the feed. */
export const createPost = mutation({
  args: {
    caption: v.string(),
    imageId: v.id("_storage"),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const author = await resolveAuthor(ctx, userId);
    return await ctx.db.insert("posts", {
      userId,
      caption: args.caption.trim(),
      imageId: args.imageId,
      location: args.location?.trim() || undefined,
      authorName: author.authorName,
      authorRole: author.authorRole,
      likedBy: [],
      createdAt: Date.now(),
    });
  },
});

export type FeedAuthorRole =
  | "farmer"
  | "nursery"
  | "home_grower"
  | "seller"
  | "vehicle_owner"
  | "labour"
  | "scientist";

export type FeedPost = {
  _id: Id<"posts">;
  caption: string;
  imageUrl: string | null;
  location: string | null;
  authorName: string;
  authorRole: FeedAuthorRole;
  likeCount: number;
  likedByMe: boolean;
  isMine: boolean;
  createdAt: number;
};

/** Newest-first feed of nursery and grower posts. */
export const listFeed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args): Promise<FeedPost[]> => {
    const userId = await getAuthUserId(ctx);
    const rows = await ctx.db
      .query("posts")
      .withIndex("by_created")
      .order("desc")
      .take(Math.min(args.limit ?? 30, 60));

    return await Promise.all(
      rows.map(async (post) => ({
        _id: post._id,
        caption: post.caption,
        imageUrl: await ctx.storage.getUrl(post.imageId),
        location: post.location ?? null,
        authorName: post.authorName,
        authorRole: post.authorRole,
        likeCount: post.likedBy.length,
        likedByMe: userId ? post.likedBy.includes(userId) : false,
        isMine: userId ? post.userId === userId : false,
        createdAt: post.createdAt,
      })),
    );
  },
});

/** Like or un-like a post for the signed-in user. */
export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    const liked = post.likedBy.includes(userId);
    await ctx.db.patch(args.postId, {
      likedBy: liked
        ? post.likedBy.filter((id) => id !== userId)
        : [...post.likedBy, userId],
    });
  },
});

/** Delete one of the signed-in user's own posts. */
export const removePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const post = await ctx.db.get(args.postId);
    if (!post || post.userId !== userId) throw new Error("Post not found");
    await ctx.storage.delete(post.imageId).catch(() => undefined);
    await ctx.db.delete(args.postId);
  },
});
