"use client";

import CopyButton from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown, LoaderCircle, Send, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { api } from "../../../convex/_generated/api";
import Timer from "@/components/timer";
import getSystemMessage from "@/lib/actions/getSystemMessage";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = searchParams.get("username") ?? "";

  const { data: participants, isLoading: isParticipantsLoading } = useQuery(
    convexQuery(api.participants.getParticipants, { roomId: props.roomId }),
  );

  const { data: room, isLoading: isRoomLoading } = useQuery(convexQuery(api.rooms.getRoom, { roomId: props.roomId }));

  const { mutate: leaveRoom, isPending: isLeaveRoomMutationPending } = useMutation({
    mutationKey: ["leaveRoom", props.roomId],
    mutationFn: useConvexMutation(api.rooms.leaveRoom),
    onSuccess: () => {
      router.push("/");
    },
  });

  return (
    <div className="flex items-center justify-between px-2 pb-2">
      <div className="flex items-center gap-1">
        <h1>#{props.roomId}</h1>
        <CopyButton textToCopy={props.roomId} />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-muted-foreground inline-flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isParticipantsLoading ? (
                <Skeleton className="h-9 w-14" />
              ) : (
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 rounded-sm px-2 py-1 text-sm"
                >
                  <Users className="h-4 w-4" />
                  {participants?.length}
                  <ChevronDown className="h-2 w-2" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Participants</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {participants ? (
                participants.map((p) => <DropdownMenuItem key={p._id}>{p.username}</DropdownMenuItem>)
              ) : (
                <DropdownMenuItem>No participants</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {isRoomLoading ? (
            <Skeleton className="h-9 w-[74px]" />
          ) : room ? (
            <Button variant="ghost">
              <Timer
                startTimestamp={room.createdAt}
                stopTimestamp={room.expiresAt}
              />
            </Button>
          ) : null}

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/10 hover:text-destructive transition-all ease-in-out"
            onClick={() => leaveRoom({ roomId: props.roomId, username })}
          >
            {isLeaveRoomMutationPending ? (
              <LoaderCircle className="h-3 w-3 animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z"></path>
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatMessages(props: { roomId: string }) {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const { data: messages } = useQuery(convexQuery(api.messages.getMessages, { roomId: props.roomId }));

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex h-64 flex-col gap-2 overflow-y-auto border-y bg-white px-2 py-3"
    >
      {messages?.map((m) => {
        if (m.isSystem) {
          const systemMessage = getSystemMessage({
            username,
            messageContent: m.content,
          });

          return (
            <div
              key={m._id}
              className="text-muted-foreground text-center text-[10px]"
            >
              {systemMessage}
            </div>
          );
        } else {
          return (
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
          );
        }
      })}
    </div>
  );
}

function ChatFooter(props: { roomId: string }) {
  const [message, setMessage] = React.useState<string>("");

  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const { mutate: sendMessage, isPending: isSendMessagePending } = useMutation({
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
        disabled={!message.trim()}
        onClick={() => sendMessage({ roomId: props.roomId, username, content: message })}
      >
        {isSendMessagePending ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
      </Button>
    </div>
  );
}
