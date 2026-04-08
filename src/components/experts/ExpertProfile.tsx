import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "../../../utils/supabase";
import {
  LayoutDashboard, Calendar, Bell, BarChart3, Mail, LogOut,
  ChevronLeft, ChevronRight, X, Edit, Check, Clock, AlertCircle,
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
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: Calendar, label: "Agendamentos", key: "appointments" },
  { icon: Bell, label: "Notificações", key: "notifications" },
  { icon: BarChart3, label: "Relatórios", key: "reports" },
  { icon: Mail, label: "Inbox", key: "inbox" },
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
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Próximos Agendamentos</h2>
                <div className="space-y-3">
                  {upcoming.map(a => (
                    <div key={a.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{a.client[0]}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{a.client}</h4>
                          <p className="text-xs text-muted-foreground">{a.date} às {a.time}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColors[a.status]}`}>{a.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Atividades</h2>
                <ActivityTimeline />
              </div>
            </motion.div>
          )}

          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-bold text-foreground mb-6">Notificações</h1>
              <div className="space-y-3">
                {[
                  { text: "Novo agendamento de Maria Silva", time: "Há 2h" },
                  { text: "Consulta com João Pedro confirmada", time: "Há 5h" },
                  { text: "Ana Costa avaliou sua consulta ⭐⭐⭐⭐⭐", time: "Há 1d" },
                ].map((n, i) => (
                  <div key={i} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-4 flex items-center gap-3">
                    <Bell className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1"><p className="text-sm text-foreground">{n.text}</p></div>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === "reports" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-bold text-foreground mb-6">Relatórios</h1>
              <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-12 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Relatórios detalhados serão exibidos aqui.</p>
              </div>
            </motion.div>
          )}

          {activeSection === "inbox" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-2xl font-bold text-foreground mb-6">Inbox</h1>
              <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-12 text-center">
                <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Sua caixa de entrada está vazia.</p>
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
