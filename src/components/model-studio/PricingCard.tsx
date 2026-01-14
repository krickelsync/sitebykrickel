import { motion } from "framer-motion";
import { Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "AI Model Studio Access",
  "Full controls (pose, lens, angle, background, ratio, output 1–6)",
  "Catalog & Campaign modes",
  "[BONUS HERE]",
];

interface PricingCardProps {
  onCtaClick: () => void;
}

const PricingCard = ({ onCtaClick }: PricingCardProps) => {
  return (
    <div className="space-y-8">
      {/* Main Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="relative max-w-lg mx-auto"
      >
        {/* Subtle glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-50" />

        <div className="relative p-6 md:p-10 rounded-2xl bg-card/60 border border-white/10 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">
              AI Model Studio — Access
            </h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl md:text-5xl font-display font-bold text-foreground">
                [PRICE / PLAN HERE]
              </span>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm md:text-base text-foreground/90">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button
            onClick={onCtaClick}
            className="w-full py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
          >
            Get Access Now
          </Button>
        </div>
      </motion.div>

      {/* Guarantee Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-lg mx-auto p-5 md:p-6 rounded-xl bg-card/40 border border-white/5 backdrop-blur-sm"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="text-base font-display font-semibold text-foreground mb-2">
              Guarantee that makes it easy to try.
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              [GUARANTEE HERE]
            </p>
            <p className="text-xs text-muted-foreground/70">
              Note: Use assets you own or have license for.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingCard;
