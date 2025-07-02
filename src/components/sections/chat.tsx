"use client";

import CopyButton from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown, Send, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Chat({ roomId }: { roomId: string }) {
  return (
    <div className="mt-4 w-full rounded-md border p-2 font-mono">
      <ChatHeader roomId={roomId} />

      <ChatMessages roomId={roomId} />

      <ChatFooter roomId={roomId} />
    </div>
  );
}

function ChatHeader(props: { roomId: string }) {
  const { data: participants, isLoading } = useQuery(
    convexQuery(api.participants.getParticipants, { roomId: props.roomId }),
  );

  return (
    <div className="flex items-center justify-between px-2 pb-2">
      <div className="flex items-center gap-1">
        <h1>#{props.roomId}</h1>
        <CopyButton textToCopy={props.roomId} />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-muted-foreground inline-flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              {isLoading ? (
                <Skeleton className="h-7 w-14" />
              ) : (
                <div className="hover:bg-accent flex items-center gap-1 rounded-sm px-2 py-1 text-sm">
                  <Users className="h-4 w-4" />
                  {participants?.length}
                  <ChevronDown className="h-2 w-2" />
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Participants</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {participants?.map((p) => (
                <DropdownMenuItem key={p._id}>{p.username}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function ChatMessages(props: { roomId: string }) {
  const { data: messages } = useQuery(convexQuery(api.messages.getMessages, { roomId: props.roomId }));

  return (
    <div className="flex h-full max-h-64 flex-col gap-2 overflow-y-auto border-y bg-white px-2 py-3">
      {messages?.map((m) => (
        <div
          key={m._id}
          className="bg-secondary flex flex-col gap-1 rounded-md px-3 py-2 shadow-xs"
        >
          <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs font-semibold">
            <span>@{m.username}</span>
            {m.createdAt && (
              <span className="text-muted-foreground text-[10px]">
                {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <div className="text-secondary-foreground text-sm break-words">{m.content}</div>
        </div>
      ))}
    </div>
  );
}

function ChatFooter(props: { roomId: string }) {
  const [message, setMessage] = React.useState<string>("");

  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage", message],
    mutationFn: useConvexMutation(api.messages.sendMessage),
    onSuccess: () => {
      setMessage("");
    },
  });

  return (
    <div className="flex items-center gap-2 pt-2">
      <Input
        placeholder="type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="font-mono placeholder:font-mono"
      />
      <Button
        size="icon"
        onClick={() => sendMessage({ roomId: props.roomId, username, content: message })}
      >
        <Send className="h-3 w-3" />
      </Button>
    </div>
  );
}
