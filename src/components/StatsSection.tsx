import { ShieldAlert, TrendingUp, Users, CreditCard, AlertTriangle, Globe } from "lucide-react";

const stats = [
  {
    icon: ShieldAlert,
    value: "R$ 2,5 bilhões",
    label: "Perdas com fraudes bancárias digitais em 2024",
    source: "Febraban",
  },
  {
    icon: Users,
    value: "1 em cada 3",
    label: "brasileiros já foi vítima de algum golpe digital",
    source: "Serasa Experian",
  },
  {
    icon: TrendingUp,
    value: "+65%",
    label: "aumento nos golpes via Pix desde 2022",
    source: "Banco Central do Brasil",
  },
  {
    icon: CreditCard,
    value: "3,4 milhões",
    label: "tentativas de fraude com cartão de crédito por ano",
    source: "ClearSale",
  },
  {
    icon: AlertTriangle,
    value: "208 mil",
    label: "registros de phishing no Brasil em 2024",
    source: "CERT.br",
  },
  {
    icon: Globe,
    value: "US$ 10,3 trilhões",
    label: "custo global estimado do cibercrime até 2025",
    source: "Cybersecurity Ventures",
  },
];

const StatsSection = () => {
  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          O Impacto Real das <span className="text-primary">Fraudes e Golpes</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Os números não mentem: fraudes digitais afetam milhões de pessoas e causam prejuízos bilionários. 
          Conheça os dados alarmantes que revelam a dimensão deste problema.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <stat.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-foreground/90 mb-3">{stat.label}</p>
              <p className="text-xs text-muted-foreground">Fonte: {stat.source}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-card border border-border rounded-lg p-8">
          <h3 className="font-display text-xl font-bold text-foreground mb-4">
            Os golpes mais comuns no Brasil
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-foreground/80">
            <div>
              <p className="mb-2">• <strong className="text-primary">Golpe do Pix:</strong> Criminosos se passam por conhecidos ou empresas para solicitar transferências via Pix.</p>
              <p className="mb-2">• <strong className="text-primary">Phishing:</strong> E-mails e SMS falsos que imitam bancos e lojas para roubar senhas e dados bancários.</p>
              <p className="mb-2">• <strong className="text-primary">Clonagem de WhatsApp:</strong> Golpistas clonam contas e pedem dinheiro aos contatos da vítima.</p>
            </div>
            <div>
              <p className="mb-2">• <strong className="text-primary">Falso boleto:</strong> Boletos adulterados que desviam pagamentos para contas de criminosos.</p>
              <p className="mb-2">• <strong className="text-primary">Golpe do emprego falso:</strong> Vagas falsas que pedem pagamento antecipado ou roubam dados pessoais.</p>
              <p className="mb-2">• <strong className="text-primary">Falsa central de atendimento:</strong> Ligações se passando por bancos para obter dados sigilosos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
