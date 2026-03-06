import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Smartphone, Mail, MessageCircle, FileText, Phone, Briefcase } from "lucide-react";

const cardStyles = [
  { icon: Smartphone, gradient: "from-[#D4A535] to-[#B8860B]", border: "border-[#D4A535]/30", bg: "bg-[#D4A535]/10", text: "text-[#F5D77A]" },
  { icon: Mail, gradient: "from-[#C9962C] to-[#8B6914]", border: "border-[#C9962C]/30", bg: "bg-[#C9962C]/10", text: "text-[#E8C547]" },
  { icon: MessageCircle, gradient: "from-[#F5D77A] to-[#D4A535]", border: "border-[#F5D77A]/30", bg: "bg-[#F5D77A]/10", text: "text-[#F5D77A]" },
  { icon: FileText, gradient: "from-[#B8860B] to-[#8B6914]", border: "border-[#B8860B]/30", bg: "bg-[#B8860B]/10", text: "text-[#D4A535]" },
  { icon: Phone, gradient: "from-[#DAA520] to-[#B8860B]", border: "border-[#DAA520]/30", bg: "bg-[#DAA520]/10", text: "text-[#DAA520]" },
  { icon: Briefcase, gradient: "from-[#CD853F] to-[#8B6914]", border: "border-[#CD853F]/30", bg: "bg-[#CD853F]/10", text: "text-[#CD853F]" },
];

const FlipCard = ({ index }: { index: number }) => {
  const [flipped, setFlipped] = useState(false);
  const { t } = useLanguage();
  const style = cardStyles[index];
  const Icon = style.icon;

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
        <div className={`absolute inset-0 backface-hidden bg-card ${style.border} border rounded-lg flex flex-col items-center justify-center p-6 gap-3`}>
          <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${style.text}`} />
          </div>
          <h3 className={`font-display text-lg font-bold ${style.text} text-center`}>{t(`flip.${index}.title`)}</h3>
          <p className="text-muted-foreground text-sm text-center">{t("flip.hover")}</p>
        </div>
        <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br ${style.gradient} ${style.border} border rounded-lg flex flex-col items-center justify-center p-6`}>
          <h3 className="font-display text-sm font-bold text-primary-foreground mb-3 text-center">{t(`flip.${index}.title`)}</h3>
          <p className="text-primary-foreground/90 text-sm text-center leading-relaxed">{t(`flip.${index}.back`)}</p>
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
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
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
