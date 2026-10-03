import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // PlantGuard AI — Farmer farmer onboarding profile (version 1 scope)
    farmerProfiles: defineTable({
      userId: v.id("users"),
      displayName: v.optional(v.string()),
      phone: v.optional(v.string()),
      language: v.optional(v.string()),
      onboardedAt: v.optional(v.number()),
      // Workspace role. Defaults to "farmer" when unset (existing accounts).
      role: v.optional(v.union(v.literal("farmer"), v.literal("nursery"))),
      location: v.optional(
        v.object({
          country: v.string(),
          state: v.string(),
          city: v.string(),
        }),
      ),
      // Farmer fields
      crops: v.array(v.string()),
      farmSize: v.optional(v.string()),
      farmingType: v.optional(v.string()),
      // Nursery fields
      nurseryType: v.optional(v.string()),
      nurseryCategories: v.optional(v.array(v.string())),
      nurseryScale: v.optional(v.string()),
      helpNeeded: v.array(v.string()),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // PlantGuard AI — saved AI plant scans
    scans: defineTable({
      userId: v.id("users"),
      plantName: v.string(),
      plantConfidence: v.number(),
      healthStatus: v.union(
        v.literal("healthy"),
        v.literal("attention"),
        v.literal("disease"),
        v.literal("inconclusive"),
      ),
      disease: v.optional(v.string()),
      diseaseConfidence: v.optional(v.number()),
      observations: v.array(v.string()),
      recommendations: v.array(v.string()),
      imageId: v.optional(v.id("_storage")),
      isDemo: v.boolean(),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // PlantGuard AI — social feed posts (nursery + grower updates)
    posts: defineTable({
      userId: v.id("users"),
      caption: v.string(),
      imageId: v.id("_storage"),
      location: v.optional(v.string()),
      authorName: v.string(),
      authorRole: v.union(v.literal("farmer"), v.literal("nursery")),
      likedBy: v.array(v.id("users")),
      createdAt: v.number(),
    })
      .index("by_created", ["createdAt"])
      .index("by_user", ["userId"]),

    // PlantGuard AI — nursery product listings for sale
    products: defineTable({
      userId: v.id("users"),
      name: v.string(),
      category: v.string(),
      price: v.number(),
      unit: v.string(),
      stock: v.number(),
      description: v.string(),
      imageId: v.optional(v.id("_storage")),
      active: v.boolean(),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    // PlantGuard AI — recorded product sales (feeds the sales analytics)
    sales: defineTable({
      userId: v.id("users"),
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      total: v.number(),
      buyer: v.optional(v.string()),
      status: v.optional(
        v.union(
          v.literal("new"),
          v.literal("confirmed"),
          v.literal("delivered"),
          v.literal("cancelled"),
        ),
      ),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
