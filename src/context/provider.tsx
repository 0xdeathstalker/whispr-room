"use client";

import { type ReactNode } from "react";
import ConvexClientProvider from "./convex-provider";

export default function Provider({ children }: { children: ReactNode }) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
