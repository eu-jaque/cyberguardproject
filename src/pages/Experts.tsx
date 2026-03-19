import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Clock, Calendar, ChevronLeft, ChevronRight, Check, Video, GraduationCap, Award, Shield, LogIn, Laugh } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import confettiLib from "canvas-confetti";
import supabase from "../../utils/supabase";
import hackerBg from "@/assets/hacker-parallax.jpg";
import expertsBg from "@/assets/experts-bg.jpg";
import { useAuth } from "@/contexts/AuthContext";

export type Expert = ({
  name?: string;
  area?: string;
  rating?: number;
  available?: boolean;
  bio?: string;
  formation?: string;
  convenios?: string;
})

export type expenses = {
  name?: string,
  value?: string
}

export default function Experts(){
    const {user, signOutUser} = useAuth();

    const [experts, setExperts] = useState<Expert[]>([]);
    const [expert, setExpert] = useState<Expert  >();


  useEffect(() => {
        if(user) syncExperts(user.id);
    }, []);

    async function syncExperts(user_id: string ): Promise<void>{
        const {data, error} = await supabase.from('experts') .select('*').eq("user_id", user_id) .single();

        if(error){
            alert(error.message)
            return
        }

        setExperts(data);
    }
  
   async function handleExperts(){
        const data = {...experts, user_id: user?.id}; 

        const { error} = await supabase.from('experts')
            .insert(data);

        if(error){
            alert(error.message);
            return;
        }

        alert("SUCESSO AO CADASTRAR ESPECIALISTA");
    }
     return(
      <>
        <div>
          <h1>Especialistas</h1>
          <input type="text" placeholder="nome" value={expert.name} onChange={(e) => setExpert({...expert, name: e.target.value})} />
          <input type="text" placeholder="Área de Especialização" value={expert.area} onChange={(e) => setExpert({...expert, area: e.target.value})} />
          <input type="number" placeholder="Avaliação" value={expert.rating} onChange={(e) => setExpert({...expert, rating: Number(e.target.value)})} />
          <input type="checkbox" checked={expert.available}  onChange={(e) => setExpert({...expert, available: e.target.checked})} />
          <input type="text" placeholder="BIO" value={expert.bio} onChange={(e) => setExpert({...expert, bio: e.target.value})} />
          <input type="text" placeholder="Formação" value={expert.formation} onChange={(e) => setExpert({...expert, formation: e.target.value})} />
          <input type="text" placeholder="convenios" value={expert.convenios} onChange={(e) => setExpert({...expert, convenios: e.target.value})} />

          <button onClick={handleExperts} >Cadastrar Especialista</button>
        </div>

        <div>

        </div>
      </>
     )
  }



const videos = [
  { title: "Como identificar phishing em 5 passos", id: "EqQ-cDeKQLU" },
  { title: "Protegendo seu Wi-Fi doméstico", id: "DMkKcrwxlsc" },
  { title: "Senhas seguras: guia completo", id: "zefv-bNtZwg" },
  { title: "O que fazer após um vazamento de dados", id: "3uJszS1bk28" },
];

const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

type ViewState = "list" | "schedule" | "confirmation";

const Experts = () => {
  const { t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<typeof experts[0] | null>(null);
  const [viewState, setViewState] = useState<ViewState>("list");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSchedule = (expert: typeof experts[0]) => {
    setSelectedExpert(expert);
    setViewState("schedule");
    setSelectedDay(null);
    setSelectedTime(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirm = () => {
    setViewState("confirmation");
    confettiLib({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ade80', '#ffffff', '#fbbf24'],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setViewState("list");
    setSelectedExpert(null);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  // Confirmation view
  if (viewState === "confirmation" && selectedExpert) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="text-center bg-card p-10 rounded-[20px] shadow-lg max-w-md w-[90%] border border-border">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <Check className="w-12 h-12 text-background" strokeWidth={3} />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-3">Tudo pronto!</h1>
            <p className="text-muted-foreground mb-2">
              Sua consulta com <strong className="text-foreground">{selectedExpert.name}</strong> foi agendada com sucesso.
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              {daysOfWeek[selectedDay!]} às {selectedTime} — {selectedExpert.area}
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Você receberá um e-mail com os detalhes em breve.
            </p>
            <button
              onClick={handleBackToList}
              className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-lg font-bold text-sm"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
        <Footer />
        <Chatbot />
        <AccessibilityWidget />
      </div>
    );
  }

  // Schedule view
  if (viewState === "schedule" && selectedExpert) {
    return (

      
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-20">
          <div className="max-w-[1100px] mx-auto px-[2%]">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-primary mb-8 hover:underline font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar aos especialistas
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left - Profile */}
              <div className="glass-card">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-28 h-28 rounded-full border-4 border-primary overflow-hidden mb-4">
                    <img src={selectedExpert.avatar} alt={selectedExpert.name} className="w-full h-full object-cover" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-foreground">{selectedExpert.name}</h2>
                  <p className="text-primary text-sm font-medium">{selectedExpert.area}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-sm text-primary font-bold">{selectedExpert.rating}</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="font-display text-sm font-bold text-gradient-gold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" /> Apresentação
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{selectedExpert.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-gradient-gold mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" /> Formação
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{selectedExpert.formation}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-gradient-gold mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" /> Convênios
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpert.convenios.map((c, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Calendar */}
              <div className="glass-card">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-lg font-bold text-gradient-gold">{t("exp.schedule")}</h2>
                </div>

                <p className="text-muted-foreground text-sm mb-6">Selecione o dia e horário desejado:</p>

                <div className="flex gap-3 mb-6 flex-wrap">
                  {daysOfWeek.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className={`px-5 py-3 rounded-lg text-sm font-medium transition-all ${selectedDay === i
                        ? "btn-gold-3d text-primary-foreground"
                        : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                        }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {selectedDay !== null && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm transition-all ${selectedTime === time
                          ? "btn-gold-3d text-primary-foreground"
                          : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
                          }`}
                      >
                        <Clock className="w-3 h-3" /> {time}
                      </button>
                    ))}
                  </div>
                )}

                {selectedDay !== null && selectedTime && (
                  <div className="text-center mt-6">
                    <p className="text-foreground/70 text-sm mb-4">
                      {daysOfWeek[selectedDay]} às {selectedTime} com {selectedExpert.name}
                    </p>
                    <button
                      onClick={handleConfirm}
                      className="btn-gold-3d text-primary-foreground px-8 py-3 rounded-lg text-sm font-bold"
                    >
                      {t("exp.confirm")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <Chatbot />
        <AccessibilityWidget />
      </div>
    );
  }

  // Main list view
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Parallax */}
      <section
        className="parallax-section relative h-[500px] flex items-center justify-center"
        style={{ backgroundImage: `url(${hackerBg})` }}
      >
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("exp.title")} <span className="text-gradient-gold">{t("exp.title_highlight")}</span>
          </h1>
          <p className="text-foreground/80 text-xl">{t("exp.subtitle")}</p>
        </div>
      </section>

      {/* Expert Carousel */}
      <section className="py-16 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-2xl font-bold text-foreground mb-10 text-center">
            <span className="text-gradient-gold">{t("exp.our_experts")}</span>
          </h2>

          <div className="relative">
            {/* Arrows */}
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            {/* Carousel container */}
            <div
              className="overflow-hidden mx-12"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollBehavior: "smooth",
                }}
              >
                {/* Auto-scrolling wrapper */}
                <div
                  className={`flex gap-6 ${!isPaused ? "animate-carousel-scroll" : ""}`}
                  style={{ minWidth: "max-content" }}
                >
                  {[...experts, ...experts].map((expert, i) => (
                    <div
                      key={i}
                      className="expert-card flex-shrink-0 w-[300px] glass-card flex flex-col items-center text-center"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <div className="w-24 h-24 rounded-full border-[3px] border-primary overflow-hidden mb-4 shadow-lg shadow-primary/20">
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-display text-sm font-bold text-foreground mb-1">{expert.name}</h3>
                      <p className="text-muted-foreground text-xs mb-3">{expert.area}</p>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-3 h-3 text-primary fill-primary" />
                        <span className="text-xs text-primary font-bold">{expert.rating}</span>
                      </div>
                      <p className="text-muted-foreground text-xs mb-4 line-clamp-3 px-2">{expert.bio}</p>
                      <button
                        onClick={() => handleSchedule(expert)}
                        className="btn-gold-3d text-primary-foreground px-6 py-2 rounded-lg text-xs font-bold mt-auto"
                      >
                        Agendar Consulta
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {experts.map((_, i) => (
                <button
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/30 hover:bg-primary transition-colors"
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollTo({ left: i * 320, behavior: "smooth" });
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section
        className="py-16 relative"
        style={{ backgroundImage: `url(${expertsBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="max-w-[1366px] mx-auto px-[2%] relative z-10">
          <div className="flex items-center justify-center gap-2 mb-10">
            <Video className="w-6 h-6 text-primary" />
            <h2 className="font-display text-2xl font-bold text-gradient-gold">{t("exp.videos")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, i) => (
              <a
                key={i}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card group cursor-pointer block"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-3 border border-primary/30 relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-primary-foreground border-b-[8px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="text-foreground text-sm font-semibold">{video.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default Experts;
function confetti(args: { 
  particleCount: number; 
  spread: number; 
  origin: { y: number; }; 
  colors: string[]; 
}) {
  // Chamamos a biblioteca importada passando os argumentos recebidos
  confettiLib({
    particleCount: args.particleCount,
    spread: args.spread,
    origin: args.origin,
    colors: args.colors
  });
}

