"use client";

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { api } from "../../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Send } from "lucide-react";

export default function ChatFooter(props: { roomId: string }) {
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
        className="font-mono text-sm placeholder:font-mono"
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
