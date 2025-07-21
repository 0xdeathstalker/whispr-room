"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode } from "react";
import { LeaveRoomContextProvider } from "./leave-context";
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
            <LeaveRoomContextProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </LeaveRoomContextProvider>
          </UploadThingProvider>
        </NuqsAdapter>
      </QueryProvider>
    </PostHogProvider>
  );
}
