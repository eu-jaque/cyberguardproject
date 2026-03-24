import { Video, Play, ExternalLink } from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
};

interface VideoLibraryProps {
  videos: VideoItem[];
  title: string;
}

export default function CarouselExpertsVideos({ videos, title }: VideoLibraryProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-16 relative bg-[#060B19]/50 overflow-hidden">
      {/* Luzes de Fundo Sombreadas (Glow) */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1366px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 shadow-inner">
              <Video className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
                {title}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 font-light">
                Aprenda a se proteger com nossos guias rápidos
              </p>
            </div>
          </div>
          
          <div className="h-[1px] flex-grow mx-6 bg-gradient-to-r from-slate-800 to-transparent hidden md:block" />
        </div>

        {/* Grade de Vídeos (Layout fluido de Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {videos.map((video) => (
            <a 
              key={video.id} 
              href={`https://www.youtube.com/watch?v=${video.id}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group cursor-pointer block"
            >
              {/* Contêiner da Thumbnail */}
              <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-slate-800/80 bg-slate-900 relative shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_40px_rgba(245,158,11,0.1)] group-hover:border-slate-700/80 transition-all duration-500">
                
                {/* Imagem do Youtube com Zoom Suave */}
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    // Fallback caso a imagem HQ não exista no youtube
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />

                {/* Overlay Escuro & Blur de Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Badges de tempo/conteúdo simulados (Dá cara de player de streaming) */}
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-bold tracking-wider text-slate-300 uppercase shadow-md">
                  HD
                </div>

                {/* Botão de Play Centralizado Futurista */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/50 flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-400 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-500 transform group-hover:scale-110">
                    <Play className="w-6 h-6 text-white group-hover:text-slate-900 fill-white group-hover:fill-slate-900 transition-all ml-1" />
                  </div>
                </div>
              </div>

              {/* Informações do Título do Vídeo */}
              <div className="flex items-start justify-between gap-2 px-1">
                <h3 className="text-slate-200 text-sm font-semibold group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                  {video.title}
                </h3>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-400 flex-shrink-0 mt-0.5 transition-colors opacity-0 group-hover:opacity-100 duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}