import { useState } from "react";

// Components
import ModelStudioNavbar from "@/components/model-studio/ModelStudioNavbar";
import HeroSection from "@/components/model-studio/HeroSection";
import SectionHeader from "@/components/model-studio/SectionHeader";
import Steps from "@/components/model-studio/Steps";
import FeatureGrid from "@/components/model-studio/FeatureGrid";
import PresetCards from "@/components/model-studio/PresetCards";
import PricingCard from "@/components/model-studio/PricingCard";
import FAQAccordion from "@/components/model-studio/FAQAccordion";
import FinalCTA from "@/components/model-studio/FinalCTA";
import MobileStickyBar from "@/components/model-studio/MobileStickyBar";
import CheckoutModal from "@/components/products/CheckoutModal";
import BundleOfferModal from "@/components/products/BundleOfferModal";

const ProductAIModelStudio = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showBundle, setShowBundle] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<"model" | "bundle">("model");

  const handleCtaClick = () => {
    setShowBundle(true);
  };

  const handleAcceptBundle = () => {
    setShowBundle(false);
    setSelectedProduct("bundle");
    setShowCheckout(true);
  };

  const handleDeclineBundle = () => {
    setShowBundle(false);
    setSelectedProduct("model");
    setShowCheckout(true);
  };

  const handlePricingClick = () => {
    const element = document.querySelector("#pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <ModelStudioNavbar onCtaClick={handleCtaClick} />

      {/* Hero Section */}
      <HeroSection onCtaClick={handleCtaClick} />

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="HOW IT WORKS"
            title="[HOW IT WORKS TITLE]"
            description="[HOW IT WORKS DESCRIPTION]"
          />
          <div className="mt-12 md:mt-16">
            <Steps />
          </div>
        </div>
      </section>

      {/* Controls / Features */}
      <section id="controls" className="py-20 md:py-32 px-4 md:px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="CONTROLS"
            title="[CONTROLS TITLE]"
            description="[CONTROLS DESCRIPTION]"
          />
          <div className="mt-12 md:mt-16">
            <FeatureGrid />
          </div>
        </div>
      </section>

      {/* Presets */}
      <section id="presets" className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="PRESETS"
            title="[PRESETS TITLE]"
            description="[PRESETS DESCRIPTION]"
          />
          <div className="mt-12 md:mt-16">
            <PresetCards />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-32 px-4 md:px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="PRICING"
            title="[PRICING TITLE]"
            description="[PRICING DESCRIPTION]"
          />
          <div className="mt-12 md:mt-16">
            <PricingCard onCtaClick={handleCtaClick} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="FAQ"
            title="[FAQ TITLE]"
            description="[FAQ DESCRIPTION]"
          />
          <div className="mt-12 md:mt-16">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <FinalCTA onCtaClick={handleCtaClick} />
        </div>
      </section>

      {/* Mobile Sticky Bar */}
      <MobileStickyBar onCtaClick={handleCtaClick} onPricingClick={handlePricingClick} />

      {/* Modals */}
      <BundleOfferModal
        isOpen={showBundle}
        onClose={() => setShowBundle(false)}
        onAcceptBundle={handleAcceptBundle}
        onDeclineBundle={handleDeclineBundle}
        originalProduct="AI Model Studio"
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        productName={selectedProduct === "bundle" ? "AI Product + Model Studio Bundle" : "AI Model Studio"}
        price={selectedProduct === "bundle" ? 100 : 100}
        isBundle={selectedProduct === "bundle"}
      />
    </div>
  );
};

export default ProductAIModelStudio;
