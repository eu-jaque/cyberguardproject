import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award, ChevronLeft, ChevronRight, Play, CheckCircle, Download, Send,
  ThumbsUp, ExternalLink, Star, ArrowRight,
  CalendarDays, Users, PencilRuler, Code, TestTube, Clock, Plus
} from "lucide-react";
import confettiLib from "canvas-confetti";
import type { Course } from "@/pages/Courses";

const COURSE_VIDEOS: Record<string, string[]> = {
  "Segurança e Redes": [
    "https://www.youtube.com/watch?v=Qmz3PGKT4KY",
    "https://www.youtube.com/watch?v=1mOLgC34aZs",
    "https://www.youtube.com/watch?v=PDiDHM3In3s&t=202s",
    "https://www.youtube.com/watch?v=yLZyb-qqmYs",
    "https://www.youtube.com/watch?v=sTlS-mrnQeM",
    "https://www.youtube.com/watch?v=u9kVRtxcv-w"
  ],
  "Ethical Hacking": [
    "https://www.youtube.com/watch?v=f4yavua1Uoo",
    "https://www.youtube.com/watch?v=uuh5ActJxRA",
    "https://www.youtube.com/watch?v=SbTmxD1aUgs",
    "https://www.youtube.com/watch?v=bYLXZ8LR97o",
    "https://www.youtube.com/watch?v=n8nI_IsH7rM",
    "https://www.youtube.com/watch?v=YxcLn0CiKaU"
  ],
  "Fundamentos da Cibersegurança": [
    "https://www.youtube.com/watch?v=UZu50GOsHt4",
    "https://www.youtube.com/watch?v=AWUhXq4FDNo",
    "https://www.youtube.com/watch?v=tI7OvhukTG8",
    "https://www.youtube.com/watch?v=NkKuVh19wTw",
    "https://www.youtube.com/watch?v=s8i4F-gPPdg",
    "https://www.youtube.com/watch?v=cCkWimEYl6U"
  ]
};

interface DashCoursesProps {
  courses: Course[];
  userEmail?: string;
}

export default function DashCourses({ courses, userEmail }: DashCoursesProps) {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [filterLevel, setFilterLevel] = useState<string>("Todos");
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openVideoUrl, setOpenVideoUrl] = useState<string | null>(null);
  const [events, setEvents] = useState<Record<string, string[]>>({ [new Date().toDateString()]: ["Fechamento de Módulo"] });
  const [addingEvent, setAddingEvent] = useState(false);
  const [newEventText, setNewEventText] = useState("");

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const dates = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) dates.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) dates.push({ date: new Date(year, month, i), isCurrentMonth: true });
    const remainingSlots = 42 - dates.length;
    for (let i = 1; i <= remainingSlots; i++) dates.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    return dates;
  };
  
  const today = new Date();

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

  // === Course List ===
  if (!activeCourse) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col xl:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-8 border-b border-border/30 pb-2">
            <h2 className="text-2xl font-bold text-foreground">Cursos</h2>
            <div className="hidden sm:flex gap-6 text-sm font-medium text-muted-foreground mt-1">
              {["Todos", "Avançado", "Intermediário", "Iniciante"].map(lvl => (
                <span 
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`cursor-pointer pb-2 transition-colors ${filterLevel === lvl ? "text-primary border-b-2 border-primary -mb-[9px]" : "hover:text-foreground"}`}
                >
                  {lvl}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {courses
              .filter(c => filterLevel === "Todos" || c.level === filterLevel)
              .map((c, idx) => {
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
                      <div className="bg-black/40 backdrop-blur-md px-2.5 py-1.5 flex items-center gap-1.5 rounded-lg text-white border border-white/5 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold leading-none">{c.duration}</span>
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
                      <button className="w-10 h-10 bg-primary/10 hover:bg-primary rounded-xl flex items-center justify-center text-primary hover:text-[#1C1F26] transition-colors group-hover:bg-primary group-hover:text-[#1C1F26]">
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
        <div className="w-full xl:w-80 flex flex-col justify-center space-y-8 self-center xl:self-stretch">
                   {/* Trending Courses Chart */}
          <div className="bg-[#1C1F26] border border-border/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Cursos em Alta</h3>
            <div className="flex items-end justify-between h-32 gap-2 mt-4">
              {[
                { name: "Hacking", value: 85, color: "from-primary/20 to-primary" },
                { name: "Redes", value: 65, color: "from-primary/20 to-primary/80" },
                { name: "Cloud", value: 92, color: "from-primary/30 to-primary" },
                { name: "Linux", value: 45, color: "from-primary/10 to-primary/60" },
                { name: "Python", value: 78, color: "from-primary/20 to-primary/90" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-end w-full h-full group">
                  <span className="text-[10px] font-bold text-white mb-1">{item.value}%</span>
                  <div className={`w-full bg-gradient-to-t ${item.color} rounded-t-md transition-all duration-500 hover:opacity-80 relative shadow-[0_0_15px_rgba(212,165,53,0.1)] group-hover:shadow-[0_0_20px_rgba(212,165,53,0.3)]`} style={{ height: `${item.value}%` }}></div>
                  <span className="text-[9px] text-muted-foreground group-hover:text-primary transition-colors mt-2 truncate w-full text-center px-1">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="flex bg-[#1C1F26] border border-border/10 rounded-2xl overflow-hidden select-none shadow-lg h-[280px]">
            {/* Left Panel (Gold Gradient) */}
            <div className="w-[35%] bg-gradient-to-br from-primary to-primary/60 p-4 flex flex-col justify-between text-[#1A1A1A]">
              <div>
                <div className="text-5xl font-black leading-none drop-shadow-sm">{selectedDate.getDate()}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                </div>
              </div>
              
              <div className="mt-4 flex-1 overflow-y-auto min-h-0 pl-1 -ml-1 pr-1">
                 <div className="flex justify-between items-center mb-1">
                   <p className="text-[10px] font-extrabold opacity-90 mb-1">Eventos Atuais</p>
                   {!addingEvent && (
                     <button onClick={() => setAddingEvent(true)} className="w-[14px] h-[14px] bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors">
                       <Plus className="w-2.5 h-2.5 text-[#1A1A1A]" />
                     </button>
                   )}
                 </div>
                 
                 <ul className="text-[9px] font-medium opacity-80 list-disc pl-3 space-y-0.5">
                   {(events[selectedDate.toDateString()] || []).length === 0 && !addingEvent && <li>Nenhum evento</li>}
                   {(events[selectedDate.toDateString()] || []).map((ev, i) => (
                     <li key={i}>{ev}</li>
                   ))}
                 </ul>

                 {addingEvent && (
                   <div className="mt-2 text-[9px]">
                     <input 
                       autoFocus 
                       value={newEventText} 
                       onChange={e => setNewEventText(e.target.value)} 
                       onKeyDown={e => {
                         if (e.key === 'Enter') {
                            if (newEventText.trim()) {
                               const dStr = selectedDate.toDateString();
                               setEvents(prev => ({...prev, [dStr]: [...(prev[dStr]||[]), newEventText.trim()]}));
                            }
                            setNewEventText("");
                            setAddingEvent(false);
                         }
                         if (e.key === 'Escape') {
                           setNewEventText("");
                           setAddingEvent(false);
                         }
                       }}
                       onBlur={() => {
                          if (newEventText.trim()) {
                               const dStr = selectedDate.toDateString();
                               setEvents(prev => ({...prev, [dStr]: [...(prev[dStr]||[]), newEventText.trim()]}));
                          }
                          setNewEventText("");
                          setAddingEvent(false);
                       }}
                       placeholder="Adicionar evento..." 
                       className="w-full bg-black/5 border-b border-black/20 focus:outline-none focus:border-black/50 px-1 py-1 placeholder:text-black/40 text-[#1A1A1A] font-medium" 
                     />
                   </div>
                 )}
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-[65%] p-4 flex flex-col bg-[#14171D]">
              {/* Month/Year Selector */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))} className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {currentMonthDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')} {currentMonthDate.getFullYear()}
                </span>
                <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))} className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["D","S","T","Q","Q","S","S"].map((day, i) => (
                  <span key={day+i} className="text-[9px] font-bold text-muted-foreground text-center">{day}</span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-y-1.5 gap-x-1 flex-1 items-start">
                {getMonthDates(currentMonthDate).map((item, i) => {
                   const { date, isCurrentMonth } = item;
                   const isToday = date.toDateString() === today.toDateString();
                   const isSelected = date.toDateString() === selectedDate.toDateString();

                   return (
                     <div key={i} onClick={() => { setSelectedDate(date); setCurrentMonthDate(date); }}
                       className={`text-[10px] h-6 flex items-center justify-center rounded-full cursor-pointer transition-all ${
                         isSelected ? "bg-primary text-[#1A1A1A] font-bold shadow-[0_0_10px_rgba(212,165,53,0.4)]" :
                         isToday ? "border border-primary text-primary font-bold" :
                         isCurrentMonth ? "text-white/80 hover:bg-white/10" : "text-white/20 hover:text-white/40"
                       }`}
                     >
                       {date.getDate()}
                     </div>
                   );
                })}
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    );
  }

  // === Course Player ===
  const videos = activeCourse.modules || [];
  const videoLinks = COURSE_VIDEOS[activeCourse.title] || [];
  
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {videos.map((v, i) => {
          const vId = v.id || v.title;
          const isActive = i === activeVideoIdx;
          const isCompleted = completedVideos.has(vId);
          const customUrl = videoLinks[i] || v.urlvideo || 'na';
          
          return (
            <div key={vId} onClick={() => { setActiveVideoIdx(i); setOpenVideoUrl(customUrl); }}
              className={`group flex flex-col p-6 rounded-3xl cursor-pointer transition-all duration-500 border ${isActive ? "border-primary/50 shadow-[0_0_40px_rgba(212,165,53,0.15)] bg-gradient-to-br from-[#1C1F26] to-[#2A2015]" : "border-white/5 hover:border-primary/30 bg-[#16181D] hover:bg-gradient-to-br hover:from-[#1C1F26] hover:to-[#222631]"}`}
            >
              {/* Icon Block */}
              <div className="mb-6 relative self-start">
                 <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center relative z-10 shadow-lg backdrop-blur-md">
                    {isCompleted ? <CheckCircle className="w-8 h-8 text-emerald-400" /> : <Play className={`w-8 h-8 ${isActive ? "text-primary" : "text-white/60"} ml-1`} />}
                 </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                Módulo {i + 1}: {v.title}
              </h3>
              
              <p className="text-sm text-white/50 line-clamp-3 mb-8 flex-1 leading-relaxed">
                {v.description || "Descrição visual de como realizar a tarefa descrita utilizando métodos práticos e rápidos."}
              </p>

              <div className="flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-primary transition-colors">
                 {isActive ? "Assistindo" : "Assistir aula"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {openVideoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-sm">
           <button onClick={() => setOpenVideoUrl(null)} className="absolute top-6 right-6 lg:top-10 lg:right-10 text-white/50 hover:text-primary transition-colors flex items-center gap-2">
             <span className="font-bold text-sm">FECHAR</span>
           </button>
           
           <div className="w-full max-w-6xl aspect-video relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(212,165,53,0.1)] bg-black">
             {openVideoUrl !== 'na' ? renderVideo(openVideoUrl) : (
                <div className="flex flex-col items-center justify-center h-full bg-[#1C1F26] text-white/50">
                  <Play className="w-16 h-16 mb-4 opacity-20" />
                  <p>Vídeo não disponível</p>
                </div>
             )}
             
             {/* Complete Button overlayed */}
             <div className="absolute bottom-6 right-6 z-30">
                <button onClick={() => markComplete(activeVideo?.id || activeVideo?.title || "1", videos.length)}
                  className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${completedVideos.has(activeVideo?.id || activeVideo?.title || "1") ? "bg-emerald-500 text-white" : "bg-primary text-[#1C1F26] hover:scale-105"}`}>
                  <CheckCircle className="w-5 h-5 flex-shrink-0" /> 
                  <span className="hidden sm:inline">{completedVideos.has(activeVideo?.id || activeVideo?.title || "1") ? "Concluído" : "Marcar como concluído"}</span>
                </button>
             </div>
           </div>
        </div>
      )}
    </motion.div>
  );
}
