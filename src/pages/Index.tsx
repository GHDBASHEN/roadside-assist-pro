import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ServiceCategories from "@/components/landing/ServiceCategories";
import HowItWorks from "@/components/landing/HowItWorks";
import MechanicSection from "@/components/landing/MechanicSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import AppScreens from "@/components/landing/AppScreens";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ServiceCategories />
      <HowItWorks />
      <MechanicSection />
      <FeaturesGrid />
      <AppScreens />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
