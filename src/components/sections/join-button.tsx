"use client";

import { Button } from "@/components/ui/button";
import type { ButtonState } from "@/lib/types";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

const BUTTON_STATES = {
  idle: (
    <React.Fragment>
      <ArrowRight className="xs:hidden h-3 w-3" />
      <span className="xs:inline hidden">join</span>
    </React.Fragment>
  ),
  loading: <LoaderCircle className="animate-spin" />,
  success: (
    <React.Fragment>
      <Check className="xs:hidden h-3 w-3" />
      <span className="xs:inline hidden">joining</span>
    </React.Fragment>
  ),
};

type JoinButtonProps = {
  buttonState: ButtonState;
  setButtonState: React.Dispatch<React.SetStateAction<ButtonState>>;
  isJoinRoomMutationPending: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function JoinButton({
  buttonState,
  setButtonState,
  isJoinRoomMutationPending,
  onClick,
}: JoinButtonProps) {
  React.useEffect(() => {
    if (isJoinRoomMutationPending) setButtonState("loading");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoinRoomMutationPending]);

  return (
    <Button
      variant="outline"
      className="relative w-full overflow-hidden"
      disabled={isJoinRoomMutationPending}
      onClick={onClick}
    >
      <AnimatePresence
        initial={false}
        mode="popLayout"
      >
        <motion.span
          key={buttonState}
          initial={{ y: -100, filter: "blur(12px)", opacity: 0 }}
          animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
          exit={{ y: 100, filter: "blur(12px)", opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        >
          {BUTTON_STATES[buttonState]}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
