import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from "lucide-react";

const mockBlogPosts = [
  { id: "1", author: "Dr. Carlos Silva", role: "Especialista em Cibersegurança", date: "15 Mar 2026", avatar: "C", title: "Como proteger seus dados em redes públicas", content: "Redes Wi-Fi públicas são um prato cheio para hackers. Neste artigo, explico as melhores práticas para se manter seguro.", likes: 24, comments: 8 },
  { id: "2", author: "Ana Beatriz", role: "Pesquisadora de Segurança", date: "12 Mar 2026", avatar: "A", title: "Os 5 golpes mais comuns no Pix em 2026", content: "O Pix revolucionou os pagamentos, mas também abriu portas para novos golpes. Conheça os mais frequentes.", likes: 42, comments: 15 },
  { id: "3", author: "Prof. Ricardo Lopes", role: "Instrutor de Cybersecurity", date: "10 Mar 2026", avatar: "R", title: "Firewall: seu primeiro escudo digital", content: "Entenda como configurar um firewall doméstico e proteger toda a sua rede.", likes: 18, comments: 5 },
];

export default function DashBlog() {
  const [blogSubTab, setBlogSubTab] = useState<"recent" | "old">("recent");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setBlogSubTab("recent")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${blogSubTab === "recent" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/30"}`}>
          Mais Recentes
        </button>
        <button onClick={() => setBlogSubTab("old")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${blogSubTab === "old" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/30"}`}>
          Mais Antigas
        </button>
      </div>

      {(blogSubTab === "old" ? [...mockBlogPosts].reverse() : mockBlogPosts).map(post => (
        <div key={post.id} className="bg-card/60 backdrop-blur-md border border-border/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{post.avatar}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{post.author}</p>
                <p className="text-[11px] text-muted-foreground">{post.role} · {post.date}</p>
              </div>
            </div>
            <button className="p-1.5 rounded-full hover:bg-secondary/30 text-muted-foreground">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">{post.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{post.content}</p>
          </div>
          <div className="flex items-center gap-6 pt-2 border-t border-border/20">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ThumbsUp className="w-4 h-4" /> Curtir ({post.likes})
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare className="w-4 h-4" /> Comentar ({post.comments})
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" /> Compartilhar
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
