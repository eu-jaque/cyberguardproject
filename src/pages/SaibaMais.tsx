import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Download, MonitorSmartphone, UserPlus, ShieldCheck } from "lucide-react";
import parallaxBg from "@/assets/parallax-bg.jpg";

const SaibaMais = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Download,
      title: "Passo 1: Baixe nosso antivírus agora",
      desc: "Clique no botão \"Baixar Agora\" disponível nesta página. O download será iniciado automaticamente. O arquivo é leve (menos de 50 MB) e compatível com Windows, macOS e Linux. Certifique-se de estar conectado à internet e de que seu navegador permite o download de arquivos. O arquivo será salvo na pasta de downloads padrão do seu dispositivo. Não se preocupe — o download é totalmente seguro e gratuito, sem custos ocultos.",
    },
    {
      icon: MonitorSmartphone,
      title: "Passo 2: Instale facilmente no seu dispositivo",
      desc: "Após o download, localize o arquivo na pasta de downloads do seu computador. Dê um duplo clique para iniciar a instalação. Siga as instruções na tela — o processo é simples e intuitivo, levando menos de 2 minutos. O instalador irá configurar automaticamente as proteções essenciais, incluindo a varredura em tempo real, o firewall inteligente e a proteção contra phishing. Ao final, o CyberGuard estará pronto para proteger seu dispositivo.",
    },
    {
      icon: UserPlus,
      title: "Passo 3: Entrar na minha conta ou me cadastrar",
      desc: "Ao abrir o CyberGuard pela primeira vez, você verá a tela de login. Se já possui uma conta, basta inserir seu e-mail e senha para acessar. Caso seja novo, clique em \"Criar conta\" e preencha seus dados básicos — nome, e-mail e uma senha segura. O cadastro é rápido e gratuito. Com sua conta, você terá acesso ao painel de controle completo, relatórios de segurança personalizados e atualizações automáticas de proteção.",
    },
    {
      icon: ShieldCheck,
      title: "Passo 4: Agora você tem a nossa proteção",
      desc: "Parabéns! Com o CyberGuard instalado e configurado, seu dispositivo está protegido contra as principais ameaças digitais. O antivírus trabalha silenciosamente em segundo plano, monitorando arquivos, conexões de rede e atividades suspeitas em tempo real. Você receberá alertas instantâneos caso alguma ameaça seja detectada. Sinta-se confiante ao navegar na internet, fazer compras online, acessar seu banco e usar suas redes sociais — o CyberGuard está cuidando da sua segurança digital 24 horas por dia.",
    },
  ];

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
            <span className="text-primary text-sm font-semibold">Proteção Gratuita</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Defenda seus dispositivos contra ciberameaças com nosso{" "}
            <span className="text-gradient-gold">antivírus CyberGuard</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
            Milhões de ameaças digitais surgem todos os dias. Hackers estão cada vez mais sofisticados, 
            e seus dados pessoais, senhas e informações financeiras estão constantemente em risco. 
            Não espere ser a próxima vítima.
          </p>
          <p className="text-foreground/70 text-base max-w-2xl mx-auto mb-8">
            O CyberGuard Antivírus foi desenvolvido com tecnologia de ponta para oferecer proteção 
            completa e em tempo real contra malware, ransomware, spyware, phishing e ameaças zero-day. 
            Tudo isso de forma leve, rápida e totalmente gratuita.
          </p>
          <button className="btn-login bg-primary text-primary-foreground px-10 py-3 rounded-[5px] text-base font-bold">
            Baixar Agora
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
            Em um mundo onde as ameaças digitais crescem exponencialmente, ter um antivírus confiável 
            não é mais opcional — é essencial. O CyberGuard combina inteligência artificial avançada 
            com uma interface simples que qualquer pessoa pode usar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">Proteção Inteligente em Tempo Real</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nosso motor de detecção com IA analisa milhares de arquivos por segundo, identificando 
                e neutralizando ameaças antes que elas possam causar danos ao seu sistema. Proteja-se 
                contra vírus, trojans, worms e as mais recentes variantes de ransomware.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">Leve e Sem Complicações</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Diferente de outros antivírus que deixam seu computador lento, o CyberGuard foi projetado 
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
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">100% Gratuito, Sem Truques</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Acreditamos que a segurança digital é um direito de todos. Por isso, o CyberGuard oferece 
                proteção completa sem cobrar nada. Sem versões limitadas, sem período de teste, sem surpresas 
                na fatura.
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

      {/* Step by Step */}
      <section className="py-20 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            Como instalar o <span className="text-gradient-gold">CyberGuard</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Em apenas 4 passos simples, você terá proteção completa no seu dispositivo.
          </p>

          <div className="max-w-3xl mx-auto space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="glass-card flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0" style={{
                    boxShadow: '0 0 20px rgba(212, 165, 53, 0.15)'
                  }}>
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-gradient-gold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button className="btn-login bg-primary text-primary-foreground px-10 py-3 rounded-[5px] text-base font-bold">
              Baixar Agora
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default SaibaMais;
