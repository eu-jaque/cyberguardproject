import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Sparkles, ShieldCheck, SendHorizontal, Bot, User, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ChatHistorySidebar from "@/components/ChatHistorySidebar"; // Import novo
import SidebarMenu from "@/components/SideBarMenu";
import ChatBotComponent from "@/components/ChatBotComponent";
import { useAuth } from "@/contexts/AuthContext";
import Swal from 'sweetalert2';
import supabase from "../../utils/supabase";
import { sendMessageToAI } from "@/services/aiService";

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface Conversation {
    id: string;
    name: string;
    created_at: string;
    user_id: string;
}

export default function ChatBotView() {
    const { user } = useAuth();
    const currentUserId = user?.id || 'id-temporario-local';

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
    });

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
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Erro ao buscar conversas:", error);
                Toast.fire({ icon: 'error', title: 'Erro ao buscar chats.' });
                return;
            }

            if (data) {
                setConversations(data);
                if (data.length > 0 && !activeChatId) {
                    setActiveChatId(data[0].id);
                }
                Toast.fire({ icon: 'success', title: 'Chats carregados.' });
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
        if (conversations.length >= 5) {
            Swal.fire({
                title: 'Limite atingido',
                text: 'Você pode ter no máximo 5 chats ativos.',
                icon: 'warning',
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
            });
            return;
        }

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
            Toast.fire({ icon: 'error', title: 'Não foi possível criar o chat.' });
            return;
        }

        if (data) {
            setConversations(prev => [data, ...prev]);
            setActiveChatId(data.id);
            Toast.fire({ icon: 'success', title: 'Chat criado com sucesso.' });
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

        const chatHistoryMsg = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

        try {
            const aiResponseText = await sendMessageToAI(input, chatHistoryMsg);

            setIsTyping(false);
            const botMessage: Message = {
                id: crypto.randomUUID(),
                text: aiResponseText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            setIsTyping(false);
            Toast.fire({ icon: 'error', title: 'Falha de conexão com a I.A.' });
        }
    };


    const handleRenameChat = async (id: string, newTitle: string) => {
        const { error } = await supabase
            .from('conversations')
            .update({ name: newTitle })
            .eq('id', id);

        if (error) {
            console.error("Erro ao renomear conversa:", error);
            Toast.fire({ icon: 'error', title: 'Não foi possível renomear.' });
            return;
        }

        setConversations(prev => prev.map(c => c.id === id ? { ...c, name: newTitle } : c));
        Toast.fire({ icon: 'success', title: 'Chat renomeado.' });
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
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
        });

        if (result.isConfirmed) {
            const { error } = await supabase
                .from('conversations')
                .delete()
                .eq('id', id);

            if (error) {
                console.error("Erro ao remover conversa:", error);
                Toast.fire({ icon: 'error', title: 'Não foi possível excluir o chat.' });
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
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
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
        </div>
    );
}