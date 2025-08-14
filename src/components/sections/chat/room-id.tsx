"use client";

import CopyButton from "@/components/copy-button";
import { useScramble } from "use-scramble";

export default function RoomId({ roomId }: { roomId: string }) {
  const { ref, replay } = useScramble({
    text: `#${roomId}`,
    speed: 0.4,
  });

  return (
    <div className="flex items-center gap-1">
      <h1
        ref={ref}
        onMouseOver={replay}
        onFocus={replay}
      />
      <CopyButton textToCopy={roomId} />
    </div>
  );
}
