import { motion } from "framer-motion";
import { CheckCircle2, Clock, MessageSquare, UserPlus } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "appointment",
    title: "Nova consulta agendada",
    description: "Maria Silva agendou para amanhã às 14:00",
    time: "Há 2 horas",
    icon: CalendarIcon,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    id: 2,
    type: "status",
    title: "Consulta concluída",
    description: "Atendimento de João Pedro finalizado com sucesso",
    time: "Há 5 horas",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
  {
    id: 3,
    type: "message",
    title: "Nova mensagem",
    description: "Ana Costa enviou uma dúvida sobre o plano",
    time: "Há 1 dia",
    icon: MessageSquare,
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    id: 4,
    type: "client",
    title: "Novo paciente",
    description: "Lucas Mendes completou o cadastro",
    time: "Há 2 dias",
    icon: UserPlus,
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  }
];

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default function ActivityTimeline() {
  return (
    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/20">
      {activities.map((activity, idx) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative flex gap-4 items-start pl-12"
        >
          {/* Icon node */}
          <div className={`absolute left-0 w-10 h-10 rounded-full ${activity.bg} border border-border/50 flex items-center justify-center z-10 shadow-lg backdrop-blur-sm`}>
            <activity.icon className={`w-5 h-5 ${activity.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 bg-card/40 backdrop-blur-md border border-border/20 rounded-xl p-4 hover:border-primary/30 transition-colors group">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{activity.title}</h4>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
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
