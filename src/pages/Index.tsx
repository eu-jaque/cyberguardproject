import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import StatsSection from "@/components/StatsSection";
import ParallaxSection from "@/components/ParallaxSection";
import FlipCardsSection from "@/components/FlipCardsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
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
        <TestimonialsSection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
