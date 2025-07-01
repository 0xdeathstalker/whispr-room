"use client";

import { type ReactNode } from "react";
import QueryProvider from "./query-provider";

export default function Provider({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
