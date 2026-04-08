import { motion } from "framer-motion";

const mockQuizzes = [
  { id: "1", title: "Identificando Phishing", status: "concluído", score: "8/10", progress: 100 },
  { id: "2", title: "Segurança de Senhas", status: "em andamento", score: "—", progress: 60 },
  { id: "3", title: "Golpes no Pix", status: "não iniciado", score: "—", progress: 0 },
  { id: "4", title: "Privacidade Online", status: "concluído", score: "10/10", progress: 100 },
];

export default function DashQuiz() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Quiz & Jogos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockQuizzes.map(q => (
          <div key={q.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold text-foreground">{q.title}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${q.status === "concluído" ? "bg-emerald-500/20 text-emerald-400" :
                q.status === "em andamento" ? "bg-amber-500/20 text-amber-400" :
                  "bg-secondary/50 text-muted-foreground"
                }`}>{q.status}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-gold rounded-full transition-all" style={{ width: `${q.progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Pontuação: {q.score}</span>
              <span>{q.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
