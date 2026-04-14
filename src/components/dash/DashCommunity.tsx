import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ThumbsUp, Heart, Flame, Lightbulb } from "lucide-react";

const reactions = [
  { icon: ThumbsUp, label: "👍" },
  { icon: Heart, label: "❤️" },
  { icon: Flame, label: "🔥" },
  { icon: Lightbulb, label: "💡" },
];

const communityQuestions = [
  { id: "1", author: "Maria", avatar: "M", question: "Como configurar firewall no Ubuntu?", status: "respondida", replies: 3 },
  { id: "2", author: "João", avatar: "J", question: "Melhor antivírus para Windows 2026?", status: "pendente", replies: 0 },
  { id: "3", author: "Ana", avatar: "A", question: "Dúvida sobre certificado SSL/TLS", status: "respondida", replies: 5 },
  { id: "4", author: "Pedro", avatar: "P", question: "Como detectar keylogger?", status: "pendente", replies: 1 },
];

interface DashCommunityProps {
  userEmail?: string;
}

export default function DashCommunity({ userEmail }: DashCommunityProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: "1", author: "Aluno", text: "Ótima aula!", reaction: "👍" },
    { id: "2", author: "Professor", text: "Obrigado pelo feedback!", reaction: "❤️" },
  ]);

  const addComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), author: userEmail || "Você", text: comment, reaction: "" }]);
    setComment("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Comunidade</h2>
      {/* Message input */}
      <div className="flex gap-2">
        <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()}
          placeholder="Escreva uma mensagem para a comunidade..."
          className="flex-1 bg-card/60 backdrop-blur-md border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        <button onClick={addComment} className="p-3 rounded-xl bg-primary text-primary-foreground">
          <Send className="w-4 h-4" />
        </button>
      </div>
      {/* Feed */}
      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-4 flex gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">{c.author[0]}</div>
            <div className="flex-1">
              <span className="text-xs font-bold text-foreground">{c.author}</span>
              <p className="text-xs text-foreground/80 mt-0.5">{c.text}</p>
              <div className="flex gap-2 mt-2">
                {reactions.map(r => (
                  <button key={r.label} className="text-sm hover:scale-125 transition-transform">{r.label}</button>
                ))}
              </div>
            </div>
          </div>
        ))}
        {communityQuestions.map(q => (
          <div key={q.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-secondary/50 flex items-center justify-center text-xs font-bold text-foreground">{q.avatar}</div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{q.question}</h4>
                <p className="text-xs text-muted-foreground">Por {q.author} · {q.replies} respostas</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${q.status === "respondida" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
              {q.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
