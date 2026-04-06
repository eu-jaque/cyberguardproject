import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import supabase from "../../utils/supabase";
import confettiLib from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Award, MessageSquare, Shield, Gamepad2, LogOut,
  ChevronLeft, ChevronRight, Play, CheckCircle, Download, Share2,
  ThumbsUp, Heart, Flame, Lightbulb, Send, Menu, X, Loader2,
  Link2, Mail, Key, XCircle, Clock, LineChart, Edit,
  MoreHorizontal, ExternalLink, FileText
} from "lucide-react";
// import CircuitBackground from "@/components/CircuitBackground";
import EditProfileModal from "@/components/EditProfileModal";
import { Input } from "@/components/ui/input";
import type { Course } from "./Courses";

type SidebarItem = { icon: typeof BookOpen; label: string; key: string };

const sidebarItems: SidebarItem[] = [
  { icon: FileText, label: "Blog", key: "blog" },
  { icon: BookOpen, label: "Cursos", key: "courses" },
  { icon: Award, label: "Certificados", key: "certificates" },
  { icon: MessageSquare, label: "Comunidade", key: "community" },
  { icon: Gamepad2, label: "Quiz & Jogos", key: "quiz" },
  { icon: Shield, label: "Verificadores", key: "verifiers" },
];

const reactions = [
  { icon: ThumbsUp, label: "👍" },
  { icon: Heart, label: "❤️" },
  { icon: Flame, label: "🔥" },
  { icon: Lightbulb, label: "💡" },
];

const mockVideos = [
  { id: "v1", title: "Introdução ao módulo", duration: "12:30", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop" },
  { id: "v2", title: "Conceitos fundamentais", duration: "15:45", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop" },
  { id: "v3", title: "Prática guiada", duration: "20:10", thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop" },
  { id: "v4", title: "Estudo de caso", duration: "18:00", thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&h=200&fit=crop" },
  { id: "v5", title: "Exercícios práticos", duration: "22:15", thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&h=200&fit=crop" },
  { id: "v6", title: "Revisão e avaliação", duration: "10:00", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop" },
];

const communityQuestions = [
  { id: "1", author: "Maria", avatar: "M", question: "Como configurar firewall no Ubuntu?", status: "respondida", replies: 3 },
  { id: "2", author: "João", avatar: "J", question: "Melhor antivírus para Windows 2026?", status: "pendente", replies: 0 },
  { id: "3", author: "Ana", avatar: "A", question: "Dúvida sobre certificado SSL/TLS", status: "respondida", replies: 5 },
  { id: "4", author: "Pedro", avatar: "P", question: "Como detectar keylogger?", status: "pendente", replies: 1 },
];

const mockBlogPosts = [
  { id: "1", author: "Dr. Carlos Silva", role: "Especialista em Cibersegurança", date: "15 Mar 2026", avatar: "C", title: "Como proteger seus dados em redes públicas", content: "Redes Wi-Fi públicas são um prato cheio para hackers. Neste artigo, explico as melhores práticas para se manter seguro.", likes: 24, comments: 8 },
  { id: "2", author: "Ana Beatriz", role: "Pesquisadora de Segurança", date: "12 Mar 2026", avatar: "A", title: "Os 5 golpes mais comuns no Pix em 2026", content: "O Pix revolucionou os pagamentos, mas também abriu portas para novos golpes. Conheça os mais frequentes.", likes: 42, comments: 15 },
  { id: "3", author: "Prof. Ricardo Lopes", role: "Instrutor de Cybersecurity", date: "10 Mar 2026", avatar: "R", title: "Firewall: seu primeiro escudo digital", content: "Entenda como configurar um firewall doméstico e proteger toda a sua rede.", likes: 18, comments: 5 },
];

const mockQuizzes = [
  { id: "1", title: "Identificando Phishing", status: "concluído", score: "8/10", progress: 100 },
  { id: "2", title: "Segurança de Senhas", status: "em andamento", score: "—", progress: 60 },
  { id: "3", title: "Golpes no Pix", status: "não iniciado", score: "—", progress: 0 },
  { id: "4", title: "Privacidade Online", status: "concluído", score: "10/10", progress: 100 },
];

export default function Dash() {
  const { t } = useLanguage();
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("blog");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [blogSubTab, setBlogSubTab] = useState<"recent" | "old">("recent");

  // Course player
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());

  // Community
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: "1", author: "Aluno", text: "Ótima aula!", reaction: "👍" },
    { id: "2", author: "Professor", text: "Obrigado pelo feedback!", reaction: "❤️" },
  ]);

  // Verifiers
  const [linkInput, setLinkInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [pixInput, setPixInput] = useState("");
  const [linkResult, setLinkResult] = useState<"safe" | "danger" | null>(null);
  const [emailResult, setEmailResult] = useState<"safe" | "danger" | null>(null);
  const [pixResult, setPixResult] = useState<"safe" | "danger" | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("courses").select("*");
      if (data) setCourses(data as Course[]);

      // Load profile
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
        if (profile) {
          setProfileName(profile.full_name || user.email?.split("@")[0] || "Usuário");
          setProfileAvatar(profile.avatar_url || "");
        } else {
          setProfileName(user.email?.split("@")[0] || "Usuário");
        }
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const totalVideos = mockVideos.length;
  const completedCount = completedVideos.size;
  const progressPct = Math.round((completedCount / totalVideos) * 100);
  const isComplete = progressPct === 100;

  const markComplete = (videoId: string) => {
    const newSet = new Set(completedVideos);
    newSet.add(videoId);
    setCompletedVideos(newSet);
    if (newSet.size === totalVideos) {
      confettiLib({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ["#D4A535", "#F5D77A", "#B8860B", "#FFD700"] });
    }
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), author: user?.email || "Você", text: comment, reaction: "" }]);
    setComment("");
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/auth", { replace: true });
  };

  const checkLink = () => { if (!linkInput.trim()) return; setLinkResult(linkInput.includes("bit.ly") || !linkInput.startsWith("https") ? "danger" : "safe"); };
  const checkEmail = () => { if (!emailInput.trim()) return; setEmailResult(emailInput.includes("temp") || !emailInput.includes("@") ? "danger" : "safe"); };
  const checkPix = () => { if (!pixInput.trim()) return; setPixResult(pixInput.length < 5 ? "danger" : "safe"); };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  const avatarSrc = profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profileName}&backgroundColor=facc15`;

  return (
    <div className="min-h-screen flex relative">
      {/* <CircuitBackground /> */}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}
        style={{ background: "rgba(10,14,23,0.92)", backdropFilter: "blur(20px)" }}>

        {/* Profile in sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-border/20">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-yellow-400 overflow-hidden">
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{profileName}</p>
                <p className="text-[10px] text-muted-foreground">Estudante</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-secondary/30 text-muted-foreground">
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {sidebarItems.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <button
                onClick={() => { setActiveSection(item.key); setActiveCourse(null); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all group ${activeSection === item.key
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/20"
                  }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${activeSection === item.key ? "text-primary" : "group-hover:text-primary"}`} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            </motion.div>
          ))}
        </nav>

        <div className="p-3 space-y-1 border-t border-border/20">
          <button onClick={() => setShowEditProfile(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-secondary/20 transition-all">
            <Edit className="w-4 h-4" />
            {sidebarOpen && <span>Editar Perfil</span>}
          </button>
          <button onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 relative z-10 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Top bar with user name on right */}
        <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-border/10">
          <div className="lg:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg bg-secondary/30">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">{profileName}</span>
            <div className="w-8 h-8 rounded-full border-2 border-yellow-400 overflow-hidden">
              <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10">
          {/* Gradient Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0891b2, #115e59)" }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-3xl font-bold text-white">{courses.length}</p>
                  <p className="text-xs text-white/80 mt-1">Cursos Matriculados</p>
                </div>
                <Clock className="w-6 h-6 text-white/60" />
              </div>
            </div>
            <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #e11d48, #ea580c)" }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-3xl font-bold text-white">{completedCount}</p>
                  <p className="text-xs text-white/80 mt-1">Aulas Concluídas</p>
                </div>
                <Lightbulb className="w-6 h-6 text-white/60" />
              </div>
            </div>
            <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f, #10b981)" }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-3xl font-bold text-white">{isComplete ? 1 : 0}</p>
                  <p className="text-xs text-white/80 mt-1">Certificados</p>
                </div>
                <LineChart className="w-6 h-6 text-white/60" />
              </div>
            </div>
          </div>

          {/* ====== BLOG TAB ====== */}
          {activeSection === "blog" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setBlogSubTab("recent")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${blogSubTab === "recent" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/30"}`}>
                  Mais Recentes
                </button>
                <button onClick={() => setBlogSubTab("old")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${blogSubTab === "old" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/30"}`}>
                  Mais Antigas
                </button>
              </div>

              {(blogSubTab === "old" ? [...mockBlogPosts].reverse() : mockBlogPosts).map(post => (
                <div key={post.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{post.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{post.author}</p>
                        <p className="text-[11px] text-muted-foreground">{post.role} · {post.date}</p>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-full hover:bg-secondary/30 text-muted-foreground">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{post.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{post.content}</p>
                  </div>
                  <div className="flex items-center gap-6 pt-2 border-t border-border/20">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" /> Curtir ({post.likes})
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" /> Comentar ({post.comments})
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" /> Compartilhar
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ====== COURSES TAB ====== */}
          {activeSection === "courses" && !activeCourse && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Meus Cursos</h2>

              {/* Completed courses portal */}
              {isComplete && courses.length > 0 && (
                <div className="bg-card/60 backdrop-blur-md border border-primary/30 rounded-2xl p-6 space-y-4">
                  <div className="flex gap-4">
                    <img src={courses[0]?.url} alt="" className="w-24 h-24 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{courses[0]?.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">Concluído em 15/03/2026 · 40 horas</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl font-bold text-primary">9,5/10</span>
                        <span className="text-xs text-muted-foreground">Nota Final</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-gold rounded-full w-full" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
                      <Award className="w-4 h-4" /> Visualizar Certificado
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-secondary/50 text-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-secondary/70 transition-colors">
                      <Download className="w-4 h-4" /> Baixar PDF
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center gap-1.5 hover:bg-blue-500/30 transition-colors">
                      <ExternalLink className="w-4 h-4" /> LinkedIn
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(c => (
                  <div key={c.id} onClick={() => setActiveCourse(c)}
                    className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all group">
                    <img src={c.url} alt="" className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</h3>
                      <p className="text-xs text-muted-foreground">{c.level} · {c.duration}</p>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-gold rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{progressPct}% concluído</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ====== COURSE PLAYER ====== */}
          {activeSection === "courses" && activeCourse && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <button onClick={() => setActiveCourse(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <h2 className="text-xl font-bold text-foreground">{activeCourse.title}</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progresso do Curso</span><span>{progressPct}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-gold rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
              <div className="aspect-video bg-card/60 backdrop-blur-md border border-border/30 rounded-2xl overflow-hidden relative">
                <img src={mockVideos[activeVideoIdx].thumbnail} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                  <button onClick={() => markComplete(mockVideos[activeVideoIdx].id)}
                    className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    {completedVideos.has(mockVideos[activeVideoIdx].id)
                      ? <CheckCircle className="w-8 h-8 text-primary-foreground" />
                      : <Play className="w-8 h-8 text-primary-foreground ml-1" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockVideos.map((v, i) => (
                  <button key={v.id} onClick={() => setActiveVideoIdx(i)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${i === activeVideoIdx ? "border-primary shadow-lg" : "border-border/30 hover:border-primary/40"}`}>
                    <div className="aspect-video">
                      <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                      {completedVideos.has(v.id) && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-card/80">
                      <p className="text-[11px] font-medium text-foreground truncate">{v.title}</p>
                      <p className="text-[10px] text-muted-foreground">{v.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
              {/* Comments */}
              <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Comentários</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-foreground">{c.author[0]}</div>
                      <div className="flex-1 bg-secondary/20 rounded-xl px-3 py-2">
                        <span className="text-xs font-bold text-foreground">{c.author}</span>
                        <p className="text-xs text-foreground/80">{c.text}</p>
                        {c.reaction && <span className="text-sm">{c.reaction}</span>}
                        <div className="flex gap-1 mt-1">
                          {reactions.map(r => (<button key={r.label} className="text-sm hover:scale-125 transition-transform">{r.label}</button>))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()}
                    placeholder="Escreva um comentário..."
                    className="flex-1 bg-secondary/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <button onClick={addComment} className="p-2.5 rounded-xl bg-primary text-primary-foreground">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ====== CERTIFICATES TAB ====== */}
          {activeSection === "certificates" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Certificados</h2>
              {isComplete ? (
                <div className="rounded-2xl p-8 text-center space-y-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f, #d4a535)" }}>
                  <div className="text-6xl">🏅</div>
                  <h3 className="text-lg font-bold text-white">Parabéns! Certificado Disponível</h3>
                  <p className="text-sm text-white/80">Você concluiu 100% do curso.</p>
                  <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-white/30 transition-colors border border-white/20">
                    <Download className="w-5 h-5" /> Emitir Certificado
                  </button>
                </div>
              ) : (
                <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-2xl p-12 text-center">
                  <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Complete 100% de um curso para receber seu certificado.</p>
                  <p className="text-sm text-muted-foreground mt-2">Progresso atual: {progressPct}%</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ====== COMMUNITY TAB ====== */}
          {activeSection === "community" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Comunidade</h2>
              {/* Message input */}
              <div className="flex gap-2">
                <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()}
                  placeholder="Escreva uma mensagem para a comunidade..."
                  className="flex-1 bg-card/60 backdrop-blur-md border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                <button onClick={addComment} className="p-3 rounded-xl bg-primary text-primary-foreground">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {/* Feed */}
              <div className="space-y-3">
                {comments.map(c => (
                  <div key={c.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-4 flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">{c.author[0]}</div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-foreground">{c.author}</span>
                      <p className="text-xs text-foreground/80 mt-0.5">{c.text}</p>
                      <div className="flex gap-2 mt-2">
                        {reactions.map(r => (
                          <button key={r.label} className="text-sm hover:scale-125 transition-transform">{r.label}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {communityQuestions.map(q => (
                  <div key={q.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-foreground">{q.avatar}</div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{q.question}</h4>
                        <p className="text-xs text-muted-foreground">Por {q.author} · {q.replies} respostas</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${q.status === "respondida" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ====== QUIZ & JOGOS TAB ====== */}
          {activeSection === "quiz" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Quiz & Jogos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockQuizzes.map(q => (
                  <div key={q.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-foreground">{q.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${q.status === "concluído" ? "bg-emerald-500/20 text-emerald-400" :
                        q.status === "em andamento" ? "bg-amber-500/20 text-amber-400" :
                          "bg-secondary/50 text-muted-foreground"
                        }`}>{q.status}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-gold rounded-full transition-all" style={{ width: `${q.progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Pontuação: {q.score}</span>
                      <span>{q.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ====== VERIFIERS TAB ====== */}
          {activeSection === "verifiers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">{t("dash.verifiers")}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Link */}
                <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2"><Link2 className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{t("dash.check_link")}</span></div>
                  <Input value={linkInput} onChange={e => { setLinkInput(e.target.value); setLinkResult(null); }} placeholder={t("dash.enter_link")} />
                  <button onClick={checkLink} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">{t("dash.verify")}</button>
                  {linkResult && (
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${linkResult === "safe" ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
                      {linkResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {linkResult === "safe" ? "Seguro" : t("dash.danger")}
                    </div>
                  )}
                </div>
                {/* Email */}
                <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2"><Mail className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{t("dash.check_email")}</span></div>
                  <Input value={emailInput} onChange={e => { setEmailInput(e.target.value); setEmailResult(null); }} placeholder={t("dash.enter_email")} />
                  <button onClick={checkEmail} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">{t("dash.verify")}</button>
                  {emailResult && (
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${emailResult === "safe" ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
                      {emailResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {emailResult === "safe" ? "Seguro" : t("dash.danger")}
                    </div>
                  )}
                </div>
                {/* Pix */}
                <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2"><Key className="w-5 h-5 text-primary" /><span className="text-sm font-bold text-foreground">{t("dash.check_pix")}</span></div>
                  <Input value={pixInput} onChange={e => { setPixInput(e.target.value); setPixResult(null); }} placeholder={t("dash.enter_pix")} />
                  <button onClick={checkPix} className="w-full bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">{t("dash.verify")}</button>
                  {pixResult && (
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-md ${pixResult === "safe" ? "bg-emerald-500/10 text-emerald-400" : "bg-destructive/10 text-destructive"}`}>
                      {pixResult === "safe" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {pixResult === "safe" ? "Seguro" : t("dash.danger")}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentName={profileName}
        currentAvatar={profileAvatar}
        onSaved={(name, avatar) => { setProfileName(name); setProfileAvatar(avatar); }}
      />

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 text-center space-y-4">
              <LogOut className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-lg font-bold text-foreground">Deseja sair?</h3>
              <p className="text-sm text-muted-foreground">Seu progresso está salvo.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary/30 transition-colors">Cancelar</button>
                <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Sair</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
