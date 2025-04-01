
import React from "react";
import { Download, Share2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface HistoryItemType {
  id: string;
  title: string;
  thumbnailUrl: string;
  format: "video" | "audio";
  quality?: string;
  downloadUrl: string;
  timestamp: number;
}

interface HistoryItemProps {
  item: HistoryItemType;
  onDelete: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete }) => {
  const { id, title, thumbnailUrl, format, quality, downloadUrl, timestamp } = item;
  
  const handleDownload = () => {
    window.open(downloadUrl, "_blank");
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this ${format} I downloaded: ${title}`,
          url: downloadUrl
        });
      } else {
        await navigator.clipboard.writeText(downloadUrl);
        toast.success("Download link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing content:", error);
      toast.error("Could not share content");
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };
  
  return (
    <div className="flex flex-col bg-card rounded-lg overflow-hidden animate-fade-in">
      <div className="flex">
        <div className="w-1/3">
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="w-full h-full object-cover aspect-video"
          />
        </div>
        <div className="w-2/3 p-3 space-y-1">
          <h3 className="font-medium line-clamp-2 text-sm">{title}</h3>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className={cn(
              "rounded px-1.5 py-0.5 mr-2",
              format === "video" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"
            )}>
              {format} {quality && `(${quality})`}
            </span>
            <span>{formatDate(timestamp)}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-1 p-2 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleDownload}
        >
          <Download size={14} className="mr-1" /> Download
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleShare}
        >
          <Share2 size={14} className="mr-1" /> Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(id)}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};

export default HistoryItem;
