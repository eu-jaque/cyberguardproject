import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Sparkles, ShieldCheck, SendHorizontal, Bot, User, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";
import SidebarMenu from "@/components/SideBarMenu";
import ChatBotComponent from "@/components/ChatBotComponent";
import { useAuth } from "@/contexts/AuthContext";
import Swal from 'sweetalert2';
import supabase from "../../utils/supabase";
import { streamChat } from "@/lib/streamChat";
import { streamGroqChat } from "@/lib/streamGroqChat";

//Cria a interface Messagem
//que segura as informações que serão utilizadas para envio/manipulação das mensagens
interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

//Cria a interface Conversation
//que segura as informações que serão utilizadas para envio/manipulação das conversas
//e ações como deletar, editar e carregar conversas
interface Conversation {
    id: string;
    name: string;
    created_at: string;
    user_id: string;
}

//Cria a função ChatBotView
//que será responsável por renderizar o chatbot
export default function ChatBotView() {
    const { user } = useAuth();
    const currentUserId = user?.id || 'id-temporario-local';

    //Cria o Toast
    //que será responsável por exibir mensagens de erro, sucesso, etc
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
    });

    //Cria os estados
    //que serão responsáveis por armazenar as informações que serão utilizadas para envio/manipulação das mensagens
    //e ações como deletar, editar e carregar conversas
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeChatId, setActiveChatId] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [chatModule, setChatModule] = useState<'default' | 'groq'>('default');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const skipNextLoadRef = useRef(false);

    // Histórico de mensagens para enviar ao AI (role format)
    const chatHistoryRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

    useEffect(() => {
        if (!user) return;
        //trás as conversas ( conversations ) pelo id do usuário e ordem de criação
        const fetchConversations = async () => {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            //Se dar algum tipo de erro, exibe
            if (error) {
                console.error("Erro ao buscar conversas:", error);
                Toast.fire({ icon: 'error', title: 'Erro ao buscar chats.' });
                return;
            }
            //se encontrar, atráves do set, ele atualiza com os dados encontrados
            if (data) {
                setConversations(data);
                if (data.length > 0 && !activeChatId) {
                    //se não tiver um chat ativo, ele define o primeiro chat como ativo
                    setActiveChatId(data[0].id);
                }
            }
        };
        //chama a função fetchConversations pela primeira vez
        fetchConversations();
    }, [user]);

    const currentChat = conversations.find(c => c.id === activeChatId);

    const saveMessage = async (msg: { id: string; text: string; sender: 'user' | 'bot'; timestamp: Date }, chatIdOverride?: string) => {
        const idToSave = chatIdOverride || activeChatId;
        if (!idToSave) return;
        
        await supabase.from('messages').insert({
            id: msg.id,
            conversation_id: idToSave,
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp.toISOString(),
        });
    };

    useEffect(() => {
        if (!activeChatId) return;
        if (skipNextLoadRef.current) {
            skipNextLoadRef.current = false;
            return;
        }
        chatHistoryRef.current = [];
        const loadMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', activeChatId)
                .order('timestamp', { ascending: true });

            if (data && data.length > 0) {
                setMessages(data.map((m: any) => ({
                    id: m.id,
                    text: m.text,
                    sender: m.sender,
                    timestamp: new Date(m.timestamp),
                })));
                chatHistoryRef.current = data.map((m: any) => ({
                    role: m.sender === 'bot' ? 'assistant' as const : 'user' as const,
                    content: m.text,
                }));
            } else {
                setMessages([{
                    id: crypto.randomUUID(),
                    text: `Olá! Sou a **CYNTIA**, sua assistente de cibersegurança. Como posso ajudar você hoje?`,
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            }
        };
        loadMessages();
        setInput("");
    }, [activeChatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
            return null;
        }
        const { data, error } = await supabase
            .from('conversations')
            .insert([{ name: 'Novo Chat', user_id: currentUserId }])
            .select()
            .single();

        if (error) {
            Toast.fire({ icon: 'error', title: 'Não foi possível criar o chat.' });
            return null;
        }
        if (data) {
            setConversations(prev => [data, ...prev]);
            setActiveChatId(data.id);
            Toast.fire({ icon: 'success', title: 'Chat criado com sucesso.' });
            return data.id;
        }
        return null;
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        let targetChatId = activeChatId;
        if (!targetChatId) {
            skipNextLoadRef.current = true;
            const newId = await handleNewChat();
            if (!newId) {
                skipNextLoadRef.current = false;
                return;
            }
            targetChatId = newId;
        }

        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        chatHistoryRef.current.push({ role: "user", content: input });
        setInput("");
        saveMessage(userMessage, targetChatId);
        setIsTyping(true);

        const botMessageId = crypto.randomUUID();
        let assistantText = "";

        // Add empty bot message
        setMessages(prev => [...prev, {
            id: botMessageId,
            text: "",
            sender: 'bot',
            timestamp: new Date()
        }]);

        try {
            const streamFn = chatModule === 'groq' ? streamGroqChat : streamChat;
            await streamFn({
                messages: chatHistoryRef.current,
                onDelta: (chunk) => {
                    assistantText += chunk;
                    setMessages(prev => prev.map(m =>
                        m.id === botMessageId ? { ...m, text: assistantText } : m
                    ));
                },
                onDone: () => {
                    chatHistoryRef.current.push({ role: "assistant", content: assistantText });
                    setIsTyping(false);
                    saveMessage({ id: botMessageId, text: assistantText, sender: 'bot', timestamp: new Date() }, targetChatId);
                },
                onError: (error) => {
                    setMessages(prev => prev.map(m =>
                        m.id === botMessageId ? { ...m, text: `⚠️ ${error}` } : m
                    ));
                    setIsTyping(false);
                }
            });
        } catch {
            setMessages(prev => prev.map(m =>
                m.id === botMessageId ? { ...m, text: "⚠️ Erro ao conectar com a IA. Tente novamente." } : m
            ));
            setIsTyping(false);
        }
    };

    const handleRenameChat = async (id: string, newTitle: string) => {
        const { error } = await supabase
            .from('conversations')
            .update({ name: newTitle })
            .eq('id', id);
        if (error) {
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
                Toast.fire({ icon: 'error', title: 'Não foi possível excluir o chat.' });
                return;
            }
            setConversations(prev => {
                const filtered = prev.filter(c => c.id !== id);
                if (activeChatId === id) {
                    setActiveChatId(filtered[0]?.id || '');
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

    return (
        <div className="h-full flex bg-background text-foreground transition-colors duration-300 relative selection:bg-primary/30 selection:text-primary">
            <div className={`flex-1 flex h-full w-full transition-all duration-300`}>
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
                    chatModule={chatModule}
                    setChatModule={setChatModule}
                />
            </div>
        </div>
    );
}
