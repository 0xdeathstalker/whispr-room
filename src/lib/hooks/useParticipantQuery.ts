import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";

export default function useParticipantQuery({ roomId }: { roomId: string }) {
  return useQuery(convexQuery(api.participants.getParticipants, { roomId }));
}
