import parallaxBg2 from "@/assets/parallax-bg-2.jpg";

const ParallaxSection2 = () => {
  return (
    <section
      className="parallax-section relative h-[400px] flex items-center justify-center"
      style={{ backgroundImage: `url(${parallaxBg2})` }}
    >
      <div className="absolute inset-0 bg-background/60" />
    </section>
  );
};

export default ParallaxSection2;
