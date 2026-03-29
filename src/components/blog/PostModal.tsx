import { X, Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type { SocialPost } from "./PostsCard";

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

  const handleComment = () => {
    if (!user) {
      localStorage.setItem("cyberguard_redirect_post", post.id);
      navigate("/auth");
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
    </div>
  );
}
