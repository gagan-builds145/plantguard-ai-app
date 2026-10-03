import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

/** Short-lived upload URL used to store a product photo. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return await ctx.storage.generateUploadUrl();
  },
});

type ProductWithImage = Doc<"products"> & { imageUrl: string | null };

async function attachImageUrl(
  ctx: QueryCtx,
  product: Doc<"products">,
): Promise<ProductWithImage> {
  const imageUrl = product.imageId
    ? await ctx.storage.getUrl(product.imageId)
    : null;
  return { ...product, imageUrl };
}

/** The signed-in nursery's product listings, newest first. */
export const listProducts = query({
  args: {},
  handler: async (ctx): Promise<ProductWithImage[]> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const rows = await ctx.db
      .query("products")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return await Promise.all(rows.map((row) => attachImageUrl(ctx, row)));
  },
});

/** Create a new product listing. */
export const createProduct = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    price: v.number(),
    unit: v.string(),
    stock: v.number(),
    description: v.string(),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    return await ctx.db.insert("products", {
      userId,
      name: args.name.trim(),
      category: args.category,
      price: Math.max(0, args.price),
      unit: args.unit,
      stock: Math.max(0, Math.floor(args.stock)),
      description: args.description.trim(),
      imageId: args.imageId,
      active: true,
      createdAt: Date.now(),
    });
  },
});

/** Update a listing (partial patch). */
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    unit: v.optional(v.string()),
    stock: v.optional(v.number()),
    description: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const product = await ctx.db.get(args.id);
    if (!product || product.userId !== userId) {
      throw new Error("Product not found");
    }
    if (
      args.imageId !== undefined &&
      product.imageId &&
      product.imageId !== args.imageId
    ) {
      await ctx.storage.delete(product.imageId).catch(() => undefined);
    }
    await ctx.db.patch(args.id, {
      ...(args.imageId !== undefined ? { imageId: args.imageId } : {}),
      ...(args.name !== undefined ? { name: args.name.trim() } : {}),
      ...(args.category !== undefined ? { category: args.category } : {}),
      ...(args.price !== undefined ? { price: Math.max(0, args.price) } : {}),
      ...(args.unit !== undefined ? { unit: args.unit } : {}),
      ...(args.stock !== undefined
        ? { stock: Math.max(0, Math.floor(args.stock)) }
        : {}),
      ...(args.description !== undefined
        ? { description: args.description.trim() }
        : {}),
      ...(args.active !== undefined ? { active: args.active } : {}),
    });
  },
});

/** Delete a listing and its stored image. */
export const removeProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const product = await ctx.db.get(args.id);
    if (!product || product.userId !== userId) {
      throw new Error("Product not found");
    }
    if (product.imageId) {
      await ctx.storage.delete(product.imageId).catch(() => undefined);
    }
    await ctx.db.delete(args.id);
  },
});

/**
 * Record a sale of a product: stores the transaction and decrements stock.
 * Sales rows power the sales analytics charts.
 */
export const recordSale = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
    buyer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    const product = await ctx.db.get(args.productId);
    if (!product || product.userId !== userId) {
      throw new Error("Product not found");
    }
    const quantity = Math.max(1, Math.floor(args.quantity));
    const total = quantity * product.price;
    await ctx.db.patch(product._id, {
      stock: Math.max(0, product.stock - quantity),
    });
    return await ctx.db.insert("sales", {
      userId,
      productId: product._id,
      productName: product.name,
      quantity,
      unitPrice: product.price,
      total,
      buyer: args.buyer?.trim() || undefined,
      createdAt: Date.now(),
    });
  },
});

/** Recent recorded sales, newest first. */
export const listSales = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    return await ctx.db
      .query("sales")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(Math.min(args.limit ?? 10, 50));
  },
});
