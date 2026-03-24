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
    </section>
  );
};

export default ParallaxSection;
