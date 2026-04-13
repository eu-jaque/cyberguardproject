import { motion } from "framer-motion";
import { Clock, Lightbulb, LineChart, Zap, TrendingUp, Play } from "lucide-react";
import type { Course } from "@/pages/Courses";
import { useSearchParams } from "react-router-dom";

interface DashOverviewProps {
  courses: Course[];
  userName: string;
}

export default function DashOverview({ courses, userName }: DashOverviewProps) {
  const [, setSearchParams] = useSearchParams();

  const handleResume = () => {
    if (courses.length > 0) {
      setSearchParams({ tab: "courses", courseId: courses[0].id });
    } else {
      setSearchParams({ tab: "courses" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Bem-vindo de volta, {userName}!</h2>
          <p className="text-muted-foreground mt-1">Sua jornada de proteção cibernética continua aqui.</p>
        </div>
      </div>

      {/* Gradient Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-[1.02] duration-300" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-20 h-20 text-white" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <p className="text-4xl font-bold text-white mb-1">{courses.length}</p>
            <p className="text-sm font-medium text-white/70 uppercase tracking-wide">Cursos Ativos</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>+2 esta semana</span>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-[1.02] duration-300" style={{ background: "linear-gradient(135deg, #450a0a, #7f1d1d)" }}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-20 h-20 text-white" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <p className="text-4xl font-bold text-white mb-1">42</p>
            <p className="text-sm font-medium text-white/70 uppercase tracking-wide">Aulas Concluídas</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <span>Total de 12 horas</span>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl p-6 relative overflow-hidden transition-all hover:scale-[1.02] duration-300" style={{ background: "linear-gradient(135deg, #064e3b, #065f46)" }}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <LineChart className="w-20 h-20 text-white" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <p className="text-4xl font-bold text-white mb-1">3</p>
            <p className="text-sm font-medium text-white/70 uppercase tracking-wide">Certificados</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <span>Nível Especialista</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Learning Card */}
        <div className="bg-card/40 backdrop-blur-md border border-border/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Play className="w-48 h-48 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-6">Continuar Aprendendo</h3>

          <div className="flex gap-6 items-center">
            <div className="w-32 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
              <img
                src={courses[0]?.url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
                {courses[0]?.title || "Introdução à Segurança"}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">Módulo 3: Engenharia Social</p>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
              </div>
            </div>
          </div>

          <button 
            onClick={handleResume}
            className="mt-8 w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Retomar Aula
          </button>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-border/10 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Dica do Dia</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-background/40 rounded-2xl border border-white/5">
              <p className="text-sm font-medium text-white/90">
                Ative a autenticação de dois fatores (MFA) em todas as suas contas críticas para aumentar a segurança em até 99%.
              </p>
            </div>
            <div className="p-4 bg-background/40 rounded-2xl border border-white/5">
              <p className="text-sm font-medium text-white/90">
                Nunca use a mesma senha para serviços diferentes. Use um gerenciador de senhas confiável.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

