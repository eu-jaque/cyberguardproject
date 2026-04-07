import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../../utils/supabase";
import {
  LayoutDashboard, Calendar, Bell, BarChart3, Mail, LogOut,
  ChevronLeft, ChevronRight,Plus, X, Edit, Check, Clock, AlertCircle,
  Lightbulb, LineChart
} from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import CircuitBackground from "@/components/CircuitBackground";
import EditProfileModal from "@/components/EditProfileModal";
import ActivityTimeline from "@/components/ActivityTimeline";

type SidebarItemType = { icon: typeof LayoutDashboard; label: string; key: string };

const sidebarItems: SidebarItemType[] = [
  { icon: LayoutDashboard, label: "Perfil", key: "Perfil" },
  { icon: Calendar, label: "Agendamentos", key: "appointments" },
  { icon: Bell, label: "Notificações", key: "notifications" },

];

type Appointment = {
  id: string; client: string; date: string; time: string;
  status: "Confirmado" | "Cancelado" | "Concluído" | "Pendente";
};

const mockAppointments: Appointment[] = [
  { id: "1", client: "Maria Silva", date: "2026-03-28", time: "14:00", status: "Confirmado" },
  { id: "2", client: "João Pedro", date: "2026-03-29", time: "10:00", status: "Pendente" },
  { id: "3", client: "Ana Costa", date: "2026-03-25", time: "16:00", status: "Concluído" },
  { id: "4", client: "Pedro Santos", date: "2026-03-20", time: "09:00", status: "Cancelado" },
  { id: "5", client: "Lucas Mendes", date: "2026-03-30", time: "11:00", status: "Pendente" },
];

const statusColors: Record<string, string> = {
  Confirmado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Cancelado: "bg-red-500/20 text-red-400 border-red-500/30",
  Concluído: "bg-muted text-muted-foreground border-border",
  Pendente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function ExpertProfile() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [appointments, setAppointments] = useState(mockAppointments);
  const [appointmentTab, setAppointmentTab] = useState<"proximos" | "historico" | "agenda">("proximos");
  const [isSheetOpen, setIsSheetOpen] = useState(false);


    const hours = Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
  
  const days = [
    { name: 'SEGUNDA', date: '15' },
    { name: 'TERÇA', date: '16' },
    { name: 'QUARTA', date: '17' },
    { name: 'QUINTA', date: '18' },
    { name: 'SEXTA', date: '19' },
    { name: 'SÁBADO', date: '20' },
    { name: 'DOMINGO', date: '21' },
  ];

  const Calendar = [
    { day: 1, time: '08:30', name: 'Ana Paula', color: 'bg-blue-500/10 border-blue-500/50', initial: 'A' },
    { day: 2, time: '13:00', name: 'MAICON SILVA', color: 'bg-emerald-500/20 border-emerald-500/50', initial: 'M' },
    { day: 2, time: '16:00', name: 'JOÃO PEDRO', color: 'bg-amber-500/10 border-amber-500/50', initial: 'J' },
    { day: 2, time: '17:30', name: 'LUCAS MENDES', color: 'bg-amber-500/10 border-amber-500/50', initial: 'L' },
    { day: 3, time: '14:30', name: 'Paulo Souza', color: 'bg-slate-500/10 border-slate-500/50', initial: 'P' },
  ];

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
      if (data) {
        setProfileName(data.full_name || user.email?.split("@")[0] || "Especialista");
        setProfileAvatar(data.avatar_url || "");
      } else {
        setProfileName(user.email?.split("@")[0] || "Especialista");
      }
    }
    loadProfile();
  }, [user]);

  const canCancel = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return diff > 24 * 60 * 60 * 1000;
  };

  const updateStatus = (id: string, status: Appointment["status"]) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleLogout = async () => {
    await signOutUser();
    navigate("/auth", { replace: true });
  };

  const upcoming = appointments.filter(a => a.status === "Confirmado" || a.status === "Pendente");
  const history = appointments.filter(a => a.status === "Concluído" || a.status === "Cancelado");

  const avatarSrc = profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profileName}&backgroundColor=facc15`;

  return (
    <div className="min-h-screen flex relative">
      <CircuitBackground />

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}
        style={{ background: "rgba(10,14,23,0.92)", backdropFilter: "blur(20px)" }}>

        <div className="flex items-center justify-between p-4 border-b border-border/20">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-yellow-400 overflow-hidden">
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{profileName}</p>
                <p className="text-[10px] text-muted-foreground">Especialista</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-secondary/30 text-muted-foreground">
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {sidebarItems.map((item, i) => (
            <motion.div key={item.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <button
                onClick={() => { setActiveSection(item.key); if (item.key === "appointments") setIsSheetOpen(true); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all group ${
                  activeSection === item.key ? "bg-primary/10 text-primary border-l-[3px] border-primary" : "text-muted-foreground hover:text-primary hover:bg-secondary/20"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${activeSection === item.key ? "text-primary" : "group-hover:text-primary"} transition-colors`} />
                {sidebarOpen && <span>{item.label}</span>}
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
        {/* Top bar */}
        <header className="flex items-center justify-end px-6 md:px-10 py-4 border-b border-border/10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">{profileName}</span>
            <div className="w-8 h-8 rounded-full border-2 border-yellow-400 overflow-hidden">
              <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10">
          {activeSection === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

              {/* Gradient Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0891b2, #115e59)" }}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-3xl font-bold text-white">{upcoming.length}</p><p className="text-xs text-white/80 mt-1">Agendamentos para Hoje</p></div>
                    <Clock className="w-6 h-6 text-white/60" />
                  </div>
                </div>
                <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #e11d48, #ea580c)" }}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-3xl font-bold text-white">2</p><p className="text-xs text-white/80 mt-1">Agendamentos para Amanhã</p></div>
                    <Lightbulb className="w-6 h-6 text-white/60" />
                  </div>
                </div>
                <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f, #10b981)" }}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-3xl font-bold text-white">{appointments.length}</p><p className="text-xs text-white/80 mt-1">Agendas</p></div>
                    <LineChart className="w-6 h-6 text-white/60" />
                  </div>
                </div>
              </div>

              {/* Próximos Agendamentos - Dynamic Patient List */}
       
    <div className="min-h-screen bg-[#05070a] text-slate-300 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Próximos Agendamentos</h1>
        <div className="flex items-center gap-4 bg-[#0f1218] p-1 rounded-lg border border-slate-800">
          <button className="px-4 py-1.5 rounded-md hover:bg-slate-800 transition-colors text-sm">Hoje</button>
          <button className="px-4 py-1.5 rounded-md bg-slate-800 text-white text-sm">Semana</button>
          <button className="px-4 py-1.5 rounded-md hover:bg-slate-800 transition-colors text-sm">Mês</button>
          <div className="flex items-center gap-2 ml-4 pr-2 border-l border-slate-700 pl-4">
            <span className="text-sm">15 Jan - 21 Jan 2024</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex border border-slate-800 rounded-xl overflow-hidden bg-[#0a0d12]">
        {/* Time Column */}
        <div className="w-20 border-r border-slate-800 pt-16">
          {hours.map(hour => (
            <div key={hour} className="h-16 flex items-start justify-center text-xs text-slate-500 border-b border-slate-800/50">
              {hour}
            </div>
          ))}
        </div>

        {/* Days Columns */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((day, idx) => (
            <div key={idx} className="border-r border-slate-800 last:border-0">
              <div className="h-16 flex flex-col items-center justify-center border-b border-slate-800 bg-[#0f1218]/50">
                <span className="text-[10px] font-bold tracking-widest text-slate-400">{day.name}, {day.date}</span>
              </div>
              <div className="relative h-full min-h-[768px]">
                {/* Grid Lines */}
                {hours.map((_, i) => (
                  <div key={i} className="h-16 border-b border-slate-800/30" />
                ))}
                
                {/* Appointments */}
                {Calendar.filter(a => a.day === idx).map((apt, i) => (
                  <div 
                    key={i}
                    className={`absolute left-2 right-2 p-3 rounded-lg border cursor-pointer hover:brightness-125 transition-all ${apt.color}`}
                    style={{ top: `${(parseInt(apt.time.split(':')[0]) - 8) * 64 + (parseInt(apt.time.split(':')[1]) / 60) * 64}px` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700">
                        {apt.initial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{apt.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{apt.time} a Term</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>


              {/* Activity Timeline */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Ranking</h2>
                <ActivityTimeline />
              </div>
            </motion.div>
          )}
          
 {/* notifications sidebar*/}

          {activeSection === "notifications" && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
    {/* Título Estilizado */}
    <div className="flex items-center gap-3 mb-8">
      <Bell className="w-7 h-7 text-[#ffcc00] fill-[#ffcc00] drop-shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
      <h1 className="text-3xl font-black italic tracking-tighter text-[#ff007a] drop-shadow-[0_0_10px_rgba(255,0,122,0.6)] uppercase">
        Notificações
      </h1>
      <span className="ml-auto bg-gradient-to-r from-[#ff007a] to-[#ff7a00] px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-wider">
        3 Novas
      </span>
    </div>

    <div className="space-y-4 relative">
      {/* Barra de scroll visual à direita */}
      <div className="absolute -right-2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#ff007a] via-[#ff7a00] to-transparent rounded-full opacity-40" />

      {[
        { text: "Novo agendamento de Maria Silva", type: "Novo Agendamento", time: "Há 2h", color: "text-[#ff007a]" },
        { text: "Consulta com João Pedro confirmada", type: "Confirmação", time: "Há 5h", color: "text-cyan-400" },
        { text: "Ana Costa avaliou sua consulta", type: "Avaliação", time: "Há 1d", color: "text-[#ffcc00]", stars: true },
      ].map((n, i) => (
        <div 
          key={i} 
          className="group bg-[#1a1a24]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden transition-all hover:bg-white/5 hover:border-white/10"
        >
          {/* Indicador lateral interno */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${n.color}`} />

          {/* Ícone com fundo escuro */}
          <div className={`p-3 rounded-xl bg-black/40 border border-white/10 ${n.color}`}>
            <Bell className="w-5 h-5 drop-shadow-md" />
          </div>

          <div className="flex-1">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1 block">
              {n.type}
            </span>
            <div className="flex flex-col">
              <p className="text-sm md:text-base font-medium text-white/90 leading-tight">
                {n.text}
              </p>
              {n.stars && (
                <div className="flex gap-1 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#ffcc00] text-xs drop-shadow-[0_0_5px_rgba(255,204,0,0.5)]">⭐</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
             {/* Ponto de notificação "Glow" */}
            <div className="w-2 h-2 rounded-full bg-[#ff007a] shadow-[0_0_10px_#ff007a]" />
            <span className="text-[10px] font-mono text-white/30 tracking-tighter italic">
              {n.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
)}
         
        </div>
      </div>

      {/* Appointments Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card border-l border-border">
          <SheetHeader>
            <SheetTitle className="text-foreground">Agendamentos</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <div className="flex gap-1 mb-6">
              {[
                { label: "Próximos", value: "proximos" as const },
                { label: "Histórico", value: "historico" as const },
                { label: "Minha Agenda", value: "agenda" as const },
              ].map(tab => (
                <button key={tab.value} onClick={() => setAppointmentTab(tab.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${appointmentTab === tab.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {(appointmentTab === "proximos" ? upcoming : appointmentTab === "historico" ? history : appointments).map(a => (
                <div key={a.id} className="bg-secondary/20 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{a.client}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {a.date} às {a.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColors[a.status]}`}>{a.status}</span>
                  </div>
                  {appointmentTab === "agenda" && a.status !== "Cancelado" && a.status !== "Concluído" && (
                    <div className="flex gap-2">
                      {a.status === "Pendente" && (
                        <button onClick={() => updateStatus(a.id, "Confirmado")} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors">Confirmar</button>
                      )}
                      <button onClick={() => updateStatus(a.id, "Concluído")} className="px-3 py-1.5 rounded-lg bg-secondary/50 text-foreground text-xs font-bold hover:bg-secondary/70 transition-colors">Concluir</button>
                      {canCancel(a.date) ? (
                        <button onClick={() => updateStatus(a.id, "Cancelado")} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors">Cancelar</button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button disabled className="px-3 py-1.5 rounded-lg bg-secondary/30 text-muted-foreground text-xs font-bold cursor-not-allowed flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Cancelar
                            </button>
                          </TooltipTrigger>
                          <TooltipContent><p>Cancelamentos só são permitidos com 24h de antecedência</p></TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-secondary/30">Cancelar</button>
                <button onClick={handleLogout} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600">Sair</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
