import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Share2, CreditCard, MailWarning, Search, ShieldAlert, Database } from "lucide-react";

const Services = () => {
  const { t } = useLanguage();

  const guideCards = [
    { icon: Share2, key: "svc.guide1" },
    { icon: CreditCard, key: "svc.guide2" },
    { icon: MailWarning, key: "svc.guide3" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%] text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("svc.title")} <span className="text-gradient-gold">{t("svc.title_highlight")}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("svc.subtitle")}</p>
        </div>
      </section>

      {/* Section 1 - Guia de Informacoes */}
      <section className="py-16 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">{t("svc.guide_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guideCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="glass-card group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-2">{t(`${card.key}.title`)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{t(`${card.key}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2 - Teste de Vulnerabilidade */}
      <section className="py-16 bg-card">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">{t("svc.vuln_title")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{t("svc.vuln_desc")}</p>
            <p className="text-foreground/70 text-sm leading-relaxed">{t("svc.vuln_detail")}</p>
          </div>
        </div>
      </section>

      {/* Section 3 - LGPD e Vazamento de Dados */}
      <section className="py-16 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">{t("svc.lgpd_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LGPD Card */}
            <div className="glass-card animate-float group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-3">{t("svc.lgpd_card_title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("svc.lgpd_card_desc")}</p>
            </div>

            {/* Vazamento Card */}
            <div className="glass-card animate-float group" style={{ animationDelay: "1s" }}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold text-foreground mb-3">{t("svc.vazamento_card_title")}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t("svc.vazamento_card_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default Services;
