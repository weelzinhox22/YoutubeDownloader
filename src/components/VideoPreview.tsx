
import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoPreviewProps {
  title: string;
  thumbnailUrl: string;
  author: string;
  duration: string;
  isLoading: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  title,
  thumbnailUrl,
  author,
  duration,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-3 py-3">
        <Skeleton className="h-[180px] w-full rounded-lg" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-hidden card-shine rounded-lg animate-fade-in">
      <div className="relative aspect-video">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded-md text-xs">
          {duration}
        </div>
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
      </div>
    </div>
  );
};

export default VideoPreview;
