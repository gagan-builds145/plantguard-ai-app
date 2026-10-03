import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

const HEALTH_LABEL: Record<string, string> = {
  healthy: "Healthy",
  attention: "Needs attention",
  disease: "Disease detected",
  inconclusive: "Needs a better photo",
};

export type Notification = {
  id: string;
  kind: "scan" | "order" | "post";
  title: string;
  description: string | null;
  createdAt: number;
  to: string;
};

/**
 * Recent activity for the signed-in user — plant checks, recorded orders and
 * published posts — newest first. Derives from existing data, no extra writes.
 */
export const listNotifications = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args): Promise<Notification[]> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];

    const [scans, sales, posts] = await Promise.all([
      ctx.db
        .query("scans")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(20),
      ctx.db
        .query("sales")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(20),
      ctx.db
        .query("posts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(20),
    ]);

    const items: Notification[] = [
      ...scans.map((scan) => ({
        id: `scan-${scan._id}`,
        kind: "scan" as const,
        title: `Plant check · ${scan.plantName}`,
        description: HEALTH_LABEL[scan.healthStatus] ?? null,
        createdAt: scan.createdAt,
        to: `/scan/${scan._id}`,
      })),
      ...sales.map((sale) => ({
        id: `order-${sale._id}`,
        kind: "order" as const,
        title: `Order recorded · ${sale.quantity} × ${sale.productName}`,
        description: `₹${sale.total.toLocaleString()}${sale.buyer ? ` · ${sale.buyer}` : ""}`,
        createdAt: sale.createdAt,
        to: "/orders",
      })),
      ...posts.map((post) => ({
        id: `post-${post._id}`,
        kind: "post" as const,
        title: "Your post is live in the feed",
        description: post.caption.trim() || "Tap to view it in the feed",
        createdAt: post.createdAt,
        to: "/feed",
      })),
    ];

    return items
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, Math.min(args.limit ?? 30, 60));
  },
});
