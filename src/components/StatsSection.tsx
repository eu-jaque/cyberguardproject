import { ShieldAlert, TrendingUp, Users, CreditCard, AlertTriangle, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const icons = [ShieldAlert, Users, TrendingUp, CreditCard, AlertTriangle, Globe];
const sources = ["Febraban", "Serasa Experian", "Banco Central do Brasil", "ClearSale", "CERT.br", "Cybersecurity Ventures"];

const StatsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          {t("stats.title")} <span className="text-primary">{t("stats.title_highlight")}</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-4">
          {t("stats.subtitle")}
        </p>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-sm">
          {t("stats.subtitle2")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {icons.map((Icon, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <Icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
                {t(`stats.${i}.value`)}
              </p>
              <p className="text-foreground/90 mb-3">{t(`stats.${i}.label`)}</p>
              <p className="text-xs text-muted-foreground">{t("stats.source")}: {sources[i]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
