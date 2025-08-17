"use client";

import { LoaderCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ButtonState } from "@/lib/types";

const ExitIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    fill="currentColor"
    viewBox="0 0 256 256"
  >
    <path d="M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z"></path>
  </svg>
);

const BUTTON_STATES = {
  idle: ExitIcon,
  loading: <LoaderCircle className="h-3 w-3 animate-spin" />,
  success: ExitIcon,
};

export default function LeaveButton(props: {
  setButtonState: React.Dispatch<React.SetStateAction<ButtonState>>;
  isLeaveRoomMutationPending: boolean;
  buttonState: ButtonState;
  leaveRoom: () => void;
}) {
  React.useEffect(() => {
    if (props.isLeaveRoomMutationPending) props.setButtonState("loading");
  }, [props.isLeaveRoomMutationPending]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10 hover:text-destructive relative hidden size-[32px] overflow-hidden transition-all ease-in-out sm:inline-flex"
        >
          <AnimatePresence
            mode="popLayout"
            initial={false}
          >
            <motion.span
              key={props.buttonState}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            >
              {BUTTON_STATES[props.buttonState]}
            </motion.span>
          </AnimatePresence>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-sans w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="font-sans">
            are you absolutely sure to exit the room?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-8">cancel</AlertDialogCancel>
          <AlertDialogAction
            className="h-8 bg-destructive/80 text-destructive-foreground hover:bg-destructive/50"
            onClick={props.leaveRoom}
          >
            exit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
