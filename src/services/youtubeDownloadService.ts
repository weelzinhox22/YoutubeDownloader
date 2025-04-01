
import { toast } from "sonner";
import { nanoid } from 'nanoid';
import { HistoryItemType } from "@/components/HistoryItem";
import { supabase } from "@/integrations/supabase/client";

// Simulação de parâmetros que seriam enviados para youtube-dl
interface YoutubeDownloadOptions {
  url: string;
  format: "video" | "audio";
  quality?: "1080p" | "720p" | "480p" | "360p";
  videoInfo: {
    title: string;
    thumbnailUrl: string;
    author: string;
    duration: string;
  };
}

/**
 * Esta função chama a Edge Function do Supabase para processar o download
 */
export async function downloadYoutubeContent(options: YoutubeDownloadOptions): Promise<HistoryItemType | null> {
  const { url, format, quality, videoInfo } = options;
  
  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Você precisa estar logado para baixar conteúdo", {
        description: "Faça login para continuar"
      });
      return null;
    }
    
    // Simular delay do processamento
    toast.loading("Preparando download...");
    
    // Chamar a Edge Function para processar o download
    const { data, error } = await supabase.functions.invoke('youtube-dl', {
      body: {
        url,
        format,
        quality,
        userId: user.id
      }
    });
    
    if (error) {
      console.error("Erro na Edge Function:", error);
      throw new Error(`Falha no download: ${error.message}`);
    }
    
    // Criar item de histórico
    const historyItem: HistoryItemType = {
      id: data.download.id,
      title: videoInfo.title,
      thumbnailUrl: videoInfo.thumbnailUrl,
      format: format,
      quality: format === "video" ? quality : undefined,
      downloadUrl: url,
      timestamp: new Date(data.download.created_at).getTime()
    };
    
    // Notificar o usuário
    toast.success(`${format === 'video' ? 'Vídeo' : 'Áudio'} baixado com sucesso!`, {
      description: videoInfo.title,
      action: {
        label: "Ver Histórico",
        onClick: () => {
          window.location.href = "/history";
        }
      }
    });
    
    return historyItem;
  } catch (error) {
    console.error("Erro ao baixar conteúdo:", error);
    toast.error("Falha no download. Por favor, tente novamente.");
    return null;
  }
}

// Função para carregar histórico de download do Supabase
export async function getDownloadHistory(): Promise<HistoryItemType[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('downloads_history')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erro ao carregar histórico:", error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      thumbnailUrl: item.thumbnail_url,
      format: item.format,
      quality: item.quality,
      downloadUrl: item.url,
      timestamp: new Date(item.created_at).getTime()
    }));
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    return [];
  }
}

// Função para excluir um item do histórico
export async function deleteFromHistory(id: string): Promise<HistoryItemType[]> {
  try {
    const { error } = await supabase
      .from('downloads_history')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erro ao excluir do histórico:", error);
      throw error;
    }
    
    return await getDownloadHistory();
  } catch (error) {
    console.error("Erro ao excluir do histórico:", error);
    return await getDownloadHistory();
  }
}

// Função para limpar todo o histórico
export async function clearAllHistory(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return;
    }
    
    const { error } = await supabase
      .from('downloads_history')
      .delete()
      .eq('user_id', user.id);
    
    if (error) {
      console.error("Erro ao limpar histórico:", error);
      throw error;
    }
  } catch (error) {
    console.error("Erro ao limpar histórico:", error);
  }
}
