import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";

export default function useMessagesQuery({ roomId }: { roomId: string }) {
  return useQuery(convexQuery(api.messages.getMessages, { roomId }));
}
