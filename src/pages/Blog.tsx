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
import image from "@/assets/news.jpeg";


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
      <section className="pt-24 pb-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0e17 0%, #00215E 50%, #0a1628 100%)' }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,215,0,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-[1366px] mx-auto px-[2%] relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16">
            {/* Left content */}
            <div className="flex-1 pt-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 mb-6">
                <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                <span className="text-[#FFD700] text-sm font-semibold tracking-wide">Cibersegurança em destaque</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                Blog <span className="text-[#FFD700]" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}>CyberGuard</span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-md mb-8">
                Artigos e notícias sobre cibersegurança para manter você informado e protegido.
              </p>
              <div className="max-w-md relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/40 focus:border-[#FFD700]/40 transition-all backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Right shield graphic */}
            <div className="hidden lg:flex items-center justify-center flex-shrink-0 w-[320px] h-[280px] relative">
              {/* Outer orbit */}
              <div className="absolute w-[260px] h-[260px] rounded-full border border-[#FFD700]/20" />
              {/* Middle orbit */}
              <div className="absolute w-[190px] h-[190px] rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5" />
              {/* Inner circle */}
              <div className="absolute w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#FFD700]/30">
                <svg className="w-10 h-10 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              </div>
              {/* Label */}
              <span className="absolute top-1/2 mt-16 text-gray-400 text-sm tracking-wider">Proteja-se</span>
              {/* Dots */}
              <div className="absolute top-6 right-12 w-2 h-2 rounded-full bg-[#FFD700]/60" />
              <div className="absolute bottom-10 left-4 w-2 h-2 rounded-full bg-gray-500/60" />
              <div className="absolute bottom-16 right-2 w-1.5 h-1.5 rounded-full bg-blue-400/60" />
            </div>
          </div>

          {/* Featured article */}
          {articles.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-[#FFD700]" />
                <span className="text-[#FFD700] text-xs font-bold tracking-[0.2em] uppercase">Artigo em Destaque</span>
              </div>
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/article/${articles[0].id}`)}
                style={{ background: 'linear-gradient(135deg, #0d1520 0%, #162032 100%)' }}
              >
                <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                  {articles[0].image && <img src={articles[0].image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/70 to-transparent" />
                <div className="relative z-10 p-6 sm:p-8 pt-16 sm:pt-24">
                  {articles[0].category && (
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FFD700]/15 text-[#FFD700] text-xs font-bold mb-3 border border-[#FFD700]/30">
                      {articles[0].category}
                    </span>
                  )}
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight max-w-2xl">
                    {articles[0].title}
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base max-w-xl mb-4 line-clamp-2">
                    {articles[0].summary}
                  </p>
                  <div className="flex items-center gap-4 text-gray-400 text-xs">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {articles[0].author}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {articles[0].date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {articles[0].readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Bottom golden line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
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
        <div className="max-w-[1366px] mx-auto px-4 sm:px-[2%]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-10">
            <div>
              {/* POSTS TAB */}
              {(activeTab === "all" || activeTab === "posts") && (
                <div className={`space-y-4 sm:space-y-6 mb-10 ${activeTab === "all" ? "rounded-2xl border border-primary/20 bg-gradient-to-br from-[hsl(var(--primary)/0.05)] to-[hsl(var(--accent)/0.08)] p-4 sm:p-6" : ""}`}>
                  {activeTab === "all" && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 rounded-full bg-primary" />
                      <h2 className="text-lg font-bold text-foreground">Papo & Meme</h2>
                    </div>
                  )}
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
                <div className={`space-y-4 mb-10 ${activeTab === "all" ? "rounded-2xl border border-[hsl(210,80%,40%,0.2)] bg-gradient-to-br from-[hsl(210,80%,20%,0.08)] to-[hsl(220,60%,30%,0.12)] p-4 sm:p-6" : ""}`}>
                  {activeTab === "all" && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 rounded-full bg-[hsl(210,80%,50%)]" />
                      <h2 className="text-lg font-bold text-foreground">Leitura Segura</h2>
                    </div>
                  )}
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
                        className="group cursor-pointer flex flex-col sm:flex-row gap-3 sm:gap-5 py-4 sm:py-5 hover:bg-card/50 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-xl transition-colors border-b border-border/30"
                      >
                        <div className="flex-shrink-0 w-full sm:w-40 md:w-52 h-44 sm:h-28 md:h-32 rounded-xl overflow-hidden">
                          <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-primary mb-1">{article.category}</span>
                          <h3 className="text-sm md:text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>
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
                <div className={`mb-10 ${activeTab === "all" ? "rounded-2xl border border-[hsl(280,60%,50%,0.2)] bg-gradient-to-br from-[hsl(280,60%,20%,0.08)] to-[hsl(260,50%,30%,0.12)] p-4 sm:p-6" : ""}`}>
                  {activeTab === "all" && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 rounded-full bg-[hsl(39, 94%, 53%)]" />
                      <h2 className="text-lg font-bold text-foreground">Aprenda Assistindo</h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                <div className={`mb-10 ${activeTab === "all" ? "rounded-2xl border border-[hsl(45,90%,50%,0.15)] bg-gradient-to-br from-[hsl(45,90%,50%,0.05)] to-[hsl(35,80%,40%,0.1)] p-4 sm:p-6" : ""}`}>
                  {activeTab === "all" && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 rounded-full bg-[hsl(45,90%,50%)]" />
                      <h2 className="text-lg font-bold text-foreground">Informação sem Fake News? Temos!</h2>
                    </div>
                  )}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
