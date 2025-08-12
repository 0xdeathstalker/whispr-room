"use client";

import { LoaderCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import type { ButtonState } from "@/lib/types";

const BUTTON_STATES = {
  idle: <Send className="h-3 w-3" />,
  loading: <LoaderCircle className="h-3 w-3 animate-spin" />,
  success: <Send className="h-3 w-3" />,
};

type SendButtonProps = {
  buttonState: ButtonState;
  setButtonState: React.Dispatch<React.SetStateAction<ButtonState>>;
  canSendMessage: boolean;
  handleSendMessage: () => void;
  isSendMessagePending: boolean;
};

export default function SendButton({
  buttonState,
  setButtonState,
  isSendMessagePending,
  canSendMessage,
  handleSendMessage,
}: SendButtonProps) {
  React.useEffect(() => {
    if (isSendMessagePending) setButtonState("loading");
  }, [isSendMessagePending]);

  return (
    <Button
      size="icon"
      disabled={!canSendMessage}
      onClick={handleSendMessage}
    >
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
    </Button>
  );
}
