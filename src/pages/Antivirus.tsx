import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Cpu, Wifi, Lock, Eye, Zap } from "lucide-react";
import parallaxBg from "@/assets/parallax-bg.jpg";

const features = [
  { icon: Shield, key: "av.feat1" },
  { icon: Cpu, key: "av.feat2" },
  { icon: Wifi, key: "av.feat3" },
  { icon: Lock, key: "av.feat4" },
  { icon: Eye, key: "av.feat5" },
  { icon: Zap, key: "av.feat6" },
];

const Antivirus = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center parallax-section"
        style={{ backgroundImage: `url(${parallaxBg})` }}
      >
        <div className="absolute inset-0 bg-background/80" />
        <div className="relative z-10 max-w-4xl mx-auto px-[2%] text-center py-32">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-primary text-sm font-semibold">{t("av.badge")}</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {t("av.title")} <span className="text-gradient-gold">{t("av.title_highlight")}</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">{t("av.desc")}</p>
          <button className="btn-login bg-primary text-primary-foreground px-8 py-3 rounded-[5px] text-base font-bold">
            {t("av.cta")}
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-[1366px] mx-auto px-[2%]">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            <span className="text-gradient-gold">{t("av.features_title")}</span>
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">{t("av.features_desc")}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="glass-card group hover:border-primary/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-gradient-gold mb-2">{t(`${feat.key}.title`)}</h3>
                  <p className="text-muted-foreground text-sm">{t(`${feat.key}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="max-w-3xl mx-auto px-[2%] text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            <span className="text-gradient-gold">{t("av.cta_title")}</span>
          </h2>
          <p className="text-muted-foreground mb-8">{t("av.cta_desc")}</p>
          <button className="btn-login bg-primary text-primary-foreground px-10 py-3 rounded-[5px] text-base font-bold">
            {t("av.cta")}
          </button>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default Antivirus;
