import AccessibilityWidget from "@/components/AccessibilityWidget";
import { Sparkles, ShieldCheck, SendHorizontal, Bot, User, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import confettiLib from "canvas-confetti";
import ChatHistorySidebar from "@/components/ChatHistorySidebar"; // Import novo
import SidebarMenu from "@/components/SideBarMenu";

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
}

export default function ChatBotView() {
    // Estado de Conversas
    const [conversations, setConversations] = useState<Conversation[]>([
        { id: '1', name: 'Como proteger senhas', date: '2026-03-25' },
        { id: '2', name: 'Explicação de Phishing', date: '2026-03-24' }
    ]);
    const [activeChatId, setActiveChatId] = useState<string>('1');

    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Olá! Como posso ajudar você a proteger sua navegação hoje?", sender: 'bot', timestamp: new Date() }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

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

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Funções de Controle de Histórico
    const handleNewChat = () => {
        const newId = crypto.randomUUID();
        setConversations(prev => [{ id: newId, name: 'Novo Chat', date: new Date().toISOString() }, ...prev]);
        setActiveChatId(newId);
        setMessages([{ id: crypto.randomUUID(), text: "Novo chat iniciado. Como posso ajudar?", sender: 'bot', timestamp: new Date() }]);
    };

    const handleRenameChat = (id: string, newTitle: string) => {
        setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
    };

    const handleDeleteChat = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeChatId === id) {
            setActiveChatId(conversations[0]?.id || '');
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0b1426] text-slate-100 transition-colors duration-300 relative selection:bg-amber-500/30 selection:text-amber-200">

            {/* 1. Sidebar Principal de Navegação (Fica fixa na esquerda) */}
            <SidebarMenu />

            {/* 2. Container que afasta o conteúdo do tamanho da SidebarMenu */}
            {/* Se a SidebarMenu fechada tem w-16 (64px), usamos pl-16 */}
            <div className="flex-1 flex pl-16 h-screen w-full">

                {/* 3. Sidebar de Histórico (Não-fixa, flui ao lado da margem da primeira) */}
                <ChatHistorySidebar
                    conversations={conversations}
                    activeId={activeChatId}
                    onSelectChat={(id) => setActiveChatId(id)}
                    onNewChat={handleNewChat}
                    onRenameChat={handleRenameChat}
                    onDeleteChat={handleDeleteChat}
                />

                {/* 4. Conteúdo Principal do Chat (ocupa o resto do espaço à direita) */}
                <main className="flex-1 flex flex-col h-full relative min-w-0">

                    {/* Cabeçalho */}
                    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#0b1426]/80 backdrop-blur-md border-b border-slate-800/50">
                        <div className=" mx-auto w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-200">CyberGuard Chat</span>
                                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> Beta
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mensagens (overflow-y-auto no próprio container de mensagens) */}
                    <div className="flex-1 overflow-y-auto pb-36 pt-4">
                        <div className="max-w-3xl mx-auto w-full px-4 space-y-8">
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex flex-col space-y-2 group">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                        {msg.sender === 'bot' ? (
                                            <>
                                                <div className="h-6 w-6 rounded-md bg-amber-500 flex items-center justify-center text-white">
                                                    <Bot size={14} />
                                                </div>
                                                CyberGuard AI
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-6 w-6 rounded-md bg-slate-700 flex items-center justify-center text-white">
                                                    <User size={14} />
                                                </div>
                                                Você
                                            </>
                                        )}
                                    </div>

                                    <div className={`pl-8 text-base leading-relaxed text-slate-100 ${msg.sender === 'user' ? 'bg-slate-800/30 p-4 rounded-xl ml-8' : ''
                                        }`}>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input Fixo no rodapé de main */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0b1426] via-[#0b1426]/90 to-transparent pt-10 pb-6">
                        <div className="max-w-3xl mx-auto w-full px-4">
                            <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#142342] border border-slate-800/80 rounded-2xl shadow-2xl focus-within:border-amber-500/50 transition-colors">
                                <textarea
                                    placeholder="Pergunte ao CyberGuard..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    rows={1}
                                    className="flex-1 bg-transparent py-4 pl-4 pr-16 resize-none focus:outline-none text-base text-white placeholder:text-slate-400 max-h-48"
                                />
                                <button type="submit" disabled={!input.trim()} className="absolute right-3 p-2.5 rounded-xl bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-30 transition-all">
                                    <SendHorizontal size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>

            <AccessibilityWidget />
        </div>
    );
}