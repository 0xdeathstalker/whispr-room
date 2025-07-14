"use client";

import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

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
    <footer className="text-muted-foreground absolute bottom-0 flex w-full items-center justify-between border-t px-5 py-2 font-sans sm:px-10">
      <Label className="text-xs">
        Developed by{" "}
        <Link
          href="https://github.com/0xdeathstalker"
          target="_blank"
          className="text-muted-foreground hover:text-foreground"
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
    </footer>
  );
}
