import news from "@/assets/news.jpeg";
import { ReactNode } from "react";

const ParallaxSectionBlog = ({ children }: { children?: ReactNode }) => {
  return (
    <section
      className="relative min-h-[340px] md:min-h-[420px] flex items-center justify-center bg-fixed bg-cover bg-center"
      style={{ backgroundImage: `url(${news})` }}
    >
      {/* Dark navy overlay with blur */}
      <div className="absolute inset-0 bg-[#00215E]/85 backdrop-blur-[2px]" />
      {/* Subtle golden gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFD700]/5" />
      {/* Bottom golden line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
};

export default ParallaxSectionBlog;
