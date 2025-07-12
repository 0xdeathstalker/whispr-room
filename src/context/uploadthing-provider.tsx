import { generateReactHelpers } from "@uploadthing/react";
import { type OurFileRouter } from "@/app/api/uploadthing/core";
import * as React from "react";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

export default function UploadThingProvider({ children }: { children: React.ReactNode }) {
  return <React.Fragment>{children}</React.Fragment>;
}
