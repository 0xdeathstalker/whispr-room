"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useScramble } from "use-scramble";
import { useCopyToClipboard } from "usehooks-ts";

export default function RoomId({ roomId }: { roomId: string }) {
  const [, copy] = useCopyToClipboard();

  const { ref, replay } = useScramble({
    text: `#${roomId}`,
    speed: 0.4,
  });

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="flex items-center gap-1" onClick={() => copy(roomId)}>
          <h1 ref={ref} onMouseOver={replay} onFocus={replay} />
          {/* <CopyButton textToCopy={roomId} /> */}
        </div>
      </TooltipTrigger>
      <TooltipContent className="font-sans">click to copy</TooltipContent>
    </Tooltip>
  );
}
