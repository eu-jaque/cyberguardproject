import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, X } from "lucide-react";
import experts from "@/assets/experts.jpg";

const ExpertVideos = () => {
  const { t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Fecha com a tecla ESC (Opcional, mas recomendado)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedVideo(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const videos = [
    { title: "Como identificar phishing em 5 passos", id: "EqQ-cDeKQLU" },
    { title: "Protegendo seu Wi-Fi doméstico", id: "DMkKcrwxlsc" },
    { title: "Senhas seguras: guia completo", id: "zefv-bNtZwg" },
    { title: "O que fazer após um vazamento de dados", id: "3uJszS1bk28" },
  ];

  return (
    <>
      <section
        className="py-16 relative"
        style={{ backgroundImage: `url(${experts})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="max-w-[1366px] mx-auto px-[2%] relative z-10">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Play className="w-6 h-6 text-primary fill-primary" />
            <h2 className="font-display text-2xl font-bold text-gradient-gold">{t("exp.videos")}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, i) => (
              <button
                key={i}
                onClick={() => setSelectedVideo(video.id)}
                className="group text-left block w-full focus:outline-none"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-3 border border-primary/30 relative">
                  <img
                    src={`https://img.youtube.com{video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-background/30 group-hover:bg-transparent flex items-center justify-center transition-colors">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="text-foreground text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 cursor-pointer animate-in fade-in duration-300"
          onClick={() => setSelectedVideo(null)}
        >
          <button className="absolute top-6 right-6 text-white hover:text-primary"><X size={32} /></button>
          <div className="w-full max-w-4xl aspect-video relative cursor-default" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com{selectedVideo}?autoplay=1`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertVideos;
