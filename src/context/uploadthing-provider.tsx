import { generateReactHelpers } from "@uploadthing/react";
import * as React from "react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

export default function UploadThingProvider({ children }: { children: React.ReactNode }) {
  return <React.Fragment>{children}</React.Fragment>;
}
