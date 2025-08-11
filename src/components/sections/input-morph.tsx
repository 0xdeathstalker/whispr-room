"use client";

import { Input } from "@/components/ui/input";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import * as React from "react";
import { api } from "../../../convex/_generated/api";

type InputMorphProps = {
  newMessage: string;
  roomId: string;
  isSendMessagePending: boolean;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
};

export default function InputMorph({
  newMessage,
  roomId,
  isSendMessagePending,
  setNewMessage,
  sendMessage,
}: InputMorphProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { data: messages } = useQuery(convexQuery(api.messages.getMessages, { roomId }));

  const lastMessageIndex = messages ? messages.length : 0;

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  React.useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      // ignore if input is already focused or if modifier keys are pressed
      if (
        document.activeElement === inputRef.current ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.key.length !== 1 // only printable characters
      ) {
        return;
      }

      inputRef.current?.focus();
    }
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="relative flex w-full items-center overflow-hidden">
      <Input
        ref={inputRef}
        type="text"
        placeholder="type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="font-mono text-sm placeholder:font-mono"
        disabled={isSendMessagePending}
        onKeyDown={handleKeyDown}
      />
      <motion.div
        key={lastMessageIndex}
        layout="position"
        layoutId={`message-${lastMessageIndex}`}
        className="pointer-events-none absolute left-[13px] z-20 text-sm text-nowrap break-words [word-break:break-word] text-transparent"
        initial={{ opacity: 0.6, zIndex: 1 }}
        animate={{ opacity: 0.6, zIndex: 1 }}
        exit={{ opacity: 1, zIndex: 1 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
      >
        <span>{newMessage}</span>
      </motion.div>
    </div>
  );
}
