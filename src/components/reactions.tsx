import { useState, useEffect } from "react";

type ReactionType = "like" | "love" | "wow" | "sad" | "Grr";

type ReactionCounts = Record<ReactionType, number>;

const emojis: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  wow: "😮",
  sad: "😢",
  Grr: "😡",
};

export default function Reactions({ postId }: { postId: string }) {
  const [reactions, setReactions] = useState<ReactionCounts>({
    like: 0,
    love: 0,
    wow: 0,
    sad: 0,
    Grr: 0,
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

      if (selected) {
        updated[selected]--;
      }

      updated[type]++;

      return updated;
    });

    setSelected(type);
  };

  return (
    <div className="flex gap-3 mt-3 flex-wrap">
      {Object.entries(emojis).map(([type, emoji]) => (
        <button
          key={type}
          onClick={() => handleReact(type as ReactionType)}
          className={`text-sm px-2 py-1 rounded ${
            selected === type ? "bg-primary text-white" : ""
          }`}
        >
          {emoji} {reactions[type as ReactionType]}
        </button>
      ))}
    </div>
  );
}