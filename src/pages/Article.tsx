import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const articles: Record<string, { title: string; content: string[] }> = {
  "fraudes-digitais": {
    title: "Fraudes Digitais: O Inimigo Invisível",
    content: [
      "As fraudes digitais se tornaram uma das maiores ameaças do século XXI. Com o avanço da tecnologia e a digitalização dos serviços bancários, criminosos encontraram novas formas de aplicar golpes em pessoas desprevenidas.",
      "No Brasil, as perdas com fraudes bancárias digitais ultrapassaram R$ 2,5 bilhões em 2024, segundo dados da Febraban. Esse número alarmante reflete a sofisticação crescente dos golpes e a falta de conscientização da população.",
      "Os criminosos utilizam técnicas de engenharia social, phishing, malware e outras estratégias para enganar suas vítimas. Muitas vezes, os golpes são tão bem elaborados que mesmo pessoas com conhecimento em tecnologia podem ser enganadas.",
      "Para se proteger, é fundamental manter-se informado sobre os tipos de golpes mais comuns, utilizar autenticação de dois fatores em todas as suas contas, nunca compartilhar senhas ou códigos de verificação e sempre desconfiar de ofertas boas demais.",
    ],
  },
  "phishing": {
    title: "Phishing: O Golpe do Clique",
    content: [
      "Phishing é uma técnica de fraude online onde criminosos criam comunicações falsas — e-mails, SMS, sites — que imitam empresas legítimas para roubar dados pessoais e bancários.",
      "O Brasil registrou mais de 208 mil tentativas de phishing em 2024, segundo o CERT.br. Os golpistas criam páginas idênticas às de bancos, lojas e redes sociais para enganar as vítimas.",
      "Os sinais de phishing incluem: erros ortográficos, urgência excessiva, links suspeitos, remetentes desconhecidos e pedidos de dados sensíveis. Sempre verifique a URL antes de inserir qualquer informação.",
      "Proteja-se: nunca clique em links de e-mails ou SMS suspeitos, acesse sites digitando o endereço diretamente no navegador, e mantenha seu antivírus atualizado.",
    ],
  },
  "roubo-identidade": {
    title: "Roubo de Identidade Digital",
    content: [
      "O roubo de identidade digital é quando criminosos obtêm e usam seus dados pessoais — CPF, RG, dados bancários — para cometer fraudes em seu nome.",
      "Com seus dados, golpistas podem abrir contas bancárias, solicitar empréstimos, fazer compras online e até cometer crimes usando sua identidade. As consequências podem levar anos para serem resolvidas.",
      "A Serasa Experian estima que 1 em cada 3 brasileiros já foi vítima de algum tipo de golpe digital, incluindo roubo de identidade. O prejuízo médio por vítima ultrapassa R$ 3 mil.",
      "Para proteger sua identidade: monitore seu CPF regularmente, não compartilhe documentos em redes sociais, use senhas fortes e únicas, e ative alertas de movimentações bancárias.",
    ],
  },
};

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles[slug || ""];

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Artigo não encontrado</h1>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">Voltar ao início</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="h-[80px] flex items-center bg-background/95 border-b border-border">
        <div className="max-w-[1366px] mx-auto px-[2%] w-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              Cyber<span className="text-primary">Guarda</span>
            </span>
          </div>
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-[2%] py-16">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">{article.title}</h1>
        {article.content.map((p, i) => (
          <p key={i} className="text-foreground/80 text-lg leading-relaxed mb-6">{p}</p>
        ))}
        <button onClick={() => navigate("/")} className="mt-8 bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
          Voltar ao Início
        </button>
      </article>
    </div>
  );
};

export default Article;
