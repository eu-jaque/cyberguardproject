import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import confettiLib from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Award, MessageSquare, LogOut,
  ChevronLeft, ChevronRight, Play, CheckCircle, Download,
  ThumbsUp, Heart, Flame, Lightbulb, Send, Menu, X, Loader2
} from "lucide-react";
import type { Course } from "./Courses";

type SidebarItem = { icon: typeof LayoutDashboard; label: string; key: string };

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: BookOpen, label: "Meus Cursos", key: "courses" },
  { icon: Award, label: "Certificados", key: "certificates" },
  { icon: MessageSquare, label: "Comunidade", key: "community" },
];

const reactions = [
  { icon: ThumbsUp, label: "👍" },
  { icon: Heart, label: "❤️" },
  { icon: Flame, label: "🔥" },
  { icon: Lightbulb, label: "💡" },
];

// Mock video data per module
const mockVideos = [
  { id: "v1", title: "Introdução ao módulo", duration: "12:30", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop" },
  { id: "v2", title: "Conceitos fundamentais", duration: "15:45", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop" },
  { id: "v3", title: "Prática guiada", duration: "20:10", thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop" },
  { id: "v4", title: "Estudo de caso", duration: "18:00", thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&h=200&fit=crop" },
  { id: "v5", title: "Exercícios práticos", duration: "22:15", thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&h=200&fit=crop" },
  { id: "v6", title: "Revisão e avaliação", duration: "10:00", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop" },
];

const communityQuestions = [
  { id: "1", author: "Maria", question: "Como configurar firewall no Ubuntu?", status: "respondida", replies: 3 },
  { id: "2", author: "João", question: "Melhor antivírus para Windows 2026?", status: "pendente", replies: 0 },
  { id: "3", author: "Ana", question: "Dúvida sobre certificado SSL/TLS", status: "respondida", replies: 5 },
  { id: "4", author: "Pedro", question: "Como detectar keylogger?", status: "pendente", replies: 1 },
];

export default function StudentDashboard() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Course player state
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: "1", author: "Aluno", text: "Ótima aula!", reaction: "👍" },
    { id: "2", author: "Professor", text: "Obrigado pelo feedback!", reaction: "❤️" },
  ]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("courses").select("*");
      if (data) setCourses(data as Course[]);
      setLoading(false);
    }
    load();
  }, []);

  // Progress calculation
  const totalVideos = mockVideos.length;
  const completedCount = completedVideos.size;
  const progressPct = Math.round((completedCount / totalVideos) * 100);
  const isComplete = progressPct === 100;

  const markComplete = (videoId: string) => {
    const newSet = new Set(completedVideos);
    newSet.add(videoId);
    setCompletedVideos(newSet);

    if (newSet.size === totalVideos) {
      confettiLib({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#D4A535", "#F5D77A", "#B8860B", "#FFD700"],
      });
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

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} bg-[hsl(216,71%,8%)]/80 backdrop-blur-xl border-r border-border/30 flex flex-col`}>
        <div className="flex items-center justify-between p-4">
          {sidebarOpen && <span className="text-sm font-bold text-gradient-gold">CyberGuard</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-secondary/30 text-muted-foreground">
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setActiveSection(item.key); setActiveCourse(null); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all group ${
                activeSection === item.key
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/20"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${activeSection === item.key ? "text-primary" : "group-hover:text-primary"}`} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border/20">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Mobile toggle */}
        <header className="lg:hidden p-4 flex items-center gap-3 border-b border-border/30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg bg-secondary/30">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-foreground">Painel do Aluno</span>
        </header>

        <div className="p-6 md:p-10">
          {/* DASHBOARD */}
          {activeSection === "dashboard" && !activeCourse && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Olá, {user?.email?.split("@")[0]} 👋</h1>
                <p className="text-muted-foreground text-sm">Continue sua jornada em cibersegurança.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border/50 rounded-xl p-5">
                  <BookOpen className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{courses.length}</p>
                  <p className="text-xs text-muted-foreground">Cursos Disponíveis</p>
                </div>
                <div className="bg-card border border-border/50 rounded-xl p-5">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mb-2" />
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                  <p className="text-xs text-muted-foreground">Aulas Concluídas</p>
                </div>
                <div className="bg-card border border-border/50 rounded-xl p-5">
                  <Award className="w-5 h-5 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">{isComplete ? 1 : 0}</p>
                  <p className="text-xs text-muted-foreground">Certificados</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Seus Cursos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map(c => (
                    <div key={c.id} onClick={() => { setActiveCourse(c); setActiveSection("courses"); }}
                      className="bg-card border border-border/50 rounded-xl p-4 flex gap-4 cursor-pointer hover:border-primary/40 transition-all group">
                      <img src={c.url} alt="" className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{c.level} · {c.duration}</p>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-gold rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{progressPct}% concluído</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* COURSE PLAYER */}
          {(activeSection === "courses" && activeCourse) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <button onClick={() => setActiveCourse(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>

              <h2 className="text-xl font-bold text-foreground">{activeCourse.title}</h2>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progresso do Curso</span>
                  <span>{progressPct}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-gold rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              {/* Video player area */}
              <div className="aspect-video bg-card border border-border/50 rounded-2xl overflow-hidden relative group">
                <img src={mockVideos[activeVideoIdx].thumbnail} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                  <button
                    onClick={() => markComplete(mockVideos[activeVideoIdx].id)}
                    className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    {completedVideos.has(mockVideos[activeVideoIdx].id)
                      ? <CheckCircle className="w-8 h-8 text-primary-foreground" />
                      : <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    }
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-background/80 px-3 py-1 rounded-lg">
                  <span className="text-xs font-bold text-foreground">{mockVideos[activeVideoIdx].title}</span>
                </div>
              </div>

              {/* Video grid 2x3 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockVideos.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVideoIdx(i)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeVideoIdx ? "border-primary shadow-lg" : "border-border/30 hover:border-primary/40"
                    }`}
                  >
                    <div className="aspect-video">
                      <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                      {completedVideos.has(v.id) && (
                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-card">
                      <p className="text-[11px] font-medium text-foreground truncate">{v.title}</p>
                      <p className="text-[10px] text-muted-foreground">{v.duration}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Comments section */}
              <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Comentários</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-foreground">
                        {c.author[0]}
                      </div>
                      <div className="flex-1 bg-secondary/20 rounded-xl px-3 py-2">
                        <span className="text-xs font-bold text-foreground">{c.author}</span>
                        <p className="text-xs text-foreground/80">{c.text}</p>
                        {c.reaction && <span className="text-sm">{c.reaction}</span>}
                        <div className="flex gap-1 mt-1">
                          {reactions.map(r => (
                            <button key={r.label} className="text-sm hover:scale-125 transition-transform">{r.label}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addComment()}
                    placeholder="Escreva um comentário..."
                    className="flex-1 bg-secondary/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button onClick={addComment} className="p-2.5 rounded-xl bg-primary text-primary-foreground">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* COURSES LIST */}
          {activeSection === "courses" && !activeCourse && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Meus Cursos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(c => (
                  <div key={c.id} onClick={() => setActiveCourse(c)}
                    className="bg-card border border-border/50 rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all group">
                    <img src={c.url} alt="" className="w-full h-40 object-cover" />
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</h3>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-gold rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CERTIFICATES */}
          {activeSection === "certificates" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Certificados</h2>
              {isComplete ? (
                <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center space-y-4">
                  <div className="text-6xl">🏅</div>
                  <h3 className="text-lg font-bold text-foreground">Parabéns! Certificado Disponível</h3>
                  <p className="text-sm text-muted-foreground">Você concluiu 100% do curso.</p>
                  <button className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto">
                    <Download className="w-5 h-5" /> Baixar Certificado
                  </button>
                </div>
              ) : (
                <div className="bg-card border border-border/50 rounded-2xl p-12 text-center">
                  <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">Complete 100% de um curso para receber seu certificado.</p>
                  <p className="text-sm text-muted-foreground mt-2">Progresso atual: {progressPct}%</p>
                </div>
              )}
            </motion.div>
          )}

          {/* COMMUNITY */}
          {activeSection === "community" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Comunidade</h2>
              <div className="space-y-3">
                {communityQuestions.map(q => (
                  <div key={q.id} className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{q.question}</h4>
                      <p className="text-xs text-muted-foreground">Por {q.author} · {q.replies} respostas</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      q.status === "respondida" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Logout modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 text-center space-y-4"
            >
              <LogOut className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-lg font-bold text-foreground">Deseja sair?</h3>
              <p className="text-sm text-muted-foreground">Seu progresso está salvo. Você pode voltar a qualquer momento.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary/30 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">
                  Sair
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
