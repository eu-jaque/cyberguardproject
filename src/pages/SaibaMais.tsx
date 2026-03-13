import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield} from "lucide-react";
import parallaxBg from "@/assets/parallax-bg.jpg";

const SaibaMais = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center parallax-section"
        style={{ backgroundImage: `url(${parallaxBg})` }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative z-10 max-w-4xl mx-auto px-[2%] text-center py-32">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-semibold">Selo de Proteção </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Defenda seu website contra malwares com a nossa{" "}
            <span className="text-gradient-gold">blindagem de sites CyberGuard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
            Milhões de ameaças digitais surgem todos os dias. Hackers estão cada vez mais sofisticados, 
            e seus dados pessoais, senhas e informações financeiras estão constantemente em risco. 
            Não espere ser a próxima vítima.
          </p>
          <button className="btn-login bg-primary text-primary-foreground px-10 py-3 rounded-[5px] text-base font-bold">
            Entrar em Contato
          </button>
        </div>
      </section>

      {/* Why CyberGuard */}
      <section className="py-20 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            Por que escolher o <span className="text-gradient-gold">CyberGuard</span>?
          </h2>
          <p className="text-center text-muted-foreground max-w-3xl mx-auto mb-12">
            Em um mundo onde as ameaças digitais crescem exponencialmente, ter uma blindagem de site confiável 
            não é mais opcional — é essencial. O CyberGuard combina inteligência artificial avançada 
            com uma interface simples que qualquer pessoa pode usar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">Proteção Inteligente em Tempo Real</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nosso motor de detecção com IA analisa milhares de arquivos por segundo, identificando 
                e neutralizando ameaças antes que elas possam causar danos ao seu website. Proteja-se 
                contra as mais recentes variantes de ransomware.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">Leve e Sem Complicações</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Diferente de outras plataformas que deixam seu computador lento, o CyberGuard foi projetado 
                para consumir recursos mínimos. Você nem vai perceber que ele está funcionando — até ele 
                bloquear uma ameaça e salvar seus dados.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">Navegação Segura Garantida</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sites falsos e links de phishing são a porta de entrada para golpistas. O CyberGuard 
                verifica cada site que você visita em tempo real, alertando você antes de inserir dados 
                em páginas fraudulentas.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">(colocar 4°motivo aqui)</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                (colocar 4°motivo aqui)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="max-w-3xl mx-auto px-[2%] text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Não espere ser a próxima vítima
          </h2>
          <p className="text-muted-foreground mb-8">
            A cada 6 segundos, alguém cai em um golpe digital no Brasil. Proteja-se agora com o 
            CyberGuard e navegue com tranquilidade.
          </p>
          <button className="btn-login bg-primary text-primary-foreground px-10 py-3 rounded-[5px] text-base font-bold">
            Baixar Agora — É Grátis
          </button>
        </div>
      </section>

    
      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default SaibaMais;
