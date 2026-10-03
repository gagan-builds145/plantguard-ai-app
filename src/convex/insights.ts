import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

const DAY = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 14;

function dateKey(ts: number) {
  const d = new Date(ts);
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function shortLabel(ts: number) {
  return new Date(ts).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });
}

type Bucket = {
  key: string;
  label: string;
  posts: number;
  likes: number;
  revenue: number;
  units: number;
};

/**
 * Analytics for the signed-in nursery: what its posts are doing and how its
 * product sales are trending, over the last 14 days.
 */
export const getOverview = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const now = Date.now();
    const buckets = new Map<string, Bucket>();
    for (let i = WINDOW_DAYS - 1; i >= 0; i -= 1) {
      const ts = now - i * DAY;
      const key = dateKey(ts);
      buckets.set(key, {
        key,
        label: shortLabel(ts),
        posts: 0,
        likes: 0,
        revenue: 0,
        units: 0,
      });
    }

    let totalLikes = 0;
    for (const post of posts) {
      totalLikes += post.likedBy.length;
      const bucket = buckets.get(dateKey(post.createdAt));
      if (bucket) {
        bucket.posts += 1;
        bucket.likes += post.likedBy.length;
      }
    }

    let totalRevenue = 0;
    let totalUnits = 0;
    const byProduct = new Map<
      string,
      { name: string; revenue: number; units: number }
    >();
    for (const sale of sales) {
      totalRevenue += sale.total;
      totalUnits += sale.quantity;
      const bucket = buckets.get(dateKey(sale.createdAt));
      if (bucket) {
        bucket.revenue += sale.total;
        bucket.units += sale.quantity;
      }
      const entry = byProduct.get(sale.productName) ?? {
        name: sale.productName,
        revenue: 0,
        units: 0,
      };
      entry.revenue += sale.total;
      entry.units += sale.quantity;
      byProduct.set(sale.productName, entry);
    }

    const topPosts = await Promise.all(
      [...posts]
        .sort((a, b) => b.likedBy.length - a.likedBy.length)
        .slice(0, 5)
        .map(async (post) => ({
          caption: post.caption.trim() || "Untitled post",
          likes: post.likedBy.length,
          imageUrl: await ctx.storage.getUrl(post.imageId),
        })),
    );

    const dayList = [...buckets.values()];

    return {
      posts: {
        total: posts.length,
        totalLikes,
        avgLikes:
          posts.length === 0
            ? 0
            : Math.round((totalLikes / posts.length) * 10) / 10,
        byDay: dayList.map((b) => ({
          label: b.label,
          posts: b.posts,
          likes: b.likes,
        })),
        topPosts,
      },
      sales: {
        totalRevenue,
        totalUnits,
        totalOrders: sales.length,
        avgOrder: sales.length === 0 ? 0 : Math.round(totalRevenue / sales.length),
        byDay: dayList.map((b) => ({
          label: b.label,
          revenue: b.revenue,
          units: b.units,
        })),
        byProduct: [...byProduct.values()]
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 6),
      },
    };
  },
});
