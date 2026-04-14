import { useState, useEffect } from "react";
import { ThumbsUp, Heart, Flame, Frown, Zap } from "lucide-react";

type ReactionType = "like" | "love" | "fire" | "sad" | "shock";

type ReactionCounts = Record<ReactionType, number>;

const reactionConfig: { type: ReactionType; icon: typeof ThumbsUp; label: string; color: string }[] = [
  { type: "like", icon: ThumbsUp, label: "Curtir", color: "text-blue-400" },
  { type: "love", icon: Heart, label: "Amei", color: "text-rose-400" },
  { type: "fire", icon: Flame, label: "Fogo", color: "text-orange-400" },
  { type: "sad", icon: Frown, label: "Triste", color: "text-sky-400" },
  { type: "shock", icon: Zap, label: "Uau", color: "text-amber-400" },
];

export default function Reactions({ postId }: { postId: string }) {
  const [reactions, setReactions] = useState<ReactionCounts>({
    like: 0, love: 0, fire: 0, sad: 0, shock: 0,
  });

  const [selected, setSelected] = useState<ReactionType | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("reactions-" + postId);
    if (saved) setReactions(JSON.parse(saved));
  }, [postId]);

  useEffect(() => {
    localStorage.setItem("reactions-" + postId, JSON.stringify(reactions));
  }, [reactions, postId]);

  const handleReact = (type: ReactionType) => {
    setReactions((prev) => {
      const updated = { ...prev };
      if (selected) updated[selected]--;
      updated[type]++;
      return updated;
    });
    setSelected(type);
  };

  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {reactionConfig.map((r) => {
        const Icon = r.icon;
        const isSelected = selected === r.type;
        return (
          <button
            key={r.type}
            onClick={() => handleReact(r.type)}
            className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-all duration-200 ${
              isSelected
                ? `${r.color} bg-secondary/60 border-current shadow-sm scale-105`
                : "text-muted-foreground border-border/40 hover:bg-secondary/40 hover:scale-105"
            }`}
            title={r.label}
          >
            <Icon className="w-4 h-4" fill={isSelected ? "currentColor" : "none"} strokeWidth={isSelected ? 1.5 : 2} />
            <span className="text-xs font-medium">{reactions[r.type]}</span>
          </button>
        );
      })}
    </div>
  );
}