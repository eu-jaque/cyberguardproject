import parallaxBgAuth from "@/assets/parallax-bg-auth.jpeg";

const ParallaxAuth = ({children}) => {

  return (
    <section
      className="parallax-section-auth relative h-[400px] flex items-center justify-center"
      style={{ backgroundImage: `url(${parallaxBgAuth})` }}
    >
      <div className="absolute inset-0 bg-background/60" >
      {children}
      </div>
    </section>
  );
};

export default ParallaxAuth;
