import { motion } from "framer-motion";
import { Check, X, Sparkles, AlertTriangle } from "lucide-react";
import VelocityText from "./VelocityText";

interface PricingFeature {
  category?: string;
  feature: string;
  standard: string | boolean;
  ultimate: string | boolean;
}

const pricingData: PricingFeature[] = [
  { category: "TARGET BRAND", feature: "Target Brand", standard: "Newbie / Starter", ultimate: "High-End / Established" },
  
  { category: "CORE SETUP", feature: "Theme Installation", standard: "Basic Theme", ultimate: "Premium Theme" },
  { feature: "Pages Setup", standard: "5 Pages (Home, Shop, etc)", ultimate: "Unlimited Pages Setup" },
  { feature: "Product Upload", standard: "Max 10 Products", ultimate: "Max 50 Products" },
  { feature: "Mobile Responsive", standard: "Standard Mobile", ultimate: "Compact Mobile UI (Fixed)" },
  
  { category: "KRICKEL EXCLUSIVES (USP)", feature: "Enter Page", standard: false, ultimate: "YES (Video/Img/3D)" },
  { feature: "3D Interactive Logo (.glb)", standard: false, ultimate: "YES (Spinning Interactive)" },
  { feature: "Global Music Player", standard: false, ultimate: "YES (Popup Equalizer)" },
  { feature: "Glassmorphism Header", standard: false, ultimate: "YES (Glass Effect)" },
  
  { category: "VISUAL & AESTHETICS", feature: "Background Type", standard: "Solid Color / Gradient", ultimate: "Custom Vid/Gif/Img Background" },
  { feature: "Lookbook", standard: "Standard", ultimate: "YES (Layout Animation on Hover)" },
  { feature: "Custom Cursor", standard: false, ultimate: "YES (Custom SVG Logo)" },
  { feature: "Running Text (Marquee)", standard: false, ultimate: "YES (Animation)" },
  { feature: "Text Glow Effect", standard: false, ultimate: "YES (Neon Vibe)" },
  { feature: "Custom Font Upload", standard: "Google Fonts Only", ultimate: "YES (Upload Fonts)" },
  { feature: "Page Preloader", standard: false, ultimate: "YES Custom Gif Logo" },
  
  { category: "CONVERSION BOOSTERS", feature: "Sticky Add-to-Cart", standard: false, ultimate: "YES (Floating Bar)" },
  { feature: "Quick Add Button", standard: "Standard", ultimate: "Glassmorph Effect" },
  { feature: "Pre-Order System", standard: false, ultimate: "Badge & Status" },
  { feature: "Size Chart Popup", standard: false, ultimate: true },
  { feature: "Stock Status Indicator", standard: false, ultimate: "Low Stock Alert" },
  
  { category: "MARKETING TOOLS", feature: "Newsletter Popup", standard: "Standard", ultimate: "Waitlist Email Collector" },
  { feature: "Social Media Icons", standard: "Standard", ultimate: "More Icons + Hover FX" },
  { feature: "Shipping Status Bar", standard: false, ultimate: "On Password Page" },
  { feature: "External Countdown", standard: false, ultimate: "Countdown Timer" },
  
  { category: "SUPPORT & REVISIONS", feature: "Design Revisions", standard: "1x Minor", ultimate: "10x Major Revisions" },
  { feature: "Turnaround Time", standard: "24 Hours", ultimate: "2-3 Days (Detail Oriented)" },
  { feature: "Support Priority", standard: "Standard", ultimate: "VIP Priority (WhatsApp)" },
];

const renderValue = (value: string | boolean, isPremium: boolean = false) => {
  if (value === false) {
    return <X size={14} className="text-muted-foreground/50 mx-auto sm:w-[18px] sm:h-[18px]" />;
  }
  if (value === true) {
    return <Check size={14} className={`mx-auto sm:w-[18px] sm:h-[18px] ${isPremium ? "text-primary" : "text-foreground"}`} />;
  }
  return (
    <span className={`font-mono text-[9px] sm:text-xs md:text-sm leading-tight text-center ${isPremium ? "text-foreground" : "text-muted-foreground"}`}>
      {value}
    </span>
  );
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="container px-4">
        {/* Velocity Text - Above Pricing Badge */}
        <VelocityText />

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 glass-card font-mono text-xs text-primary tracking-widest mb-6">
            PRICING
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight">
            <span className="text-foreground">AND MORE</span>
            <br />
            <span className="text-yellow-400 glow-text">FEATURES!</span>
          </h2>
        </motion.div>

        {/* Pricing Table */}
        <div className="max-w-4xl mx-auto pt-8">
          {/* Header */}
          <div className="grid grid-cols-[1fr,90px,100px] sm:grid-cols-[1fr,120px,140px] md:grid-cols-[1fr,160px,180px] gap-1 sm:gap-2 mb-4">
            <div className="p-2 sm:p-4">
              <span className="font-mono text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
                Feature
              </span>
            </div>
            
            {/* Standard Package */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-2 sm:p-4 text-center group cursor-default"
            >
              <span className="font-display text-[10px] sm:text-sm uppercase tracking-tight block mb-1 group-hover:tracking-widest transition-all duration-300">Standard</span>
              <span className="font-display text-lg sm:text-2xl md:text-3xl font-bold hover-float hover-scale-premium inline-block">$99</span>
            </motion.div>
            
            {/* Ultimate Package */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative premium-card rounded-xl p-2 sm:p-4 text-center glow-border animate-pulse-glow overflow-visible group cursor-default"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-primary text-primary-foreground font-mono text-[8px] sm:text-[10px] uppercase tracking-wider rounded-full whitespace-nowrap">
                  <AlertTriangle size={10} className="sm:w-3 sm:h-3" />
                  PROMO!
                </span>
              </div>
              <span className="font-display text-[10px] sm:text-sm uppercase tracking-tight block mb-1 group-hover:tracking-widest transition-all duration-300 hover-glow-intense">Ultimate Premium</span>
              <span className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-primary glow-text hover-float hover-scale-premium inline-block">$199</span>
            </motion.div>
          </div>

          {/* Table Body */}
          <div className="space-y-0.5 sm:space-y-1">
            {pricingData.map((row, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {row.category && (
                  <div className="pt-4 sm:pt-6 pb-1 sm:pb-2 first:pt-0">
                    <span className="font-display text-[10px] sm:text-xs text-primary uppercase tracking-widest">
                      {row.category}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-[1fr,90px,100px] sm:grid-cols-[1fr,120px,140px] md:grid-cols-[1fr,160px,180px] gap-1 sm:gap-2 group">
                  <div className="p-2 sm:p-3 md:p-4 glass-card group-hover:border-muted transition-colors">
                    <span className="font-mono text-[10px] sm:text-xs md:text-sm leading-tight">{row.feature}</span>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 glass-card group-hover:border-muted transition-colors flex items-center justify-center">
                    {renderValue(row.standard)}
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 premium-card rounded-xl group-hover:border-primary/30 transition-colors flex items-center justify-center">
                    <div className="flex items-center gap-1">
                      {row.ultimate !== false && row.ultimate !== true && typeof row.ultimate === 'string' && (
                        <Sparkles size={10} className="text-primary shrink-0 hidden sm:block" />
                      )}
                      {renderValue(row.ultimate, true)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://www.instagram.com/krickel.sync/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 font-mono text-sm font-bold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:glow-box"
          >
            <span className="relative z-10">Get Started Now</span>
            <Sparkles size={18} className="relative z-10" />
            <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <p className="font-mono text-xs text-muted-foreground mt-4">
            Secure payment • Setup starts within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
