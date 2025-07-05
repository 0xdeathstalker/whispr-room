"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
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
      {isCopied ? (
        <CheckIcon className="text-muted-foreground h-3 w-3" />
      ) : (
        <CopyIcon className="text-muted-foreground h-3 w-3" />
      )}
      {children}
    </button>
  );
}
