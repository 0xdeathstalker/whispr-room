"use client";

import MediaUpload from "@/components/sections/chat/media-upload";
import SendButton from "@/components/sections/chat/send-button";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/context/uploadthing-provider";
import type { ButtonState, Media } from "@/lib/types";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import * as React from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";

export default function ChatFooter(props: { roomId: string }) {
  const [message, setMessage] = React.useState<string>("");
  const [media, setMedia] = React.useState<Media>({ url: "", type: "", name: "", size: 0 });
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const [uploadButtonState, setUploadButtonState] = React.useState<ButtonState>("idle");
  const [sendButtonState, setSendButtonState] = React.useState<ButtonState>("idle");

  const [username] = useQueryState("username", { defaultValue: "" });

  const { mutate: sendMessage, isPending: isSendMessagePending } = useMutation({
    mutationKey: ["sendMessage", message, media.url],
    mutationFn: useConvexMutation(api.messages.sendMessage),
    onSuccess: () => {
      setMessage("");
      setMedia({ url: "", type: "", name: "", size: 0 });
      setUploadButtonState("success");
      setSendButtonState("success");
    },
    onError: () => {
      setUploadButtonState("idle");
      setSendButtonState("idle");
    },
  });

  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: (response) => {
      setIsUploading(false);
      if (response[0]) {
        const file = response[0];
        setMedia({ url: file.ufsUrl, type: file.type, name: file.name, size: file.size });
        setUploadButtonState("success");
        toast.success("uploaded successfully!");
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
    if (!message.trim() && !media.url) return;

    sendMessage({
      roomId: props.roomId,
      username,
      content: message,
      mediaUrl: media.url ?? undefined,
      mediaType: media.type ?? undefined,
      mediaName: media.name ?? undefined,
      mediaSize: media.size ?? undefined,
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  const canSendMessage = Boolean((message.trim() || media.url) && !isSendMessagePending);
  const isUploadDisabled = isUploading || isSendMessagePending;

  return (
    <div className="flex items-center gap-2 pt-2">
      <MediaUpload
        mediaUrl={media.url}
        isUploading={isUploading}
        isDisabled={isUploadDisabled}
        handleFileSelect={handleFileSelect}
        buttonState={uploadButtonState}
        setButtonState={setUploadButtonState}
      />

      <Input
        placeholder="type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="font-mono text-sm placeholder:font-mono"
        disabled={isSendMessagePending}
        onKeyDown={handleKeyDown}
      />

      <SendButton
        buttonState={sendButtonState}
        setButtonState={setSendButtonState}
        canSendMessage={canSendMessage}
        isSendMessagePending={isSendMessagePending}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
