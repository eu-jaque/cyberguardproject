import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award, ChevronLeft, Play, CheckCircle, Download, Send,
  ThumbsUp, Heart, Flame, Lightbulb, ExternalLink, Star, ArrowRight,
  CalendarDays, Users, PencilRuler, Code, TestTube
} from "lucide-react";
import confettiLib from "canvas-confetti";
import type { Course } from "@/pages/Courses";


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

  const totalVideosStr = completedVideos.size; // Global completed count
  const isComplete = false; // Mock global completion for now to not break layout immediately

  const markComplete = (videoId: string, modulesCount: number) => {
    const newSet = new Set(completedVideos);
    newSet.add(videoId);
    setCompletedVideos(newSet);

    // Check if current course is complete
    let courseCompleted = 0;
    activeCourse?.modules?.forEach(m => {
      if (newSet.has(m.id || m.title)) courseCompleted++;
    });

    if (courseCompleted === modulesCount && modulesCount > 0) {
      confettiLib({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ["#D4A535", "#F5D77A", "#B8860B", "#FFD700"] });
    }
  };

  const renderVideo = (url: string) => {
    if (!url) return null;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let embedId = '';
      if (url.includes('youtu.be/')) {
        embedId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('watch?v=')) {
        embedId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('embed/')) {
        embedId = url.split('embed/')[1].split('?')[0];
      }

      if (embedId) {
        return (
          <iframe
            className="w-full h-full bg-black z-20 relative"
            src={`https://www.youtube.com/embed/${embedId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      }
    }

    return (
      <video
        controls
        className="w-full h-full bg-black z-20 relative"
        src={url}
      />
    );
  };

  const addComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), author: userEmail || "Você", text: comment, reaction: "" }]);
    setComment("");
  };

  // === Course List ===
  if (!activeCourse) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col xl:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-8 border-b border-border/30 pb-2">
            <h2 className="text-2xl font-bold text-foreground">Courses</h2>
            <div className="hidden sm:flex gap-6 text-sm font-medium text-muted-foreground mt-1">
              <span className="text-primary border-b-2 border-primary pb-2 -mb-[9px] cursor-pointer">All</span>
              <span className="hover:text-foreground transition-colors cursor-pointer pb-2">Advanced</span>
              <span className="hover:text-foreground transition-colors cursor-pointer pb-2">Intermediate</span>
              <span className="hover:text-foreground transition-colors cursor-pointer pb-2">Beginner</span>
            </div>
          </div>

          <div className="space-y-4">
            {courses.map((c, idx) => {
              const mods = c.modules || [];
              let compl = 0;
              mods.forEach(m => { if (completedVideos.has(m.id || m.title)) compl++; });
              const prog = mods.length > 0 ? Math.round((compl / mods.length) * 100) : 0;
              const hasDiscount = idx % 2 === 1;
              
              return (
                <div key={c.id} onClick={() => { setActiveCourse(c); setActiveVideoIdx(0); }}
                  className="bg-[#1C1F26] border border-border/10 rounded-2xl p-4 flex flex-col md:flex-row gap-6 cursor-pointer hover:border-primary/30 hover:bg-[#232730] transition-all group">
                  
                  {/* Image Section */}
                  <div className="relative w-full md:w-56 h-36 rounded-xl overflow-hidden shrink-0">
                    <img src={c.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-white/70 font-medium">Início:</p>
                        <p className="text-xs text-white font-bold">Imediato</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{c.title}</h3>
                       <div className="flex items-center gap-1 text-primary text-xs font-bold">
                         <Star className="w-3.5 h-3.5 fill-current" />
                         <span>{c.rating || "4.8"}</span>
                       </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 max-w-lg">
                      {c.description || "The course provides hands-on training in basic methodologies and techniques."}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/80">
                          {c.category || "Development"}
                        </span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white/80">
                          {c.level || "Iniciante"}
                        </span>
                      </div>
                      <button className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white transition-colors group-hover:bg-primary">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-80 space-y-8">
          
          {/* Calendar Widget */}
          <div className="bg-[#1C1F26] border border-border/10 rounded-2xl p-5">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-white">November 2026</h3>
               <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
             </div>
             <div className="flex justify-between text-xs text-muted-foreground font-medium mb-3">
               <span>SUN</span><span>MON</span><span className="text-blue-400">TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
             </div>
             <div className="flex justify-between text-sm font-bold text-white/80">
               <span className="opacity-50">12</span><span>13</span>
               <span className="text-blue-400 border-b-2 border-blue-400 pb-1 -mb-1">14</span>
               <span>15</span><span>16</span><span>17</span><span>18</span>
             </div>
          </div>

          {/* Trending Courses Chart */}
          <div className="bg-[#1C1F26] border border-border/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Cursos em Alta</h3>
            <div className="flex items-end justify-between h-32 gap-2 mt-4">
              {[
                { name: "Hacking", value: 85, color: "bg-primary" },
                { name: "Redes", value: 65, color: "bg-blue-500" },
                { name: "Cloud", value: 92, color: "bg-purple-500" },
                { name: "Linux", value: 45, color: "bg-emerald-500" },
                { name: "Python", value: 78, color: "bg-pink-500" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-end w-full h-full group">
                  <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity mb-1">{item.value}%</span>
                  <div className={`w-full ${item.color} rounded-t-md transition-all duration-500 hover:opacity-80 relative`} style={{ height: `${item.value}%` }}></div>
                  <span className="text-[9px] text-muted-foreground mt-2 truncate w-full text-center px-1">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Process */}
          <div className="bg-[#1C1F26] border border-border/10 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-sm font-bold text-white">Learning Process</h3>
              <span className="text-xs text-muted-foreground cursor-pointer hover:text-white">See all</span>
            </div>
            <div className="space-y-4">
              {courses.slice(0, 3).map((c, i) => {
                const mods = c.modules || [];
                let compl = 0;
                mods.forEach(m => { if (completedVideos.has(m.id || m.title)) compl++; });
                const prog = mods.length > 0 ? Math.round((compl / mods.length) * 100) : (40 + (i * 20)); // Fake progress if 0 for UI sake
                
                const colors = ["bg-emerald-500", "bg-purple-500", "bg-blue-500"];
                const color = colors[i % colors.length];

                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-white/80">{c.title}</span>
                       <span className="text-muted-foreground">{prog}%</span>
                    </div>
                    <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                       <div className={`h-full ${color} rounded-full`} style={{ width: `${prog}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </motion.div>
    );
  }

  // === Course Player ===
  const videos = activeCourse.modules || [];
  const activeVideo = videos[activeVideoIdx];
  const videoId = activeVideo?.id || activeVideo?.title || "1";

  let currentCompleted = 0;
  videos.forEach(m => { if (completedVideos.has(m.id || m.title)) currentCompleted++; });
  const activeProgPct = videos.length > 0 ? Math.round((currentCompleted / videos.length) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <button onClick={() => setActiveCourse(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
        <ChevronLeft className="w-4 h-4" /> Voltar
      </button>
      <h2 className="text-xl font-bold text-foreground">{activeCourse.title}</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progresso do Curso</span><span>{activeProgPct}%</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-gradient-gold rounded-full transition-all duration-700" style={{ width: `${activeProgPct}%` }} />
        </div>
      </div>

      {activeVideo ? (
        <div className="aspect-video bg-card/60 backdrop-blur-md border border-border/30 rounded-2xl overflow-hidden relative">
          {activeVideo.urlvideo ? renderVideo(activeVideo.urlvideo) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/20">
              <Play className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-bold text-foreground">Vídeo indisponível</h3>
            </div>
          )}
          <div className="absolute bottom-4 right-4 z-30 flex items-center justify-center">
            <button onClick={() => markComplete(videoId, videos.length)}
              className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              {completedVideos.has(videoId)
                ? <CheckCircle className="w-6 h-6 text-primary-foreground" />
                : <CheckCircle className="w-6 h-6 text-primary-foreground opacity-50" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="aspect-video bg-card/60 backdrop-blur-md border border-border/30 rounded-2xl overflow-hidden flex items-center justify-center">
          <p className="text-muted-foreground">Este curso ainda não possui módulos.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {videos.map((v, i) => {
          const vId = v.id || v.title;
          return (
            <button key={vId} onClick={() => setActiveVideoIdx(i)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${i === activeVideoIdx ? "border-primary shadow-lg" : "border-border/30 hover:border-primary/40"}`}>
              <div className="aspect-video relative">
                <img src={activeCourse.url} alt="" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/70" />
                </div>
                {completedVideos.has(vId) && (
                  <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <div className="p-2 bg-card/80 text-left">
                <p className="text-[11px] font-medium text-foreground truncate">Módulo {i + 1}: {v.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{v.description}</p>
              </div>
            </button>
          );
        })}
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
