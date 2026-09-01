import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import CategoriesSection from "@/components/home/CategoriesSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <CategoriesSection />
      <CTASection />
    </main>
  );
}