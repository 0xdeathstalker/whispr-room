"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Send } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";
import { api } from "../../../../convex/_generated/api";

export default function ChatFooter(props: { roomId: string }) {
  const [message, setMessage] = React.useState<string>("");

  const [username] = useQueryState("username", { defaultValue: "" });

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
        className="font-mono text-sm placeholder:font-mono"
        disabled={isSendMessagePending}
        onKeyDown={(e) => e.key === "Enter" && sendMessage({ roomId: props.roomId, username, content: message })}
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
