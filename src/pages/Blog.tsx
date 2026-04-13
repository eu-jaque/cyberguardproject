import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Calendar, Search, Clock, User, Play, Mail, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PostCard from "@/components/blog/PostCard";
import PostModal from "@/components/blog/PostModal";
import VideoModal from "@/components/blog/VideoModal";
import CyberLabSection from "@/components/blog/CyberLabSection";
import type { SocialPost } from "@/components/blog/PostCard";
import type { VideoPost } from "@/components/blog/VideoModal";
import { useEffect, useRef, useState } from "react";
import supabase from "../../utils/supabase";


type ContentType = "all" | "posts" | "articles" | "videos" | "news" | "cyberlab";

const tabs: { label: string; value: ContentType }[] = [
  { label: "Todos", value: "all" },
  { label: "Posts", value: "posts" },
  { label: "Artigos", value: "articles" },
  { label: "Vídeos", value: "videos" },
  { label: "Notícias", value: "news" },
  { label: "CyberLab", value: "cyberlab" },
];

const Blog = () => {
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ContentType>("all");
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
  const [email, setEmail] = useState("");
  const newsCarouselRef = useRef<HTMLDivElement>(null);

  const scrollNews = (direction: "left" | "right") => {
    if (!newsCarouselRef.current) return;
    const scrollAmount = 320;
    newsCarouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchContents = async () => {
      const { data, error } = await supabase
        .from("contents")
        .select(`
            *,
            profiles (
              name,
              role,
              avatars
            )
          `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setContents(data);
      setLoading(false);
    };

    fetchContents();
  }, []);
  const socialPosts = contents
    .filter(c => c.type === "post")
    .map(c => ({
      id: c.id,
      author: c.profiles?.name ?? "Autor",
      authorRole: c.profiles?.role ?? "",
      authorAvatar: c.profiles?.avatars ?? "",
      date: c.extra?.date,
      content: c.content,
      image: c.image,
      likes: c.extra?.likes,
      comments: c.extra?.comments
    }));


  const articles = contents
    .filter(c => c.type === "article")
    .map(c => ({
      id: c.id,
      title: c.title,
      summary: c.content,
      category: c.extra?.category,
      date: c.extra?.date,
      readTime: c.extra?.readTime,
      author: c.profiles?.name,
      authorAvatar: c.profiles?.avatars ?? "",
      image: c.image
    }));

  const newsItems = contents
    .filter(c => c.type === "news")
    .map(c => ({
      id: c.id,
      title: c.title,
      summary: c.content,
      category: c.extra?.category,
      date: c.extra?.date,
      readTime: c.extra?.readTime,
      author: c.profiles?.name,
      authorAvatar: c.profiles?.avatars ?? "",
      image: c.image
    }));

  const videoPosts = contents
    .filter(c => c.type === "video")
    .map(c => ({
      id: c.id,
      title: c.title,
      description: c.content,
      thumbnail: c.image,
      duration: c.extra?.duration,
      views: c.extra?.views,
      videoId: c.extra?.videoId,
      author: c.extra?.author, // ✅ FIX
      date: c.created_at
    }));
  console.log(contents)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-card to-background">
        <div className="max-w-[1366px] mx-auto px-[2%] text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Mais que um Blog: <span className="text-gradient-gold">Conteúdo que protege</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">{t("blog.subtitle")}</p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border bg-background sticky top-[72px] z-20">
        <div className="max-w-[1366px] mx-auto px-[2%] flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            <div>
              {/* POSTS TAB */}
              {(activeTab === "all" || activeTab === "posts") && (
                <div className="space-y-6 mb-10">
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">Papo & Meme</h2>}
                  {socialPosts
                    .filter(p => !searchQuery || p.content.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((post, i) => (
                      <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                        <PostCard post={post} onOpen={() => setSelectedPost(post)} />
                      </motion.div>
                    ))}
                </div>
              )}

              {/* ARTICLES TAB */}
              {(activeTab === "all" || activeTab === "articles") && (
                <div className="space-y-4 mb-10">
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">Leitura Segura</h2>}
                  {articles
                    .filter(a => !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((article, i) => (
                      <motion.article
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        viewport={{ once: true }}
                        onClick={() => navigate(`/blog/${article.id}`)}
                        className="group cursor-pointer flex gap-5 py-5 hover:bg-card/50 -mx-4 px-4 rounded-xl transition-colors border-b border-border/30"
                      >
                        <div className="flex-shrink-0 w-40 h-28 md:w-52 md:h-32 rounded-xl overflow-hidden">
                          <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-primary mb-1">{article.category}</span>
                          <h3 className="text-sm md:text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{article.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">{article.summary}</p>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                              {article.authorAvatar ? (
                                <img src={article.authorAvatar} alt={article.author} className="w-5 h-5 rounded-full object-cover" />
                              ) : (
                                <User className="w-3 h-3" />
                              )}
                              {article.author}
                            </span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                </div>
              )}

              {/* VIDEOS TAB */}
              {(activeTab === "all" || activeTab === "videos") && (
                <div className="mb-10">
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">Aprenda Assistindo</h2>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {videoPosts
                      .filter(v => !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((video, i) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          viewport={{ once: true }}
                          onClick={() => setSelectedVideo(video)}
                          className="group cursor-pointer bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all"
                        >
                          <div className="aspect-video relative overflow-hidden">
                            <img src={video.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-background/30 flex items-center justify-center group-hover:bg-background/20 transition-colors">
                              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs font-bold px-2 py-0.5 rounded">{video.duration}</span>
                          </div>
                          <div className="p-4">
                            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">{video.title}</h3>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
                              <span>{video.date}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              )}

              {/* NEWS TAB */}
              {(activeTab === "all" || activeTab === "news") && (
                <div className="mb-10">
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">Informação sem Fake News? Temos!</h2>}
                  {activeTab === "all" ? (
                    <div className="relative group/carousel">
                      <button
                        onClick={() => scrollNews("left")}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover/carousel:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div ref={newsCarouselRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                        {newsItems
                          .filter(n => !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((news, i) => (
                            <motion.article
                              key={news.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              viewport={{ once: true }}
                              onClick={() => navigate(`/blog/${news.id}`)}
                              className="group cursor-pointer flex-shrink-0 w-[280px] sm:w-[300px] snap-start bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all"
                            >
                              <div className="aspect-[16/10] relative overflow-hidden">
                                <img src={news.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {news.category && (
                                  <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">{news.category}</span>
                                )}
                              </div>
                              <div className="p-4">
                                <h3 className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors mb-2 line-clamp-3">{news.title}</h3>
                                <span className="text-[11px] text-muted-foreground">{news.date}</span>
                                <div className="flex items-center gap-2 mt-2">
                                  {news.authorAvatar ? (
                                    <img src={news.authorAvatar} alt={news.author} className="w-5 h-5 rounded-full object-cover" />
                                  ) : (
                                    <User className="w-4 h-4 text-muted-foreground" />
                                  )}
                                  <span className="text-[11px] text-muted-foreground font-medium">{news.author}</span>
                                </div>
                              </div>
                            </motion.article>
                          ))}
                      </div>
                      <button
                        onClick={() => scrollNews("right")}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover/carousel:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {newsItems
                        .filter(n => !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((news, i) => (
                          <motion.article
                            key={news.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            onClick={() => navigate(`/blog/${news.id}`)}
                            className="group cursor-pointer bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 transition-all"
                          >
                            <div className="aspect-[16/10] relative overflow-hidden">
                              <img src={news.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              {news.category && (
                                <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">{news.category}</span>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm font-bold text-primary group-hover:text-primary/80 transition-colors mb-2 line-clamp-3">{news.title}</h3>
                              <span className="text-[11px] text-muted-foreground">{news.date}</span>
                              <div className="flex items-center gap-2 mt-2">
                                {news.authorAvatar ? (
                                  <img src={news.authorAvatar} alt={news.author} className="w-5 h-5 rounded-full object-cover" />
                                ) : (
                                  <User className="w-4 h-4 text-muted-foreground" />
                                )}
                                <span className="text-[11px] text-muted-foreground font-medium">{news.author}</span>
                              </div>
                            </div>
                          </motion.article>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* CYBERLAB TAB */}
              {(activeTab === "all" || activeTab === "cyberlab") && (
                <div className="mb-10">
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">Divirta-se com o CyberLab</h2>}
                  <CyberLabSection />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="glass-card-static p-5">
                <h3 className="font-display text-sm font-bold text-gradient-gold mb-4">Mais Lidos</h3>
                <div className="space-y-4">
                  {articles.slice(0, 4).map(a => (
                    <div key={a.id} onClick={() => navigate(`/blog/${a.id}`)} className="flex gap-3 cursor-pointer group">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img src={a.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{a.title}</h4>
                        <span className="text-[10px] text-muted-foreground">{a.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card-static p-5">
                <h3 className="font-display text-sm font-bold text-gradient-gold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Newsletter
                </h3>
                <p className="text-muted-foreground text-xs mb-4">Receba dicas de segurança no seu e-mail.</p>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="w-full btn-gold-3d text-primary-foreground py-2 rounded-lg text-xs font-bold">Inscrever-se</button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Modals */}
      {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default Blog;
