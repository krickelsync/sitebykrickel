import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "[PRICING FEATURE 1]",
  "[PRICING FEATURE 2]",
  "[PRICING FEATURE 3]",
  "[PRICING FEATURE 4]",
  "[PRICING FEATURE 5]",
  "[PRICING FEATURE 6]",
];

interface PricingCardProps {
  onCtaClick: () => void;
}

const PricingCard = ({ onCtaClick }: PricingCardProps) => {
  return (
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
          <span className="inline-block text-xs font-mono tracking-wider text-primary/80 mb-3">
            LIFETIME ACCESS
          </span>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl md:text-5xl font-display font-bold text-foreground">
              [PRICE]
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            One-time payment. No subscriptions.
          </p>
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

        {/* Bonus */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
          <p className="text-sm text-center">
            <span className="text-primary font-medium">Bonus:</span>{" "}
            <span className="text-foreground/80">[BONUS]</span>
          </p>
        </div>

        {/* CTA */}
        <Button
          onClick={onCtaClick}
          className="w-full py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
        >
          Get Access Now
        </Button>

        {/* Guarantee */}
        <p className="mt-4 text-xs text-center text-muted-foreground">
          [GUARANTEE]
        </p>
      </div>
    </motion.div>
  );
};

export default PricingCard;
