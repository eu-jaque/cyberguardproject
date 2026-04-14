import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const images = [hero1, hero2, hero3];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const next = useCallback(() => setCurrent((c) => (c + 1) % 3), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + 3) % 3), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const titles = [t("hero.slide1.title"), t("hero.slide2.title"), t("hero.slide3.title")];
  const descs = [t("hero.slide1.desc"), t("hero.slide2.desc"), t("hero.slide3.desc")];

  return (
    <section id="inicio" className="relative w-full h-screen overflow-hidden">
      {/* Full-width background images */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img src={img} alt={titles[i]} className="w-full h-full object-cover" />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
      ))}

      {/* Glassmorphism content card */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full max-w-[1366px] mx-auto px-4 sm:px-[2%]">
          <div
            className="max-w-2xl pointer-events-auto rounded-2xl p-6 sm:p-10 border border-white/10"
            style={{
              background: "linear-gradient(135deg, rgba(0,33,94,0.45) 0%, rgba(0,0,0,0.35) 100%)",
              backdropFilter: "blur(16px) saturate(1.4)",
              WebkitBackdropFilter: "blur(16px) saturate(1.4)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Decorative accent line */}
            <div className="w-16 h-1 rounded-full bg-primary mb-5" />

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {titles[current]}
            </h1>
            <p className="text-white/80 mb-8 text-base sm:text-lg md:text-xl leading-relaxed">
              {descs[current]}
            </p>
            <Link
              to="/saiba-mais"
              className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-lg font-semibold inline-block text-sm sm:text-base"
            >
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all border border-white/15 hover:border-primary/60"
        style={{
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all border border-white/15 hover:border-primary/60"
        style={{
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              i === current
                ? "bg-primary w-10 shadow-[0_0_12px_rgba(212,165,53,0.5)]"
                : "bg-white/30 w-2.5 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
