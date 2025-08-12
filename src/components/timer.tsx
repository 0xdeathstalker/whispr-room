"use client";

import { useRouter } from "next/navigation";
import { useTimer } from "@/lib/hooks/useTimer";
import { cn, formatTime } from "@/lib/utils";

export default function Timer({ startTimestamp, stopTimestamp }: { startTimestamp: number; stopTimestamp: number }) {
  const router = useRouter();

  const { timeLeft } = useTimer({ startTimestamp, stopTimestamp, onExpire: () => router.push("/") });

  return <span className={cn(timeLeft <= 30 ? "text-red-500" : "", "text-xs sm:text-sm")}>{formatTime(timeLeft)}</span>;
}
