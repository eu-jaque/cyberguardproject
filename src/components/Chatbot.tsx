import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  from: "user" | "bot";
  text: string;
}

const knowledgeBase: { keywords: string[]; answer: Record<string, string> }[] = [
  {
    keywords: ["pix", "transferencia", "transferir"],
    answer: {
      pt: "Nunca faca Pix por pressao ou urgencia. Sempre confirme a identidade de quem esta pedindo por ligacao ou pessoalmente. Bancos nunca pedem transferencias por mensagem.",
      en: "Never send Pix under pressure or urgency. Always confirm the identity of whoever is asking by phone or in person. Banks never ask for transfers via messages.",
      es: "Nunca hagas Pix bajo presion o urgencia. Siempre confirma la identidad de quien pide por telefono o en persona. Los bancos nunca piden transferencias por mensaje.",
    },
  },
  {
    keywords: ["whatsapp", "clonado", "clonar", "clonagem"],
    answer: {
      pt: "Se seu WhatsApp foi clonado, avise seus contatos imediatamente. Tente recuperar pelo app e ative a verificacao em duas etapas.",
      en: "If your WhatsApp was cloned, warn your contacts immediately. Try to recover through the app and enable two-step verification.",
      es: "Si tu WhatsApp fue clonado, avisa a tus contactos inmediatamente. Intenta recuperarlo por la app y activa la verificacion en dos pasos.",
    },
  },
  {
    keywords: ["phishing", "e-mail", "email", "link", "falso"],
    answer: {
      pt: "Phishing e quando criminosos enviam mensagens falsas imitando empresas para roubar seus dados. Nunca clique em links de e-mails ou SMS suspeitos.",
      en: "Phishing is when criminals send fake messages imitating companies to steal your data. Never click on links from suspicious emails or SMS.",
      es: "Phishing es cuando los criminales envian mensajes falsos imitando empresas para robar tus datos. Nunca hagas clic en enlaces de correos o SMS sospechosos.",
    },
  },
  {
    keywords: ["senha", "senhas", "password"],
    answer: {
      pt: "Use senhas com pelo menos 12 caracteres, misturando letras, numeros e simbolos. Nunca repita a mesma senha em sites diferentes.",
      en: "Use passwords with at least 12 characters, mixing letters, numbers and symbols. Never repeat the same password on different sites.",
      es: "Usa contrasenas de al menos 12 caracteres, mezclando letras, numeros y simbolos. Nunca repitas la misma contrasena en sitios diferentes.",
    },
  },
  {
    keywords: ["boleto", "adulterado"],
    answer: {
      pt: "Antes de pagar um boleto, confira o nome do beneficiario, o CNPJ e o valor. Se os dados nao baterem, nao pague.",
      en: "Before paying an invoice, check the beneficiary name, ID number and amount. If the data does not match, do not pay.",
      es: "Antes de pagar un boleto, verifica el nombre del beneficiario, el CNPJ y el monto. Si los datos no coinciden, no pagues.",
    },
  },
  {
    keywords: ["banco", "ligacao", "central", "atendimento", "telefone"],
    answer: {
      pt: "Bancos nunca pedem sua senha ou codigo por telefone. Se receber uma ligacao suspeita, desligue e ligue para o numero oficial.",
      en: "Banks never ask for your password or code by phone. If you receive a suspicious call, hang up and call the official number.",
      es: "Los bancos nunca piden tu contrasena o codigo por telefono. Si recibes una llamada sospechosa, cuelga y llama al numero oficial.",
    },
  },
  {
    keywords: ["golpe", "fraude", "cai", "caiu", "vitima"],
    answer: {
      pt: "Se voce caiu em um golpe: 1) Fale com seu banco. 2) Registre um boletim de ocorrencia. 3) Avise seus contatos. 4) Mude suas senhas.",
      en: "If you fell for a scam: 1) Contact your bank. 2) File a police report. 3) Warn your contacts. 4) Change your passwords.",
      es: "Si caiste en una estafa: 1) Habla con tu banco. 2) Haz un informe policial. 3) Avisa a tus contactos. 4) Cambia tus contrasenas.",
    },
  },
  {
    keywords: ["idoso", "idosos", "velho", "avos", "avo"],
    answer: {
      pt: "Para proteger idosos: converse sobre golpes com calma, ative verificacao em duas etapas e oriente a nunca dar dados por telefone.",
      en: "To protect the elderly: talk about scams calmly, enable two-step verification and advise them to never give data by phone.",
      es: "Para proteger a los mayores: habla sobre estafas con calma, activa la verificacion en dos pasos y orientalos a nunca dar datos por telefono.",
    },
  },
];

const Chatbot = () => {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (open && !initialized) {
      setMessages([{ from: "bot", text: t("chat.welcome") }]);
      setInitialized(true);
    }
  }, [open, initialized, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getAnswer = (input: string): string => {
    const lower = input.toLowerCase();
    for (const entry of knowledgeBase) {
      if (entry.keywords.some((kw) => lower.includes(kw))) {
        return entry.answer[lang] || entry.answer.pt;
      }
    }
    return t("chat.fallback");
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: getAnswer(userMsg) }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        aria-label={t("chat.open")}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-2xl flex flex-col max-h-[500px]">
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-lg">
            <p className="font-display text-sm font-bold">{t("chat.title")}</p>
            <p className="text-xs opacity-80">{t("chat.subtitle")}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("chat.placeholder")}
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button onClick={send} className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
