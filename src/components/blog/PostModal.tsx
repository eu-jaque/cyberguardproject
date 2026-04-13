import { X, Send, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { SocialPost } from "./PostCard";

const mockComments = [
  { id: "1", author: "Maria Silva", text: "Muito útil, obrigada!", date: "Há 2h", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "2", author: "João Pedro", text: "Excelente artigo, vou compartilhar!", date: "Há 5h", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: "3", author: "Ana Costa", text: "Precisamos de mais conteúdo assim.", date: "Há 1d", avatar: "https://i.pravatar.cc/40?img=3" },
];

export default function PostModal({ post, onClose }: { post: SocialPost; onClose: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(mockComments);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const handleLoginSuccess = () => {
    navigate("/auth");
  };
  const handleComment = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      localStorage.setItem("cyberguard_redirect_post", post.id);
      // navigate("/auth");
      return;
    }
    if (!comment.trim()) return;
    setComments(prev => [{ id: Date.now().toString(), author: user.email || "Você", text: comment, date: "Agora", avatar: "https://i.pravatar.cc/40?img=10" }, ...prev]);
    setComment("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full border-2 border-primary/30" />
            <div>
              <h4 className="text-sm font-bold text-foreground">{post.author}</h4>
              <p className="text-xs text-muted-foreground">{post.authorRole} · {post.date}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary/50 text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Content */}
          <p className="p-4 text-sm text-foreground/90">{post.content}</p>
          <img src={post.image} alt="" className="w-full" />

          {/* Comments */}
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-bold text-foreground">Comentários ({comments.length})</h4>
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <img src={c.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div className="flex-1 bg-secondary/30 rounded-xl px-3 py-2">
                  <span className="text-xs font-bold text-foreground">{c.author}</span>
                  <p className="text-xs text-foreground/80">{c.text}</p>
                  <span className="text-[10px] text-muted-foreground">{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment input */}
        <div className="p-4 border-t border-border flex gap-2">
          <input
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleComment()}
            placeholder={user ? "Escreva um comentário..." : "Faça login para comentar"}
            className="flex-1 bg-secondary/30 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button onClick={handleComment} className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-card/90 backdrop-blur-2xl w-full max-w-md p-10 rounded-[28px] border border-border shadow-2xl animate-in zoom-in-95 duration-300 transition-colors duration-300">

            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1.5 rounded-full bg-secondary/80 hover:bg-secondary border border-border/40 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary border border-border/40 flex items-center justify-center mb-6 shadow-inner transition-colors duration-300">
                <LogIn className="w-7 h-7 text-amber-400" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight transition-colors duration-300">Autenticação Necessária</h2>
              <p className="text-muted-foreground text-sm mb-8 font-light leading-relaxed transition-colors duration-300">
                Faça login ou crie uma conta para fazer um comentário.
              </p>

              <button
                onClick={handleLoginSuccess}
                className="w-full h-12 btn-gold-3d text-primary-foreground font-bold rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Login / Continuar
                <LogIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )
      }
    </div >
  )
}
