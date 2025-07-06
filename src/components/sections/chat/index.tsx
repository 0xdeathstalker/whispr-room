"use client";

import ChatFooter from "./footer";
import ChatHeader from "./header";
import ChatMessages from "./messages";
import { useRoomLeave } from "../../../lib/hooks/useRoomLeave";
import { useQueryState } from "nuqs";

export default function Chat({ roomId }: { roomId: string }) {
  const [username] = useQueryState("username", { defaultValue: "" });

  useRoomLeave(roomId, username);

  return (
    <div className="mt-4 w-full rounded-md border p-2 font-mono">
      <ChatHeader roomId={roomId} />

      <ChatMessages roomId={roomId} />

      <ChatFooter roomId={roomId} />
    </div>
  );
}
