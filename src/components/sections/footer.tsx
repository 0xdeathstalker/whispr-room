"use client";

import { Label } from "@/components/ui/label";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Footer() {
  const { theme, setTheme } = useTheme();

  function handleToggle() {
    const getSystemTheme = () => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const currentEffectiveTheme = theme === "system" ? getSystemTheme() : theme;

    if (currentEffectiveTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0 }}
      className="text-muted-foreground absolute bottom-0 flex w-full items-center justify-between border-t px-5 py-2 font-sans sm:px-10"
    >
      <Label className="text-xs">
        Developed by
        <Link
          href="https://deathstalker.dev"
          target="_blank"
          className="text-muted-foreground hover:text-foreground -ml-1"
        >
          0xdeathstalker
        </Link>
      </Label>

      <span
        className="hover:text-foreground cursor-pointer font-mono text-xs font-medium"
        onClick={handleToggle}
      >
        {theme === "light" ? "light mode" : theme === "dark" ? "dark mode" : "system mode"}
      </span>
    </motion.footer>
  );
}
