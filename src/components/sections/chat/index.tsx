"use client";

import Link from "next/link";
import { useQueryState } from "nuqs";
import ChatFooter from "@/components/sections/chat/footer";
import ChatHeader from "@/components/sections/chat/header";
import ChatMessages from "@/components/sections/chat/messages";
import { buttonVariants } from "@/components/ui/button";
import { LeaveRoomContextProvider } from "@/context/leave-context";
import useRoomQuery from "@/lib/hooks/useRoomQuery";
import { cn } from "@/lib/utils";
import { formSchema } from "@/lib/validation/room";
import useParticipantsQuery from "@/lib/hooks/useParticipantsQuery";

export default function Chat({ roomId }: { roomId: string }) {
  const [username] = useQueryState("username", { defaultValue: "" });

  const validationResult = formSchema.safeParse({ username, roomId });

  const { data: room, isLoading } = useRoomQuery({ roomId });
  const { data: participants, isLoading: isParticipantsLoading } = useParticipantsQuery({ roomId });

  const isUsernameParticipant = participants?.find((p) => p.username === username);

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

  if (!isParticipantsLoading && !isUsernameParticipant) {
    return (
      <div className="mt-4 flex h-[340px] w-full flex-col items-center justify-center gap-6 rounded-md border p-2 font-sans">
        <h1>uh oh! you're not in this room.</h1>

        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "font-mono")}
        >
          please join the room
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
      <LeaveRoomContextProvider>
        <ChatHeader roomId={roomId} />

        <ChatMessages roomId={roomId} />

        <ChatFooter roomId={roomId} />
      </LeaveRoomContextProvider>
    </div>
  );
}
