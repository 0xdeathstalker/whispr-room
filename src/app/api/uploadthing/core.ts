import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  mediaUploader: f({
    image: { maxFileSize: "4MB" },
    video: { maxFileSize: "16MB" },
    audio: { maxFileSize: "8MB" },
    pdf: { maxFileSize: "16MB" },
    text: { maxFileSize: "4MB" },
    blob: { maxFileSize: "16MB" },
  })
    .input(
      z.object({
        roomId: z.string(),
        username: z.string(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { roomId: input.roomId, username: input.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        uploadedBy: metadata.username,
        roomId: metadata.roomId,
        type: file.type,
        url: file.ufsUrl,
        name: file.name,
        size: file.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
