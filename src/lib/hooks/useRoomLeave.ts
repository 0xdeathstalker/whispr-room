import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import * as React from "react";
import { api } from "../../../convex/_generated/api";

export function useRoomLeave(roomId: string, username: string) {
  const hasLeftRef = React.useRef(false);

  const { mutate: leaveRoom } = useMutation({
    mutationKey: ["leave-room", roomId, username],
    mutationFn: useConvexMutation(api.participants.leaveRoom),
  });

  const handleLeaveRoom = () => {
    if (!hasLeftRef.current && roomId && username) {
      hasLeftRef.current = true;
      leaveRoom({ roomId, username });
    }
  };

  React.useEffect(() => {
    const handleBeforeUnload = () => {
      handleLeaveRoom();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleLeaveRoom();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, username]);

  return { leaveRoom: handleLeaveRoom };
}
