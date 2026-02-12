import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ScamResponseSection = () => {
  const { t } = useLanguage();
  const cards = [0, 1, 2, 3, 4, 5];

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
          {cards.map((i) => (
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
        <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-lg flex flex-col items-center justify-center p-6">
          <h3 className="font-display text-lg font-bold text-primary text-center">
            {t(`scam.${index}.title`)}
          </h3>
          <p className="text-muted-foreground text-sm mt-2 text-center">{t("scam.hover")}</p>
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-secondary border border-primary/30 rounded-lg flex flex-col items-center justify-center p-6">
          <h3 className="font-display text-sm font-bold text-primary mb-3 text-center">
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
