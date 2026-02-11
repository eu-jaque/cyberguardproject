const testimonials = [
  {
    name: "Maria S., 62 anos",
    text: "Recebi uma mensagem no WhatsApp de alguem se passando pelo meu filho pedindo dinheiro. Gracas ao que aprendi aqui, liguei para confirmar e era golpe. Quase perdi R$ 3.000.",
  },
  {
    name: "Carlos R., 45 anos",
    text: "Depois de fazer o quiz, percebi que eu clicava em qualquer link sem pensar. Mudei meus habitos e agora verifico tudo antes de abrir.",
  },
  {
    name: "Ana L., 70 anos",
    text: "Minha neta me mostrou esse site. Aprendi o que e phishing e como verificar se um boleto e verdadeiro. Me sinto mais segura agora.",
  },
  {
    name: "Pedro M., 33 anos",
    text: "Trabalhava com vendas online e quase cai no golpe do falso comprovante de Pix. As dicas daqui me salvaram de um prejuizo grande.",
  },
  {
    name: "Lucia F., 55 anos",
    text: "Recebi um e-mail identico ao do meu banco pedindo para atualizar dados. Lembrei do curso de phishing e nao cliquei. Era golpe mesmo.",
  },
  {
    name: "Roberto A., 40 anos",
    text: "Compartilhei o site com meus pais idosos. Eles aprenderam a desconfiar de ligacoes de falsas centrais de atendimento. Informacao salva.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Quem aprendeu, <span className="text-primary">nao caiu</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Veja depoimentos de pessoas que reconheceram golpes a tempo gracas a informacao.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground/80 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
              <p className="text-primary font-semibold text-sm">-- {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
