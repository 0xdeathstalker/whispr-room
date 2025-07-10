"use client";

import { buttonVariants } from "@/components/ui/button";
import { useRoomLeave } from "@/lib/hooks/useRoomLeave";
import { cn } from "@/lib/utils";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { api } from "../../../../convex/_generated/api";
import ChatFooter from "./footer";
import ChatHeader from "./header";
import ChatMessages from "./messages";

export default function Chat({ roomId }: { roomId: string }) {
  const [username] = useQueryState("username", { defaultValue: "" });

  const { data: room, isLoading } = useQuery({
    ...convexQuery(api.rooms.getRoom, { roomId }),
    retry: false,
  });

  useRoomLeave({ roomId, username });

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

  return (
    <div className="mt-4 w-full rounded-md border p-2 font-mono">
      <ChatHeader roomId={roomId} />

      <ChatMessages roomId={roomId} />

      <ChatFooter roomId={roomId} />
    </div>
  );
}
