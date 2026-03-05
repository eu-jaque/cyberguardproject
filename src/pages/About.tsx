import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-[2%] py-32">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">{t("about.title")}</h1>
        <p className="text-foreground/80 text-lg leading-relaxed">{t("about.desc")}</p>
      </main>
      <Footer />
      <Chatbot />
      <AccessibilityWidget />
    </div>
  );
};

export default About;
