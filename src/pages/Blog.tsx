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

<<<<<<< HEAD
// Social Posts data
const socialPosts: SocialPost[] = [
  {
    id: "post-1", author: "Dr. Carlos Silva", authorRole: "Especialista em Cibersegurança", authorAvatar: "https://i.pravatar.cc/100?img=11",
    date: "15 Mar 2026", content: "🔒 Dica do dia: Sempre ative a autenticação em dois fatores (2FA) em todas as suas contas. É a barreira extra que pode salvar seus dados!", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop", likes: 127, comments: 23,
  },
  {
    id: "post-2", author: "Anaa Rodrigues", authorRole: "Analista de Segurança", authorAvatar: "https://i.pravatar.cc/100?img=5",
    date: "14 Mar 2026", content: "⚠️ Alerta: Nova campanha de phishing usando IA para gerar e-mails extremamente convincentes. Fiquem atentos!", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop", likes: 89, comments: 15,
  },
  {
    id: "post-3", author: "Prof. Lucas Mendes", authorRole: "Pesquisador em IA e Segurança", authorAvatar: "https://i.pravatar.cc/100?img=12",
    date: "12 Mar 2026", content: "🧠 Acabei de publicar um estudo sobre como deepfakes estão sendo usados em ataques de engenharia social corporativa. Link nos comentários!", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop", likes: 234, comments: 41,
  },
  {
    id: "post-4", author: "Mariana Oliveira", authorRole: "Consultora LGPD", authorAvatar: "https://i.pravatar.cc/100?img=9",
    date: "10 Mar 2026", content: "📋 Empresas que não se adequaram à LGPD até agora estão correndo sérios riscos. Veja o checklist que preparei para adequação rápida.", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", likes: 156, comments: 28,
  },
];

// Articles data
const articles = [
  { id: "golpes-pix", title: "Os 5 golpes via Pix mais perigosos de 2026", summary: "Conheça as táticas mais recentes usadas por criminosos para roubar dinheiro via Pix.", category: "Fraude", date: "15 Mar 2026", readTime: "6 min", author: "Dr. Carlos Silva", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop" },
  { id: "phishing-2026", title: "Phishing em 2026: como identificar e-mails falsos", summary: "Técnicas avançadas de phishing estão enganando até os mais experientes.", category: "Segurança", date: "10 Mar 2026", readTime: "8 min", author: "Ana Rodrigues", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop" },
  { id: "senhas-seguras", title: "Senhas seguras: o guia definitivo para 2026", summary: "Como criar senhas fortes e usar gerenciadores de senha de forma prática.", category: "Tecnologia", date: "20 Fev 2026", readTime: "5 min", author: "Rafael Santos", image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop" },
  { id: "engenharia-social", title: "Engenharia social: a arte de manipular pessoas", summary: "Criminosos usam psicologia para enganar vítimas. Descubra as técnicas mais comuns.", category: "Segurança", date: "25 Fev 2026", readTime: "6 min", author: "Mariana Oliveira", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop" },
  { id: "whatsapp-clonagem", title: "Clonagem de WhatsApp: como se proteger", summary: "Golpistas estão clonando contas do WhatsApp para aplicar golpes nos seus contatos.", category: "Fraude", date: "10 Fev 2026", readTime: "5 min", author: "Ana Rodrigues", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop" },
];

// News data
const newsItems = [
  { id: "ransomware-empresas", title: "Ransomware: o pesadelo das empresas brasileiras", summary: "Ataques de ransomware cresceram 150% no Brasil em 2026.", category: "Tecnologia", date: "01 Mar 2026", readTime: "9 min", author: "Prof. Lucas Mendes", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop" },
  { id: "vazamento-dados", title: "O que fazer após um vazamento de dados", summary: "Seus dados foram expostos? Saiba os passos imediatos.", category: "Segurança", date: "15 Fev 2026", readTime: "7 min", author: "Dr. Carlos Silva", image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&h=400&fit=crop" },
  { id: "deepfake-perigos", title: "Deepfakes: a nova arma dos golpistas digitais", summary: "IA está sendo usada para criar vídeos falsos ultra-realistas.", category: "Tecnologia", date: "05 Fev 2026", readTime: "8 min", author: "Prof. Lucas Mendes", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop" },
  { id: "lgpd-direitos", title: "LGPD: conheça seus direitos sobre seus dados pessoais", summary: "A Lei Geral de Proteção de Dados garante direitos importantes.", category: "Legislação", date: "05 Mar 2026", readTime: "7 min", author: "Dra. Juliana Costa", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop" },
];

// Videos data
const videoPosts: VideoPost[] = [
  { id: "v1", title: "Como identificar phishing em 5 passos", description: "Guia prático para reconhecer tentativas de phishing.", thumbnail: "https://img.youtube.com/vi/EqQ-cDeKQLU/hqdefault.jpg", duration: "12:34", views: "15.2K", author: "CyberGuard", date: "08 Mar 2026", videoId: "EqQ-cDeKQLU" },
  { id: "v2", title: "Protegendo seu Wi-Fi doméstico", description: "Configure seu roteador de forma segura.", thumbnail: "https://img.youtube.com/vi/DMkKcrwxlsc/hqdefault.jpg", duration: "15:20", views: "8.7K", author: "CyberGuard", date: "28 Fev 2026", videoId: "DMkKcrwxlsc" },
  { id: "v3", title: "Senhas seguras: guia completo", description: "Tutorial completo sobre criação e gerenciamento de senhas.", thumbnail: "https://img.youtube.com/vi/zefv-bNtZwg/hqdefault.jpg", duration: "10:45", views: "12.1K", author: "CyberGuard", date: "18 Fev 2026", videoId: "zefv-bNtZwg" },
  { id: "v4", title: "O que fazer após um vazamento de dados", description: "Passos imediatos para proteger suas contas.", thumbnail: "https://img.youtube.com/vi/3uJszS1bk28/hqdefault.jpg", duration: "8:15", views: "6.3K", author: "CyberGuard", date: "10 Fev 2026", videoId: "3uJszS1bk28" },
];

=======
>>>>>>> b7b6573f865e85ebd7436cee183805d6098b7aa6
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
      <section
        className="pt-32 pb-20 relative bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-[#00215E]/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="max-w-[1366px] mx-auto px-[2%] text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block bg-card/10 backdrop-blur-xl border border-primary/20 rounded-3xl px-8 py-10 md:px-14 md:py-14 shadow-2xl"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Mais que um Blog: <span className="text-gradient-gold">Conteúdo que protege</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">{t("blog.subtitle")}</p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Buscar conteúdo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all shadow-inner"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-[72px] z-20 shadow-sm">
        <div className="max-w-[1366px] mx-auto px-[2%] flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === tab.value ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30"
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
                <div className={`mb-10 ${activeTab === "all" ? "rounded-2xl border border-[hsl(160,60%,40%,0.2)] bg-gradient-to-br from-[hsl(160,60%,20%,0.08)] to-[hsl(180,50%,30%,0.12)] p-4 sm:p-6" : ""}`}>
                  {activeTab === "all" && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-6 rounded-full bg-[hsl(160,60%,50%)]" />
                      <h2 className="text-lg font-bold text-foreground">Divirta-se com o CyberLab</h2>
                    </div>
                  )}
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
