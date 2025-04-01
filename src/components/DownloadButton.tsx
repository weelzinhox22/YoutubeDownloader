
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface DownloadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  format?: "video" | "audio";
  quality?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  onClick,
  isLoading,
  isDisabled,
  format = "video",
  quality
}) => {
  // Simulação de progresso (em uma implementação real, isso viria do backend)
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading) {
      // Resetar o progresso quando começa a carregar
      setProgress(0);
      
      // Simular avanço do progresso durante o download
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 15;
          const newValue = prev + increment;
          // Máximo de 95% para simular que ainda está processando
          return newValue > 95 ? 95 : newValue;
        });
      }, 300);
    } else if (progress > 0) {
      // Quando termina, mostrar 100%
      setProgress(100);
      // E depois de um tempo, resetar
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 1000);
      return () => clearTimeout(timeout);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);
  
  return (
    <div className="w-full space-y-2">
      <Button
        onClick={onClick}
        disabled={isDisabled || isLoading}
        className={cn(
          "w-full py-6 text-lg gap-2",
          isLoading ? "bg-primary/70" : ""
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processando {format === "video" ? "vídeo" : "áudio"}...
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Baixar {format === "video" ? `vídeo ${quality}` : "música MP3"}
          </>
        )}
      </Button>
      
      {isLoading && (
        <div className="w-full space-y-1">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Baixando... {Math.round(progress)}%</span>
            <span>
              {format === "video" 
                ? `MP4 ${quality || "HD"}` 
                : "MP3 alta qualidade"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;
