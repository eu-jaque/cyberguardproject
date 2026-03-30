import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Calendar, Search, Clock, User, Play, Mail, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PostCard from "@/components/blog/PostCard";
import PostModal from "@/components/blog/PostModal";
import VideoModal from "@/components/blog/VideoModal";
import CyberLabSection from "@/components/blog/CyberLabSection";
import type { SocialPost } from "@/components/blog/PostCard";
import type { VideoPost } from "@/components/blog/VideoModal";

type ContentType = "all" | "posts" | "articles" | "videos" | "news" | "cyberlab";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  type: PostType;
  date: string;
  readTime: string;
  author: string;
  image: string;
  videoId?: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "golpes-pix",
    title: "Os 5 golpes via Pix mais perigosos de 2026",
    summary: "Conheça as táticas mais recentes usadas por criminosos para roubar dinheiro via Pix e aprenda a se proteger de cada uma delas.",
    category: "Fraude",
    type: "article",
    date: "2026-03-15",
    readTime: "6 min",
    author: "Dr. Carlos Silva",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  },
  {
    id: "phishing-2026",
    title: "Phishing em 2026: como identificar e-mails falsos",
    summary: "Técnicas avançadas de phishing estão enganando até os mais experientes. Veja como analisar e-mails suspeitos antes de clicar.",
    category: "Segurança",
    type: "article",
    date: "2026-03-10",
    readTime: "8 min",
    author: "Ana Rodrigues",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
  },
  {
    id: "video-phishing",
    title: "Como identificar phishing em 5 passos",
    summary: "Assista nosso guia prático em vídeo e aprenda a reconhecer tentativas de phishing rapidamente.",
    category: "Tutorial",
    type: "video",
    date: "2026-03-08",
    readTime: "12 min",
    author: "CyberGuard",
    image: "https://img.youtube.com/vi/EqQ-cDeKQLU/hqdefault.jpg",
    videoId: "EqQ-cDeKQLU",
  },
  {
    id: "lgpd-direitos",
    title: "LGPD: conheça seus direitos sobre seus dados pessoais",
    summary: "A Lei Geral de Proteção de Dados garante direitos importantes. Saiba como exercê-los e proteger suas informações.",
    category: "Legislação",
    type: "article",
    date: "2026-03-05",
    readTime: "7 min",
    author: "Dra. Juliana Costa",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
  },
  {
    id: "ransomware-empresas",
    title: "Ransomware: o pesadelo das empresas brasileiras",
    summary: "Ataques de ransomware cresceram 150% no Brasil. Entenda como funcionam e o que fazer para não ser refém digital.",
    category: "Tecnologia",
    type: "news",
    date: "2026-03-01",
    readTime: "9 min",
    author: "Prof. Lucas Mendes",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
  },
  {
    id: "video-wifi",
    title: "Protegendo seu Wi-Fi doméstico",
    summary: "Aprenda a configurar seu roteador de forma segura e evitar que invasores acessem sua rede doméstica.",
    category: "Tutorial",
    type: "video",
    date: "2026-02-28",
    readTime: "15 min",
    author: "CyberGuard",
    image: "https://img.youtube.com/vi/DMkKcrwxlsc/hqdefault.jpg",
    videoId: "DMkKcrwxlsc",
  },
  {
    id: "engenharia-social",
    title: "Engenharia social: a arte de manipular pessoas",
    summary: "Criminosos usam psicologia para enganar vítimas. Descubra as técnicas mais comuns e como não cair nessas armadilhas.",
    category: "Segurança",
    type: "article",
    date: "2026-02-25",
    readTime: "6 min",
    author: "Mariana Oliveira",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop",
  },
  {
    id: "senhas-seguras",
    title: "Senhas seguras: o guia definitivo para 2026",
    summary: "Descubra como criar senhas fortes, usar gerenciadores e proteger todas as suas contas online de forma prática.",
    category: "Tecnologia",
    type: "article",
    date: "2026-02-20",
    readTime: "5 min",
    author: "Rafael Santos",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop",
  },
  {
    id: "video-senhas",
    title: "Senhas seguras: guia completo em vídeo",
    summary: "Vídeo tutorial completo sobre como criar e gerenciar senhas fortes para todas as suas contas.",
    category: "Tutorial",
    type: "video",
    date: "2026-02-18",
    readTime: "10 min",
    author: "CyberGuard",
    image: "https://img.youtube.com/vi/zefv-bNtZwg/hqdefault.jpg",
    videoId: "zefv-bNtZwg",
  },
  {
    id: "vazamento-dados",
    title: "O que fazer após um vazamento de dados",
    summary: "Seus dados foram expostos? Saiba os passos imediatos para minimizar danos e proteger suas contas.",
    category: "Segurança",
    type: "news",
    date: "2026-02-15",
    readTime: "7 min",
    author: "Dr. Carlos Silva",
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&h=400&fit=crop",
  },
  {
    id: "whatsapp-clonagem",
    title: "Clonagem de WhatsApp: como se proteger",
    summary: "Golpistas estão clonando contas do WhatsApp para aplicar golpes nos seus contatos. Veja como evitar.",
    category: "Fraude",
    type: "article",
    date: "2026-02-10",
    readTime: "5 min",
    author: "Ana Rodrigues",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
  },
  {
    id: "deepfake-perigos",
    title: "Deepfakes: a nova arma dos golpistas digitais",
    summary: "Inteligência artificial está sendo usada para criar vídeos falsos ultra-realistas. Saiba identificar e se proteger.",
    category: "Tecnologia",
    type: "news",
    date: "2026-02-05",
    readTime: "8 min",
    author: "Prof. Lucas Mendes",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  },
];

type TabType = "all" | "posts" | "artigos" | "noticias" | "videos"| "cyberlab"; 
const categories = ["Todos", "Fraude", "Segurança", "Tecnologia", "Legislação", "Tutorial"];
const tabs: { label: string; value: TabType}[] = [
  { label: "Todos", value: "all" },
  { label: "Posts", value: "posts" },
  { label: "Vídeos", value: "videos" },
  { label: "Notícias", value: "noticias" },
  { label: "CyberLab", value: "cyberlab" },
];

// Social Posts data
const socialPosts: SocialPost[] = [
  {
    id: "post-1", author: "Dr. Carlos Silva", authorRole: "Especialista em Cibersegurança", authorAvatar: "https://i.pravatar.cc/100?img=11",
    date: "15 Mar 2026", content: "🔒 Dica do dia: Sempre ative a autenticação em dois fatores (2FA) em todas as suas contas. É a barreira extra que pode salvar seus dados!", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop", likes: 127, comments: 23,
  },
  {
    id: "post-2", author: "Ana Rodrigues", authorRole: "Analista de Segurança", authorAvatar: "https://i.pravatar.cc/100?img=5",
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

const Blog = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ContentType>("all");
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoPost | null>(null);
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-card to-background">
        <div className="max-w-[1366px] mx-auto px-[2%] text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Blog <span className="text-gradient-gold">CyberGuard</span>
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
        <div className="max-w-[1366px] mx-auto px-[2%] flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveTab(t.value)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === t.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              {t.value == "cyberlab"} {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            <div>
              {/* Filtro de Categorias */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum resultado encontrado para "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-border/50">
                 
                  {filteredPosts.length > 0 && (() => {
                    const feat = filteredPosts[0];
                    return (
                     <article key={feat.id} className="group cursor-pointer pb-8" onClick={() => setSelectedPost(feat)}>
                        <div className="aspect-[21/9] rounded-2xl overflow-hidden relative mb-5">
                          <img src={feat.image} alt={feat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                          {feat.type === "video" && (
                            <div className="absolute inset-0 bg-background/20 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-xl"><Play className="w-7 h-7 text-primary-foreground ml-1" /></div>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${categoryColors[feat.category] || "bg-card text-foreground border-border"}`}>{feat.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{feat.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{feat.readTime}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{feat.author}</span>
                        </div>
                        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{feat.title}</h3>
                        <p className="text-muted-foreground text-sm max-w-2xl">{feat.summary}</p>
                      </article>
                    );
                  })()}

                
                  {filteredPosts.slice(1).map((post) => (
                    <article key={post.id} className="group cursor-pointer flex gap-5 py-6 hover:bg-card/50 -mx-4 px-4 rounded-xl transition-colors" onClick={() => setSelectedPost(post)}>
                      <div className="flex-shrink-0 w-40 h-28 md:w-52 md:h-32 rounded-xl overflow-hidden relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        {post.type === "video" && (
                          <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center"><Play className="w-4 h-4 text-primary-foreground ml-0.5" /></div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                </div>
              )}

              {/* VIDEOS TAB */}
              {(activeTab === "all" || activeTab === "videos") && (
                <div className="mb-10">
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">🎬 Vídeos</h2>}
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
                <div className="space-y-4 mb-10">
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">📰 Notícias</h2>}
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
                        className="group cursor-pointer flex gap-5 py-5 hover:bg-card/50 -mx-4 px-4 rounded-xl transition-colors border-b border-border/30"
                      >
                        <div className="flex-shrink-0 w-40 h-28 md:w-52 md:h-32 rounded-xl overflow-hidden">
                          <img src={news.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-red-400 mb-1">🔴 {news.category}</span>
                          <h3 className="text-sm md:text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{news.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">{news.summary}</p>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{news.author}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{news.date}</span>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                </div>
              )}

              {/* CYBERLAB TAB */}
              {(activeTab === "all" || activeTab === "cyberlab") && (
                <div className="mb-10">
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">🧪 CyberLab — Desafios</h2>}
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

      {/* Video Section */}
      <section className="py-16 bg-card">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
            Vídeos em <span className="text-gradient-gold">Destaque</span>
          </h2>
          <p className="text-center text-muted-foreground mb-10">Aprenda cibersegurança de forma prática</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts
              .filter((p) => p.type === "video" && p.videoId)
              .map((video) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-3 border border-primary/20 relative">
                    <img
                      src={video.image}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-foreground text-sm font-semibold group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                </a>
              ))}
          </div>
        </div>
      </section>
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-[#111] text-white p-6 rounded-xl w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPost(null)}
              className="mb-4 text-sm text-gray-400 hover:text-white"
            >
              Fechar 
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedPost.title}
            </h2>

            <p className="text-gray-400 mb-4">
              {selectedPost.summary}
            </p>
           <Reactions postId={selectedPost.id} />
           <Comments postId={selectedPost.id} />
          </div>
        </div>
      )}

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default Blog;
