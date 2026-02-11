import { useState } from "react";

const fraudTypes = [
  {
    title: "Golpe do Pix",
    back: "Criminosos se passam por conhecidos ou empresas e pedem transferencias urgentes via Pix. Sempre confirme por ligacao antes de enviar qualquer valor.",
  },
  {
    title: "Phishing",
    back: "Mensagens falsas por e-mail, SMS ou redes sociais imitam bancos e lojas. O objetivo e roubar suas senhas e dados bancarios. Nunca clique em links suspeitos.",
  },
  {
    title: "Clonagem de WhatsApp",
    back: "Golpistas clonam seu numero e pedem dinheiro aos seus contatos. Ative a verificacao em duas etapas no WhatsApp para se proteger.",
  },
  {
    title: "Falso Boleto",
    back: "Boletos adulterados desviam seu pagamento para contas de criminosos. Sempre confira os dados do beneficiario antes de pagar.",
  },
  {
    title: "Falsa Central de Atendimento",
    back: "Ligacoes que fingem ser do seu banco pedem senhas e codigos. Bancos nunca pedem senha por telefone. Desligue e ligue voce mesmo para o numero oficial.",
  },
  {
    title: "Golpe do Emprego Falso",
    back: "Vagas falsas pedem pagamento antecipado ou seus documentos pessoais. Empresas serias nunca cobram para contratar. Desconfie de ofertas boas demais.",
  },
];

const FlipCard = ({ title, back }: { title: string; back: string }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-56 cursor-pointer perspective-1000"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-lg flex flex-col items-center justify-center p-6">
          <h3 className="font-display text-lg font-bold text-primary text-center">{title}</h3>
          <p className="text-muted-foreground text-sm mt-2 text-center">Passe o mouse para saber mais</p>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-secondary border border-primary/30 rounded-lg flex flex-col items-center justify-center p-6">
          <h3 className="font-display text-sm font-bold text-primary mb-3 text-center">{title}</h3>
          <p className="text-foreground/80 text-sm text-center leading-relaxed">{back}</p>
        </div>
      </div>
    </div>
  );
};

const FlipCardsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Voce sabe <span className="text-primary">reconhecer um golpe?</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Conheca os tipos de fraude mais comuns e aprenda a identificar cada um deles antes que seja tarde.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fraudTypes.map((item, i) => (
            <FlipCard key={i} title={item.title} back={item.back} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlipCardsSection;
