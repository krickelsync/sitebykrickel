import { motion } from "framer-motion";
import { Check, X, Sparkles, AlertTriangle } from "lucide-react";
import VelocityText from "./VelocityText";

const standardFeatures = [
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
  ]},
];

const ultimateFeatures = [
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

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-3 md:gap-8">
          
          {/* Standard Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-3 md:p-8 flex flex-col"
          >
            {/* Header */}
            <div className="text-center mb-4 md:mb-6 pb-4 md:pb-6 border-b border-border/50">
              <span className="font-display text-[10px] md:text-sm uppercase tracking-widest text-muted-foreground">Standard</span>
              <div className="mt-1 md:mt-2">
                <span className="font-display text-2xl md:text-5xl font-bold">$99</span>
              </div>
              <p className="font-mono text-[8px] md:text-xs text-muted-foreground mt-1 md:mt-2">Perfect for starters</p>
            </div>

            {/* Features */}
            <div className="flex-1 space-y-3 md:space-y-5">
              {standardFeatures.map((section, idx) => (
                <div key={idx}>
                  <span className="font-mono text-[8px] md:text-[10px] text-primary uppercase tracking-widest">{section.category}</span>
                  <ul className="mt-1 md:mt-2 space-y-1 md:space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-1 md:gap-2">
                        <Check className="text-foreground mt-0.5 shrink-0 w-3 h-3 md:w-[14px] md:h-[14px]" />
                        <span className="font-mono text-[9px] md:text-xs text-muted-foreground">
                          {item.feature}: <span className="text-foreground">{item.value}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Not Included */}
              <div>
                <span className="font-mono text-[8px] md:text-[10px] text-muted-foreground/50 uppercase tracking-widest">Not Included</span>
                <ul className="mt-1 md:mt-2 space-y-1">
                  {notIncludedStandard.map((item, i) => (
                    <li key={i} className="flex items-center gap-1 md:gap-2">
                      <X className="text-muted-foreground/30 shrink-0 w-2.5 h-2.5 md:w-3 md:h-3" />
                      <span className="font-mono text-[8px] md:text-xs text-muted-foreground/40">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://www.instagram.com/krickel.sync/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-6 block w-full text-center py-2 md:py-4 border border-border font-mono text-[10px] md:text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Get Started
            </a>
          </motion.div>

          {/* Ultimate Premium Card Wrapper */}
          <div className="relative">
            {/* Promo Badge - Outside card for visibility */}
            <div className="absolute -top-2.5 md:-top-3 left-1/2 -translate-x-1/2 z-20">
              <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-4 py-0.5 md:py-1 bg-primary text-primary-foreground font-mono text-[8px] md:text-[10px] uppercase tracking-wider rounded-full shadow-lg">
                <AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3" />
                PROMO!
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative glass-card shiny-card rounded-xl p-3 md:p-8 pt-6 md:pt-10 flex flex-col hover:border-primary/30 transition-all duration-500"
            >
              {/* Premium glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none rounded-xl" />

            {/* Header */}
            <div className="text-center mb-4 md:mb-6 pb-4 md:pb-6 border-b border-primary/20">
              <span className="font-display text-[10px] md:text-sm uppercase tracking-widest text-primary">Ultimate Premium</span>
              <div className="mt-1 md:mt-2">
                <span className="font-display text-2xl md:text-5xl font-bold text-primary glow-text">$199</span>
              </div>
              <p className="font-mono text-[8px] md:text-xs text-muted-foreground mt-1 md:mt-2">For high-end brands</p>
            </div>

            {/* Features */}
            <div className="flex-1 space-y-3 md:space-y-5">
              {ultimateFeatures.map((section, idx) => (
                <div key={idx}>
                  <span className="font-mono text-[8px] md:text-[10px] text-primary uppercase tracking-widest">{section.category}</span>
                  <ul className="mt-1 md:mt-2 space-y-1 md:space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-1 md:gap-2">
                        <Check className="text-primary mt-0.5 shrink-0 w-3 h-3 md:w-[14px] md:h-[14px]" />
                        <span className="font-mono text-[9px] md:text-xs text-muted-foreground">
                          {item.feature}
                          {'value' in item && item.value && (
                            <>: <span className="text-foreground">{item.value}</span></>
                          )}
                        </span>
                        {'value' in item && item.value && (
                          <Sparkles className="text-primary shrink-0 ml-auto w-2 h-2 md:w-2.5 md:h-2.5" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://www.instagram.com/krickel.sync/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 md:mt-6 relative block w-full text-center bg-primary text-primary-foreground py-2 md:py-4 font-mono text-[10px] md:text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 hover:glow-box"
            >
              <span className="relative z-10 flex items-center justify-center gap-1 md:gap-2">
                Get Premium
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              </span>
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
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
