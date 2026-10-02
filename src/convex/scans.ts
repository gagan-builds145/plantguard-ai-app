import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

const healthStatusValidator = v.union(
  v.literal("healthy"),
  v.literal("attention"),
  v.literal("disease"),
  v.literal("inconclusive"),
);

/** Short-lived upload URL used to store the plant photo alongside a scan. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

/** Persist an AI plant-check result so it appears in scan history. */
export const createScan = mutation({
  args: {
    plantName: v.string(),
    plantConfidence: v.number(),
    healthStatus: healthStatusValidator,
    disease: v.optional(v.string()),
    diseaseConfidence: v.optional(v.number()),
    observations: v.array(v.string()),
    recommendations: v.array(v.string()),
    imageId: v.optional(v.id("_storage")),
    isDemo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return await ctx.db.insert("scans", {
      userId,
      ...args,
      createdAt: Date.now(),
    });
  },
});

type ScanWithImage = Doc<"scans"> & { imageUrl: string | null };

async function attachImageUrl(
  ctx: QueryCtx,
  scan: Doc<"scans">,
): Promise<ScanWithImage> {
  const imageUrl = scan.imageId
    ? await ctx.storage.getUrl(scan.imageId)
    : null;
  return { ...scan, imageUrl };
}

/** All saved scans for the signed-in farmer, newest first. */
export const listScans = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const rows = await ctx.db
      .query("scans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return await Promise.all(rows.map((row) => attachImageUrl(ctx, row)));
  },
});

/** Recent scans for the dashboard widget. */
export const listRecentScans = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const rows = await ctx.db
      .query("scans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(Math.min(args.limit ?? 4, 20));
    return await Promise.all(rows.map((row) => attachImageUrl(ctx, row)));
  },
});

/** A single saved scan, used by the read-only result screen. */
export const getScan = query({
  args: { id: v.id("scans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const scan = await ctx.db.get(args.id);
    if (!scan || scan.userId !== userId) return null;
    return await attachImageUrl(ctx, scan);
  },
});

/** Delete a saved scan (destructive action, confirmed in the UI). */
export const removeScan = mutation({
  args: { id: v.id("scans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const scan = await ctx.db.get(args.id);
    if (!scan || scan.userId !== userId) throw new Error("Scan not found");
    if (scan.imageId) {
      await ctx.storage.delete(scan.imageId).catch(() => undefined);
    }
    await ctx.db.delete(args.id);
  },
});
