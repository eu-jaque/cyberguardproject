import { Calendar, MessageSquare, Info, Plus, Eye, Send, X } from "lucide-react";

type TimelineItem = {
  id: string;
  type: "message" | "appointment" | "info";
  title: string;
  client: string;
  time: string;
  section: "todo" | "today";
  badges?: { label: string; color: string }[];
};

const mockTimeline: TimelineItem[] = [
  {
    id: "1", type: "appointment", title: "Consulta de Segurança",
    client: "Alex Araujo", time: "14:00",
    section: "today",
    badges: [
      { label: "Confirmado", color: "bg-emerald-500/20 text-emerald-400" },
      { label: "Hoje", color: "bg-blue-500/20 text-blue-400" },
    ],
  },
  {
    id: "2", type: "message", title: "Análise de Vulnerabilidade",
    client: "Maria Silva", time: "10:30", section: "today",
  },
  {
    id: "3", type: "info", title: "Revisão de Firewall",
    client: "João Pedro", time: "Amanhã, 09:00", section: "todo",
  },
  {
    id: "4", type: "message", title: "Treinamento de Equipe",
    client: "Ana Costa", time: "Quinta, 15:00", section: "todo",
  },
];

const iconMap = {
  message: { icon: MessageSquare, color: "bg-blue-500/20 text-blue-400" },
  appointment: { icon: Calendar, color: "bg-yellow-500/20 text-yellow-400" },
  info: { icon: Info, color: "bg-purple-500/20 text-purple-400" },
};

export default function ActivityTimeline() {
  const todoItems = mockTimeline.filter(i => i.section === "todo");
  const todayItems = mockTimeline.filter(i => i.section === "today");

  const renderItem = (item: TimelineItem, isHighlight = false) => {
    const { icon: Icon, color } = iconMap[item.type];

    return (
      <div key={item.id} className="flex gap-3 relative">
        {/* Timeline dot */}
        <div className="flex flex-col items-center z-10">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 rounded-xl p-4 mb-3 ${
          isHighlight
            ? "bg-yellow-500/10 border border-yellow-500/20"
            : "bg-card/60 backdrop-blur-sm border border-border/30"
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground font-medium">{item.client}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">{item.time}</span>
          </div>

          {item.badges && (
            <div className="flex gap-2 mb-3">
              {item.badges.map(b => (
                <span key={b.label} className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${b.color}`}>
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {isHighlight && (
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-colors flex items-center gap-1">
                <Eye className="w-3 h-3" /> Visualizar
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-secondary/50 text-foreground text-xs font-bold hover:bg-secondary/70 transition-colors flex items-center gap-1">
                <Send className="w-3 h-3" /> Mensagem
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-colors flex items-center gap-1">
                <X className="w-3 h-3" /> Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action input */}
      <div className="flex items-center gap-3 bg-card/60 backdrop-blur-sm border border-border/30 rounded-xl px-4 py-3">
        <input
          placeholder="Discutir no bate-papo..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center hover:bg-blue-500/30 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line - hidden on mobile */}
        <div className="absolute left-[17px] top-0 bottom-0 w-px bg-border/30 hidden md:block" />

        {/* Today section */}
        <div className="mb-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-4">
            Hoje
          </div>
          {todayItems.map((item, i) => renderItem(item, i === 0))}
        </div>

        {/* Todo section */}
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4">
            Coisas a fazer
          </div>
          {todoItems.map(item => renderItem(item))}
        </div>
      </div>
    </div>
  );
}
