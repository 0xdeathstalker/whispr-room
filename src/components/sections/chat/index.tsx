"use client";

import ChatFooter from "@/components/sections/chat/footer";
import ChatHeader from "@/components/sections/chat/header";
import ChatMessages from "@/components/sections/chat/messages";
import { buttonVariants } from "@/components/ui/button";
import { useLeaveRoom } from "@/context/leave-context";
import { cn } from "@/lib/utils";
import { formSchema } from "@/lib/validation/room";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import * as React from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";

export default function Chat({ roomId }: { roomId: string }) {
  const [username] = useQueryState("username", { defaultValue: "" });
  const router = useRouter();

  const { isLeaving } = useLeaveRoom();

  const validationResult = formSchema.safeParse({ username, roomId });

  const { data: room, isLoading } = useQuery({
    ...convexQuery(api.rooms.getRoom, { roomId }),
    retry: false,
  });

  const { data: participants, isLoading: isParticipantsLoading } = useQuery(
    convexQuery(api.participants.getParticipants, { roomId }),
  );

  const { mutate: joinRoom } = useMutation({
    mutationKey: ["joinRoom"],
    mutationFn: useConvexMutation(api.participants.joinRoom),
    onSuccess: (data: { roomId: string }) => {
      toast.success(`success: joined room ${data.roomId}`);
    },
    onError: (error) => {
      toast.error(`error: failed to join room:: ${error.message}`);
      router.push("/");
    },
  });

  const { mutate: leaveRoom } = useMutation({
    mutationKey: ["leave-room"],
    mutationFn: useConvexMutation(api.rooms.leaveRoom),
  });

  const handleBeforeUnload = React.useCallback(() => {
    if (roomId && username) {
      isLeaving.current = true;
      leaveRoom({ roomId, username });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, username, leaveRoom]);

  // auto join room when the user visits the url with valid username and room id
  React.useEffect(() => {
    if (isParticipantsLoading || !participants || isLeaving.current) return;

    const participantAlreadyExists = participants.find((p) => p.username === username);

    if (!participantAlreadyExists && validationResult.success) {
      joinRoom({ username, roomId });
    } else if (!validationResult.success) {
      toast.error(`error: Unable to join the room, username:'${username}' or roomId:'${roomId}' not validated`);
    }
    // doing nothing if participant already exists
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, roomId, participants, isParticipantsLoading]);

  // auto leave room when user closes tab/window
  React.useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  if (!isLoading && (!room || room?.expiresAt <= Date.now())) {
    return (
      <div className="mt-4 flex h-[340px] w-full flex-col items-center justify-center gap-6 rounded-md border p-2 font-sans">
        <h1>uh oh! room not found.</h1>

        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "font-mono")}
        >
          create a room
        </Link>
      </div>
    );
  }

  if (!validationResult.success) {
    return (
      <div className="mt-4 flex h-[340px] w-full flex-col items-center justify-center gap-6 rounded-md border p-2 font-sans">
        <h1>please choose a valid username to chat!</h1>

        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "font-mono")}
        >
          join room
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full rounded-md border p-2 font-mono">
      <ChatHeader roomId={roomId} />

      <ChatMessages roomId={roomId} />

      <ChatFooter roomId={roomId} />
    </div>
  );
}
