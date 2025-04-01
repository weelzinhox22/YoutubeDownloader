
// Follow this setup guide to integrate the Deno runtime into your Supabase functions:
// https://supabase.com/docs/guides/functions/deno-runtime

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function simulateYoutubeDownload(url: string, format: string, quality?: string) {
  // Simular extração de informações do vídeo
  console.log(`[youtube-dl] Extracting video info for: ${url}`);
  
  // Extrair ID do vídeo para obter thumbnail
  const videoId = extractYoutubeId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }
  
  // Simular chamada para obter informações do vídeo
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Gerar informações simuladas do vídeo
  const videoInfo = {
    title: `YouTube Video - ${videoId}`,
    author: "YouTube Creator",
    duration: Math.floor(Math.random() * 10) + ":" + Math.floor(Math.random() * 60).toString().padStart(2, '0'),
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
  };
  
  console.log(`[youtube-dl] Title: ${videoInfo.title}`);
  console.log(`[youtube-dl] Author: ${videoInfo.author}`);
  
  // Simular processamento do download
  console.log(`[youtube-dl] Starting ${format} download with quality: ${quality || 'best'}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular caminho do arquivo
  const fileExt = format === 'video' ? 'mp4' : 'mp3';
  const fileName = `${videoId}.${fileExt}`;
  const filePath = `downloads/${format}s/${fileName}`;
  
  console.log(`[youtube-dl] Download completed: ${filePath}`);
  
  return {
    title: videoInfo.title,
    thumbnailUrl: videoInfo.thumbnailUrl,
    author: videoInfo.author,
    duration: videoInfo.duration,
    filePath,
    fileSize: Math.floor(Math.random() * 1000) * 1024 * 1024, // Tamanho simulado em bytes
    status: "completed"
  };
}

// Helper function to extract YouTube video ID from various URL formats
function extractYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11)
    ? match[2]
    : null;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get Supabase client using environment variables
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Parse request body
    const { url, format, quality, userId } = await req.json();
    
    // Validate input
    if (!url || !format) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Perform download operation (simulated)
    const downloadResult = await simulateYoutubeDownload(url, format, quality);
    
    // Save to downloads_history table
    const { data, error } = await supabaseClient
      .from('downloads_history')
      .insert({
        user_id: userId,
        title: downloadResult.title,
        format: format,
        quality: quality,
        thumbnail_url: downloadResult.thumbnailUrl,
        file_path: downloadResult.filePath,
        file_size: downloadResult.fileSize,
        url: url,
        status: downloadResult.status
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error saving download history:", error);
      throw error;
    }
    
    return new Response(
      JSON.stringify({ success: true, download: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error processing YouTube download:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
