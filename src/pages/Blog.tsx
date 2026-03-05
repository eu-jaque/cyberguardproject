import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  { key: "blog.post1", date: "2026-03-01", img: "/placeholder.svg" },
  { key: "blog.post2", date: "2026-02-25", img: "/placeholder.svg" },
  { key: "blog.post3", date: "2026-02-18", img: "/placeholder.svg" },
  { key: "blog.post4", date: "2026-02-10", img: "/placeholder.svg" },
  { key: "blog.post5", date: "2026-01-30", img: "/placeholder.svg" },
  { key: "blog.post6", date: "2026-01-20", img: "/placeholder.svg" },
];

const Blog = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            {t("blog.title")} <span className="text-gradient-gold">{t("blog.title_highlight")}</span>
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">{t("blog.subtitle")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <article key={i} className="glass-card group cursor-pointer">
                <div className="aspect-video bg-secondary/30 rounded-lg mb-4 overflow-hidden">
                  <img src={post.img} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{post.date}</span>
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{t(`${post.key}.title`)}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{t(`${post.key}.summary`)}</p>
                <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t("blog.read_more")} <ArrowRight className="w-3 h-3" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default Blog;
