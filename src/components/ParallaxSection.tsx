import parallaxBg from "@/assets/parallax-bg.jpg";

const ParallaxSection = () => {
  return (
    <section
      className="parallax-section relative h-[400px] flex items-center justify-center"
      style={{ backgroundImage: `url(${parallaxBg})` }}
    >
      <div className="absolute inset-0 bg-background/60" />
      <div className="relative z-10 text-center max-w-3xl px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">
          Proteja-se. Informe-se. Não seja a próxima vítima.
        </h2>
        <p className="text-foreground/80 text-lg">
          O conhecimento é sua maior arma contra os golpes digitais.
        </p>
      </div>
    </section>
  );
};

export default ParallaxSection;
