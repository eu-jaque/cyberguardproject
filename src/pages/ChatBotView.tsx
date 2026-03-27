import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Sparkles, ShieldCheck, SendHorizontal, Bot, User, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import confettiLib from "canvas-confetti";
import ChatHistorySidebar from "@/components/ChatHistorySidebar"; // Import novo
import SidebarMenu from "@/components/SideBarMenu";
import ChatBotComponent from "@/components/ChatBotComponent";
import { useAuth } from "@/contexts/AuthContext";
import Swal from 'sweetalert2';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface Conversation {
    id: string;
    name: string;
    date: string;
    user_id: string;
}

export default function ChatBotView() {
    const { user } = useAuth();
    const currentUserId = user?.id || 'id-temporario-local';

    const [conversations, setConversations] = useState<Conversation[]>([
        { id: '1', name: 'Como proteger senhas', date: '2026-03-25', user_id: currentUserId },
        { id: '2', name: 'Explicação de Phishing', date: '2026-03-24', user_id: currentUserId }
    ]);

    const [activeChatId, setActiveChatId] = useState<string>('1');

    // Inicializamos as mensagens vazias
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 🎯 CORREÇÃO 1: Sempre que mudar o chat ativo, troca as mensagens!
    useEffect(() => {
        // No futuro, aqui você fará um fetch no Supabase buscando mensagens por `activeChatId`
        // Por enquanto, vamos simular resetando a conversa com a mensagem inicial
        setMessages([
            {
                id: crypto.randomUUID(),
                text: `Olá! Você entrou no chat "${currentChat?.name || 'Novo Chat'}". Como posso ajudar?`,
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
        setInput(""); // Limpa a caixa de texto ao trocar de chat
    }, [activeChatId]); // 👈 Escuta a mudança de chat!

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);


    const handleNewChat = () => {
        const newId = crypto.randomUUID();

        setConversations(prev => [
            { id: newId, name: 'Novo Chat', date: new Date().toISOString(), user_id: currentUserId },
            ...prev
        ]);

        setActiveChatId(newId);
        // O useEffect acima cuidará de carregar a mensagem padrão para esse newId!
    };


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const botMessage: Message = {
                id: crypto.randomUUID(),
                text: "Para proteger suas senhas, recomendo usar um gerenciador de senhas confiável e ativar a autenticação de dois fatores (2FA).",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, botMessage]);
        }, 1500);
    };


    const handleRenameChat = (id: string, newTitle: string) => {
        // 🎯 PEQUENO AJUSTE: Trocado 'title' por 'name' para bater com sua interface
        setConversations(prev => prev.map(c => c.id === id ? { ...c, name: newTitle } : c));
    };


    const handleDeleteChat = async (id: string) => {
        const result = await Swal.fire({
            title: 'Excluir chat?',
            text: "Essa ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            background: '#0b1426',
            color: '#f1f7feb3',
        });

        if (result.isConfirmed) {
            setConversations(prev => {
                const filtered = prev.filter(c => c.id !== id);

                if (activeChatId === id) {
                    const nextChat = filtered[0];
                    setActiveChatId(nextChat ? nextChat.id : '');
                }

                return filtered;
            });

            Swal.fire({
                title: 'Excluído!',
                text: 'O chat foi removido.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#0b1426',
                color: '#f1f7feb3',
            });
        }
    };

    const currentChat = conversations.find(c => c.id === activeChatId);

    return (
        <div className="min-h-screen flex bg-[#0b1426] text-slate-100 transition-colors duration-300 relative selection:bg-amber-500/30 selection:text-amber-200">
            <SidebarMenu />

            <div className="flex-1 flex pl-16 h-screen w-full">
                <ChatHistorySidebar
                    conversations={conversations}
                    activeId={activeChatId}
                    onSelectChat={(id) => setActiveChatId(id)}
                    onNewChat={handleNewChat}
                    onRenameChat={handleRenameChat}
                    onDeleteChat={handleDeleteChat}
                />

                <ChatBotComponent
                    messages={messages}
                    messagesEndRef={messagesEndRef}
                    input={input}
                    setInput={setInput}
                    chatName={currentChat?.name || 'Novo Chat'}
                    handleSendMessage={handleSendMessage}
                />
            </div>

            <AccessibilityWidget />
        </div>
    );
}