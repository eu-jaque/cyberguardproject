import { motion } from "framer-motion";
import { Award } from "lucide-react";
import CertificateGenerator from "../CertificateGenerator";

interface DashCertificatesProps {
  isComplete: boolean;
  progressPct: number;
  studentName: string;
  courseName: string;
}

export default function DashCertificates({ isComplete, progressPct, studentName, courseName }: DashCertificatesProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Certificados</h2>
      {isComplete ? (
        <div className="rounded-2xl p-8 text-center space-y-4 relative overflow-hidden bg-card border border-primary/20">
          <div className="text-6xl">🏅</div>
          <h3 className="text-lg font-bold text-foreground">Parabéns! Certificado Disponível</h3>
          <p className="text-sm text-muted-foreground">Você concluiu 100% do curso.</p>
          <div className="max-w-xs mx-auto">
            <CertificateGenerator 
              studentName={studentName || "Aluno CyberGuard"} 
              courseName={courseName || "Técnico em Cibersegurança"} 
            />
          </div>
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
