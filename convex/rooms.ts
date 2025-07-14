import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";

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
    const expiresAt = now + 1800 * 1000; // TODO: move the duration to .env

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

    const uploadedFileKeys: string[] = [];

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
        if (!message.isSystem) {
          const fileKey = message.mediaUrl?.split("/f/")[1];
          if (fileKey) {
            uploadedFileKeys.push(fileKey);
          }
        }
        await ctx.db.delete(message._id);
      }
      console.log("[uploaded-files] = ", { uploadedFileKeys });
      await ctx.scheduler.runAfter(0, internal.rooms.deleteUploadedFilesAction, { fileKeys: uploadedFileKeys });

      await ctx.db.delete(room._id);
    }

    console.log(`Cleaned up ${expiredRooms.length} expired rooms.`);
  },
});

export const deleteUploadedFilesAction = internalAction({
  args: { fileKeys: v.array(v.string()) },
  handler: async (ctx, args) => {
    const uploadThingSecret = process.env.UPLOADTHING_SECRET;
    console.log("[deleteFiles] = ", { uploadThingSecret, fileKeys: args.fileKeys });

    if (!uploadThingSecret) {
      console.warn("UPLOADTHING_SECRET not found, skipping file deletion");
      return { success: false, deletedCount: 0, error: "No secret key configured" };
    }

    if (args.fileKeys.length === 0) {
      console.log("No file keys provided for deletion");
      return { success: true, deletedCount: 0 };
    }

    try {
      const response = await fetch("https://api.uploadthing.com/v6/deleteFiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Uploadthing-Api-Key": uploadThingSecret,
        },
        body: JSON.stringify({
          fileKeys: args.fileKeys,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Uploadthing API error: ", response.status, errorText);
        throw new Error(`Failed to delete files: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log("Files deleted successfully: ", result);

      return {
        success: true,
        deletedCount: args.fileKeys.length,
        result,
      };
    } catch (error) {
      console.error("Error deleting files from Uploadthing: ", error);
      throw error;
    }
  },
});
