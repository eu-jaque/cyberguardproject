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
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img src={img} alt={titles[i]} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full max-w-[1366px] mx-auto px-[2%]">
          <div className="max-w-xl pointer-events-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              {titles[current]}
            </h1>
            <p className="text-foreground/80 mb-6" style={{ fontSize: "20px" }}>{descs[current]}</p>
            <Link
              to="/saiba-mais"
              className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-[5px] font-semibold inline-block"
            >
              {t("hero.cta")}
            </Link>
          </div>
        </div>
      </div>

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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {images.map((_, i) => (
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
