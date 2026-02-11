import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  from: "user" | "bot";
  text: string;
}

const knowledgeBase: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["pix", "transferencia", "transferir"],
    answer: "Nunca faca Pix por pressao ou urgencia. Sempre confirme a identidade de quem esta pedindo por ligacao ou pessoalmente. Bancos nunca pedem transferencias por mensagem.",
  },
  {
    keywords: ["whatsapp", "clonado", "clonar", "clonagem"],
    answer: "Se seu WhatsApp foi clonado, avise seus contatos imediatamente. Tente recuperar pelo app e ative a verificacao em duas etapas em Configuracoes > Conta > Confirmacao em duas etapas.",
  },
  {
    keywords: ["phishing", "e-mail", "email", "link", "falso"],
    answer: "Phishing e quando criminosos enviam mensagens falsas imitando empresas para roubar seus dados. Nunca clique em links de e-mails ou SMS suspeitos. Acesse sempre o site oficial digitando o endereco no navegador.",
  },
  {
    keywords: ["senha", "senhas", "password"],
    answer: "Use senhas com pelo menos 12 caracteres, misturando letras, numeros e simbolos. Nunca repita a mesma senha em sites diferentes. Use um gerenciador de senhas como o Bitwarden (gratuito).",
  },
  {
    keywords: ["boleto", "falso", "adulterado"],
    answer: "Antes de pagar um boleto, confira o nome do beneficiario, o CNPJ e o valor. Se os dados nao baterem com a empresa, nao pague. Prefira gerar boletos diretamente no site oficial.",
  },
  {
    keywords: ["banco", "ligacao", "central", "atendimento", "telefone"],
    answer: "Bancos nunca pedem sua senha ou codigo de seguranca por telefone. Se receber uma ligacao suspeita, desligue e ligue voce mesmo para o numero oficial no verso do seu cartao.",
  },
  {
    keywords: ["golpe", "fraude", "cai", "caiu", "vitima"],
    answer: "Se voce caiu em um golpe: 1) Fale com seu banco imediatamente. 2) Registre um boletim de ocorrencia. 3) Avise seus contatos. 4) Mude suas senhas. Quanto mais rapido agir, maiores as chances de recuperar o dinheiro.",
  },
  {
    keywords: ["idoso", "idosos", "velho", "avos", "avo"],
    answer: "Para proteger pessoas idosas: converse sobre golpes comuns com calma, ative verificacao em duas etapas no celular delas, e oriente a nunca dar dados por telefone. Se possivel, acompanhe as transacoes bancarias.",
  },
  {
    keywords: ["compra", "compras", "online", "site", "loja"],
    answer: "Antes de comprar online, verifique se o site tem 'https' e cadeado na URL. Pesquise a loja no Reclame Aqui. Desconfie de precos muito baixos e de lojas que so aceitam Pix ou boleto.",
  },
  {
    keywords: ["emprego", "vaga", "trabalho"],
    answer: "Empresas serias nunca cobram para contratar. Desconfie de vagas que pedem pagamento antecipado ou dados pessoais logo no primeiro contato. Verifique se a empresa existe e tem CNPJ.",
  },
];

function getAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return "Nao encontrei uma resposta especifica para sua pergunta. Tente perguntar sobre: Pix, phishing, WhatsApp, senhas, boletos, compras online, golpes em geral ou como proteger idosos.";
}

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Ola! Sou o assistente do CyberGuard. Pergunte sobre qualquer tipo de golpe ou fraude digital e vou te ajudar a se proteger." },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Abrir chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-2xl flex flex-col max-h-[500px]">
          <div className="bg-primary text-primary-foreground px-4 py-3 rounded-t-lg">
            <p className="font-display text-sm font-bold">CyberGuard - Assistente</p>
            <p className="text-xs opacity-80">Tire suas duvidas sobre golpes e fraudes</p>
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
              placeholder="Digite sua duvida..."
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
