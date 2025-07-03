"use client";

import { useTimer } from "@/lib/hooks/useTimer";
import { formatTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Timer({ startTimestamp, stopTimestamp }: { startTimestamp: number; stopTimestamp: number }) {
  const router = useRouter();

  const { timeLeft } = useTimer({ startTimestamp, stopTimestamp, onExpire: () => router.push("/") });

  return <span>{formatTime(timeLeft)}</span>;
}
