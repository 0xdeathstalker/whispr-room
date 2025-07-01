import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { EXPIRY_DURATION } from "../src/lib/constants";

function generateRoomID(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
}

export const createRoom = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + EXPIRY_DURATION * 1000;

    const roomId = generateRoomID();

    const convexRoomId = await ctx.db.insert("rooms", {
      createdAt: now,
      expiresAt,
      roomId,
    });

    const convexUserId = await ctx.db.insert("participants", {
      roomId: convexRoomId,
      username: args.username,
      joinedAt: now,
    });

    return { roomId };
  },
});

export const leaveRoom = mutation({
  args: {
    roomId: v.id("rooms"),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!room) {
      throw new Error("Room doesn't exist");
    }

    const participant = await ctx.db
      .query("participants")
      .filter((q) => q.and(q.eq(q.field("roomId"), room._id), q.eq(q.field("username"), args.username)))
      .first();

    if (!participant) {
      throw new Error("Participant doesn't exist");
    }

    await ctx.db.delete(participant._id);
  },
});
