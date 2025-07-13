"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocIcon, getDocLabel, getDocSize } from "@/lib/actions/getDocActions";
import { cn } from "@/lib/utils";
import { AlertCircle, Download, ExternalLink, File } from "lucide-react";
import Link from "next/link";
import * as React from "react";

type MediaContentProps = {
  mediaUrl: string;
  mediaType: string;
  mediaName: string | undefined;
  mediaSize: number | undefined;
};

type DocumentProps = {
  name: string | undefined;
  size: number | undefined;
  type: string;
  url: string;
};

export default function MediaContent({ mediaUrl, mediaType, mediaName, mediaSize }: MediaContentProps) {
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

  const isDoc =
    mediaType.includes("word") ||
    mediaType.includes("excel") ||
    mediaType.includes("spreadsheet") ||
    mediaType.includes("powerpoint") ||
    mediaType.includes("presentation") ||
    mediaType.includes("pdf") ||
    mediaType.includes("csv") ||
    mediaType.startsWith("text/") ||
    mediaType.includes("document");

  if (isDoc) {
    return (
      <Document
        name={mediaName}
        size={mediaSize}
        type={mediaType}
        url={mediaUrl}
      />
    );
  }

  const renderLoadingState = () => (
    <Skeleton className="flex h-36 w-full animate-pulse items-center justify-center rounded-md bg-black/30" />
  );

  const renderErrorState = (type: string) => (
    <div className="bg-muted flex h-32 w-full items-center justify-center rounded-md">
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
      {isLoading && renderLoadingState()}
      {hasError && renderErrorState("audio")}
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
    <div className="bg-muted flex h-32 w-full items-center justify-center rounded-md">
      <div className="flex flex-col items-center gap-2">
        <File className="h-6 w-6" />
        <span className="text-muted-foreground text-xs">File shared</span>
      </div>
    </div>
  );
}

function Document({ name, size, type, url }: DocumentProps) {
  const DocIcon = getDocIcon(type);
  const docSize = getDocSize(size);
  const docLabel = getDocLabel(type);

  return (
    <div className="bg-muted flex flex-col gap-2 rounded-md p-3">
      <div className="flex items-center gap-3">
        <DocIcon className="text-secondary-foreground/80 h-6 w-6" />
        <div>
          <div className="text-secondary-foreground mb-1 text-sm break-all">{name ?? "Document"}</div>
          <div className="text-muted-foreground text-xs">
            {docSize}, {docLabel}
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="sm"
            variant="outline"
            className="text-secondary-foreground text-xs"
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            Open
          </Button>
        </a>
        <Link
          href={url}
          target="_blank"
        >
          <Button
            size="sm"
            variant="outline"
            className="text-secondary-foreground text-xs"
          >
            <Download className="mr-1 h-3 w-3" />
            Save as
          </Button>
        </Link>
      </div>
    </div>
  );
}
