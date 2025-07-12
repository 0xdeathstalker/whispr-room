"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Paperclip, Send } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";
import { api } from "../../../../convex/_generated/api";
import { useUploadThing } from "@/context/uploadthing-provider";
import { toast } from "sonner";

export default function ChatFooter(props: { roomId: string }) {
  const [message, setMessage] = React.useState<string>("");
  const [mediaUrl, setMediaUrl] = React.useState<string>("");
  const [mediaType, setMediaType] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const [username] = useQueryState("username", { defaultValue: "" });

  const { mutate: sendMessage, isPending: isSendMessagePending } = useMutation({
    mutationKey: ["sendMessage", message, mediaUrl],
    mutationFn: useConvexMutation(api.messages.sendMessage),
    onSuccess: () => {
      setMessage("");
      setMediaUrl("");
      setMediaType("");
    },
  });

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: (response) => {
      setIsUploading(false);
      if (response[0]) {
        const file = response[0];
        setMediaType(file.type);
        setMediaUrl(file.ufsUrl);
        toast.success("media uploaded successfully!");
      }
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      toast.error(`upload failed: ${error.message}`);
    },
  });

  const handleFileSelect = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsUploading(true);
      void startUpload(Array.from(files), { roomId: props.roomId, username });
    },
    [startUpload, props.roomId, username],
  );

  function handleSendMessage() {
    if (!message.trim() && !mediaUrl) return;

    sendMessage({
      roomId: props.roomId,
      username,
      content: message ?? (mediaUrl ? "Media shared" : ""),
      mediaUrl: mediaUrl ?? undefined,
      mediaType: mediaType ?? undefined,
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") handleSendMessage();
  }

  const canSendMessage = (message.trim() || mediaUrl) && !isSendMessagePending;

  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="relative">
        <input
          type="file"
          id="media-upload"
          className="hidden"
          accept="image/*,video/*,audio/*"
          onChange={handleFileSelect}
          disabled={isUploading || isSendMessagePending}
        />
        <label htmlFor="media-upload">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isUploading || isSendMessagePending}
            asChild
          >
            <span>
              {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
            </span>
          </Button>
        </label>
        {mediaUrl && (
          <div
            className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500"
            title="Media ready to send"
          />
        )}
      </div>

      <Input
        placeholder="type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="font-mono text-sm placeholder:font-mono"
        disabled={isSendMessagePending}
        onKeyDown={handleKeyDown}
      />
      <Button
        size="icon"
        disabled={!canSendMessage}
        onClick={handleSendMessage}
      >
        {isSendMessagePending ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
      </Button>
    </div>
  );
}
