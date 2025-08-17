"use client";

import CopyButton from "@/components/copy-button";
import { useScramble } from "use-scramble";
import { useCopyToClipboard } from "usehooks-ts";

export default function RoomId({ roomId }: { roomId: string }) {
  const [, copy] = useCopyToClipboard();

  const { ref, replay } = useScramble({
    text: `#${roomId}`,
    speed: 0.4,
  });

  return (
    <div className="flex items-center gap-1" onClick={() => copy(roomId)}>
      <h1
        ref={ref}
        onMouseOver={replay}
        onFocus={replay}
        className="cursor-pointer"
      />
      <CopyButton textToCopy={roomId} />
    </div>
  );
}
