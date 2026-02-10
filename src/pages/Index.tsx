import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ParallaxSection from "@/components/ParallaxSection";
import StatsSection from "@/components/StatsSection";
import QuizSection from "@/components/QuizSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <ParallaxSection />
        <StatsSection />
        <QuizSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
