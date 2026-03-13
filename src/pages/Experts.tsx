import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { User, Calendar, MessageSquare, Video, Star, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { error } from "console";
import { promises } from "dns";

const experts = [
  { name: "Dr. Carlos Silva", area: "Segurança de Redes", rating: 4.9, available: true },
  { name: "Ana Rodrigues", area: "Análise de Malware", rating: 4.8, available: true },
  { name: "Prof. Lucas Mendes", area: "Forense Digital", rating: 4.7, available: false },
  { name: "Dra. Juliana Costa", area: "LGPD e Compliance", rating: 4.9, available: true },
  { name: "Rafael Santos", area: "Pentesting", rating: 4.6, available: true },
  { name: "Mariana Oliveira", area: "Engenharia Social", rating: 4.8, available: false },
];

export type Experts = ({
  name?: string;
  area?: string;
  rating?: string;
  available?: string;
})

export type expenses = {
  name?: string,
  value?: string
}


export default function Experts(){
const {user, signOutUser} = useAuth();
const [experts, setExperts]= useState <Experts[]> ([]);


useEffect( () => {
  if (user) syncExperts(user.id); 
}, []);

async function syncExperts(user_id: string ): Promise<void>{
  const{data, error} = await supabase.from('experts')
     .select('*').eq("user_id", user_id).single();

if(error){
  alert(error.message)
  return
}

setExperts(data);

}



async function handleExpert(){
const data= {...expert, user_id: user.id};


const { error } = await supabase.from('Experts').insert(data);

if (error) {
  alert(error.message);
  return
}
  alert("cadastrado com sucesso")
}
return(
  <>
  <h1></h1>
  <input type="text"
  placeholder="text?"
  value={expert.name}
  onChange={(e) => setExpert ({...expert, name : (e.target.value)})} />
  <button onClick={handleExpert}> Confimar agendamento </button>
  </>
)
}
const videos = [
  { title: "Como identificar phishing em 5 passos", duration: "12:30", views: "2.4k" },
  { title: "Protegendo seu Wi-Fi doméstico", duration: "8:45", views: "1.8k" },
  { title: "Senhas seguras: guia completo", duration: "15:20", views: "3.1k" },
  { title: "O que fazer após um vazamento de dados", duration: "10:15", views: "2.7k" },
];

const daysOfWeek = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

const Experts = () => {
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%] text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("exp.title")} <span className="text-gradient-gold">{t("exp.title_highlight")}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("exp.subtitle")}</p>
        </div>
      </section>

      {/* Experts Grid */}
      <section className="py-12 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-xl font-bold text-foreground mb-6">
            <span className="text-gradient-gold">{t("exp.our_experts")}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert, i) => (
              <div key={i} className="glass-card group flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">{expert.name}</h3>
                <p className="text-muted-foreground text-xs mb-2">{expert.area}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-xs text-primary font-bold">{expert.rating}</span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  expert.available
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {expert.available ? t("exp.available") : t("exp.unavailable")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Mockup */}
      <section className="py-12 bg-card">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-gradient-gold">{t("exp.schedule")}</h2>
          </div>
          <div className="glass-card max-w-2xl">
            <div className="flex gap-3 mb-6 flex-wrap">
              {daysOfWeek.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDay === i
                      ? "btn-gold-3d text-primary-foreground"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {selectedDay !== null && (
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedTime === time
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
              <div className="mt-4 text-center">
                <button className="btn-gold-3d text-primary-foreground px-6 py-2 rounded-lg text-sm font-bold">
                  {t("exp.confirm")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Chat Mockup */}
      <section className="py-12 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-gradient-gold">{t("exp.chat")}</h2>
          </div>
          <div className="glass-card max-w-2xl">
            <div className="space-y-3 mb-4 min-h-[150px]">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-secondary/50 rounded-xl px-3 py-2 text-sm text-foreground/80">
                  {t("exp.chat_example")}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t("exp.chat_placeholder")}
                className="flex-1 bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <button className="btn-gold-3d text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold">
                {t("exp.send")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Gallery */}
      <section className="py-12 bg-card">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <div className="flex items-center gap-2 mb-6">
            <Video className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold text-gradient-gold">{t("exp.videos")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, i) => (
              <div key={i} className="glass-card group cursor-pointer">
                <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center mb-3">
                  <Video className="w-10 h-10 text-primary/50 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-foreground text-sm font-semibold mb-1">{video.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{video.duration}</span>
                  <span>{video.views} views</span>
                </div>
              </div>
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


