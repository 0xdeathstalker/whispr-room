"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle, LoaderCircle } from "lucide-react";
import * as React from "react";

type MediaContentProps = {
  mediaUrl: string;
  mediaType: string;
};

export default function MediaContent({ mediaUrl, mediaType }: MediaContentProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleMediaLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleMediaError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleMediaLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const renderLoadingState = () => (
    <Skeleton className="flex h-36 w-full animate-pulse items-center justify-center rounded-md bg-black/30" />
  );

  const renderErrorState = (type: string) => (
    <div className="bg-muted flex h-48 w-full items-center justify-center rounded-md">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="text-destructive h-6 w-6" />
        <span className="text-muted-foreground text-xs">Failed to load {type}</span>
      </div>
    </div>
  );

  const renderImage = () => (
    <div className="relative">
      {isLoading && renderLoadingState()}
      {hasError && renderErrorState("image")}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mediaUrl}
        alt="shared image"
        className={cn("max-h-48 max-w-full rounded-md object-contain", isLoading || hasError ? "hidden" : "")}
        onLoad={handleMediaLoad}
        onError={handleMediaError}
        onLoadStart={handleMediaLoadStart}
      />
    </div>
  );

  const renderVideo = () => (
    <div className="relative">
      {isLoading && renderLoadingState()}
      {hasError && renderErrorState("video")}
      <video
        src={mediaUrl}
        controls
        className={cn("max-h-48 max-w-full rounded-md", isLoading || hasError ? "hidden" : "")}
        onLoadStart={handleMediaLoadStart}
        onCanPlay={handleMediaLoad}
        onError={handleMediaError}
      >
        Your browser does not support the video tag
      </video>
    </div>
  );

  const renderAudio = () => (
    <div className="relative">
      {isLoading && (
        <div className="bg-muted flex h-16 w-full items-center justify-center rounded-md">
          <div className="flex flex-col items-center gap-2">
            <LoaderCircle className="text-muted-foreground h-4 w-4 animate-spin" />
            <span className="text-muted-foreground text-xs">Loading audio...</span>
          </div>
        </div>
      )}
      {hasError && (
        <div className="bg-muted flex h-16 w-full items-center justify-center rounded-md">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="text-destructive h-4 w-4" />
            <span className="text-muted-foreground text-xs">Failed to load audio</span>
          </div>
        </div>
      )}
      <audio
        src={mediaUrl}
        controls
        className={cn("w-full", isLoading || hasError ? "hidden" : "")}
        onLoadStart={handleMediaLoadStart}
        onCanPlay={handleMediaLoad}
        onError={handleMediaError}
      >
        Your browser does not support the audio tag
      </audio>
    </div>
  );

  if (mediaType.startsWith("image/")) {
    return renderImage();
  } else if (mediaType.startsWith("video/")) {
    return renderVideo();
  } else if (mediaType.startsWith("audio/")) {
    return renderAudio();
  }

  return (
    <div className="bg-muted flex h-16 w-full items-center justify-center rounded-md">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="text-destructive h-4 w-4" />
        <span className="text-muted-foreground text-xs">Unsupported media type</span>
      </div>
    </div>
  );
}
