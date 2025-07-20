import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const joinRoom = mutation({
  args: {
    roomId: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!room || room.expiresAt < now) {
      throw new Error("Room doesn't exist or has expired");
    }

    const participantAlreadyExists = await ctx.db
      .query("participants")
      .filter((q) => q.and(q.eq(q.field("roomId"), room._id), q.eq(q.field("username"), args.username)))
      .first();
    if (participantAlreadyExists) {
      throw new Error("Participant with the same username already exists in the room!");
    }

    await ctx.db.insert("participants", {
      roomId: room._id,
      username: args.username,
      joinedAt: now,
    });

    await ctx.db.insert("messages", {
      roomId: room._id,
      username: "System",
      content: `${args.username} entered the room`,
      createdAt: Date.now(),
      isSystem: true,
    });

    return { roomId: room.roomId };
  },
});

export const getParticipants = query({
  args: {
    roomId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!room) {
      throw new Error("Room doesn't exist");
    }

    return await ctx.db
      .query("participants")
      .filter((q) => q.eq(q.field("roomId"), room._id))
      .collect();
  },
});
