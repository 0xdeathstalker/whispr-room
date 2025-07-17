"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useCopyToClipboard } from "usehooks-ts";

type CopyButtonProps = {
  textToCopy: string | undefined;
  children?: React.ReactNode;
};

export default function CopyButton({ textToCopy, children }: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const [, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    if (!textToCopy) {
      console.error("No text to copy");
      return;
    }

    const success = await copy(textToCopy);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <button
      className="dark:hover:bg-accent/50 hover:bg-accent hover:text-accent-foreground inline-flex size-5 cursor-pointer items-center justify-center rounded-sm"
      onClick={handleCopy}
    >
      <AnimatePresence
        mode="popLayout"
        initial={false}
      >
        {isCopied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          >
            <CheckIcon className="text-muted-foreground h-3 w-3" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          >
            <CopyIcon className="text-muted-foreground h-3 w-3" />
          </motion.span>
        )}
        {children}
      </AnimatePresence>
    </button>
  );
}
