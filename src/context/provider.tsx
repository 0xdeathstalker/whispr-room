"use client";

import { type ReactNode } from "react";
import QueryProvider from "./query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </QueryProvider>
  );
}
