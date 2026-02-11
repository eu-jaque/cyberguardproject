import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "O que devo fazer se cai em um golpe?",
    answer: "Primeiro, entre em contato com seu banco imediatamente para tentar bloquear a transacao. Depois, registre um boletim de ocorrencia na delegacia ou pela internet. Tambem e importante avisar seus contatos caso seus dados tenham sido roubados.",
  },
  {
    question: "Como saber se um site e seguro para comprar?",
    answer: "Verifique se o endereco comeca com 'https' e se ha um cadeado ao lado da URL. Pesquise a reputacao da loja em sites como Reclame Aqui. Desconfie de precos muito abaixo do normal e de sites que so aceitam Pix ou boleto.",
  },
  {
    question: "Meu WhatsApp foi clonado. O que faco?",
    answer: "Avise seus contatos imediatamente para que ninguem envie dinheiro ao golpista. Tente recuperar sua conta pelo proprio app seguindo as instrucoes de verificacao. Ative a verificacao em duas etapas para evitar que aconteca novamente.",
  },
  {
    question: "E seguro fazer Pix para desconhecidos?",
    answer: "Evite ao maximo. Antes de transferir, confirme a identidade da pessoa por outros meios, como uma ligacao. Nunca faca Pix por pressao ou urgencia. Lembre-se: depois de enviado, e muito dificil recuperar o dinheiro.",
  },
  {
    question: "Como criar uma senha realmente segura?",
    answer: "Use pelo menos 12 caracteres misturando letras maiusculas, minusculas, numeros e simbolos. Nao use datas de aniversario, nomes de familiares ou sequencias como 123456. O ideal e usar um gerenciador de senhas.",
  },
  {
    question: "Recebi uma ligacao do banco pedindo minha senha. E verdade?",
    answer: "Nao. Bancos nunca pedem senha, numero do cartao completo ou codigo de seguranca por telefone. Se receber esse tipo de ligacao, desligue e ligue voce mesmo para o numero oficial do banco que esta no verso do seu cartao.",
  },
  {
    question: "Como proteger pessoas idosas de golpes?",
    answer: "Converse com elas sobre os golpes mais comuns, de forma simples e sem pressa. Configure a verificacao em duas etapas no celular delas. Oriente a nunca dar informacoes por telefone e a sempre confirmar pedidos de dinheiro com um familiar.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Perguntas <span className="text-primary">frequentes</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Tire suas duvidas sobre seguranca digital e saiba como agir em cada situacao.
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border rounded-lg px-6">
                <AccordionTrigger className="text-foreground text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
