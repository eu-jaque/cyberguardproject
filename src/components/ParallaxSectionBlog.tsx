import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import news from "@/assets/news.jpeg";
import { ReactNode } from "react";
import { useState } from "react";
import {Search} from "lucide-react";

const ParallaxSectionBlog = ({children}: { children?: ReactNode}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
    <input
              type="text"
              placeholder="Buscar conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
<section
      className="parallax-section-auth relative min-h-[600px] flex items-center justify-center"
      style={{ backgroundImage: `url(${news})` }}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      {children}
    </section>
    </div>
  );
};

export default ParallaxSectionBlog;
