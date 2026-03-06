import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import parallaxBg from "@/assets/parallax-bg.jpg";

const ParallaxSection = () => {
  const { t } = useLanguage();

  return (
    <section
      className="parallax-section relative h-[400px] flex items-center justify-center"
      style={{ backgroundImage: `url(${parallaxBg})` }}
    >
      <div className="absolute inset-0 bg-background/60" />
      <div className="relative z-10 text-center max-w-3xl px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
          {t("parallax.title")}
        </h2>
        <p className="text-foreground/80 text-lg mb-6">
          {t("parallax.desc")}
        </p>
        <Link
          to="/saiba-mais"
          className="btn-login bg-primary text-primary-foreground px-8 py-3 rounded-[5px] font-semibold text-sm inline-block hover:bg-primary/90 transition-colors"
        >
          {t("hero.cta")}
        </Link>
      </div>
    </section>
  );
};

export default ParallaxSection;
