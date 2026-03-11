import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  { name: "Maria S., 62 anos", key: 0 },
  { name: "Carlos R., 45 anos", key: 1 },
  { name: "Ana L., 70 anos", key: 2 },
  { name: "Pedro M., 33 anos", key: 3 },
  { name: "Lúcia F., 55 anos", key: 4 },
  { name: "Roberto A., 40 anos", key: 5 },
];

const texts: Record<number, Record<string, string>> = {
  0: {
    pt: "Recebi uma mensagem falsa do meu 'filho' pedindo Pix. Graças ao CyberGuard, liguei para confirmar: era golpe.",
    en: "I got a fake message from my 'son' asking for Pix. Thanks to CyberGuard, I called to confirm: it was a scam.",
    es: "Recibí un mensaje falso de mi 'hijo' pidiendo Pix. Gracias a CyberGuard, llamé para confirmar: era estafa.",
  },
  1: {
    pt: "Depois do quiz, parei de clicar em links sem pensar. Mudei meus hábitos digitais completamente.",
    en: "After the quiz, I stopped clicking links without thinking. I changed my digital habits completely.",
    es: "Después del quiz, dejé de hacer clic en enlaces sin pensar. Cambié mis hábitos digitales.",
  },
  2: {
    pt: "Aprendi o que é phishing e como verificar boletos. Me sinto muito mais segura navegando na internet.",
    en: "I learned what phishing is and how to verify invoices. I feel much safer browsing the internet.",
    es: "Aprendí qué es phishing y cómo verificar boletos. Me siento mucho más segura.",
  },
  3: {
    pt: "Quase caí no golpe do falso comprovante de Pix. As dicas do CyberGuard me salvaram de um prejuízo enorme.",
    en: "I almost fell for the fake Pix receipt scam. CyberGuard's tips saved me from a huge loss.",
    es: "Casi caigo en la estafa del comprobante falso de Pix. Los consejos de CyberGuard me salvaron.",
  },
  4: {
    pt: "Recebi um e-mail falso do banco pedindo dados. Lembrei do curso e não cliquei. Era golpe!",
    en: "I got a fake bank email asking for data. I remembered the course and didn't click. It was a scam!",
    es: "Recibí un correo falso del banco pidiendo datos. Recordé el curso y no hice clic. ¡Era estafa!",
  },
  5: {
    pt: "Compartilhei o site com meus pais. Agora desconfiam de ligações de falsas centrais. Informação salva.",
    en: "I shared the site with my parents. Now they distrust fake call center calls. Information saves.",
    es: "Compartí el sitio con mis padres. Ahora desconfían de llamadas falsas. La información salva.",
  },
};

const TestimonialsSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          {t("test.title")} <span className="text-gradient-gold">{t("test.title_highlight")}</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12" style={{ fontSize: "20px" }}>
          {t("test.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div key={item.key} className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground/80 leading-relaxed mb-4 italic" style={{ fontSize: "16px" }}>
                "{texts[item.key][lang]}"
              </p>
              <p className="text-primary font-semibold text-sm">— {item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
