"use client";

import { LoaderCircle, Paperclip } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import type { ButtonState } from "@/lib/types";

type MediaUploadProps = {
  mediaUrl: string;
  isUploading: boolean;
  isDisabled: boolean;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  buttonState: ButtonState;
  setButtonState: React.Dispatch<React.SetStateAction<ButtonState>>;
};

const BUTTON_STATES = {
  idle: <Paperclip className="h-4 w-4" />,
  loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
  success: <Paperclip className="h-4 w-4" />,
};

export default function MediaUploadInput({
  mediaUrl,
  isUploading,
  isDisabled,
  handleFileSelect,
  buttonState,
  setButtonState,
}: MediaUploadProps) {
  React.useEffect(() => {
    if (isUploading) setButtonState("loading");
  }, [isUploading]);

  return (
    <div className="relative">
      <input
        type="file"
        id="media-upload"
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.ppt,.pptx"
        onChange={handleFileSelect}
        disabled={isDisabled}
      />
      <label htmlFor="media-upload">
        <Button
          variant="outline"
          size="icon"
          disabled={isDisabled}
          asChild
        >
          <div>
            <AnimatePresence
              mode="popLayout"
              initial={false}
            >
              <motion.span
                key={buttonState}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              >
                {BUTTON_STATES[buttonState]}
              </motion.span>
            </AnimatePresence>
          </div>
        </Button>
      </label>
      {mediaUrl && (
        <div
          className="bg-primary absolute -top-1 -right-1 h-3 w-3 rounded-full"
          title="File ready to send"
        />
      )}
    </div>
  );
}
