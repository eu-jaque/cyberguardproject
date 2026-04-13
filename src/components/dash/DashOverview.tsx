import { motion } from "framer-motion";
import { Clock, Lightbulb, LineChart } from "lucide-react";
import type { Course } from "@/pages/Courses";

interface DashOverviewProps {
  courses: Course[];
  userName: string;
}

export default function DashOverview({ courses, userName }: DashOverviewProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Visão Geral</h2>

      {/* Gradient Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0891b2, #115e59)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-3xl font-bold text-white">{courses.length}</p>
              <p className="text-xs text-white/80 mt-1">Cursos Matriculados</p>
            </div>
            <Clock className="w-6 h-6 text-white/60" />
          </div>
        </div>
        <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #e11d48, #ea580c)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-xs text-white/80 mt-1">Aulas Concluídas</p>
            </div>
            <Lightbulb className="w-6 h-6 text-white/60" />
          </div>
        </div>
        <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f, #10b981)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-xs text-white/80 mt-1">Certificados</p>
            </div>
            <LineChart className="w-6 h-6 text-white/60" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
