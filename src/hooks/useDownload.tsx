
import { useState } from "react";
import { downloadYoutubeContent, getDownloadHistory, deleteFromHistory, clearAllHistory } from "@/services/youtubeDownloadService";
import { HistoryItemType } from "@/components/HistoryItem";

interface DownloadOptions {
  format: "video" | "audio";
  quality?: "1080p" | "720p" | "480p" | "360p";
  videoInfo: {
    title: string;
    thumbnailUrl: string;
    author: string;
    duration: string;
  };
  url: string;
}

export function useDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadContent = async (options: DownloadOptions) => {
    setIsDownloading(true);
    
    try {
      // Usa o serviço que simula integração com youtube-dl
      const result = await downloadYoutubeContent(options);
      return result;
    } catch (error) {
      console.error("Erro ao baixar conteúdo:", error);
      return null;
    } finally {
      setIsDownloading(false);
    }
  };
  
  return { isDownloading, downloadContent };
}

// Re-exportar funções de histórico para manter compatibilidade
export { 
  getDownloadHistory, 
  deleteFromHistory, 
  clearAllHistory 
};
