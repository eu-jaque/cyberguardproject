import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, Bell, BarChart3, Mail, LogOut,
  ChevronLeft, ChevronRight, X, Edit, Check, Clock, AlertCircle
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

type SidebarItemType = { icon: typeof LayoutDashboard; label: string; key: string };

const sidebarItems: SidebarItemType[] = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: Calendar, label: "Agendamentos", key: "appointments" },
  { icon: Bell, label: "Notificações", key: "notifications" },
  { icon: BarChart3, label: "Relatórios", key: "reports" },
  { icon: Mail, label: "Inbox", key: "inbox" },
];

type Appointment = {
  id: string;
  client: string;
  date: string;
  time: string;
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
  const [profileName, setProfileName] = useState(user?.email?.split("@")[0] || "Usuário");
  const [appointments, setAppointments] = useState(mockAppointments);
  const [appointmentTab, setAppointmentTab] = useState<"proximos" | "historico" | "agenda">("proximos");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isExpert = true; // Mock: would check role from DB

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

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}
        style={{ background: "hsl(216 71% 8% / 0.9)", backdropFilter: "blur(20px)" }}>
        
        <div className="flex items-center justify-between p-4 border-b border-border/20">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{profileName[0]?.toUpperCase()}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{profileName}</p>
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
              {item.key === "appointments" ? (
                <button
                  onClick={() => { setActiveSection(item.key); setIsSheetOpen(true); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all group ${
                    activeSection === item.key ? "bg-[hsl(216,50%,18%)] text-primary border-l-[3px] border-primary" : "text-muted-foreground hover:text-primary hover:bg-[hsl(216,50%,15%)]"
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${activeSection === item.key ? "text-primary" : "group-hover:text-primary"} transition-colors`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ) : (
                <button
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all group ${
                    activeSection === item.key ? "bg-[hsl(216,50%,18%)] text-primary border-l-[3px] border-primary" : "text-muted-foreground hover:text-primary hover:bg-[hsl(216,50%,15%)]"
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${activeSection === item.key ? "text-primary" : "group-hover:text-primary"} transition-colors`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              )}
            </motion.div>
          ))}
        </nav>

        {/* Edit profile + Logout */}
        <div className="p-3 space-y-1 border-t border-border/20">
          <button onClick={() => setShowEditProfile(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-[hsl(216,50%,15%)] transition-all">
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
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"} p-6 md:p-10`}>
        {activeSection === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border/50 rounded-xl p-5">
                <Calendar className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">{upcoming.length}</p>
                <p className="text-xs text-muted-foreground">Agendamentos Próximos</p>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-5">
                <Check className="w-5 h-5 text-emerald-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">{history.filter(a => a.status === "Concluído").length}</p>
                <p className="text-xs text-muted-foreground">Consultas Realizadas</p>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-5">
                <BarChart3 className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">4.8</p>
                <p className="text-xs text-muted-foreground">Avaliação Média</p>
              </div>
            </div>

            {/* Recent appointments */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Próximos Agendamentos</h2>
              <div className="space-y-3">
                {upcoming.slice(0, 3).map(a => (
                  <div key={a.id} className="bg-card border border-border/50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{a.client}</h4>
                      <p className="text-xs text-muted-foreground">{a.date} às {a.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColors[a.status]}`}>{a.status}</span>
                  </div>
                ))}
              </div>
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
                <div key={i} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-3">
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
            <div className="bg-card border border-border/50 rounded-xl p-12 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Relatórios detalhados serão exibidos aqui.</p>
            </div>
          </motion.div>
        )}

        {activeSection === "inbox" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-bold text-foreground mb-6">Inbox</h1>
            <div className="bg-card border border-border/50 rounded-xl p-12 text-center">
              <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Sua caixa de entrada está vazia.</p>
            </div>
          </motion.div>
        )}
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
                ...(isExpert ? [{ label: "Minha Agenda", value: "agenda" as const }] : []),
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setAppointmentTab(tab.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                    appointmentTab === tab.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
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
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {a.date} às {a.time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${statusColors[a.status]}`}>{a.status}</span>
                  </div>

                  {/* Expert actions */}
                  {isExpert && appointmentTab === "agenda" && a.status !== "Cancelado" && a.status !== "Concluído" && (
                    <div className="flex gap-2">
                      {a.status === "Pendente" && (
                        <button onClick={() => updateStatus(a.id, "Confirmado")} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-colors">
                          Confirmar
                        </button>
                      )}
                      <button onClick={() => updateStatus(a.id, "Concluído")} className="px-3 py-1.5 rounded-lg bg-secondary/50 text-foreground text-xs font-bold hover:bg-secondary/70 transition-colors">
                        Concluir
                      </button>

                      {canCancel(a.date) ? (
                        <button onClick={() => updateStatus(a.id, "Cancelado")} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors">
                          Cancelar
                        </button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button disabled className="px-3 py-1.5 rounded-lg bg-secondary/30 text-muted-foreground text-xs font-bold cursor-not-allowed flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Cancelar
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancelamentos só são permitidos com 24h de antecedência</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  )}

                  {/* Client actions */}
                  {!isExpert && (appointmentTab === "proximos") && a.status !== "Cancelado" && (
                    <div className="flex gap-2">
                      {canCancel(a.date) ? (
                        <button onClick={() => updateStatus(a.id, "Cancelado")} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold">
                          Cancelar
                        </button>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button disabled className="px-3 py-1.5 rounded-lg bg-secondary/30 text-muted-foreground text-xs cursor-not-allowed flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Cancelar
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Cancelamentos só são permitidos com 24h de antecedência</TooltipContent>
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
      <AnimatePresence>
        {showEditProfile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full mx-4 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">Editar Perfil</h3>
                <button onClick={() => setShowEditProfile(false)} className="p-1.5 rounded-full hover:bg-secondary/50 text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{profileName[0]?.toUpperCase()}</span>
                </div>
                <button className="text-xs text-primary hover:underline">Alterar foto</button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase">Nome</label>
                <input
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-secondary/30 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <button onClick={() => setShowEditProfile(false)} className="w-full btn-gold-3d text-primary-foreground py-2.5 rounded-xl font-bold text-sm">
                Salvar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center">
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
