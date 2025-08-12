"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { PostHogProvider } from "./posthog-provider";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import UploadThingProvider from "./uploadthing-provider";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
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
    </PostHogProvider>
  );
}
