import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award, ChevronLeft, Play, CheckCircle, Download, Send,
  ThumbsUp, Heart, Flame, Lightbulb, ExternalLink
} from "lucide-react";
import confettiLib from "canvas-confetti";
import type { Course } from "@/pages/Courses";

const mockVideos = [
  { id: "v1", title: "Introdução ao módulo", duration: "12:30", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop" },
  { id: "v2", title: "Conceitos fundamentais", duration: "15:45", thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop" },
  { id: "v3", title: "Prática guiada", duration: "20:10", thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop" },
  { id: "v4", title: "Estudo de caso", duration: "18:00", thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&h=200&fit=crop" },
  { id: "v5", title: "Exercícios práticos", duration: "22:15", thumbnail: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&h=200&fit=crop" },
  { id: "v6", title: "Revisão e avaliação", duration: "10:00", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=200&fit=crop" },
];

const reactions = [
  { icon: ThumbsUp, label: "👍" },
  { icon: Heart, label: "❤️" },
  { icon: Flame, label: "🔥" },
  { icon: Lightbulb, label: "💡" },
];

interface DashCoursesProps {
  courses: Course[];
  userEmail?: string;
}

export default function DashCourses({ courses, userEmail }: DashCoursesProps) {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: "1", author: "Aluno", text: "Ótima aula!", reaction: "👍" },
    { id: "2", author: "Professor", text: "Obrigado pelo feedback!", reaction: "❤️" },
  ]);

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
    setComments(prev => [...prev, { id: Date.now().toString(), author: userEmail || "Você", text: comment, reaction: "" }]);
    setComment("");
  };

  // === Course List ===
  if (!activeCourse) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Meus Cursos</h2>

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
    );
  }

  // === Course Player ===
  return (
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
  );
}
