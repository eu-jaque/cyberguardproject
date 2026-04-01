import { Heart, MessageCircle, Share2, ThumbsUp, Smile, Flame } from "lucide-react";
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
  { icon: Flame, label: "Fogo", color: "text-orange-500" },
  { icon: Smile, label: "Haha", color: "text-yellow-500" },
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

  const handleReaction = (idx: number) => {
    if (!user) {
      localStorage.setItem("cyberguard_redirect_post", post.id);
      navigate("/auth");
      return;
    }
    setReacted(reacted === idx ? null : idx);
    setShowReactions(false);
  };

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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium w-full justify-center transition-colors ${
              reacted !== null
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

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50 flex-1 justify-center transition-colors">
          <Share2 className="w-4 h-4" /> Compartilhar
        </button>
      </div>
    </article>
  );
}
