import { motion } from "framer-motion";
import { CheckCircle2, Clock, MessageSquare, UserPlus } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "appointment",
    title: "Nova consulta agendada",
    description: "Maria Silva agendou uma consultoria para amanhã às 14:00.",
    time: "Há 2 horas",
    icon: UserPlus,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: 2,
    type: "message",
    title: "Nova mensagem recebida",
    description: "João Pedro enviou uma dúvida sobre o relatório de vulnerabilidades.",
    time: "Há 5 horas",
    icon: MessageSquare,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    id: 3,
    type: "completed",
    title: "Consulta concluída",
    description: "A consultoria com Ana Costa foi finalizada com sucesso.",
    time: "Ontem às 16:30",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    id: 4,
    type: "reminder",
    title: "Lembrete de compromisso",
    description: "Você tem um webinar sobre cibersegurança em 30 minutos.",
    time: "Há 1 dia",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

export default function ActivityTimeline() {
  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8 pb-6 last:pb-0"
        >
          {/* Timeline Line */}
          {index !== activities.length - 1 && (
            <div className="absolute left-[15px] top-8 w-[2px] h-full bg-border/20" />
          )}

          {/* Icon */}
          <div
            className={`absolute left-0 top-0 w-8 h-8 rounded-full ${activity.bg} flex items-center justify-center border border-white/5 z-10`}
          >
            <activity.icon className={`w-4 h-4 ${activity.color}`} />
          </div>

          {/* Content */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/20 rounded-xl p-4 hover:border-primary/30 transition-colors group">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {activity.title}
              </h4>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                {activity.time}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activity.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
