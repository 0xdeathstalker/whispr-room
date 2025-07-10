"use client";

import { type ReactNode } from "react";
import QueryProvider from "./query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme-provider";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
}
