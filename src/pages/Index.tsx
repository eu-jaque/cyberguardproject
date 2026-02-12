import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import StatsSection from "@/components/StatsSection";
import ParallaxSection from "@/components/ParallaxSection";
import FlipCardsSection from "@/components/FlipCardsSection";
import ParallaxSection2 from "@/components/ParallaxSection2";
import ScamResponseSection from "@/components/ScamResponseSection";
import QuizSection from "@/components/QuizSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <StatsSection />
        <ParallaxSection />
        <FlipCardsSection />
        <ParallaxSection2 />
        <ScamResponseSection />
        <QuizSection />
        <FAQSection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
