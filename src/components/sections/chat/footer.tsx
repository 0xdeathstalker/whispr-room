"use client";

import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/context/uploadthing-provider";
import type { ButtonState } from "@/lib/types";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import * as React from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import MediaUpload from "./media-upload";
import SendButton from "./send-button";

export default function ChatFooter(props: { roomId: string }) {
  const [message, setMessage] = React.useState<string>("");
  const [mediaUrl, setMediaUrl] = React.useState<string>("");
  const [mediaType, setMediaType] = React.useState<string>("");
  const [mediaName, setMediaName] = React.useState<string>("");
  const [mediaSize, setMediaSize] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const [uploadButtonState, setUploadButtonState] = React.useState<ButtonState>("idle");
  const [sendButtonState, setSendButtonState] = React.useState<ButtonState>("idle");

  const [username] = useQueryState("username", { defaultValue: "" });

  const { mutate: sendMessage, isPending: isSendMessagePending } = useMutation({
    mutationKey: ["sendMessage", message, mediaUrl],
    mutationFn: useConvexMutation(api.messages.sendMessage),
    onSuccess: () => {
      setMessage("");
      setMediaUrl("");
      setMediaType("");
      setMediaName("");
      setMediaSize(0);
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
        setMediaType(file.type);
        setMediaUrl(file.ufsUrl);
        setMediaSize(file.size);
        setMediaName(file.name);
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
    if (!message.trim() && !mediaUrl) return;

    sendMessage({
      roomId: props.roomId,
      username,
      content: message,
      mediaUrl: mediaUrl ?? undefined,
      mediaType: mediaType ?? undefined,
      mediaName: mediaName ?? undefined,
      mediaSize: mediaSize ?? undefined,
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  const canSendMessage = Boolean((message.trim() || mediaUrl) && !isSendMessagePending);
  const isUploadDisabled = isUploading || isSendMessagePending;

  return (
    <div className="flex items-center gap-2 pt-2">
      <MediaUpload
        mediaUrl={mediaUrl}
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
