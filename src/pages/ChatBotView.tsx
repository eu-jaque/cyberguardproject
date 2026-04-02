import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useState, useEffect, useRef } from "react";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import SidebarMenu from "@/components/SideBarMenu";
import ChatBotComponent from "@/components/ChatBotComponent";
import { useAuth } from "@/contexts/AuthContext";
import Swal from 'sweetalert2';
import supabase from "../../utils/supabase";
import { streamChat, type AiMessage } from "@/lib/ai-chat";
import { toast } from "sonner";

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
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Histórico de mensagens para contexto da IA
    const aiHistoryRef = useRef<AiMessage[]>([]);

    useEffect(() => {
        if (!user) return;
        const fetchConversations = async () => {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) { console.error("Erro ao buscar conversas:", error); return; }
            if (data) {
                setConversations(data);
                if (data.length > 0 && !activeChatId) setActiveChatId(data[0].id);
            }
        };
        fetchConversations();
    }, [user]);

    const currentChat = conversations.find(c => c.id === activeChatId);

    useEffect(() => {
        aiHistoryRef.current = [];
        setMessages([{
            id: crypto.randomUUID(),
            text: `Olá! Sou a **Cyntia**, assistente de segurança digital da CyberGuard. Como posso ajudar você?`,
            sender: 'bot',
            timestamp: new Date()
        }]);
        setInput("");
    }, [activeChatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleNewChat = async () => {
        const { data, error } = await supabase
            .from('conversations')
            .insert([{ name: 'Novo Chat', user_id: currentUserId }])
            .select().single();

        if (error) { Swal.fire('Erro', 'Não foi possível criar o chat.', 'error'); return; }
        if (data) {
            setConversations(prev => [data, ...prev]);
            setActiveChatId(data.id);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userText = input.trim();
        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Adiciona ao histórico da IA
        aiHistoryRef.current.push({ role: "user", content: userText });

        const botId = crypto.randomUUID();
        let botText = "";

        await streamChat({
            messages: aiHistoryRef.current,
            onDelta: (chunk) => {
                botText += chunk;
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last?.id === botId) {
                        return prev.map((m, i) => i === prev.length - 1 ? { ...m, text: botText } : m);
                    }
                    return [...prev, { id: botId, text: botText, sender: 'bot', timestamp: new Date() }];
                });
            },
            onDone: () => {
                setIsTyping(false);
                aiHistoryRef.current.push({ role: "assistant", content: botText });
            },
            onError: (err) => {
                setIsTyping(false);
                toast.error(err);
                setMessages(prev => [...prev, {
                    id: botId,
                    text: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            }
        });
    };

    const handleRenameChat = async (id: string, newTitle: string) => {
        const { error } = await supabase.from('conversations').update({ name: newTitle }).eq('id', id);
        if (error) { Swal.fire('Erro', 'Não foi possível renomear.', 'error'); return; }
        setConversations(prev => prev.map(c => c.id === id ? { ...c, name: newTitle } : c));
    };

    const handleDeleteChat = async (id: string) => {
        const result = await Swal.fire({
            title: 'Excluir chat?', text: "Essa ação não poderá ser desfeita!",
            icon: 'warning', showCancelButton: true,
            confirmButtonColor: '#f59e0b', cancelButtonColor: '#475569',
            confirmButtonText: 'Sim, excluir!', cancelButtonText: 'Cancelar',
            background: '#0b1426', color: '#f1f7feb3',
        });
        if (result.isConfirmed) {
            const { error } = await supabase.from('conversations').delete().eq('id', id);
            if (error) { Swal.fire('Erro', 'Não foi possível excluir.', 'error'); return; }
            setConversations(prev => {
                const filtered = prev.filter(c => c.id !== id);
                if (activeChatId === id) setActiveChatId(filtered[0]?.id || '');
                return filtered;
            });
        }
    };

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
                    isTyping={isTyping}
                />
            </div>
            <AccessibilityWidget />
        </div>
    );
}
