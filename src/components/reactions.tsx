import { useState } from "react";

export default function Comments() {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");

  function handleAddComment() {
    if (newComment.trim() === "") return;

    setComments([...comments, newComment]);
    setNewComment("");
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Comentários</h3>

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Escreva um comentário..."
        style={{ width: "100%", height: "80px" }}
      />

      <br />

      <button onClick={handleAddComment}>
        Comentar
      </button>

      <div style={{ marginTop: "20px" }}>
        {comments.map((c, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}