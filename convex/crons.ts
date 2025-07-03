import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const cron = cronJobs();

cron.interval("cleanup expired rooms", { hours: 1 }, internal.rooms.cleanExpiredRoom);

export default cron;
