"use client";

import { Button } from "@/components/ui/button";
import type { ButtonState } from "@/lib/types";
import { LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

const BUTTON_STATES = {
  idle: "create a room",
  loading: <LoaderCircle className="animate-spin" />,
  success: "room created! redirecting...",
};

type CreateButtonProps = {
  buttonState: ButtonState;
  setButtonState: React.Dispatch<React.SetStateAction<ButtonState>>;
  isCreateRoomMutationPending: boolean;
};

export default function CreateButton({ buttonState, setButtonState, isCreateRoomMutationPending }: CreateButtonProps) {
  React.useEffect(() => {
    if (isCreateRoomMutationPending) setButtonState("loading");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateRoomMutationPending]);

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={isCreateRoomMutationPending}
    >
      <AnimatePresence
        initial={false}
        mode="popLayout"
      >
        <motion.span
          key={buttonState}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        >
          {BUTTON_STATES[buttonState]}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
