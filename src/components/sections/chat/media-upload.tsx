import { Button } from "@/components/ui/button";
import { LoaderCircle, Paperclip } from "lucide-react";

type MediaUploadProps = {
  mediaUrl: string;
  isUploading: boolean;
  isDisabled: boolean;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MediaUpload({ mediaUrl, isUploading, isDisabled, handleFileSelect }: MediaUploadProps) {
  return (
    <div className="relative">
      <input
        type="file"
        id="media-upload"
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.ppt,.pptx"
        onChange={handleFileSelect}
        disabled={isDisabled}
      />
      <label htmlFor="media-upload">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isDisabled}
          asChild
        >
          <span>
            {isUploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          </span>
        </Button>
      </label>
      {mediaUrl && (
        <div
          className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500"
          title="File ready to send"
        />
      )}
    </div>
  );
}
