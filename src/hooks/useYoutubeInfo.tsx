
import { useState } from "react";
import { toast } from "sonner";

interface VideoInfo {
  title: string;
  thumbnailUrl: string;
  author: string;
  duration: string;
}

export function useYoutubeInfo() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // This is a mock function - in a real app this would call an API
  const fetchVideoInfo = async (url: string) => {
    setIsLoading(true);
    
    try {
      // In reality, this would be an API call to get video metadata
      // For now, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Extract video ID from URL
      const videoId = extractYoutubeId(url);
      
      if (!videoId) {
        throw new Error("Invalid YouTube URL");
      }
      
      // Mock data - in a real app this would come from the API
      const mockInfo: VideoInfo = {
        title: "Sample YouTube Video Title - Your download will appear here",
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        author: "YouTube Creator",
        duration: "3:45"
      };
      
      setVideoInfo(mockInfo);
      return mockInfo;
    } catch (error) {
      console.error("Error fetching video info:", error);
      toast.error("Could not fetch video information. Please check the URL and try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { videoInfo, isLoading, fetchVideoInfo };
}

// Helper function to extract YouTube video ID from various URL formats
function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11)
    ? match[2]
    : null;
}
