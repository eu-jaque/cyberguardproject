import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Calendar, ArrowRight, Search, Tag, Clock, User, Play, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import Comments from "@/components/comments";
import Reactions from "@/components/reactions";

type PostType = "article" | "video" | "news";

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

const categories = ["Todos", "Fraude", "Segurança", "Tecnologia", "Legislação", "Tutorial"];
const tabs: { label: string; value: "all" | PostType }[] = [
  { label: "Todos", value: "all" },
  { label: "Artigos", value: "article" },
  { label: "Vídeos", value: "video" },
  { label: "Notícias", value: "news" },
];

const categoryColors: Record<string, string> = {
  Fraude: "bg-primary/20 text-primary border-primary/30",
  Segurança: "bg-primary/20 text-primary border-primary/30",
  Tecnologia: "bg-primary/20 text-primary border-primary/30",
  Legislação: "bg-primary/20 text-primary border-primary/30",
  Tutorial: "bg-primary/20 text-primary border-primary/30",
};

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | PostType>("all");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [email, setEmail] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || post.type === activeTab;
    const matchesCat = activeCategory === "Todos" || post.category === activeCategory;
    return matchesSearch && matchesTab && matchesCat;
  });

  const popularPosts = blogPosts.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-card to-background">
        <div className="max-w-[1366px] mx-auto px-[2%] text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Blog <span className="text-gradient-gold">CyberGuard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            {t("blog.subtitle")}
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar artigos por título ou palavra-chave..."
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
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
<<<<<<< HEAD
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
=======
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
>>>>>>> a5461d5ec87796e88a719eafa73518dc8e76519b
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
            {/* Main */}
            <div>
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
<<<<<<< HEAD
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50"
                    }`}
=======
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === cat
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50"
                      }`}
>>>>>>> a5461d5ec87796e88a719eafa73518dc8e76519b
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
<<<<<<< HEAD
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="glass-card group cursor-pointer hover:border-primary/30 transition-all"
                    >
                      <div className="aspect-video bg-secondary/30 rounded-lg mb-4 overflow-hidden relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {post.type === "video" && (
                          <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                              <Play className="w-6 h-6 text-primary-foreground ml-1" />
                            </div>
                          </div>
                        )}
                        <span
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold border ${
                            categoryColors[post.category] || "bg-card text-foreground border-border"
                          }`}
                        >
                          {post.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                      </div>

                      <h3 className="font-display text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.summary}</p>

                      {post.type === "video" && post.videoId ? (
                        <a
                          href={`https://www.youtube.com/watch?v=${post.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                        >
                          Assistir vídeo <Play className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          {t("blog.read_more")} <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
=======
                <div className="space-y-0 divide-y divide-border/50">
                  {/* Featured first post */}
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

                  {/* Rest as horizontal feed cards */}
                  {filteredPosts.slice(1).map((post) => (
                    <article key={post.id} className="group cursor-pointer flex gap-5 py-6 hover:bg-card/50 -mx-4 px-4 rounded-xl transition-colors" onClick={() => setSelectedPost(post)}>
                      <div className="flex-shrink-0 w-40 h-28 md:w-52 md:h-32 rounded-xl overflow-hidden relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        {post.type === "video" && (
                          <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center"><Play className="w-4 h-4 text-primary-foreground ml-0.5" /></div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${categoryColors[post.category] || "bg-card text-foreground border-border"}`}>{post.category}</span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                        </div>
                        <h3 className="font-display text-sm md:text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 hidden sm:block">{post.summary}</p>
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                        </div>
                      </div>
>>>>>>> a5461d5ec87796e88a719eafa73518dc8e76519b
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Popular Posts */}
              <div className="glass-card">
                <h3 className="font-display text-sm font-bold text-gradient-gold mb-4">Mais Lidos</h3>
                <div className="space-y-4">
                  {popularPosts.map((post, i) => (
                    <div key={post.id} className="flex gap-3 cursor-pointer group">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img src={post.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground">{post.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="glass-card">
                <h3 className="font-display text-sm font-bold text-gradient-gold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Newsletter
                </h3>
                <p className="text-muted-foreground text-xs mb-4">
                  Receba dicas de segurança digital diretamente no seu e-mail.
                </p>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="w-full btn-gold-3d text-primary-foreground py-2 rounded-lg text-xs font-bold">
                  Inscrever-se
                </button>
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
            <Reactions />
            <Comments />
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
