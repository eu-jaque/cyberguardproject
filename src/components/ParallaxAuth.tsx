import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import parallaxBgAuth from "@/assets/parallax-bg-auth.jpg";

const ParallaxSection = () => {
  const { t } = useLanguage();

  return (
    <section
      className="parallax-section relative h-[400px] flex items-center justify-center"
      style={{ backgroundImage: `url(${parallaxBgAuth})` }}
    >
      <div className="absolute inset-0 bg-background/60" />
      <div className="relative z-10 text-center max-w-3xl px-4">
       
        <Link
          to="/saiba-mais"
          className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-[5px] font-semibold inline-block"
        >
          {t("hero.cta")}
        </Link>
      </div>
    </section>
  );
};

export default ParallaxSection;
