import { motion } from "framer-motion";
import { Check, X, Sparkles, AlertTriangle } from "lucide-react";
interface PricingFeature {
  category?: string;
  feature: string;
  standard: string | boolean;
  ultimate: string | boolean;
}
const pricingData: PricingFeature[] = [{
  category: "TARGET BRAND",
  feature: "Target Brand",
  standard: "Newbie / Starter",
  ultimate: "High-End / Established"
}, {
  category: "CORE SETUP",
  feature: "Theme Installation",
  standard: "Basic Theme",
  ultimate: "Premium Theme"
}, {
  feature: "Pages Setup",
  standard: "5 Pages (Home, Shop, etc)",
  ultimate: "Unlimited Pages Setup"
}, {
  feature: "Product Upload",
  standard: "Max 10 Products",
  ultimate: "Max 50 Products"
}, {
  feature: "Mobile Responsive",
  standard: "Standard Mobile",
  ultimate: "Compact Mobile UI (Fixed)"
}, {
  category: "KRICKEL EXCLUSIVES (USP)",
  feature: "Enter Page",
  standard: false,
  ultimate: "YES (Video/Img/3D)"
}, {
  feature: "3D Interactive Logo (.glb)",
  standard: false,
  ultimate: "YES (Spinning Interactive)"
}, {
  feature: "Global Music Player",
  standard: false,
  ultimate: "YES (Popup Equalizer)"
}, {
  feature: "Glassmorphism Header",
  standard: false,
  ultimate: "YES (Glass Effect)"
}, {
  category: "VISUAL & AESTHETICS",
  feature: "Background Type",
  standard: "Solid Color / Gradient",
  ultimate: "Custom Vid/Gif/Img Background"
}, {
  feature: "Lookbook",
  standard: "Standard",
  ultimate: "YES (Layout Animation on Hover)"
}, {
  feature: "Custom Cursor",
  standard: false,
  ultimate: "YES (Custom SVG Logo)"
}, {
  feature: "Running Text (Marquee)",
  standard: false,
  ultimate: "YES (Animation)"
}, {
  feature: "Text Glow Effect",
  standard: false,
  ultimate: "YES (Neon Vibe)"
}, {
  feature: "Custom Font Upload",
  standard: "Google Fonts Only",
  ultimate: "YES (Upload Fonts)"
}, {
  feature: "Page Preloader",
  standard: false,
  ultimate: "YES Custom Gif Logo"
}, {
  category: "CONVERSION BOOSTERS",
  feature: "Sticky Add-to-Cart",
  standard: false,
  ultimate: "YES (Floating Bar)"
}, {
  feature: "Quick Add Button",
  standard: "Standard",
  ultimate: "Glassmorph Effect"
}, {
  feature: "Pre-Order System",
  standard: false,
  ultimate: "Badge & Status"
}, {
  feature: "Size Chart Popup",
  standard: false,
  ultimate: true
}, {
  feature: "Stock Status Indicator",
  standard: false,
  ultimate: "Low Stock Alert"
}, {
  category: "MARKETING TOOLS",
  feature: "Newsletter Popup",
  standard: "Standard",
  ultimate: "Waitlist Email Collector"
}, {
  feature: "Social Media Icons",
  standard: "Standard",
  ultimate: "More Icons + Hover FX"
}, {
  feature: "Shipping Status Bar",
  standard: false,
  ultimate: "On Password Page"
}, {
  feature: "External Countdown",
  standard: false,
  ultimate: "Countdown Timer"
}, {
  category: "SUPPORT & REVISIONS",
  feature: "Design Revisions",
  standard: "1x Minor",
  ultimate: "10x Major Revisions"
}, {
  feature: "Turnaround Time",
  standard: "24 Hours",
  ultimate: "2-3 Days (Detail Oriented)"
}, {
  feature: "Support Priority",
  standard: "Standard",
  ultimate: "VIP Priority (WhatsApp)"
}];
const renderValue = (value: string | boolean, isPremium: boolean = false) => {
  if (value === false) {
    return <X size={14} className="text-muted-foreground/50 mx-auto sm:w-[18px] sm:h-[18px]" />;
  }
  if (value === true) {
    return <Check size={14} className={`mx-auto sm:w-[18px] sm:h-[18px] ${isPremium ? "text-primary" : "text-foreground"}`} />;
  }
  return <span className={`font-mono text-[9px] sm:text-xs md:text-sm leading-tight text-center ${isPremium ? "text-foreground" : "text-muted-foreground"}`}>
      {value}
    </span>;
};
const rowVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const
    }
  })
};
const Pricing = () => {
  return;
};
export default Pricing;