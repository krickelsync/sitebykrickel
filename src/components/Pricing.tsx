import VelocityText from "./VelocityText";
import SectionHeader from "./shared/SectionHeader";
import PricingCard, {
  type PricingFeatureSection,
} from "./pricing/PricingCard";
import { useContactScroll } from "@/hooks/useContactScroll";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

const starterFeatures: PricingFeatureSection[] = [
  { category: "INCLUDED", items: [
    { feature: "SYNC Starter Theme", included: true },
    { feature: "1 Store License", included: true },
    { feature: "Mobile-first Layout", included: true },
    { feature: "Shopify 2.0 Compatible", included: true },
    { feature: "Lifetime Updates", included: true },
    { feature: "Email Support", included: true },
  ]},
];

const proFeatures: PricingFeatureSection[] = [
  { category: "EVERYTHING IN STARTER", items: [
    { feature: "1 Store License", included: true },
    { feature: "No Footer Watermark", included: true },
  ]},
  { category: "PRO ADD-ONS", items: [
    { feature: "Product Page Builder", included: true },
    { feature: "Lookbook Sections", included: true },
    { feature: "Drop Countdown Sections", included: true },
    { feature: "Sticky Add to Cart", included: true },
    { feature: "Priority Email Support", included: true },
  ]},
];

const allAccessFeatures: PricingFeatureSection[] = [
  { category: "EVERYTHING IN PRO", items: [
    { feature: "Unlimited Store Licenses", included: true },
    { feature: "All Future Themes Included", included: true },
  ]},
  { category: "EXTRAS", items: [
    { feature: "Mega Menu Layouts", included: true },
    { feature: "Editorial Image Blocks", included: true },
    { feature: "Trust Badges Pack", included: true },
    { feature: "VIP Support", included: true },
  ]},
];

const setupFeatures: PricingFeatureSection[] = [
  { category: "DONE-FOR-YOU", items: [
    { feature: "Theme Installation", included: true },
    { feature: "Brand Setup (logo, fonts, colors)", included: true },
    { feature: "Up to 20 Products Uploaded", included: true },
    { feature: "Homepage & Product Pages", included: true },
    { feature: "Mobile Polish & QA", included: true },
    { feature: "Launch Support", included: true },
  ]},
];

const Pricing = () => {
  const handleContactClick = useContactScroll();

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container px-4">
        <VelocityText />

        <SectionHeader
          eyebrow="PRICING"
          title={<span className="text-foreground">SIMPLE PRICING.</span>}
          accent="PICK YOUR LICENSE."
          accentTone="gold"
        />

        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          <PricingCard
            tier="Starter Theme"
            price="$49"
            tagline="For new brands"
            sections={starterFeatures}
            ctaLabel="Get Started"
            onCtaClick={handleContactClick}
            variant="standard"
          />
          <PricingCard
            tier="Pro Theme"
            price="$99"
            tagline="Most popular"
            sections={proFeatures}
            ctaLabel="Get Pro"
            onCtaClick={handleContactClick}
            variant="premium"
            badge="MOST POPULAR"
            delay={0.1}
          />
          <PricingCard
            tier="All Access"
            price="$199"
            tagline="Unlimited stores"
            sections={allAccessFeatures}
            ctaLabel="Get All Access"
            onCtaClick={handleContactClick}
            variant="standard"
            delay={0.15}
          />
          <PricingCard
            tier="Done-for-you Setup"
            price="$499"
            tagline="We launch it for you"
            sections={setupFeatures}
            ctaLabel="Book Setup"
            onCtaClick={handleContactClick}
            variant="standard"
            delay={0.2}
          />
        </div>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-mono text-xs text-muted-foreground text-center mt-8"
        >
          Secure payment • Setup starts within 24 hours
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
