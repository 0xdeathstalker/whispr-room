"use client";

import { AnimatePresence, motion } from "motion/react";
import { useQueryState } from "nuqs";
import * as React from "react";
import MediaContent from "@/components/sections/chat/media-content";
import getSystemMessage from "@/lib/actions/getSystemMessage";
import useMessagesQuery from "@/lib/hooks/useMessagesQuery";
import { cn } from "@/lib/utils";

export default function ChatMessages({ roomId }: { roomId: string }) {
  const { data: messages } = useMessagesQuery({ roomId });

  const [username] = useQueryState("username", { defaultValue: "" });
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
      className="bg-background flex h-64 flex-col gap-2 overflow-x-hidden overflow-y-auto border-y px-2 py-3"
    >
      <AnimatePresence mode="wait">
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
              <motion.div
                key={m._id}
                className={cn(
                  "bg-secondary relative flex max-w-[250px] flex-col rounded-md px-3 py-1 pb-[17px] shadow-xs",
                  m.username === username ? "place-self-end" : "place-self-start",
                )}
                layout="position"
                layoutId={`message-${messages.length - 1}`}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              >
                <h3 className="text-muted-foreground text-[10px]">
                  {m.username === username ? null : `@${m.username}`}
                </h3>

                <div className="break-words">
                  {m.content && (
                    <div className="text-secondary-foreground text-sm whitespace-pre-wrap">
                      {m.content}
                      {/* reserve space for timestamp only on the last line of text */}
                      <span
                        aria-hidden
                        className="pointer-events-none mt-1 inline-block h-[1em] min-w-12 align-baseline opacity-0 select-none"
                      />
                    </div>
                  )}
                  {m.mediaUrl && m.mediaType && (
                    <div className="mb-1 w-full">
                      <MediaContent
                        mediaUrl={m.mediaUrl}
                        mediaType={m.mediaType}
                        mediaName={m.mediaName}
                        mediaSize={m.mediaSize}
                      />
                    </div>
                  )}
                </div>

                {m.createdAt && (
                  <span className="text-muted-foreground absolute right-3 bottom-1 text-[10px]">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </motion.div>
            );
          }
        })}
      </AnimatePresence>
    </div>
  );
}
