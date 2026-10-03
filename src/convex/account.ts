import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";

/**
 * Delete all of the signed-in user's PlantGuard data (profile, scans, posts,
 * products and orders), including any stored images. The auth account itself is
 * removed client-side by signing out afterwards.
 */
export const deleteMyData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const scans = await ctx.db
      .query("scans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const scan of scans) {
      if (scan.imageId) {
        await ctx.storage.delete(scan.imageId).catch(() => undefined);
      }
      await ctx.db.delete(scan._id);
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const post of posts) {
      if (post.imageId) {
        await ctx.storage.delete(post.imageId).catch(() => undefined);
      }
      await ctx.db.delete(post._id);
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const product of products) {
      if (product.imageId) {
        await ctx.storage.delete(product.imageId).catch(() => undefined);
      }
      await ctx.db.delete(product._id);
    }

    const sales = await ctx.db
      .query("sales")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const sale of sales) {
      await ctx.db.delete(sale._id);
    }

    const profile = await ctx.db
      .query("farmerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (profile) {
      await ctx.db.delete(profile._id);
    }
  },
});
