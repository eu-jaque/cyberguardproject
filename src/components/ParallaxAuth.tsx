import parallaxBgAuth from "@/assets/parallax-bg-auth.jpeg";
import type { ReactNode } from "react";

const ParallaxAuth = ({ children }: { children: ReactNode }) => {
  return (
    <section
      className="parallax-section-auth relative min-h-[600px] flex items-center justify-center"
      style={{ backgroundImage: `url(${parallaxBgAuth})` }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      {children}
    </section>
  );
};

export default ParallaxAuth;
