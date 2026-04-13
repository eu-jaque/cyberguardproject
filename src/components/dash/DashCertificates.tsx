import { motion } from "framer-motion";
import { Award, Download } from "lucide-react";

interface DashCertificatesProps {
  isComplete: boolean;
  progressPct: number;
}

export default function DashCertificates({ isComplete, progressPct }: DashCertificatesProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Certificados</h2>
      {isComplete ? (
        <div className="rounded-2xl p-8 text-center space-y-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a5f, #d4a535)" }}>
          <div className="text-6xl">🏅</div>
          <h3 className="text-lg font-bold text-white">Parabéns! Certificado Disponível</h3>
          <p className="text-sm text-white/80">Você concluiu 100% do curso.</p>
          <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-white/30 transition-colors border border-white/20">
            <Download className="w-5 h-5" /> Emitir Certificado
          </button>
        </div>
      ) : (
        <div className="bg-card/60 backdrop-blur-md border border-border/30 rounded-2xl p-12 text-center">
          <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Complete 100% de um curso para receber seu certificado.</p>
          <p className="text-sm text-muted-foreground mt-2">Progresso atual: {progressPct}%</p>
        </div>
      )}
    </motion.div>
  );
}
