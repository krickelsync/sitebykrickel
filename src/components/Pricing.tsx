import VelocityText from "./VelocityText";
import SectionHeader from "./shared/SectionHeader";
import PricingCard, {
  type PricingFeatureSection,
} from "./pricing/PricingCard";
import { useContactScroll } from "@/hooks/useContactScroll";
import { motion } from "framer-motion";

const standardFeatures: PricingFeatureSection[] = [
  { category: "CORE SETUP", items: [
    { feature: "Theme Installation", value: "Basic Theme" },
    { feature: "Pages Setup", value: "5 Pages" },
    { feature: "Product Upload", value: "Max 10 Products" },
    { feature: "Mobile Responsive", value: "Standard" },
  ]},
  { category: "VISUAL & AESTHETICS", items: [
    { feature: "Background Type", value: "Solid/Gradient" },
    { feature: "Custom Font", value: "Google Fonts" },
    { feature: "Lookbook", value: "Standard" },
  ]},
  { category: "MARKETING", items: [
    { feature: "Newsletter Popup", value: "Standard" },
    { feature: "Social Icons", value: "Standard" },
  ]},
  { category: "SUPPORT", items: [
    { feature: "Revisions", value: "1x Minor" },
    { feature: "Turnaround", value: "24 Hours" },
    { feature: "Support", value: "Standard" },
    { feature: "License", value: "Lifetime" },
  ]},
];

const ultimateFeatures: PricingFeatureSection[] = [
  { category: "CORE SETUP", items: [
    { feature: "Theme Installation", value: "Premium Theme" },
    { feature: "Pages Setup", value: "Unlimited" },
    { feature: "Product Upload", value: "Max 50 Products" },
    { feature: "Mobile Responsive", value: "Compact UI" },
  ]},
  { category: "KRICKEL EXCLUSIVES", items: [
    { feature: "Enter Page", value: "Video/Img/3D" },
    { feature: "3D Interactive Logo", value: "Spinning .glb" },
    { feature: "Global Music Player", value: "Popup Equalizer" },
    { feature: "Glassmorphism Header", value: "Glass Effect" },
    { feature: "Custom Cursor", value: "SVG Logo" },
    { feature: "Free Domain Include", value: "Included" },
    { feature: "Free Email Domain", value: "Up to 10 Custom Emails @yourbrand.com" },
  ]},
  { category: "VISUAL & AESTHETICS", items: [
    { feature: "Background Type", value: "Vid/Gif/Img" },
    { feature: "Custom Font", value: "Upload Fonts" },
    { feature: "Lookbook", value: "Hover Animation" },
    { feature: "Running Marquee", value: "Animated" },
    { feature: "Text Glow Effect", value: "Neon Vibe" },
    { feature: "Page Preloader", value: "Custom Gif" },
  ]},
  { category: "CONVERSION BOOSTERS", items: [
    { feature: "Sticky Add-to-Cart", value: "Floating Bar" },
    { feature: "Quick Add Button", value: "Glassmorph" },
    { feature: "Pre-Order System", value: "Badge & Status" },
    { feature: "Size Chart Popup", included: true },
    { feature: "Stock Indicator", value: "Low Stock Alert" },
  ]},
  { category: "MARKETING", items: [
    { feature: "Newsletter Popup", value: "Waitlist Email" },
    { feature: "Social Icons", value: "More + Hover FX" },
    { feature: "Shipping Status", value: "Password Page" },
    { feature: "Countdown Timer", included: true },
  ]},
  { category: "SUPPORT", items: [
    { feature: "Revisions", value: "10x Major" },
    { feature: "Turnaround", value: "2-3 Days" },
    { feature: "Support", value: "VIP WhatsApp" },
    { feature: "License", value: "Lifetime" },
  ]},
];

const notIncludedStandard = [
  "Enter Page",
  "3D Interactive Logo",
  "Music Player",
  "Glassmorphism",
  "Custom Cursor",
  "Running Marquee",
  "Preloader",
  "Sticky Cart",
  "Pre-Order",
  "Countdown",
];

const Pricing = () => {
  const handleContactClick = useContactScroll();

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container px-4">
        <VelocityText />

        <SectionHeader
          eyebrow="PRICING"
          title={<span className="text-foreground">AND MORE</span>}
          accent="FEATURES!"
          accentTone="gold"
        />

        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-3 md:gap-8">
          <PricingCard
            tier="Standard"
            price="$150"
            tagline="Perfect for starters"
            sections={standardFeatures}
            notIncluded={notIncludedStandard}
            ctaLabel="Get Started"
            onCtaClick={handleContactClick}
            variant="standard"
          />
          <PricingCard
            tier="Ultimate Premium"
            price="$299"
            tagline="For high-end brands"
            sections={ultimateFeatures}
            ctaLabel="Get Premium"
            onCtaClick={handleContactClick}
            variant="premium"
            badge="PROMO!"
            delay={0.1}
          />
        </div>

        <motion.p
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.01 }}
          className="font-mono text-xs text-muted-foreground text-center mt-8"
        >
          Secure payment • Setup starts within 24 hours
        </motion.p>
      </div>
    </section>
  );
};

export default Pricing;
