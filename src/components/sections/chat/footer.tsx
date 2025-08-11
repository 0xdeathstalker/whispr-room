"use client";

import MediaUpload from "@/components/sections/chat/media-upload";
import { motion } from "motion/react";
import SendButton from "@/components/sections/chat/send-button";
import { Input } from "@/components/ui/input";
import { useUploadThing } from "@/context/uploadthing-provider";
import type { ButtonState, Media } from "@/lib/types";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { usePostHog } from "posthog-js/react";
import * as React from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";

export default function ChatFooter(props: { roomId: string }) {
  const posthog = usePostHog();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [message, setMessage] = React.useState<string>("");
  const [media, setMedia] = React.useState<Media>({ url: "", type: "", name: "", size: 0 });
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  const [uploadButtonState, setUploadButtonState] = React.useState<ButtonState>("idle");
  const [sendButtonState, setSendButtonState] = React.useState<ButtonState>("idle");

  const [username] = useQueryState("username", { defaultValue: "" });

  const { data: messages } = useQuery(convexQuery(api.messages.getMessages, { roomId: props.roomId }));

  const { mutate: sendMessage, isPending: isSendMessagePending } = useMutation({
    mutationKey: ["sendMessage", message, media.url],
    mutationFn: useConvexMutation(api.messages.sendMessage),
    onSuccess: () => {
      setMessage("");
      setMedia({ url: "", type: "", name: "", size: 0 });
      setUploadButtonState("success");
      setSendButtonState("success");

      posthog.capture("message_sent", { roomId: props.roomId, username });
    },
    onError: (error) => {
      setUploadButtonState("idle");
      setSendButtonState("idle");

      posthog.capture("message_sent_failed", { roomId: props.roomId, username, error: error.message });
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

        posthog.capture("media_uploaded", { roomId: props.roomId, username });
      }
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      toast.error(`upload failed: ${error.message}`);

      posthog.capture("media_upload_failed", { roomId: props.roomId, username, error: error.message });
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

  const canSendMessage = Boolean((message.trim() || media.url) && !isSendMessagePending);
  const isUploadDisabled = isUploading || isSendMessagePending;

  const lastMessageIndex = messages ? messages.length : 0;

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

      <div className="relative flex w-full items-center overflow-hidden">
        <Input
          ref={inputRef}
          type="text"
          placeholder="type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="font-mono text-sm placeholder:font-mono"
          disabled={isSendMessagePending}
          onKeyDown={handleKeyDown}
        />
        <motion.div
          key={lastMessageIndex}
          layout="position"
          layoutId={`message-${lastMessageIndex}`}
          className="pointer-events-none absolute left-[13px] -z-10 text-sm text-nowrap break-words [word-break:break-word] text-transparent"
          initial={{ opacity: 0.6, zIndex: -1 }}
          animate={{ opacity: 0.6, zIndex: -1 }}
          exit={{ opacity: 1, zIndex: 1 }}
        >
          <span>{message}</span>
        </motion.div>
      </div>

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
