"use client";

import { useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import * as React from "react";
import { env } from "@/env";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
      defaults: "2025-05-24",
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <React.Suspense>
        <PostHogAuthWrapper>{children}</PostHogAuthWrapper>
      </React.Suspense>
    </PHProvider>
  );
}

function PostHogAuthWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  React.useEffect(() => {
    if (username) {
      posthog.identify(username, {
        username,
      });
    } else {
      posthog.reset();
    }
  }, [username]);

  return children;
}
