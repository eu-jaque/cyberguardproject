import { Heart, MessageCircle, Share2, ThumbsUp, Smile, Angry, X, LogIn } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export interface SocialPost {
  id: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
}

const reactions = [
  { icon: ThumbsUp, label: "Curtir", color: "text-blue-500" },
  { icon: Heart, label: "Amei", color: "text-red-500" },
  { icon: Smile, label: "Uau", color: "text-yellow-500" },
  { icon: Smile, label: "Haha", color: "text-yellow-400" },
  { icon: Angry, label: "Raiva", color: "text-orange-500" },
];

export default function PostCard({
  post,
  onOpen,
}: {
  post: SocialPost;
  onOpen: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reacted, setReacted] = useState<number | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const handleLoginSuccess = () => {
    navigate("/auth");
  };
  const handleReaction = (idx: number) => {
    if (!user) {
      setIsLoginModalOpen2(true);
      localStorage.setItem("cyberguard_redirect_post", post.id);
      // navigate("/auth");
      return;
    }
    setReacted(reacted === idx ? null : idx);
    setShowReactions(false);
  };
  const [isLoginModalOpen2, setIsLoginModalOpen2] = useState(false);

  return (
    <article className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.authorAvatar}
          alt={post.author}
          className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
        />
        <div>
          <h4 className="text-sm font-bold text-foreground">{post.author}</h4>
          <p className="text-xs text-muted-foreground">
            {post.authorRole} · {post.date}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="px-4 pb-3 text-sm text-foreground/90">{post.content}</p>

      {/* Image */}
      <div
        className="aspect-video overflow-hidden cursor-pointer"
        onClick={onOpen}
      >
        <img
          src={post.image}
          alt=""
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-b border-border/30">
        <span>{post.likes + (reacted !== null ? 1 : 0)} curtidas</span>
        <span>{post.comments} comentários</span>
      </div>

      {/* Actions */}
      <div className="flex items-center relative px-2 py-1">
        <div
          className="relative flex-1"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button
            onClick={() => handleReaction(0)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium w-full justify-center transition-colors ${reacted !== null
              ? reactions[reacted].color
              : "text-muted-foreground hover:bg-secondary/50"
              }`}
          >
            {reacted !== null ? (
              <>
                {(() => {
                  const Icon = reactions[reacted].icon;
                  return <Icon className="w-4 h-4" />;
                })()}
                {reactions[reacted].label}
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" /> Curtir
              </>
            )}
          </button>

          {/* Reaction picker */}
          {showReactions && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-1 bg-card border border-border rounded-full px-2 py-1.5 shadow-xl z-20 animate-scale-in">
              {reactions.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => handleReaction(i)}
                  className={`p-2 rounded-full hover:bg-secondary/50 transition-transform hover:scale-125 ${r.color}`}
                  title={r.label}
                >
                  <r.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onOpen}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 flex-1 justify-center transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Comentar
        </button>

        <button
          onClick={async () => {
            const shareData = {
              title: `Post de ${post.author}`,
              text: post.content?.slice(0, 100) || "Confira este post no CyberGuard!",
              url: `${window.location.origin}/blog/${post.id}`,
            };
            try {
              if (navigator.share) {
                await navigator.share(shareData);
              } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copiado para a área de transferência!");
              }
            } catch (e) {
              // user cancelled share dialog
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 flex-1 justify-center transition-colors"
        >
          <Share2 className="w-4 h-4" /> Compartilhar
        </button>
      </div>
      {isLoginModalOpen2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-card/90 backdrop-blur-2xl w-full max-w-md p-10 rounded-[28px] border border-border shadow-2xl animate-in zoom-in-95 duration-300 transition-colors duration-300">

            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={() => setIsLoginModalOpen2(false)}
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
    </article>

  );
}
