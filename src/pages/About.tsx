import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShieldCheck, Eye, Target, Users } from "lucide-react"; // Importe ícones para dar vida aos valores

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: <Target className="w-6 h-6 text-primary" />, title: "Missão", desc: "Democratizar o acesso à segurança digital para todos." },
    { icon: <Eye className="w-6 h-6 text-primary" />, title: "Visão", desc: "Ser a maior referência em conscientização contra fraudes no Brasil." },
    { icon: <ShieldCheck className="w-6 h-6 text-primary" />, title: "Segurança", desc: "Proteção baseada em conhecimento e tecnologia de ponta." },
    { icon: <Users className="w-6 h-6 text-primary" />, title: "Comunidade", desc: "Fortalecer o elo mais importante: as pessoas." },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Hero Section da Página Sobre */}
        <section className="max-w-[1200px] mx-auto px-6 mb-20 text-center md:text-left">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Protegendo o seu <br />
                <span className="text-gradient-gold">Futuro Digital</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                {t("about.desc")}
              </p>
            </div>
            
            {/* Elemento Decorativo: Um card que simula interface ou proteção */}
            <div className="relative hidden md:block">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30"></div>
              <div className="relative bg-card border border-border p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <p className="font-mono text-sm text-primary/80 leading-relaxed">
                  {`> status: active`} <br />
                  {`> protection_layer: enabled`} <br />
                  {`> mission: educating_users`} <br />
                  <span className="animate-pulse">_</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Valores/Cards */}
        <section className="bg-secondary/30 py-20">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((item, idx) => (
                <div key={idx} className="p-8 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group">
                  <div className="mb-4 p-3 bg-background rounded-lg inline-block group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default About;