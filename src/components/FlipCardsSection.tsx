import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Smartphone, Mail, MessageCircle, FileText, Phone, Briefcase } from "lucide-react";

const cardStyles = [
  { icon: Smartphone, color: "text-red-400", border: "border-red-400/30", bg: "bg-red-400/10" },
  { icon: Mail, color: "text-blue-400", border: "border-blue-400/30", bg: "bg-blue-400/10" },
  { icon: MessageCircle, color: "text-green-400", border: "border-green-400/30", bg: "bg-green-400/10" },
  { icon: FileText, color: "text-yellow-400", border: "border-yellow-400/30", bg: "bg-yellow-400/10" },
  { icon: Phone, color: "text-purple-400", border: "border-purple-400/30", bg: "bg-purple-400/10" },
  { icon: Briefcase, color: "text-orange-400", border: "border-orange-400/30", bg: "bg-orange-400/10" },
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
            <Icon className={`w-6 h-6 ${style.color}`} />
          </div>
          <h3 className={`font-display text-lg font-bold ${style.color} text-center`}>{t(`flip.${index}.title`)}</h3>
          <p className="text-muted-foreground text-sm text-center">{t("flip.hover")}</p>
        </div>
        <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-secondary ${style.border} border rounded-lg flex flex-col items-center justify-center p-6`}>
          <h3 className={`font-display text-sm font-bold ${style.color} mb-3 text-center`}>{t(`flip.${index}.title`)}</h3>
          <p className="text-foreground/80 text-sm text-center leading-relaxed">{t(`flip.${index}.back`)}</p>
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
          {t("flip.title")} <span className="text-primary">{t("flip.title_highlight")}</span>
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
