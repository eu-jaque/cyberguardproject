import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import cyntiaAvatar from "@/assets/cyntia-avatar.png";
import { streamChat, type AiMessage } from "@/lib/ai-chat";

const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
}

const Chatbot = () => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const aiHistoryRef = useRef<AiMessage[]>([]);

  useEffect(() => {
    if (open && !initialized) {
      setMessages([{
        id: "init",
        from: "bot",
        text: t("chat.welcome"),
        timestamp: getCurrentTime(),
      }]);
      aiHistoryRef.current = [];
      setInitialized(true);
    }
  }, [open, initialized, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      from: "user",
      text: userText,
      timestamp: getCurrentTime(),
    }]);
    setInput("");
    setIsTyping(true);

    aiHistoryRef.current.push({ role: "user", content: userText });

    const botId = (Date.now() + 1).toString();
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
          return [...prev, { id: botId, from: "bot", text: botText, timestamp: getCurrentTime() }];
        });
      },
      onDone: () => {
        setIsTyping(false);
        aiHistoryRef.current.push({ role: "assistant", content: botText });
      },
      onError: () => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: botId,
          from: "bot",
          text: lang === "en" ? "Sorry, an error occurred. Try again." : lang === "es" ? "Lo siento, ocurrió un error. Inténtalo de nuevo." : "Desculpe, ocorreu um erro. Tente novamente.",
          timestamp: getCurrentTime(),
        }]);
      }
    });
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="btn-gold-3d text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          aria-label={t("chat.open")}
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col max-h-[500px] overflow-hidden"
          style={{ background: "rgba(10, 20, 40, 0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(212, 165, 53, 0.2)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3 relative" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
            <div className="w-9 h-9 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
              <img src={cyntiaAvatar} alt="Cyntia" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-foreground text-xs font-bold uppercase tracking-wide">{t("chat.title")}</h1>
              <h2 className="text-muted-foreground text-[10px] tracking-widest flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                IA Ativa
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-bounce-in`}>
                {msg.from === "bot" && (
                  <div className="w-7 h-7 rounded-full overflow-hidden mr-2 shrink-0 self-end">
                    <img src={cyntiaAvatar} alt="Cyntia" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div
                    className={`px-3 py-2 text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-[#D4A535] to-[#B8860B] text-primary-foreground rounded-xl rounded-br-none"
                        : "bg-black/30 text-foreground/80 rounded-xl rounded-bl-none"
                    }`}
                  >
                    {msg.from === "bot" ? (
                      <div className="prose prose-xs prose-invert max-w-none prose-p:my-0.5 prose-li:my-0 prose-headings:text-amber-400 prose-headings:text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span className="text-[9px] text-muted-foreground/50 mt-1 block">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && !messages.some(m => m.id === (Date.now() + 1).toString()) && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                  <img src={cyntiaAvatar} alt="Cyntia" className="w-full h-full object-cover" />
                </div>
                <div className="bg-black/30 rounded-xl px-4 py-3 flex gap-1.5">
                  <span className="typing-dot" style={{ animationDelay: "0s" }} />
                  <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 flex gap-2" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("chat.placeholder")}
              className="flex-1 bg-transparent border-none text-sm text-foreground/80 placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <button onClick={send} disabled={isTyping || !input.trim()} className="btn-gold-3d text-primary-foreground p-2 rounded-lg disabled:opacity-50">
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
