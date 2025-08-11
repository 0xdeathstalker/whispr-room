import type { Id } from "../../../convex/_generated/dataModel";

export type ButtonState = "idle" | "loading" | "success";

export type Media = {
  url: string;
  type: string;
  name: string;
  size: number;
};

export type Participants =
  | {
      _id: Id<"participants">;
      _creationTime: number;
      roomId: Id<"rooms">;
      username: string;
      joinedAt: number;
    }[]
  | undefined;
