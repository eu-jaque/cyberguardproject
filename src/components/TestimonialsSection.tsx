import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  { name: "Maria S., 62 anos", key: 0 },
  { name: "Carlos R., 45 anos", key: 1 },
  { name: "Ana L., 70 anos", key: 2 },
  { name: "Pedro M., 33 anos", key: 3 },
  { name: "Lucia F., 55 anos", key: 4 },
  { name: "Roberto A., 40 anos", key: 5 },
];

const texts: Record<number, Record<string, string>> = {
  0: {
    pt: "Recebi uma mensagem no WhatsApp de alguem se passando pelo meu filho pedindo dinheiro. Gracas ao que aprendi aqui, liguei para confirmar e era golpe. Quase perdi R$ 3.000.",
    en: "I received a WhatsApp message from someone pretending to be my son asking for money. Thanks to what I learned here, I called to confirm and it was a scam. I almost lost R$ 3,000.",
    es: "Recibi un mensaje de WhatsApp de alguien haciendose pasar por mi hijo pidiendo dinero. Gracias a lo que aprendi aqui, llame para confirmar y era estafa. Casi pierdo R$ 3.000.",
  },
  1: {
    pt: "Depois de fazer o quiz, percebi que eu clicava em qualquer link sem pensar. Mudei meus habitos e agora verifico tudo antes de abrir.",
    en: "After taking the quiz, I realized I was clicking on any link without thinking. I changed my habits and now I check everything before opening.",
    es: "Despues de hacer el quiz, me di cuenta de que hacia clic en cualquier enlace sin pensar. Cambie mis habitos y ahora verifico todo antes de abrir.",
  },
  2: {
    pt: "Minha neta me mostrou esse site. Aprendi o que e phishing e como verificar se um boleto e verdadeiro. Me sinto mais segura agora.",
    en: "My granddaughter showed me this site. I learned what phishing is and how to verify if an invoice is real. I feel safer now.",
    es: "Mi nieta me mostro este sitio. Aprendi que es el phishing y como verificar si un boleto es verdadero. Me siento mas segura ahora.",
  },
  3: {
    pt: "Trabalhava com vendas online e quase cai no golpe do falso comprovante de Pix. As dicas daqui me salvaram de um prejuizo grande.",
    en: "I was working with online sales and almost fell for the fake Pix receipt scam. The tips here saved me from a big loss.",
    es: "Trabajaba con ventas en linea y casi caigo en la estafa del comprobante falso de Pix. Los consejos de aqui me salvaron de una gran perdida.",
  },
  4: {
    pt: "Recebi um e-mail identico ao do meu banco pedindo para atualizar dados. Lembrei do curso de phishing e nao cliquei. Era golpe mesmo.",
    en: "I received an email identical to my bank asking to update data. I remembered the phishing course and did not click. It was indeed a scam.",
    es: "Recibi un correo identico al de mi banco pidiendo actualizar datos. Recorde el curso de phishing y no hice clic. Era estafa.",
  },
  5: {
    pt: "Compartilhei o site com meus pais idosos. Eles aprenderam a desconfiar de ligacoes de falsas centrais de atendimento. Informacao salva.",
    en: "I shared the site with my elderly parents. They learned to be suspicious of calls from fake call centers. Information saves.",
    es: "Comparti el sitio con mis padres mayores. Aprendieron a desconfiar de llamadas de falsos centros de atencion. La informacion salva.",
  },
};

const TestimonialsSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          {t("test.title")} <span className="text-primary">{t("test.title_highlight")}</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          {t("test.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div key={item.key} className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground/80 text-sm leading-relaxed mb-4 italic">
                "{texts[item.key][lang]}"
              </p>
              <p className="text-primary font-semibold text-sm">-- {item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
