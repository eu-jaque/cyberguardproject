import { useState } from "react";
import { MessageSquare, Plus, Trash2, Check, X, PencilLine } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  date: string;
}

interface ChatHistorySidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
}

export default function ChatHistorySidebar({
  conversations,
  activeId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
}: ChatHistorySidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.name);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      onRenameChat(id, editTitle);
    }
    setEditingId(null);
  };

  return (
    <aside className="w-72 h-[calc(100vh)] bg-[#0f1b33] border-r border-slate-800 flex flex-col p-4 z-20">
      {/* Botão Novo Chat */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 w-full p-3 rounded-xl border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-all text-sm font-medium text-white mb-6 group"
      >
        <Plus size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
        Novo Chat
      </button>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-2">
          Histórico Recente
        </span>

        {conversations.length === 0 ? (
          <div className="text-center text-sm text-slate-500 mt-4">
            Nenhuma conversa salva
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all text-sm ${
                activeId === conv.id ? "bg-amber-500/10 text-amber-400" : "hover:bg-slate-800 text-slate-300"
              }`}
              onClick={() => editingId !== conv.id && onSelectChat(conv.id)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare size={16} className={activeId === conv.id ? "text-amber-400" : "text-slate-400"} />
                
                {editingId === conv.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                    className="bg-slate-800 text-white text-xs p-1 rounded border border-amber-500/50 w-full focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(conv.id);
                    }}
                  />
                ) : (
                  <span className="truncate pr-2">{conv.name}</span>
                )}
              </div>

              {/* Ações (Editar / Deletar) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId === conv.id ? (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveEdit(conv.id); }}
                      className="p-1 hover:bg-slate-700 rounded text-emerald-500"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                      className="p-1 hover:bg-slate-700 rounded text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStartEdit(conv); }}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    >
                      <PencilLine size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteChat(conv.id); }}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}