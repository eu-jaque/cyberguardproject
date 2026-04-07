import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Sparkles, ShieldCheck, SendHorizontal, Bot, User, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import confettiLib from "canvas-confetti";
import ChatHistorySidebar from "@/components/ChatHistorySidebar"; // Import novo
import SidebarMenu from "@/components/SideBarMenu";
import ChatBotComponent from "@/components/ChatBotComponent";
import { useAuth } from "@/contexts/AuthContext";
import Swal from 'sweetalert2';
import supabase from "../../utils/supabase";

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

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChatId, setActiveChatId] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Busca das conversas iniciais no Supabase
    useEffect(() => {
        if (!user) return;

        const fetchConversations = async () => {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) {
                console.error("Erro ao buscar conversas:", error);
                return;
            }

            if (data) {
                setConversations(data);
                if (data.length > 0 && !activeChatId) {
                    setActiveChatId(data[0].id);
                }
            }
        };

        fetchConversations();
    }, [user]);

    // Inicializamos as mensagens vazias
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([
            {
                id: crypto.randomUUID(),
                text: `Olá! Você entrou no chat "${currentChat?.name || 'Novo Chat'}". Como posso ajudar?`,
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
        setInput("");
    }, [activeChatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);


    const handleNewChat = async () => {
        const newChat = {
            name: 'Novo Chat',
            user_id: currentUserId,
        };

        const { data, error } = await supabase
            .from('conversations')
            .insert([newChat])
            .select()
            .single();

        if (error) {
            console.error("Erro ao criar conversa:", error);
            Swal.fire('Erro', 'Não foi possível criar o chat.', 'error');
            return;
        }

        if (data) {
            setConversations(prev => [data, ...prev]);
            setActiveChatId(data.id);
        }
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


    const handleRenameChat = async (id: string, newTitle: string) => {
        const { error } = await supabase
            .from('conversations')
            .update({ name: newTitle })
            .eq('id', id);

        if (error) {
            console.error("Erro ao renomear conversa:", error);
            Swal.fire('Erro', 'Não foi possível renomear.', 'error');
            return;
        }

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
            const { error } = await supabase
                .from('conversations')
                .delete()
                .eq('id', id);

            if (error) {
                console.error("Erro ao remover conversa:", error);
                Swal.fire('Erro', 'Não foi possível excluir o chat.', 'error');
                return;
            }

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
        <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300 relative selection:bg-primary/30 selection:text-primary">
            <SidebarMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className={`flex-1 flex h-screen w-full transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
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