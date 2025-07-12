"use client";

import { type ReactNode } from "react";
import QueryProvider from "./query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "./theme-provider";
import UploadThingProvider from "./uploadthing-provider";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <UploadThingProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </UploadThingProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
}
