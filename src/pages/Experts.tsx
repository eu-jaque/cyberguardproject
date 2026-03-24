import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Clock, Calendar, ChevronLeft, ChevronRight, Check, Video, GraduationCap, Award, Shield } from "lucide-react";
import { useState,useEffect, useRef } from "react";
import confettiLib from "canvas-confetti";
import supabase from "../../utils/supabase";
import hackerBg from "@/assets/hacker-parallax.jpg";
import { useAuth } from "@/contexts/AuthContext";
import ExpertVideo from "@/components/ExpertVideo";

const ExpertVideoSection = () => { 
  return (
    <div>
      {/* Agora o React sabe que este é o componente que veio do import */}
      <ExpertVideo /> 
    </div>
  );
};

export type Expert = ({
  id?:string;
  name?: string;
  area?: string;
  rating?: number;
  available?: boolean;
  bio?: string;
  formation?: string;
  convenios?: string;
})

type ViewState = "list" | "schedule" | "confirmation";

const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export default function Experts(){
    const {user} = useAuth();
    const { t } = useLanguage();
    const [experts, setExperts] = useState<Expert[]>([]);
    const [expert, setExpert] = useState<Expert>({ name: '', area: '', rating: 5, available: true });
    const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
    const [viewState, setViewState] = useState<ViewState>("list");
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

// --- Efeitos e Supabase ---
  useEffect(() => {
        if(user) syncExperts();
    }, []);

    async function syncExperts(): Promise<void>{
        const {data, error} = await supabase.from('experts') .select('*');
        if(error){
            alert(error.message)
            return
        }

        setExperts(data || [] );
    }
  
   async function handleCreateExpert(){
    const { error} = await supabase.from('experts').insert([experts]);
      if(error){
        alert(error.message);
      }else {
      alert("Especialista cadastrado!");
      syncExperts();
      setExpert({ name: '', area: '', rating: 5, available: true }); // Limpa form
    }
    }
    const handleSchedule = (exp: Expert) => {
    setSelectedExpert(exp);
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
 
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
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
};

 // --- Renderização Condicional ---

  // 1. TELA DE CONFIRMAÇÃO
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
       
      </div>
    );
  }
    // 2. TELA DE LISTAGEM E CADASTRO
     return(
      <div className="p-8 max-w-4xl mx-auto">
      {viewState === "list" ? (
      <>
          <section className="mb-12 p-6 bg-slate-50 rounded-xl border"></section>
          <h1>Especialistas</h1>
          <div className="grid grid-cols-2 gap-4"> </div>
          <input type="text" placeholder="nome" value={expert.name} onChange={(e) => setExpert({...expert, name: e.target.value})} />
          <input type="text" placeholder="Área de Especialização" value={expert.area} onChange={(e) => setExpert({...expert, area: e.target.value})} />
          <input type="number" placeholder="Avaliação" value={expert.rating} onChange={(e) => setExpert({...expert, rating: Number(e.target.value)})} />
          <input type="checkbox" checked={expert.available}  onChange={(e) => setExpert({...expert, available: e.target.checked})} />
          <input type="text" placeholder="BIO" value={expert.bio} onChange={(e) => setExpert({...expert, bio: e.target.value})} />
          <input type="text" placeholder="Formação" value={expert.formation} onChange={(e) => setExpert({...expert, formation: e.target.value})} />
          <input type="text" placeholder="convenios" value={expert.convenios} onChange={(e) => setExpert({...expert, convenios: e.target.value})} />

          <button onClick={handleCreateExpert}className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"> Cadastrar Especialista </button>
        <div>
        <section>

        </section>
        <h2 className="mt-8">Lista de Especialistas</h2>
        <div className="grid gap-4">
           {experts.map((exp) => (
          <div key={exp.id} className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm"> </div>
          <div>
          <h3 className="font-bold text-lg">{exp.name}</h3>
          <p className="text-gray-600">{exp.area} • {exp.rating}⭐</p>
          </div>
           <button 
                    onClick={() => handleSchedule(exp)}
                    className="bg-gold-500 border border-amber-400 px-4 py-2 rounded-md hover:bg-amber-50"
                  >
                    Agendar Horário
                  </button>
                
        ))}
       </div>
      </section>
      
    </>
  );

    return (
      <div className="min-h-screen bg-background pt-20 px-4">
        <div className="max-w-[1100px] mx-auto">
          <button onClick={handleBackToList} className="flex items-center gap-2 text-primary mb-8 hover:underline">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda: Perfil */}
            <div className="glass-card p-6">
              <div className="flex flex-col items-center mb-6">
                <img src={selectedExpert.avatar || '/placeholder.png'} className="w-28 h-28 rounded-full border-4 border-primary object-cover mb-4" alt="" />
                <h2 className="text-xl font-bold">{selectedExpert.name}</h2>
                <p className="text-primary">{selectedExpert.area}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="font-bold">{selectedExpert.rating}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                   <h3 className="flex items-center gap-2 font-bold text-gradient-gold mb-2"><Shield className="w-4 h-4"/> Bio</h3>
                   <p className="text-sm text-muted-foreground">{selectedExpert.bio}</p>
                </div>
                <div>
                   <h3 className="flex items-center gap-2 font-bold text-gradient-gold mb-2"><GraduationCap className="w-4 h-4"/> Formação</h3>
                   <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedExpert.formation}</p>
                </div>
                <div>
                   <h3 className="flex items-center gap-2 font-bold text-gradient-gold mb-2"><Award className="w-4 h-4"/> Convênios</h3>
                   <div className="flex flex-wrap gap-2">
                      {selectedExpert.convenios?.map((c, i) => (
                        <span key={i} className="text-[10px] px-3 py-1 rounded-full bg-primary/10 border border-primary/20">{c}</span>
                      ))}
                   </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Horários */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-gradient-gold mb-6 flex items-center gap-2"><Calendar className="w-5 h-5"/> Selecione o Horário</h2>
              <div className="flex gap-2 mb-6 flex-wrap">
                {daysOfWeek.map((day, i) => (
                  <button key={i} onClick={() => setSelectedDay(i)} className={`px-4 py-2 rounded-lg text-sm ${selectedDay === i ? 'btn-gold-3d' : 'bg-secondary'}`}>{day}</button>
                ))}
              </div>
              {selectedDay !== null && (
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(time => (
                    <button key={time} onClick={() => setSelectedTime(time)} className={`p-3 rounded-lg text-sm flex items-center justify-center gap-2 ${selectedTime === time ? 'btn-gold-3d' : 'bg-secondary/50'}`}>
                      <Clock className="w-3 h-3"/> {time}
                    </button>
                  ))}
                </div>
              )}
              {selectedTime && (
                <button onClick={handleConfirm} className="btn-gold-3d w-full mt-8 py-3 rounded-lg font-bold">Confirmar Agendamento</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  

  // 3. TELA PRINCIPAL (LISTA)
  return (
    <div className="min-h-screen bg-background">
      {/* Seção Hero */}
      <section className="h-[400px] flex items-center justify-center text-center px-4 bg-slate-900 text-white">
        <div>
          <h1 className="text-4xl font-bold mb-4">Nossos <span className="text-amber-400">Especialistas</span></h1>
          <p className="text-gray-300">Encontre o profissional ideal para sua jornada.</p>
        </div>
      </section>

      {/* Seção Carrossel */}
      <section className="py-16 max-w-[1200px] mx-auto relative px-10">
        <button onClick={() => scrollCarousel("left")} className="absolute left-0 top-1/2 z-10 p-2 bg-white rounded-full shadow-md"><ChevronLeft/></button>
        <button onClick={() => scrollCarousel("right")} className="absolute right-0 top-1/2 z-10 p-2 bg-white rounded-full shadow-md"><ChevronRight/></button>
        
        <div ref={carouselRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x">
          {experts.map((exp, i) => (
            <div key={i} className="expert-card flex-shrink-0 w-[280px] snap-start glass-card p-6 flex flex-col items-center">
              <img src={exp.avatar || '/placeholder.png'} className="w-20 h-20 rounded-full mb-4 border-2 border-primary" alt="" />
              <h3 className="font-bold">{exp.name}</h3>
              <p className="text-xs text-primary mb-4">{exp.area}</p>
              <button onClick={() => handleSchedule(exp)} className="btn-gold-3d w-full py-2 rounded-md text-sm font-bold">Ver Perfil</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );


      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};



