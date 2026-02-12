import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-card">
      <div className="max-w-[1366px] mx-auto px-[2%]">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          {t("faq.title")} <span className="text-primary">{t("faq.title_highlight")}</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          {t("faq.subtitle")}
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border rounded-lg px-6">
                <AccordionTrigger className="text-foreground text-left hover:no-underline">
                  {t(`faq.${i}.q`)}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">
                  {t(`faq.${i}.a`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
