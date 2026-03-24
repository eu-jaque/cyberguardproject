import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, X, LogIn, Sparkles, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import confettiLib from "canvas-confetti";
import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Componentes Extraídos
import CarouselExpertsVideos from "@/components/CarouselExpertsVideos";
import CarouselExperts from "@/components/CarouselExperts";
import ScheduleForm from "@/components/ScheduleForm";

export type Expert = {
  id: string;
  name: string;
  area: string;
  rating: number;
  available: boolean;
  bio: string;
  formation: string;
  convenios: string;
  avatar: string;
};

const videos = [
  { title: "Como identificar phishing em 5 passos", id: "EqQ-cDeKQLU" },
  { title: "Protegendo seu Wi-Fi doméstico", id: "DMkKcrwxlsc" },
  { title: "Senhas seguras: guia completo", id: "zefv-bNtZwg" },
  { title: "O que fazer após um vazamento de dados", id: "3uJszS1bk28" },
];

type ViewState = "list" | "confirmation";

export default function Experts() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [viewState, setViewState] = useState<ViewState>("list");

  const [confirmedDetails, setConfirmedDetails] = useState<{ day: string; time: string } | null>(null);
  const [pendingSchedule, setPendingSchedule] = useState<{ day: string; time: string } | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // 🔒 Trava o scroll do body quando qualquer modal abre
  useEffect(() => {
    if (isLoginModalOpen || isScheduleModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoginModalOpen, isScheduleModalOpen]);
  
  useEffect(() => {
    async function fetchExperts() {
      const { data, error } = await supabase
        .from("experts")
        .select("*")
        .eq("available", true);

      if (!error && data) {
        setExperts(data);
      }
    }
    fetchExperts();
  }, []);

  const handleExpertSelected = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsScheduleModalOpen(true);
  };

  const handleConfirmSchedule = (day: string, time: string) => {
    if (!user) {
      setPendingSchedule({ day, time });
      setIsLoginModalOpen(true);
      return;
    }
    executeSchedule(day, time);
  };

  const executeSchedule = (day: string, time: string) => {
    setConfirmedDetails({ day, time });
    setIsScheduleModalOpen(false);
    setViewState("confirmation");

    confettiLib({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#fbbf24", "#ffffff", "#10b981"],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    setViewState("list");
    setIsScheduleModalOpen(false);
    setSelectedExpert(null);
    setConfirmedDetails(null);
    setPendingSchedule(null);
  };

  const handleLoginSuccess = () => {
    if (pendingSchedule && selectedExpert) {
      localStorage.setItem(
        "cyberguard_pending_appointment",
        JSON.stringify({
          expertId: selectedExpert.id,
          day: pendingSchedule.day,
          time: pendingSchedule.time,
        })
      );
    }
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      {/* 🌌 Hero Futurista Premium com Aura Radiante */}
      <section className="relative h-[480px] flex flex-col items-center justify-center overflow-hidden border-b border-border/40 transition-colors duration-300">
        <div className="absolute top-[-100px] left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-secondary/80 border border-border/40 backdrop-blur-md shadow-inner transition-colors duration-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase transition-colors duration-300">Consultoria de Alto Nível</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.15] text-foreground transition-colors duration-300">
            Converse com nossos{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
              Especialistas
            </span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed transition-colors duration-300">
            Conecte-se com profissionais de elite em segurança da informação para blindar sua infraestrutura.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6">

        {/* 📋 VISTA 1: CARROSSÉIS (Atualizados para ler cores do tema) */}
        {viewState === "list" && (
          <div className="space-y-16 py-16">
            <div className="relative group bg-card/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-border/60 shadow-lg transition-all duration-500 hover:border-primary/40">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent rounded-3xl -z-10" />
              <CarouselExperts
                experts={experts}
                onSelectExpert={handleExpertSelected}
                title={t("exp.our_experts")}
              />
            </div>

            <div className="bg-card/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-border/60 shadow-lg hover:border-primary/40 transition-all duration-500">
              <CarouselExpertsVideos
                videos={videos}
                title={t("exp.videos")}
              />
            </div>
          </div>
        )}

        {/* 🎉 VISTA 2: SUCESSO (ESTILO APP MOBILE PREMIUM) */}
        {viewState === "confirmation" && selectedExpert && (
          <section className="py-24 flex items-center justify-center animate-in zoom-in-95 duration-500">
            <div className="relative w-full max-w-md bg-card/80 backdrop-blur-2xl p-10 rounded-[32px] border border-border/80 shadow-2xl overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col items-center">
                <div className="relative flex items-center justify-center w-24 h-24 mb-8">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping [animation-duration:2s]" />
                  <div className="absolute inset-0 bg-emerald-500/10 rounded-full" />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                </div>

                <h1 className="font-display text-3xl font-bold text-foreground mb-3 tracking-tight transition-colors duration-300">
                  Tudo Pronto!
                </h1>

                <p className="text-muted-foreground text-center mb-6 font-light transition-colors duration-300">
                  Sua sessão estratégica com <span className="text-foreground font-medium transition-colors duration-300">{selectedExpert.name}</span> foi blindada na agenda.
                </p>

                {confirmedDetails && (
                  <div className="w-full bg-secondary/50 backdrop-blur-sm p-4 rounded-2xl mb-8 border border-border/40 flex flex-col items-center gap-1 shadow-inner transition-colors duration-300">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium transition-colors duration-300">Horário Reservado</span>
                    <p className="text-base font-semibold text-emerald-500 flex items-center gap-2 transition-colors duration-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {confirmedDetails.day} às {confirmedDetails.time}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleBackToList}
                  className="w-full h-12 btn-gold-3d text-primary-foreground font-bold rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-2 group shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirmar e Concluir
                  <ShieldCheck className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
      <Chatbot />
      <AccessibilityWidget />

      {/* 📅 MODAL DE AGENDAMENTO (NOVO) */}
      {isScheduleModalOpen && selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card/90 backdrop-blur-2xl p-8 md:p-10 rounded-[28px] border border-border shadow-2xl animate-in zoom-in-95 duration-300 transition-colors duration-300">

            <button
              onClick={() => setIsScheduleModalOpen(false)}
              className="absolute top-5 right-5 z-10 text-muted-foreground hover:text-foreground p-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/40 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            <ScheduleForm
              expert={selectedExpert}
              onBack={() => setIsScheduleModalOpen(false)}
              onConfirm={handleConfirmSchedule}
            />
          </div>
        </div>
      )}

      {/* 🔐 MODAL DE LOGIN (PREMIUM GLASSMORPHISM) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-card/90 backdrop-blur-2xl w-full max-w-md p-10 rounded-[28px] border border-border shadow-2xl animate-in zoom-in-95 duration-300 transition-colors duration-300">

            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/40 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary border border-border/40 flex items-center justify-center mb-6 shadow-inner transition-colors duration-300">
                <LogIn className="w-7 h-7 text-amber-400" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight transition-colors duration-300">Autenticação Necessária</h2>
              <p className="text-muted-foreground text-sm mb-8 font-light leading-relaxed transition-colors duration-300">
                Faça login ou crie uma conta para continuar agendando sua consulta com <strong className="text-foreground transition-colors duration-300">{selectedExpert?.name}</strong>.
              </p>

              <button
                onClick={handleLoginSuccess}
                className="w-full h-12 btn-gold-3d text-primary-foreground font-bold rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Login / Continuar
                <LogIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}