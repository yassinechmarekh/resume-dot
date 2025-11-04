import Header from "@/components/header";
import Footer from "@/components/footer";
import HeroSection from "@/sections/home/hero-section";
import FeaturesSection from "@/sections/home/features-section";
import TestiomonialsSection from "@/sections/home/testimonials-section";
import CTA from "@/sections/home/cta";

const HomeRoute = () => {
  return (
    <div>
      <Header />
      <div className={"space-y-8 sm:space-y-16"}>
        <HeroSection />
        <FeaturesSection />
        <TestiomonialsSection />
        <CTA />
      </div>
      <Footer />
    </div>
  );
};

export default HomeRoute;
