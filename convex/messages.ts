import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    roomId: v.string(),
    username: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!room) {
      throw new Error(`Room not found with id:: ${args.roomId}`);
    }

    const participant = await ctx.db
      .query("participants")
      .filter((q) => q.and(q.eq(q.field("roomId"), room._id), q.eq(q.field("username"), args.username)))
      .first();

    if (!participant) {
      throw new Error(`Participant not found with username:: ${args.username}`);
    }

    await ctx.db.insert("messages", {
      roomId: room._id,
      username: args.username,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

export const getMessages = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!room) {
      throw new Error(`Room not found with id:: ${args.roomId}`);
    }

    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("roomId"), room._id))
      .order("asc")
      .collect();
  },
});
