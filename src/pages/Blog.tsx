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
import news from "@/assets/news.jpeg";

type ContentType = "all" | "posts" | "articles" | "videos" | "news" | "cyberlab";

const tabs: { label: string; value: ContentType }[] = [
  { label: "Todos", value: "all" },
  { label: "Posts", value: "posts" },
  { label: "Artigos", value: "articles" },
  { label: "Vídeos", value: "videos" },
  { label: "Notícias", value: "news" },
  { label: "CyberLab", value: "cyberlab" },
];




// Social Posts data
const socialPosts: SocialPost[] = [
  {
    id: "post-1", author: "Dr. Carlos Silva", authorRole: "Especialista em Cibersegurança", authorAvatar: "https://i.pravatar.cc/100?img=11",
    date: "15 Mar 2026", content: "🔒 Dica do dia: Sempre ative a autenticação em dois fatores (2FA) em todas as suas contas. É a barreira extra que pode salvar seus dados!", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop", likes: 127, comments: 23, tags: ["Iniciante", "Segurança", "Privacidade"],
  },
  {
    id: "post-2", author: "Ana Rodrigues", authorRole: "Analista de Segurança", authorAvatar: "https://i.pravatar.cc/100?img=5",
    date: "14 Mar 2026", content: "⚠️ Alerta: Nova campanha de phishing usando IA para gerar e-mails extremamente convincentes. Fiquem atentos!", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop", likes: 89, comments: 15, tags: ["Intermediário", "Fraude", "IA"],
  },
  {
    id: "post-3", author: "Prof. Lucas Mendes", authorRole: "Pesquisador em IA e Segurança", authorAvatar: "https://i.pravatar.cc/100?img=12",
    date: "12 Mar 2026", content: "Acabei de publicar um estudo sobre como deepfakes estão sendo usados em ataques de engenharia social corporativa. Link nos comentários!", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop", likes: 234, comments: 41, tags: ["Avançado", "IA", "Tecnologia"],
  },
  {
    id: "post-4", author: "Mariana Oliveira", authorRole: "Consultora LGPD", authorAvatar: "https://i.pravatar.cc/100?img=9",
    date: "10 Mar 2026", content: "Empresas que não se adequaram à LGPD até agora estão correndo sérios riscos. Veja o checklist que preparei para adequação rápida.", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", likes: 156, comments: 28, tags: ["Intermediário", "Legislação", "Privacidade"],
  },
];

// Articles data
const articles = [
  { id: "golpes-pix", title: "Os 5 golpes via Pix mais perigosos de 2026", summary: "Conheça as táticas mais recentes usadas por criminosos para roubar dinheiro via Pix.", category: "Fraude", date: "15 Mar 2026", readTime: "6 min", author: "Dr. Carlos Silva", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop", tags: ["Iniciante", "Fraude", "Segurança"] },
  { id: "phishing-2026", title: "Phishing em 2026: como identificar e-mails falsos", summary: "Técnicas avançadas de phishing estão enganando até os mais experientes.", category: "Segurança", date: "10 Mar 2026", readTime: "8 min", author: "Ana Rodrigues", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop", tags: ["Intermediário", "Segurança", "Fraude"] },
  { id: "senhas-seguras", title: "Senhas seguras: o guia definitivo para 2026", summary: "Como criar senhas fortes e usar gerenciadores de senha de forma prática.", category: "Tecnologia", date: "20 Fev 2026", readTime: "5 min", author: "Rafael Santos", image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop", tags: ["Iniciante", "Tecnologia", "Privacidade"] },
  { id: "engenharia-social", title: "Engenharia social: a arte de manipular pessoas", summary: "Criminosos usam psicologia para enganar vítimas. Descubra as técnicas mais comuns.", category: "Segurança", date: "25 Fev 2026", readTime: "6 min", author: "Mariana Oliveira", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop", tags: ["Intermediário", "Segurança", "Educação"] },
  { id: "whatsapp-clonagem", title: "Clonagem de WhatsApp: como se proteger", summary: "Golpistas estão clonando contas do WhatsApp para aplicar golpes nos seus contatos.", category: "Fraude", date: "10 Fev 2026", readTime: "5 min", author: "Ana Rodrigues", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop", tags: ["Iniciante", "Fraude", "Redes Sociais"] },
];

// News data
const newsItems = [
  { id: "ransomware-empresas", title: "Ransomware: o pesadelo das empresas brasileiras", summary: "Ataques de ransomware cresceram 150% no Brasil em 2026.", category: "Tecnologia", date: "01 Mar 2026", readTime: "9 min", author: "Prof. Lucas Mendes", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop", tags: ["Avançado", "Tecnologia", "Segurança"] },
  { id: "vazamento-dados", title: "O que fazer após um vazamento de dados", summary: "Seus dados foram expostos? Saiba os passos imediatos.", category: "Segurança", date: "15 Fev 2026", readTime: "7 min", author: "Dr. Carlos Silva", image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=600&h=400&fit=crop", tags: ["Iniciante", "Segurança", "Privacidade"] },
  { id: "deepfake-perigos", title: "Deepfakes: a nova arma dos golpistas digitais", summary: "IA está sendo usada para criar vídeos falsos ultra-realistas.", category: "Tecnologia", date: "05 Fev 2026", readTime: "8 min", author: "Prof. Lucas Mendes", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop", tags: ["Avançado", "IA", "Tecnologia"] },
  { id: "lgpd-direitos", title: "LGPD: conheça seus direitos sobre seus dados pessoais", summary: "A Lei Geral de Proteção de Dados garante direitos importantes.", category: "Legislação", date: "05 Mar 2026", readTime: "7 min", author: "Dra. Juliana Costa", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", tags: ["Intermediário", "Legislação", "Privacidade"] },
];

// Videos data
const videoPosts: VideoPost[] = [
  { id: "v1", title: "Cibersegurança — O que é e por que importa?", description: "Entenda os fundamentos da segurança cibernética e como ela afeta o seu dia a dia.", thumbnail: "https://img.youtube.com/vi/inWWhr5tnEA/maxresdefault.jpg", duration: "10:21", views: "1.2M", author: "Simplilearn", date: "2023", videoId: "inWWhr5tnEA", tags: ["Iniciante", "Segurança", "Educação"] },
  { id: "v2", title: "Como hackers realmente invadem contas", description: "Veja as técnicas mais comuns usadas por hackers e como se proteger.", thumbnail: "https://img.youtube.com/vi/lpa8uy4DyMo/maxresdefault.jpg", duration: "14:07", views: "3.5M", author: "Linus Tech Tips", date: "2023", videoId: "lpa8uy4DyMo", tags: ["Avançado", "Segurança", "Tecnologia"] },
  { id: "v3", title: "5 dicas de segurança online que todos precisam", description: "Dicas práticas e simples para proteger seus dados na internet.", thumbnail: "https://img.youtube.com/vi/aO858HyFbKI/maxresdefault.jpg", duration: "8:45", views: "850K", author: "ThioJoe", date: "2024", videoId: "aO858HyFbKI", tags: ["Iniciante", "Privacidade", "Educação"] },
  { id: "v4", title: "Ransomware explicado em 6 minutos", description: "O que é ransomware, como funciona e como evitar ser vítima.", thumbnail: "https://img.youtube.com/vi/AR1qiGUdWKM/maxresdefault.jpg", duration: "6:12", views: "520K", author: "PowerCert", date: "2024", videoId: "AR1qiGUdWKM", tags: ["Intermediário", "Tecnologia", "Segurança"] },
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

      {/* Parallax Hero */}
      <section
        className="relative min-h-[380px] md:min-h-[440px] flex items-center justify-center bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url(${news})` }}
      >
        <div className="absolute inset-0 bg-[hsl(var(--background))]/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(var(--primary))]/5" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative z-10 w-full max-w-[1366px] mx-auto px-[2%] pt-28 pb-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            Blog <span className="text-gradient-gold">CyberGuard</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8"
          >
            {t("blog.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </motion.div>
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
      <section className="py-8 bg-background">
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
                          <div className="flex gap-1.5 mb-1.5 flex-wrap">
                            {article.tags?.map(tag => (
                              <span key={tag} className="text-[10px] font-bold rounded-full px-2 py-0.5 border border-primary/20 text-primary/70 bg-transparent">{tag}</span>
                            ))}
                          </div>
                          <h3 className="text-sm md:text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{article.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">{article.summary}</p>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.author}</span>
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
                            <div className="flex gap-1.5 mb-2 flex-wrap">
                              {video.tags?.map(tag => (
                                <span key={tag} className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${getTagClasses(tag, false)}`}>{tag}</span>
                              ))}
                            </div>
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
                  {activeTab === "all" && <h2 className="text-lg font-bold text-foreground mb-4">Informação sem  Fake News? Temos!</h2>}
                  {newsItems
                    .filter(n => matchesTheme(n, activeTheme))
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
                          <div className="flex gap-1.5 mb-1.5 flex-wrap">
                            {news.tags?.map(tag => (
                              <span key={tag} className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${getTagClasses(tag, false)}`}>{tag}</span>
                            ))}
                          </div>
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
