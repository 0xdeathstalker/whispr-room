import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    roomId: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  }),

  participants: defineTable({
    roomId: v.id("rooms"),
    username: v.string(),
    joinedAt: v.number(),
  }),

  messages: defineTable({
    roomId: v.id("rooms"),
    username: v.string(),
    content: v.string(),
    createdAt: v.number(),
    isSystem: v.optional(v.boolean()),
    mediaType: v.optional(v.string()),
    mediaUrl: v.optional(v.string()),
  }),
});
