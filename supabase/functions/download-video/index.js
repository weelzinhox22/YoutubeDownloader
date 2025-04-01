// Função Serverless do Supabase para download de vídeos usando youtube-dl
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { exec } from 'https://deno.land/x/exec/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Lidar com requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, options } = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL é obrigatória' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Configurar o cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Verificar autenticação (opcional)
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    // Construir comando youtube-dl
    let ytdlCommand = 'youtube-dl';
    
    if (options?.audioOnly) {
      ytdlCommand += ' -x --audio-format mp3';
    } else {
      ytdlCommand += ` -f 'best[ext=${options?.format || 'mp4'}]'`;
    }
    
    // Adicionar opções de qualidade se especificadas
    if (options?.quality && !options.audioOnly) {
      ytdlCommand += ` -f 'best[height<=${options.quality}]'`;
    }
    
    // Adicionar URL e opções para obter apenas informações
    ytdlCommand += ` --get-url "${url}"`;
    
    // Executar youtube-dl para obter a URL direta
    const { stdout } = await exec(ytdlCommand);
    const downloadUrl = stdout.trim();
    
    if (!downloadUrl) {
      throw new Error('Não foi possível obter a URL de download');
    }
    
    // Obter informações do vídeo
    const { stdout: infoOutput } = await exec(`youtube-dl -j "${url}"`);
    const videoInfo = JSON.parse(infoOutput);
    
    // Gerar um nome de arquivo para o download
    const fileName = videoInfo.title 
      ? `${videoInfo.title.replace(/[^\w\s]/gi, '')}.${options?.audioOnly ? 'mp3' : (options?.format || 'mp4')}`
      : `video-${Date.now()}.${options?.audioOnly ? 'mp3' : (options?.format || 'mp4')}`;
    
    // Registrar o download no banco de dados (opcional)
    if (user) {
      await supabaseClient.from('downloads').insert({
        user_id: user.id,
        video_url: url,
        video_title: videoInfo.title,
        format: options?.audioOnly ? 'mp3' : (options?.format || 'mp4'),
        downloaded_at: new Date().toISOString(),
      });
    }
    
    return new Response(
      JSON.stringify({ 
        downloadUrl,
        fileName,
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        duration: videoInfo.duration,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro ao processar o download' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}); 