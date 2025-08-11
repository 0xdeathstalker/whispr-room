"use client";

import { motion } from "motion/react";
import Chat from "@/components/sections/chat";
import { Hero } from "@/components/sections/main-content";

export default function ChatContent({ roomId }: { roomId: string }) {
  return (
    <motion.div
      layout="size"
      layoutId="app-container"
      className="mx-auto flex h-fit w-full max-w-md flex-col items-center justify-between rounded-md border p-7 shadow-lg sm:max-w-lg sm:p-14 dark:shadow-none"
    >
      <Hero />

      <Chat roomId={roomId} />
    </motion.div>
  );
}
