import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { EXPIRY_DURATION } from "../src/lib/constants";

function generateRoomID(length = 6) {
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

    await ctx.db.insert("participants", {
      roomId: convexRoomId,
      username: args.username,
      joinedAt: now,
    });

    await ctx.db.insert("messages", {
      roomId: convexRoomId,
      username: "System",
      content: `${args.username} created the room`,
      createdAt: Date.now(),
      isSystem: true,
    });

    return { roomId };
  },
});

export const leaveRoom = mutation({
  args: {
    roomId: v.string(),
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

    await ctx.db.insert("messages", {
      roomId: room._id,
      username: "System",
      content: `${args.username} left the room`,
      createdAt: Date.now(),
      isSystem: true,
    });

    await ctx.db.delete(participant._id);
  },
});

export const getRoom = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const room = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("roomId"), args.roomId))
      .first();

    if (!room) {
      throw new Error(`Room not found with id:: ${args.roomId}`);
    }

    if (room.expiresAt <= Date.now()) {
      throw new Error(`Room ${args.roomId} has expired`);
    }

    return room;
  },
});

export const cleanExpiredRoom = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const expiredRooms = await ctx.db
      .query("rooms")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const room of expiredRooms) {
      const participants = await ctx.db
        .query("participants")
        .filter((q) => q.eq(q.field("roomId"), room._id))
        .collect();
      for (const participant of participants) {
        await ctx.db.delete(participant._id);
      }

      const messages = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("roomId"), room._id))
        .collect();
      for (const message of messages) {
        await ctx.db.delete(message._id);
      }

      await ctx.db.delete(room._id);
    }

    console.log(`Cleaned up ${expiredRooms.length} expired rooms.`);
  },
});
