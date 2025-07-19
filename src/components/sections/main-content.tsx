"use client";

import { motion } from "motion/react";
import Link from "next/link";
import MainForm from "@/components/sections/main-form";

const text = "just create, share, and whisprrr.";

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02, // adjust for speed
    },
  },
};

const child = {
  hidden: { opacity: 0, x: -10, filter: "blur(10px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" },
};

export default function MainContent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", bounce: 0, duration: 1 }}
      className="mx-auto flex h-fit w-full max-w-md flex-col items-center justify-between rounded-md border p-7 shadow-lg sm:max-w-lg sm:p-14 dark:shadow-none"
    >
      <Hero />

      <MainForm />
    </motion.div>
  );
}

export function Hero() {
  return (
    <div>
      <Link
        href="/"
        className="inline-block w-full overflow-y-hidden"
      >
        <motion.h1
          initial={{ opacity: 0, y: 100, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
          }}
          className="text-center font-mono"
        >
          /whisprroom
        </motion.h1>
      </Link>

      <motion.p
        variants={container}
        initial="hidden"
        animate="visible"
        className="text-muted-foreground text-center font-sans text-sm"
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={child}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}
