import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import * as React from "react";

export function useRoomLeave({ roomId, username }: { roomId: string; username: string }) {
  const { mutate: leaveRoom } = useMutation({
    mutationKey: ["leave-room"],
    mutationFn: useConvexMutation(api.rooms.leaveRoom),
  });

  const handleBeforeUnload = React.useCallback(() => {
    if (roomId && username) {
      leaveRoom({ roomId, username });
    }
  }, [roomId, username, leaveRoom]);

  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);
}
