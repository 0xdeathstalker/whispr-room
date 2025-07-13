"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertCircle, Download, ExternalLink, File, FileSpreadsheet, FileText } from "lucide-react";
import Link from "next/link";
import * as React from "react";

type MediaContentProps = {
  mediaUrl: string;
  mediaType: string;
  mediaName: string | undefined;
  mediaSize: number | undefined;
};

function getDocIcon(type: string) {
  if (type.includes("word")) return <FileText className="h-6 w-6" />;
  if (type.includes("excel") || type.includes("spreadsheet")) return <FileSpreadsheet className="h-6 w-6" />;
  if (type.includes("powerpoint") || type.includes("presentation")) return <FileText className="h-6 w-6" />;
  if (type.includes("pdf")) return <FileText className="h-6 w-6" />;
  if (type.includes("csv")) return <FileSpreadsheet className="h-6 w-6" />;
  if (type.startsWith("text/")) return <FileText className="h-6 w-6" />;
  return <File className="h-6 w-6" />;
}

function getDocLabel(type: string) {
  if (type.includes("word")) return "Microsoft Word Document";
  if (type.includes("excel") || type.includes("spreadsheet")) return "Microsoft Excel Spreadsheet";
  if (type.includes("powerpoint") || type.includes("presentation")) return "PowerPoint Presentation";
  if (type.includes("pdf")) return "PDF Document";
  if (type.includes("csv")) return "CSV File";
  if (type.startsWith("text/")) return "Text File";
  return "Document";
}

function formatSize(size?: number) {
  if (!size) return "Unknown size";
  if (size > 1e6) return (size / 1e6).toFixed(1) + " MB";
  if (size > 1e3) return (size / 1e3).toFixed(1) + " KB";
  return size + " bytes";
}

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

  // Document preview card for docs (not images, video, audio)
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
      <div className="bg-muted flex flex-col gap-2 rounded-md p-3">
        <div className="flex items-center gap-3">
          {getDocIcon(mediaType)}
          <div>
            <div className="mb-1 text-sm font-medium break-all">{mediaName ?? "Document"}</div>
            <div className="text-muted-foreground text-xs">
              {formatSize(mediaSize)}, {getDocLabel(mediaType)}
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              Open
            </Button>
          </a>
          <Link
            href={mediaUrl}
            target="_blank"
          >
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
            >
              <Download className="mr-1 h-3 w-3" />
              Save as
            </Button>
          </Link>
        </div>
      </div>
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

  const renderPDF = () => (
    <div className="relative">
      {isLoading && renderLoadingState()}
      {hasError && renderErrorState("PDF")}
      <iframe
        src={mediaUrl}
        className={cn("h-96 w-full rounded-md border", isLoading || hasError ? "hidden" : "")}
        onLoad={handleMediaLoad}
        onError={handleMediaError}
      >
        <p>
          Your browser does not support PDFs.{" "}
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        </p>
      </iframe>
    </div>
  );

  if (mediaType.startsWith("image/")) {
    return renderImage();
  } else if (mediaType.startsWith("video/")) {
    return renderVideo();
  } else if (mediaType.startsWith("audio/")) {
    return renderAudio();
  } else if (mediaType === "application/pdf") {
    return renderPDF();
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
