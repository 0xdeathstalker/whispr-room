import { usePostHog } from "posthog-js/react";
import * as React from "react";
import { toast } from "sonner";
import { useUploadThing } from "@/context/uploadthing-provider";
import type { ButtonState, Media } from "@/lib/types";

type UseMediaUploadProps = {
  roomId: string;
  username: string;
};

export default function useMediaUpload({ roomId, username }: UseMediaUploadProps) {
  const posthog = usePostHog();

  const [media, setMedia] = React.useState<Media>({ url: "", type: "", name: "", size: 0 });
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [uploadButtonState, setUploadButtonState] = React.useState<ButtonState>("idle");

  const { startUpload } = useUploadThing("mediaUploader", {
    onUploadBegin: () => {
      setIsUploading(true);
    },
    onClientUploadComplete: (response) => {
      if (response[0]) {
        setIsUploading(false);
        const file = response[0];
        setMedia({ url: file.ufsUrl, type: file.type, name: file.name, size: file.size });
        setUploadButtonState("success");
        toast.success("uploaded successfully!");

        posthog.capture("media_uploaded", { roomId, username });
      }
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      toast.error(`upload failed: ${error.message}`);

      posthog.capture("media_upload_failed", { roomId, username, error: error.message });
    },
  });

  return {
    startUpload,
    isUploading,
    media,
    setMedia,
    buttonState: uploadButtonState,
    setButtonState: setUploadButtonState,
  };
}
