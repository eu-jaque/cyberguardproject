import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Smartphone, Mail, MessageCircle, FileText, Phone, Briefcase } from "lucide-react";

const cardStyle = {
  gradient: "from-[#F5D77A] to-[#D4A535]",
  border: "border-[#F5D77A]/30",
  bg: "bg-[#F5D77A]/10",
  text: "text-[#F5D77A]",
};

const cardIcons = [Smartphone, Mail, MessageCircle, FileText, Phone, Briefcase];

const FlipCard = ({ index }: { index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const { t } = useLanguage();
  const Icon = cardIcons[index];

  return (
    <div
      className="relative h-56 cursor-pointer perspective-1000"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className={`absolute inset-0 backface-hidden bg-card ${cardStyle.border} border rounded-lg flex flex-col items-center justify-center p-6 gap-3`}>
          <div className={`w-12 h-12 rounded-full ${cardStyle.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${cardStyle.text}`} />
          </div>
          <h3 className={`font-display text-lg font-bold ${cardStyle.text} text-center`}>{t(`flip.${index}.title`)}</h3>
          <p className="text-muted-foreground text-center" style={{ fontSize: "16px" }}>{t("flip.hover")}</p>
        </div>
        <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br ${cardStyle.gradient} ${cardStyle.border} border rounded-lg flex flex-col items-center justify-center p-6`}>
          <h3 className="font-display text-sm font-bold text-primary-foreground mb-3 text-center">{t(`flip.${index}.title`)}</h3>
          <p className="text-primary-foreground/90 text-center leading-relaxed" style={{ fontSize: "16px" }}>{t(`flip.${index}.back`)}</p>
        </div>
      </div>
    </div>
  );
};

const FlipCardsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          {t("flip.title")} <span className="text-gradient-gold">{t("flip.title_highlight")}</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12" style={{ fontSize: "20px" }}>
          {t("flip.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <FlipCard key={i} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlipCardsSection;
