
import React, { useState } from "react";
import { useYoutubeInfo } from "@/hooks/useYoutubeInfo";
import { useDownload } from "@/hooks/useDownload";
import UrlInput from "@/components/UrlInput";
import FormatSelector, { DownloadFormat, VideoQuality } from "@/components/FormatSelector";
import VideoPreview from "@/components/VideoPreview";
import DownloadButton from "@/components/DownloadButton";
import NavigationBar from "@/components/NavigationBar";
import EmptyState from "@/components/EmptyState";
import { SearchX } from "lucide-react";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<DownloadFormat>("video");
  const [quality, setQuality] = useState<VideoQuality>("720p");
  
  const { videoInfo, isLoading, fetchVideoInfo } = useYoutubeInfo();
  const { isDownloading, downloadContent } = useDownload();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleUrlSubmit = async (submittedUrl: string) => {
    setUrl(submittedUrl);
    await fetchVideoInfo(submittedUrl);
  };
  
  const handleFormatChange = (newFormat: DownloadFormat) => {
    setFormat(newFormat);
  };
  
  const handleQualityChange = (newQuality: VideoQuality) => {
    setQuality(newQuality);
  };
  
  const handleDownload = async () => {
    if (!videoInfo || !url) return;
    
    if (!user) {
      toast.error("Você precisa estar logado para baixar conteúdo", {
        description: "Faça login para continuar",
        action: {
          label: "Login",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }
    
    await downloadContent({
      format,
      quality,
      videoInfo,
      url
    });
  };
  
  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-main text-transparent bg-clip-text">
            Media Flare
          </h1>
          
          <UserMenu />
        </div>
        
        <p className="text-muted-foreground mb-8">
          Baixe vídeos e músicas do YouTube facilmente
        </p>
        
        <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
        
        {videoInfo ? (
          <div className="space-y-6 animate-fade-in">
            <VideoPreview
              title={videoInfo.title}
              thumbnailUrl={videoInfo.thumbnailUrl}
              author={videoInfo.author}
              duration={videoInfo.duration}
              isLoading={isLoading}
            />
            
            <FormatSelector
              onFormatChange={handleFormatChange}
              onQualityChange={handleQualityChange}
              selectedFormat={format}
              selectedQuality={quality}
            />
            
            <DownloadButton
              onClick={handleDownload}
              isLoading={isDownloading}
              isDisabled={!videoInfo}
              format={format}
              quality={quality}
            />
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title="Nenhum vídeo selecionado"
            description="Cole uma URL do YouTube para começar. A pré-visualização do vídeo aparecerá aqui."
          />
        )}
      </div>
      <NavigationBar />
    </div>
  );
};

export default Index;
