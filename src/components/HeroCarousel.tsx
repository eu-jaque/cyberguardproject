import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    title: "Voce confia em quem esta do outro lado da tela?",
    description: "A cada 6 segundos, alguem cai em um golpe digital no Brasil. O proximo pode ser voce ou alguem que voce ama.",
    link: "/artigo/fraudes-digitais",
  },
  {
    image: hero2,
    title: "Aquela mensagem urgente pode custar tudo que voce tem",
    description: "Criminosos usam o medo e a pressa para roubar seu dinheiro. Aprenda a reconhecer os sinais antes que seja tarde.",
    link: "/artigo/phishing",
  },
  {
    image: hero3,
    title: "Seus dados ja podem estar nas maos erradas",
    description: "Nome, CPF, senhas: tudo pode ser roubado sem voce perceber. Descubra como blindar sua vida digital agora.",
    link: "/artigo/roubo-identidade",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="inicio" className="relative w-full h-screen overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 cursor-pointer ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => navigate(slide.link)}
        >
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full max-w-[1366px] mx-auto px-[2%]">
          <div className="max-w-xl pointer-events-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              {slides[current].title}
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-6">
              {slides[current].description}
            </p>
            <button
              onClick={() => navigate(slides[current].link)}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors"
            >
              Saiba Mais
            </button>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/40 hover:bg-primary/80 text-foreground p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/40 hover:bg-primary/80 text-foreground p-3 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`w-3 h-3 rounded-full transition-all ${
              i === current ? "bg-primary w-8" : "bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
