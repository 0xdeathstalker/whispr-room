"use client";

import CopyButton from "@/components/copy-button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";

export default function Chat({ roomId }: { roomId: string }) {
  return (
    <div className="mt-4 w-full rounded-md border p-2 font-mono">
      <ChatHeader roomId={roomId} />

      <ChatMessages roomId={roomId} />

      <ChatFooter />
    </div>
  );
}

function ChatHeader(props: { roomId: string }) {
  return (
    <div className="flex items-center gap-1 pb-2">
      <h1 className="pl-2">#{props.roomId}</h1>
      <CopyButton textToCopy={props.roomId} />
    </div>
  );
}

function ChatMessages({ roomId }: { roomId: string }) {
  const { data, isLoading } = useQuery(convexQuery(api.messages.getMessages, { roomId }));
  console.log("[data] = ", { data });

  return <div className="min-h-56 border-y" />;
}

function ChatFooter() {
  const [message, setMessage] = React.useState<string>("");

  return (
    <div className="flex items-center gap-3 pt-2">
      <Input
        placeholder="type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="font-mono placeholder:font-mono"
      />
      <Button size="icon">
        <Send className="h-3 w-3" />
      </Button>
    </div>
  );
}
