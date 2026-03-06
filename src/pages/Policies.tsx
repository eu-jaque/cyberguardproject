import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";

const Policies = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 bg-background">
        <div className="max-w-3xl mx-auto px-[2%]">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            <span className="text-gradient-gold">{t("pol.title")}</span>
          </h1>

          <div className="space-y-10">
            <div>
              <h2 className="font-display text-lg font-bold text-gradient-gold mb-3">{t("pol.terms_title")}</h2>
              <p className="text-foreground/80 text-sm leading-relaxed">{t("pol.terms_text")}</p>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-gradient-gold mb-3">{t("pol.privacy_title")}</h2>
              <p className="text-foreground/80 text-sm leading-relaxed">{t("pol.privacy_text")}</p>
            </div>

            <div>
              <h2 className="font-display text-lg font-bold text-gradient-gold mb-3">{t("pol.lgpd_title")}</h2>
              <p className="text-foreground/80 text-sm leading-relaxed">{t("pol.lgpd_text")}</p>
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

export default Policies;
