import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/lib/supabase";

interface DownloadOptions {
  format?: string;
  quality?: string;
  audioOnly?: boolean;
}

const YoutubeDownloader: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [options, setOptions] = useState<DownloadOptions>({
    format: "mp4",
    quality: "best",
    audioOnly: false,
  });

  const handleDownload = async () => {
    if (!url) {
      setError("Por favor, insira uma URL válida");
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadLink(null);

    try {
      // Chamar a função serverless do Supabase que utiliza youtube-dl
      const { data, error } = await supabase.functions.invoke("download-video", {
        body: { url, options },
      });

      if (error) throw error;

      if (data && data.downloadUrl) {
        setDownloadLink(data.downloadUrl);
      } else {
        throw new Error("Não foi possível obter o link de download");
      }
    } catch (err) {
      console.error("Erro ao fazer download:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido ao processar o download");
    } finally {
      setLoading(false);
    }
  };

  const toggleAudioOnly = () => {
    setOptions({
      ...options,
      audioOnly: !options.audioOnly,
      format: !options.audioOnly ? "mp3" : "mp4",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>YouTube Downloader</CardTitle>
        <CardDescription>
          Cole o link do vídeo do YouTube para baixá-lo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="audioOnly"
              checked={options.audioOnly}
              onChange={toggleAudioOnly}
              className="rounded"
            />
            <label htmlFor="audioOnly">Apenas áudio (MP3)</label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button 
            onClick={handleDownload} 
            disabled={loading || !url}
            className="w-full"
          >
            {loading ? "Processando..." : "Baixar"}
          </Button>

          {downloadLink && (
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <p className="text-green-700 mb-2">Download pronto!</p>
              <a 
                href={downloadLink} 
                className="text-blue-600 hover:underline"
                download
              >
                Clique aqui para baixar
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default YoutubeDownloader; 