"use client";

import MediaContent from "@/components/sections/chat/media-content";
import getSystemMessage from "@/lib/actions/getSystemMessage";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import * as React from "react";
import { api } from "../../../../convex/_generated/api";

export default function ChatMessages(props: { roomId: string }) {
  const [username] = useQueryState("username", { defaultValue: "" });

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
      className="bg-background flex h-64 flex-col gap-2 overflow-y-auto border-y px-2 py-3"
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
              {m.content && <div className="text-secondary-foreground text-sm break-words">{m.content}</div>}
              {m.mediaUrl && m.mediaType && (
                <div className="mt-2">
                  <MediaContent
                    mediaUrl={m.mediaUrl}
                    mediaType={m.mediaType}
                  />
                </div>
              )}
            </div>
          );
        }
      })}
    </div>
  );
}
