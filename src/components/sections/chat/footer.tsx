"use client";

import MediaUpload from "@/components/sections/chat/media-upload";
import SendButton from "@/components/sections/chat/send-button";
import useMediaUpload from "@/lib/hooks/useMediaUpload";
import type { ButtonState } from "@/lib/types";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { usePostHog } from "posthog-js/react";
import * as React from "react";
import { api } from "../../../../convex/_generated/api";
import InputMorph from "../input-morph";

export default function ChatFooter(props: { roomId: string }) {
  const posthog = usePostHog();

  const [newMessage, setNewMessage] = React.useState<string>("");
  const [sendButtonState, setSendButtonState] = React.useState<ButtonState>("idle");

  const [username] = useQueryState("username", { defaultValue: "" });

  const {
    media,
    setMedia,
    isUploading,
    startUpload,
    buttonState: uploadButtonState,
    setButtonState: setUploadButtonState,
  } = useMediaUpload({ roomId: props.roomId, username });

  const { mutate: sendMessage, isPending: isSendMessagePending } = useMutation({
    mutationKey: ["sendMessage", newMessage, media.url],
    mutationFn: useConvexMutation(api.messages.sendMessage),
    onSuccess: () => {
      setNewMessage("");
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

  const handleFileSelect = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      void startUpload(Array.from(files), { roomId: props.roomId, username });
    },
    [startUpload, props.roomId, username],
  );

  function handleSendMessage() {
    if (!newMessage.trim() && !media.url) return;

    sendMessage({
      roomId: props.roomId,
      username,
      content: newMessage,
      mediaUrl: media.url ?? undefined,
      mediaType: media.type ?? undefined,
      mediaName: media.name ?? undefined,
      mediaSize: media.size ?? undefined,
    });
  }

  const canSendMessage = Boolean((newMessage.trim() || media.url) && !isSendMessagePending);
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

      <InputMorph
        newMessage={newMessage}
        roomId={props.roomId}
        setNewMessage={setNewMessage}
        isSendMessagePending={isSendMessagePending}
        sendMessage={handleSendMessage}
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
