import { useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, User, ShieldCheck } from "lucide-react";

type Expert = {
  id: string;
  name: string;
  area: string;
  rating: number;
  bio: string;
  avatar: string;
};

interface ExpertsCarouselProps {
  experts: Expert[];
  onSelectExpert: (expert: Expert) => void;
  title?: string;
}

export default function ExpertsCarousel({ experts, onSelectExpert, title = "Nossos Especialistas" }: ExpertsCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const amount = 344; // 320px do card + 24px do gap
      carouselRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth"
      });
    }
  };

  if (!experts || experts.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-background via-secondary/10 to-background text-foreground overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">

        <h2 className="font-display text-3xl font-bold mb-14 text-center tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-400">
            {title}
          </span>
        </h2>

        <div className="relative group/carousel">

          {/* Controles de Seta flutuantes */}
          <button
            onClick={() => scroll("left")}
            aria-label="Rolar para esquerda"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-md cursor-pointer hover:border-primary hover:text-primary hover:scale-105 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            aria-label="Rolar para direita"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-card/90 backdrop-blur-md border border-border/60 flex items-center justify-center shadow-md cursor-pointer hover:border-primary hover:text-primary hover:scale-105 transition-all opacity-0 group-hover/carousel:opacity-100 hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carrossel Ativo */}
          <div
            className="overflow-hidden px-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide py-6"
              style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
            >
              <div
                className={`flex gap-6 ${!isPaused ? "animate-carousel-scroll" : ""}`}
                style={{ minWidth: "max-content" }}
              >
                {[...experts, ...experts].map((expert, idx) => (
                  <div
                    key={`${expert.id}-clone-${idx}`}
                    className="flex-shrink-0 w-[320px] h-[440px] bg-card/40 backdrop-blur-md border border-border/60 rounded-3xl flex flex-col justify-between p-6 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Luz de Fundo sutil no card (Efeito Cyberpunk) */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

                    <div>
                      {/* Topo do Card: Avatar + Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-16 h-16 rounded-2xl border-2 border-primary/40 group-hover:border-primary overflow-hidden shadow-md bg-secondary flex items-center justify-center transition-all duration-500">
                          {expert.avatar ? (
                            <img
                              src={expert.avatar}
                              alt={`Foto de ${expert.name}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <User className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-1.5 bg-secondary/80 px-2.5 py-1 rounded-full border border-border/40 shadow-sm">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-foreground">
                              {expert.rating.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px] font-semibold tracking-wider uppercase">Verificado</span>
                          </div>
                        </div>
                      </div>

                      {/* Títulos e Área */}
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {expert.name}
                        </h3>
                        <p className="text-primary text-xs font-medium tracking-wide uppercase mt-1">
                          {expert.area}
                        </p>
                      </div>

                      {/* Bio cortada elegantemente */}
                      <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed mb-4">
                        {expert.bio}
                      </p>
                    </div>

                    {/* Rodapé: Botão expandido e alinhado na base */}
                    <div className="mt-auto pt-4 border-t border-border/40">
                      <button
                        onClick={() => onSelectExpert(expert)}
                        className="btn-gold-3d w-full text-primary-foreground py-3 rounded-2xl text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 group-hover:gap-3"
                      >
                        Agendar Consulta
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}