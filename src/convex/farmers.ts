import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * The signed-in farmer's onboarding profile, or null when they have not
 * completed onboarding yet. The dashboard uses `null` to route new users into
 * the onboarding flow.
 */
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db
      .query("farmerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

/**
 * Create or update the farmer profile. Each onboarding step can save the
 * fields it collected without wiping values from earlier steps.
 */
export const saveProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    language: v.optional(v.string()),
    location: v.optional(
      v.object({
        country: v.string(),
        state: v.string(),
        city: v.string(),
      }),
    ),
    crops: v.optional(v.array(v.string())),
    farmSize: v.optional(v.string()),
    farmingType: v.optional(v.string()),
    helpNeeded: v.optional(v.array(v.string())),
    clearLocation: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("farmerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!existing) {
      return await ctx.db.insert("farmerProfiles", {
        userId,
        displayName: args.displayName,
        language: args.language,
        location: args.location,
        crops: args.crops ?? [],
        farmSize: args.farmSize,
        farmingType: args.farmingType,
        helpNeeded: args.helpNeeded ?? [],
        createdAt: Date.now(),
      });
    }

    await ctx.db.patch(existing._id, {
      ...(args.displayName !== undefined
        ? { displayName: args.displayName }
        : {}),
      ...(args.language !== undefined ? { language: args.language } : {}),
      ...(args.crops !== undefined ? { crops: args.crops } : {}),
      ...(args.farmSize !== undefined ? { farmSize: args.farmSize } : {}),
      ...(args.farmingType !== undefined
        ? { farmingType: args.farmingType }
        : {}),
      ...(args.helpNeeded !== undefined
        ? { helpNeeded: args.helpNeeded }
        : {}),
      ...(args.location !== undefined ? { location: args.location } : {}),
      ...(args.clearLocation ? { location: undefined } : {}),
    });
    return existing._id;
  },
});
