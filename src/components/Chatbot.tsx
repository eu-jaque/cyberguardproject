import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import cyntiaAvatar from "@/assets/cyntia-avatar.png";

interface Message {
  id: string;
  from: "user" | "bot";
  text: string;
  timestamp: string;
  isContact?: boolean;
}

const knowledgeBase: { keywords: string[]; answer: Record<string, string> }[] = [
  {
    keywords: ["pix", "transferencia", "transferir", "agendamento"],
    answer: {
      pt: "Nunca faça Pix por pressão ou urgência. Sempre confirme a identidade de quem está pedindo por ligação ou pessoalmente. Bancos nunca pedem transferências por mensagem.",
      en: "Never send Pix under pressure or urgency. Always confirm the identity of whoever is asking by phone or in person. Banks never ask for transfers via messages.",
      es: "Nunca hagas Pix bajo presión o urgencia. Siempre confirma la identidad de quien pide por teléfono o en persona. Los bancos nunca piden transferencias por mensaje.",
    },
  },
  {
    keywords: ["whatsapp", "clonado", "clonar", "clonagem"],
    answer: {
      pt: "Se seu WhatsApp foi clonado, avise seus contatos imediatamente. Tente recuperar pelo app e ative a verificação em duas etapas.",
      en: "If your WhatsApp was cloned, warn your contacts immediately. Try to recover through the app and enable two-step verification.",
      es: "Si tu WhatsApp fue clonado, avisa a tus contactos inmediatamente. Intenta recuperarlo por la app y activa la verificación en dos pasos.",
    },
  },
  {
    keywords: ["phishing", "e-mail", "email", "link", "falso", "site"],
    answer: {
      pt: "Phishing é quando criminosos enviam mensagens falsas imitando empresas para roubar seus dados. Nunca clique em links de e-mails ou SMS suspeitos.",
      en: "Phishing is when criminals send fake messages imitating companies to steal your data. Never click on links from suspicious emails or SMS.",
      es: "Phishing es cuando los criminales envían mensajes falsos imitando empresas para robar tus datos. Nunca hagas clic en enlaces de correos o SMS sospechosos.",
    },
  },
  {
    keywords: ["senha", "senhas", "password"],
    answer: {
      pt: "Use senhas com pelo menos 12 caracteres, misturando letras, números e símbolos. Nunca repita a mesma senha em sites diferentes.",
      en: "Use passwords with at least 12 characters, mixing letters, numbers and symbols. Never repeat the same password on different sites.",
      es: "Usa contraseñas de al menos 12 caracteres, mezclando letras, números y símbolos. Nunca repitas la misma contraseña en sitios diferentes.",
    },
  },
  {
    keywords: ["boleto", "adulterado", "pdf", "pagamento"],
    answer: {
      pt: "Antes de pagar um boleto, confira o nome do beneficiário, o CNPJ e o valor. Se os dados não baterem, não pague.",
      en: "Before paying an invoice, check the beneficiary name, ID number and amount. If the data does not match, do not pay.",
      es: "Antes de pagar un boleto, verifica el nombre del beneficiario, el CNPJ y el monto. Si los datos no coinciden, no pagues.",
    },
  },
  {
    keywords: ["banco", "ligacao", "central", "atendimento", "telefone"],
    answer: {
      pt: "Bancos nunca pedem sua senha ou código por telefone. Se receber uma ligação suspeita, desligue e ligue para o número oficial.",
      en: "Banks never ask for your password or code by phone. If you receive a suspicious call, hang up and call the official number.",
      es: "Los bancos nunca piden tu contraseña o código por teléfono. Si recibes una llamada sospechosa, cuelga y llama al número oficial.",
    },
  },
  {
    keywords: ["golpe", "fraude", "cai", "caiu", "vitima", "vítima"],
    answer: {
      pt: "Se você caiu em um golpe: 1) Fale com seu banco. 2) Registre um boletim de ocorrência. 3) Avise seus contatos. 4) Mude suas senhas.",
      en: "If you fell for a scam: 1) Contact your bank. 2) File a police report. 3) Warn your contacts. 4) Change your passwords.",
      es: "Si caíste en una estafa: 1) Habla con tu banco. 2) Haz un informe policial. 3) Avisa a tus contactos. 4) Cambia tus contraseñas.",
    },
  },
  {
    keywords: ["idoso", "idosos", "velho", "avos", "avó", "avô"],
    answer: {
      pt: "Para proteger idosos: converse sobre golpes com calma, ative verificação em duas etapas e oriente a nunca dar dados por telefone.",
      en: "To protect the elderly: talk about scams calmly, enable two-step verification and advise them to never give data by phone.",
      es: "Para proteger a los mayores: habla sobre estafas con calma, activa la verificación en dos pasos y oriéntalos a nunca dar datos por teléfono.",
    },
  },
  {
    keywords: ["cartao", "cartão", "clonado", "cvv", "compra", "indevida"],
    answer: {
      pt: "Seu cartão foi clonado? Bloqueie-o imediatamente pelo aplicativo do banco. Para compras online, utilize sempre o Cartão Virtual.",
      en: "Was your card cloned? Block it immediately through the bank app. For online purchases, always use a Virtual Card.",
      es: "¿Tu tarjeta fue clonada? Bloquéala inmediatamente por la app del banco. Para compras online, usa siempre la Tarjeta Virtual.",
    },
  },
  {
    keywords: ["lgpd", "dados pessoais", "privacidade", "vazamento"],
    answer: {
      pt: "A LGPD garante seu direito sobre seus dados pessoais. Em caso de vazamento, você pode exigir informações, correção ou exclusão dos seus dados junto à empresa responsável.",
      en: "The LGPD guarantees your rights over your personal data. In case of a breach, you can demand information, correction, or deletion of your data from the responsible company.",
      es: "La LGPD garantiza tu derecho sobre tus datos personales. En caso de filtración, puedes exigir información, corrección o eliminación de tus datos a la empresa responsable.",
    },
  },
];

const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const Chatbot = () => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (open && !initialized) {
      setMessages([{
        id: "init",
        from: "bot",
        text: t("chat.welcome"),
        timestamp: getCurrentTime(),
      }]);
      setInitialized(true);
    }
  }, [open, initialized, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getAnswer = (input: string): { text: string; isContact: boolean } => {
    const lower = input.toLowerCase();
    for (const entry of knowledgeBase) {
      if (entry.keywords.some((kw) => lower.includes(kw))) {
        return { text: entry.answer[lang] || entry.answer.pt, isContact: false };
      }
    }
    return {
      text: t("chat.fallback"),
      isContact: true,
    };
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      from: "user",
      text: userMsg,
      timestamp: getCurrentTime(),
    }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = getAnswer(userMsg);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        from: "bot",
        text: answer.text,
        timestamp: getCurrentTime(),
        isContact: answer.isContact,
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Toggle button - fixed bottom right, below accessibility */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="btn-gold-3d text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          aria-label={t("chat.open")}
        >
          {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col max-h-[500px] overflow-hidden"
          style={{ background: "rgba(10, 20, 40, 0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(212, 165, 53, 0.2)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 relative" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
            <div className="w-9 h-9 rounded-full border-2 border-primary/30 overflow-hidden shrink-0">
              <img src={cyntiaAvatar} alt="Cyntia" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-foreground text-xs font-bold uppercase tracking-wide">{t("chat.title")}</h1>
              <h2 className="text-muted-foreground text-[10px] tracking-widest">{t("chat.subtitle")}</h2>
            </div>
          </div>

          {/* Messages */}
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
                    {msg.text}
                  </div>
                  {msg.isContact && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {t("chat.contact_info")}
                    </div>
                  )}
                  <span className="text-[9px] text-muted-foreground/50 mt-1 block">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
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

          {/* Input */}
          <div className="p-3 flex gap-2" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("chat.placeholder")}
              className="flex-1 bg-transparent border-none text-sm text-foreground/80 placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <button onClick={send} className="btn-gold-3d text-primary-foreground p-2 rounded-lg">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
