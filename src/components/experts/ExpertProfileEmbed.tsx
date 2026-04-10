import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import supabase from "../../../utils/supabase";
import {
  LayoutDashboard, Bell, Calendar as CalendarIcon,
  ChevronRight, Check, Clock,
  Lightbulb, LineChart, X
} from "lucide-react";
import { RankingElite } from "@/components";

type SidebarItemType = { icon: typeof LayoutDashboard; label: string; key: string };

const sidebarItems: SidebarItemType[] = [
  { icon: LayoutDashboard, label: "Perfil", key: "dashboard" },
  { icon: CalendarIcon, label: "Agendamentos", key: "appointments" },
  { icon: Bell, label: "Notificações", key: "notifications" },
];

type Appointment = {
  id: string;
  client_name: string;
  date: string;
  time: string;
  status: "Confirmado" | "Rejeitado" | "Concluído" | "Pendente";
  specialty?: string;
};

const statusColors: Record<string, string> = {
  Confirmado: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Rejeitado: "bg-destructive/20 text-destructive border-destructive/30",
  Concluído: "bg-primary/20 text-primary border-primary/30",
  Pendente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function ExpertProfileEmbed() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [profileName, setProfileName] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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

  const calendarEvents = appointments
    .filter(a => a.status === "Confirmado")
    .map(a => ({
      date: a.date,
      time: a.time,
      name: a.client_name,
      color: 'bg-emerald-500/20 border-emerald-500/50',
      initial: a.client_name[0]
    }));

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("full_name, avatar_url").eq("user_id", user.id).single();
      if (data) {
        setProfileName(data.full_name || user.email?.split("@")[0] || "Especialista");
        setProfileAvatar(data.avatar_url || "");
      } else {
        setProfileName(user.email?.split("@")[0] || "Especialista");
      }
    }

    async function fetchAppointments() {
      if (!user) return;
      const { data: expertRecord } = await supabase
        .from("experts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (expertRecord) {
        const { data, error } = await supabase
          .from("schedules")
          .select("*")
          .eq("experts_id", expertRecord.id)
          .order("date", { ascending: true });

        if (!error && data) {
          setAppointments(data as Appointment[]);
        }
      }
    }

    loadProfile();
    fetchAppointments();
  }, [user]);

  const updateStatus = async (id: string, status: Appointment["status"]) => {
    const { error } = await supabase
      .from("schedules")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    }
  };

  const pendingActions = appointments.filter(a => a.status === "Pendente");
  const appointmentHistory = appointments.filter(a => a.status !== "Pendente");

  return (
    <div className="flex h-full">
      {/* Sidebar interna */}
      <aside className="w-56 bg-card/40 border-r border-border/20 flex flex-col py-4 px-2 shrink-0">
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${isActive
                  ? "bg-primary/10 text-primary border-l-[3px] border-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/20 border-l-[3px] border-transparent"
                  }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : "group-hover:text-primary"} transition-colors`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {activeSection === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

            {/* Metric Cards — padrão da plataforma (mesmos gradients do DashOverview) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0891b2, #115e59)" }}>
                <div className="flex justify-between items-start">
                  <div><p className="text-3xl font-bold text-white">{appointments.filter(a => a.status === 'Confirmado').length}</p><p className="text-xs text-white/80 mt-1">Agendamentos Confirmados</p></div>
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

            {/* Próximos Agendamentos — Calendar */}
            <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-foreground">Próximos Agendamentos</h1>
                <div className="flex items-center gap-4 bg-background/60 p-1 rounded-lg border border-border/30">
                  <button className="px-4 py-1.5 rounded-md hover:bg-secondary/30 transition-colors text-sm text-muted-foreground">Hoje</button>
                  <button className="px-4 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">Semana</button>
                  <button className="px-4 py-1.5 rounded-md hover:bg-secondary/30 transition-colors text-sm text-muted-foreground">Mês</button>
                  <div className="flex items-center gap-2 ml-4 pr-2 border-l border-border/30 pl-4 text-muted-foreground">
                    <span className="text-sm">15 Jan - 21 Jan 2024</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>

              <div className="flex border border-border/30 rounded-xl overflow-hidden bg-background/40">
                <div className="w-20 border-r border-border/30 pt-16">
                  {hours.map(hour => (
                    <div key={hour} className="h-16 flex items-start justify-center text-xs text-muted-foreground border-b border-border/20">
                      {hour}
                    </div>
                  ))}
                </div>
                <div className="flex-1 grid grid-cols-7">
                  {days.map((day, idx) => (
                    <div key={idx} className="border-r border-border/30 last:border-0">
                      <div className="h-16 flex flex-col items-center justify-center border-b border-border/30 bg-card/30">
                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{day.name}, {day.date}</span>
                      </div>
                      <div className="relative h-full min-h-[768px]">
                        {hours.map((_, i) => (
                          <div key={i} className="h-16 border-b border-border/10" />
                        ))}
                        {calendarEvents.filter(apt => {
                          const aptDate = new Date(apt.date).getDate().toString();
                          return aptDate === day.date;
                        }).map((apt, i) => (
                          <div
                            key={i}
                            className={`absolute left-1 right-1 p-2 rounded-lg border cursor-pointer hover:brightness-125 transition-all z-20 ${apt.color}`}
                            style={{ top: `${(parseInt(apt.time.split(':')[0]) - 8) * 64 + (parseInt(apt.time.split(':')[1]) / 60) * 64}px` }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center text-[10px] font-bold border border-border/30">
                                {apt.initial}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-foreground truncate">{apt.name}</p>
                                <p className="text-[8px] text-muted-foreground truncate">{apt.time}</p>
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

            {/* Ranking */}
            <div className="mt-12">
              <h2 className="text-xl font-black italic text-foreground mb-8 uppercase tracking-tighter">Ranking Elite</h2>
              <RankingElite limit={3} />
            </div>
          </motion.div>
        )}

        {activeSection === "notifications" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <div className="flex items-center gap-3 mb-8">
              <Bell className="w-7 h-7 text-primary" />
              <h1 className="text-3xl font-black italic tracking-tighter text-foreground uppercase">
                Notificações
              </h1>
              <span className="ml-auto bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold shadow-lg uppercase tracking-wider">
                3 Novas
              </span>
            </div>

            <div className="space-y-4 relative">
              <div className="absolute -right-2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/40 to-transparent rounded-full opacity-40" />

              {[
                { text: "Novo agendamento de Maria Silva", type: "Novo Agendamento", time: "Há 2h", color: "text-primary" },
                { text: "Consulta com João Pedro confirmada", type: "Confirmação", time: "Há 5h", color: "text-emerald-400" },
                { text: "Ana Costa avaliou sua consulta", type: "Avaliação", time: "Há 1d", color: "text-amber-400", stars: true },
              ].map((n, i) => (
                <div key={i} className="group bg-card/60 backdrop-blur-xl border border-border/20 rounded-2xl p-5 flex items-center gap-5 relative overflow-hidden transition-all hover:bg-card hover:border-border/40">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 bg-current ${n.color}`} />
                  <div className={`p-3 rounded-xl bg-background/60 border border-border/20 ${n.color}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1 block">{n.type}</span>
                    <div className="flex flex-col">
                      <p className="text-sm md:text-base font-medium text-foreground/90 leading-tight">{n.text}</p>
                      {n.stars && (
                        <div className="flex gap-1 mt-1.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-primary text-xs">⭐</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                    <span className="text-[10px] font-mono text-muted-foreground tracking-tighter italic">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === "appointments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Ações Pendentes</h1>
              <p className="text-sm text-muted-foreground mt-2 italic font-medium">Usuários que clicaram em "Conversar com especialista".</p>

              <div className="flex gap-6 mt-8 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-primary/20">
                {pendingActions.length > 0 ? pendingActions.map(a => (
                  <div key={a.id} className="min-w-[320px] bg-card/60 border-2 border-border/30 rounded-[2rem] p-6 hover:border-primary/30 transition-all group backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                    <div className="flex gap-4 items-center mb-6">
                      <div className="w-16 h-16 rounded-3xl border-2 border-primary/50 bg-card flex items-center justify-center text-2xl font-bold text-foreground overflow-hidden shadow-[0_0_15px_rgba(212,165,53,0.2)]">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.client_name}`} alt="" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{a.client_name}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(a.date).toLocaleDateString()} às {a.time} - {a.specialty || "Nutrição"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button onClick={() => updateStatus(a.id, "Confirmado")} className="w-full py-3.5 rounded-2xl btn-gold-3d text-black font-black text-xs uppercase tracking-widest">
                        Confirmar Agendamento
                      </button>
                      <button onClick={() => updateStatus(a.id, "Rejeitado")} className="w-full py-3.5 rounded-2xl bg-transparent border-2 border-border text-muted-foreground font-bold text-xs uppercase tracking-widest hover:border-destructive/50 hover:text-destructive transition-all">
                        Rejeitar
                      </button>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground italic py-8">Nenhuma ação pendente no momento.</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Histórico de Agendamentos</h2>
              </div>

              <div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border/30 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border/30 bg-card/40">
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Data</th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Usuário</th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Especialista</th>
                      <th className="px-8 py-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {appointmentHistory.map(a => (
                      <tr key={a.id} className="hover:bg-secondary/20 transition-colors group">
                        <td className="px-8 py-6 text-sm font-medium text-foreground/80">
                          {new Date(a.date).toLocaleDateString()} às {a.time}
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.client_name}`} alt="" className="w-9 h-9 rounded-xl border border-border/30" />
                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{a.client_name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-medium text-muted-foreground">Especialista {profileName}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-2 w-fit ${statusColors[a.status]}`}>
                            {a.status === "Confirmado" && <Check className="w-3 h-3" />}
                            {a.status === "Rejeitado" && <X className="w-3 h-3" />}
                            {a.status === "Concluído" && <Check className="w-3 h-3" />}
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
