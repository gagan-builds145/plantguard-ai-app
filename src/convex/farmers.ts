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
    phone: v.optional(v.string()),
    language: v.optional(v.string()),
    onboardedAt: v.optional(v.number()),
    role: v.optional(
      v.union(
        v.literal("farmer"),
        v.literal("nursery"),
        v.literal("home_grower"),
        v.literal("seller"),
        v.literal("vehicle_owner"),
        v.literal("labour"),
        v.literal("scientist"),
      ),
    ),
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
    nurseryType: v.optional(v.string()),
    nurseryCategories: v.optional(v.array(v.string())),
    nurseryScale: v.optional(v.string()),
    helpNeeded: v.optional(v.array(v.string())),
    // Role setup fields for the Home Grower / Seller / Vehicle Owner / Labour /
    // Scientist workspaces.
    growerSpace: v.optional(v.string()),
    growerInterests: v.optional(v.array(v.string())),
    sellerBrandName: v.optional(v.string()),
    sellerCategories: v.optional(v.array(v.string())),
    institution: v.optional(v.string()),
    department: v.optional(v.string()),
    specialization: v.optional(v.string()),
    yearsExperience: v.optional(v.string()),
    researchInterests: v.optional(v.array(v.string())),
    skills: v.optional(v.array(v.string())),
    equipment: v.optional(v.array(v.string())),
    experience: v.optional(v.string()),
    serviceArea: v.optional(
      v.object({
        city: v.string(),
        district: v.string(),
        state: v.string(),
        radius: v.string(),
      }),
    ),
    availability: v.optional(v.string()),
    usesVehicle: v.optional(v.boolean()),
    vehicles: v.optional(v.array(v.any())),
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
        phone: args.phone,
        language: args.language,
        onboardedAt: args.onboardedAt,
        role: args.role,
        location: args.location,
        crops: args.crops ?? [],
        farmSize: args.farmSize,
        farmingType: args.farmingType,
        nurseryType: args.nurseryType,
        nurseryCategories: args.nurseryCategories,
        nurseryScale: args.nurseryScale,
        helpNeeded: args.helpNeeded ?? [],
        growerSpace: args.growerSpace,
        growerInterests: args.growerInterests,
        sellerBrandName: args.sellerBrandName,
        sellerCategories: args.sellerCategories,
        institution: args.institution,
        department: args.department,
        specialization: args.specialization,
        yearsExperience: args.yearsExperience,
        researchInterests: args.researchInterests,
        skills: args.skills,
        equipment: args.equipment,
        experience: args.experience,
        serviceArea: args.serviceArea,
        availability: args.availability,
        usesVehicle: args.usesVehicle,
        vehicles: args.vehicles,
        createdAt: Date.now(),
      });
    }

    await ctx.db.patch(existing._id, {
      ...(args.displayName !== undefined
        ? { displayName: args.displayName }
        : {}),
      ...(args.phone !== undefined ? { phone: args.phone } : {}),
      ...(args.language !== undefined ? { language: args.language } : {}),
      ...(args.onboardedAt !== undefined
        ? { onboardedAt: args.onboardedAt }
        : {}),
      ...(args.role !== undefined ? { role: args.role } : {}),
      ...(args.crops !== undefined ? { crops: args.crops } : {}),
      ...(args.farmSize !== undefined ? { farmSize: args.farmSize } : {}),
      ...(args.farmingType !== undefined
        ? { farmingType: args.farmingType }
        : {}),
      ...(args.nurseryType !== undefined
        ? { nurseryType: args.nurseryType }
        : {}),
      ...(args.nurseryCategories !== undefined
        ? { nurseryCategories: args.nurseryCategories }
        : {}),
      ...(args.nurseryScale !== undefined
        ? { nurseryScale: args.nurseryScale }
        : {}),
      ...(args.helpNeeded !== undefined
        ? { helpNeeded: args.helpNeeded }
        : {}),
      ...(args.growerSpace !== undefined
        ? { growerSpace: args.growerSpace }
        : {}),
      ...(args.growerInterests !== undefined
        ? { growerInterests: args.growerInterests }
        : {}),
      ...(args.sellerBrandName !== undefined
        ? { sellerBrandName: args.sellerBrandName }
        : {}),
      ...(args.sellerCategories !== undefined
        ? { sellerCategories: args.sellerCategories }
        : {}),
      ...(args.institution !== undefined
        ? { institution: args.institution }
        : {}),
      ...(args.department !== undefined
        ? { department: args.department }
        : {}),
      ...(args.specialization !== undefined
        ? { specialization: args.specialization }
        : {}),
      ...(args.yearsExperience !== undefined
        ? { yearsExperience: args.yearsExperience }
        : {}),
      ...(args.researchInterests !== undefined
        ? { researchInterests: args.researchInterests }
        : {}),
      ...(args.skills !== undefined ? { skills: args.skills } : {}),
      ...(args.equipment !== undefined ? { equipment: args.equipment } : {}),
      ...(args.experience !== undefined ? { experience: args.experience } : {}),
      ...(args.serviceArea !== undefined
        ? { serviceArea: args.serviceArea }
        : {}),
      ...(args.availability !== undefined
        ? { availability: args.availability }
        : {}),
      ...(args.usesVehicle !== undefined
        ? { usesVehicle: args.usesVehicle }
        : {}),
      ...(args.vehicles !== undefined ? { vehicles: args.vehicles } : {}),
      ...(args.location !== undefined ? { location: args.location } : {}),
      ...(args.clearLocation ? { location: undefined } : {}),
    });
    return existing._id;
  },
});
