import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ban, FileWarning, Users, KeyRound, ShieldAlert, Eye } from "lucide-react";

const cardStyles = [
  { icon: Ban, color: "text-rose-400", border: "border-rose-400/30", bg: "bg-rose-400/10" },
  { icon: FileWarning, color: "text-amber-400", border: "border-amber-400/30", bg: "bg-amber-400/10" },
  { icon: Users, color: "text-cyan-400", border: "border-cyan-400/30", bg: "bg-cyan-400/10" },
  { icon: KeyRound, color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/10" },
  { icon: ShieldAlert, color: "text-violet-400", border: "border-violet-400/30", bg: "bg-violet-400/10" },
  { icon: Eye, color: "text-sky-400", border: "border-sky-400/30", bg: "bg-sky-400/10" },
];

const ScamResponseSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          {t("scam.title")} <span className="text-primary">{t("scam.title2")}</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          {t("scam.subtitle")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ScamFlipCard key={i} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ScamFlipCard = ({ index }: { index: number }) => {
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
          <h3 className={`font-display text-lg font-bold ${style.color} text-center`}>
            {t(`scam.${index}.title`)}
          </h3>
          <p className="text-muted-foreground text-sm text-center">{t("scam.hover")}</p>
        </div>
        <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-secondary ${style.border} border rounded-lg flex flex-col items-center justify-center p-6`}>
          <h3 className={`font-display text-sm font-bold ${style.color} mb-3 text-center`}>
            {t(`scam.${index}.title`)}
          </h3>
          <p className="text-foreground/80 text-sm text-center leading-relaxed">
            {t(`scam.${index}.back`)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScamResponseSection;
