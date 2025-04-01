
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Music, Video } from "lucide-react";

export type DownloadFormat = 'video' | 'audio';
export type VideoQuality = '1080p' | '720p' | '480p' | '360p';

interface FormatSelectorProps {
  onFormatChange: (format: DownloadFormat) => void;
  onQualityChange: (quality: VideoQuality) => void;
  selectedFormat: DownloadFormat;
  selectedQuality: VideoQuality;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  onFormatChange,
  onQualityChange,
  selectedFormat,
  selectedQuality
}) => {
  return (
    <div className="w-full space-y-4">
      <Tabs 
        value={selectedFormat} 
        onValueChange={(value) => onFormatChange(value as DownloadFormat)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video size={16} />
            <span>Video (MP4)</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music size={16} />
            <span>Audio (MP3)</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="video" className="mt-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Select quality:</Label>
            <RadioGroup 
              value={selectedQuality} 
              onValueChange={(value) => onQualityChange(value as VideoQuality)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2 bg-secondary/50 rounded-md p-3">
                <RadioGroupItem value="1080p" id="1080p" />
                <Label htmlFor="1080p">1080p (HD)</Label>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/50 rounded-md p-3">
                <RadioGroupItem value="720p" id="720p" />
                <Label htmlFor="720p">720p (HD)</Label>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/50 rounded-md p-3">
                <RadioGroupItem value="480p" id="480p" />
                <Label htmlFor="480p">480p (SD)</Label>
              </div>
              <div className="flex items-center space-x-2 bg-secondary/50 rounded-md p-3">
                <RadioGroupItem value="360p" id="360p" />
                <Label htmlFor="360p">360p (SD)</Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
        
        <TabsContent value="audio" className="mt-4">
          <p className="text-sm text-muted-foreground">
            Audio will be downloaded in the best available MP3 quality.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormatSelector;
