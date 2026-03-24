import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, ChevronDown, Check, X } from "lucide-react";
import { useState } from "react";
import parallaxBg from "@/assets/parallax-bg.jpg";

interface ServiceRow {
  name: string;
  description: string;
  basico: boolean | string;
  avancado: boolean | string;
  profissional: boolean | string;
  enterprise: boolean | string;
}

const services: ServiceRow[] = [
  { name: "Testes de vulnerabilidades", description: "Análise automatizada que identifica falhas de segurança em sistemas, redes e aplicações, gerando relatórios detalhados para correção preventiva.", basico: true, avancado: true, profissional: true, enterprise: true },
  { name: "Selo de proteção", description: "Certificado visual que demonstra que seu site passou por verificações de segurança, aumentando a confiança dos visitantes.", basico: true, avancado: true, profissional: true, enterprise: true },
  //{ name: "Dashboard Site Defender", description: "Painel de controle em tempo real para monitorar ameaças, tráfego suspeito e status de segurança do seu website.", basico: false, avancado: true, profissional: true, enterprise: true },
  { name: "Relatórios de vulnerabilidades", description: "Documentos técnicos detalhados com todas as vulnerabilidades encontradas, classificadas por severidade, com recomendações de correção.", basico: false, avancado: true, profissional: true, enterprise: true },
  { name: "Consultoria especializada", description: "Sessões com especialistas em cibersegurança para orientação personalizada sobre proteção digital e conformidade.", basico: false, avancado: false, profissional: true, enterprise: true },
  { name: "Certificado SSL", description: "Implementação e gerenciamento de certificados SSL/TLS para criptografar a comunicação entre seu site e os visitantes.", basico: false, avancado: true, profissional: true, enterprise: true },
  { name: "Monitoramento 24/7", description: "Vigilância ininterrupta do seu ambiente digital, com alertas em tempo real para qualquer atividade suspeita ou tentativa de invasão.", basico: false, avancado: false, profissional: true, enterprise: true },
  //{ name: "Extended Detection and Response (XDR)", description: "Plataforma unificada que correlaciona dados de múltiplas fontes de segurança para detecção e resposta automatizada a ameaças avançadas.", basico: false, avancado: false, profissional: true, enterprise: true },
  { name: "Inventário detalhado dos ativos", description: "Mapeamento completo de todos os ativos digitais da empresa — servidores, aplicações, dispositivos — para gestão de superfície de ataque.", basico: false, avancado: false, profissional: false, enterprise: true },
  { name: "Relatório de ataques e eventos de segurança", description: "Análise detalhada de todos os incidentes de segurança, tentativas de ataque e eventos relevantes, com timeline e impacto.", basico: false, avancado: false, profissional: true, enterprise: true },
  { name: "Relatórios de CVE's", description: "Monitoramento contínuo de vulnerabilidades públicas (CVE) que afetam suas tecnologias, com alertas e patches recomendados.", basico: false, avancado: false, profissional: false, enterprise: true },
  { name: "Pentest — Testes de Intrusão", description: "Simulação de ataques reais por ethical hackers para testar as defesas do seu sistema e identificar pontos fracos exploráveis.", basico: false, avancado: false, profissional: false, enterprise: true },
  //{ name: "Perícia forense digital", description: "Investigação técnica aprofundada após incidentes de segurança, com coleta de evidências digitais e análise de causa raiz.", basico: false, avancado: false, profissional: false, enterprise: true },
];

const plans = [
  { key: "basico", name: "Básico", price: "R$ 220", period: "/mês", featured: false },
  { key: "avancado", name: "Avançado", price: "R$ 268", period: "/mês", featured: false },
  { key: "profissional", name: "Profissional", price: "R$ 640", period: "/mês", featured: true },
  { key: "enterprise", name: "Enterprise", price: "Sob consulta", period: "", featured: false },
];

const SaibaMais = () => {
  const { t } = useLanguage();
  const [expandedService, setExpandedService] = useState<number | null>(null);

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
            <span className="text-primary text-sm font-semibold">Selo de Proteção</span>
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
          <button className="btn-gold-3d text-primary-foreground px-10 py-3 rounded-[5px] text-base font-bold">
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
                e neutralizando ameaças antes que elas possam causar danos ao seu website.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">Leve e Sem Complicações</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Diferente de outras plataformas que deixam seu computador lento, o CyberGuard foi projetado
                para consumir recursos mínimos. Você nem vai perceber que ele está funcionando.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">Navegação Segura Garantida</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sites falsos e links de phishing são a porta de entrada para golpistas. O CyberGuard
                verifica cada site que você visita em tempo real, alertando antes de inserir dados em páginas fraudulentas.
              </p>
            </div>
            <div className="glass-card">
              <h3 className="font-display text-sm font-bold text-gradient-gold mb-3">Suporte Especializado 24/7</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nossa equipe de especialistas em cibersegurança está disponível 24 horas por dia para
                auxiliar em qualquer incidente ou dúvida sobre a segurança do seu website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Comparison Table */}
      <section className="py-20 bg-card">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            CONHEÇA NOSSOS <span className="text-gradient-gold">PLANOS</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Escolha o plano ideal para a proteção do seu negócio
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              {/* Plan Headers */}
              <thead>
                <tr>
                  <th className="text-left p-4 w-[320px]">
                    <span className="font-display text-sm font-bold text-gradient-gold">
                      ENTENDA OS NOSSOS SERVIÇOS
                    </span>
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.key} className="p-4 text-center relative">
                      {plan.featured && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full">
                          DESTAQUE
                        </span>
                      )}
                      <div className={`rounded-xl p-4 ${plan.featured ? "bg-primary/10 border border-primary/30" : ""}`}>
                        <h3 className="font-display text-base font-bold text-foreground">{plan.name}</h3>
                        <p className="text-primary font-bold text-xl mt-1">
                          {plan.price}
                          <span className="text-muted-foreground text-xs font-normal">{plan.period}</span>
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Service Rows */}
              <tbody>
                {services.map((service, i) => (
                  <>
                    <tr
                      key={`row-${i}`}
                      className={`border-t border-border/50 hover:bg-secondary/20 transition-colors cursor-pointer ${
                        expandedService === i ? "bg-secondary/20" : ""
                      }`}
                      onClick={() => setExpandedService(expandedService === i ? null : i)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={`w-4 h-4 text-primary transition-transform ${
                              expandedService === i ? "rotate-180" : ""
                            }`}
                          />
                          <span className="text-sm text-foreground font-medium">{service.name}</span>
                        </div>
                      </td>
                      {(["basico", "avancado", "profissional", "enterprise"] as const).map((planKey) => (
                        <td key={planKey} className="p-4 text-center">
                          {typeof service[planKey] === "string" ? (
                            <span className="text-sm text-foreground">{service[planKey]}</span>
                          ) : service[planKey] ? (
                            <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                    {expandedService === i && (
                      <tr key={`desc-${i}`}>
                        <td colSpan={5} className="px-4 pb-4 pt-0">
                          <div className="ml-6 p-3 rounded-lg bg-secondary/30 border border-border/30">
                            <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>

              {/* CTA Row */}
              <tfoot>
                <tr className="border-t border-border">
                  <td className="p-6"></td>
                  {plans.map((plan) => (
                    <td key={plan.key} className="p-6 text-center">
                      <button
                        className={`px-6 py-3 rounded-lg text-sm font-bold transition-all ${
                          plan.featured
                            ? "btn-gold-3d text-primary-foreground"
                            : plan.key === "enterprise"
                            ? "border border-primary text-primary hover:bg-primary/10"
                            : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {plan.key === "enterprise" ? "CONTATE-NOS" : "ESCOLHER PLANO"}
                      </button>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-[2%] text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Não espere ser a próxima vítima
          </h2>
          <p className="text-muted-foreground mb-8">
            A cada 6 segundos, alguém cai em um golpe digital no Brasil. Proteja-se agora com o
            CyberGuard e navegue com tranquilidade.
          </p>
          <button className="btn-gold-3d text-primary-foreground px-10 py-3 rounded-[5px] text-base font-bold">
            Entrar em Contato
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
