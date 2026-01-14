import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield } from "lucide-react";

const features = [
  "Full photo generator access",
  "Complete shot control",
  "Catalog & Campaign modes",
];

interface PricingCardProps {
  onCtaClick: () => void;
}

const PricingCard = ({ onCtaClick }: PricingCardProps) => {
  return (
    <div className="space-y-8">
      {/* Main Pricing Card */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto p-6 md:p-8 rounded-2xl bg-card/50 border border-white/10 backdrop-blur-sm"
      >
        {/* Title & Price */}
        <div className="text-center mb-8">
          <h3 className="text-lg md:text-xl font-display font-semibold text-foreground mb-4">
            AI Model Studio — Access
          </h3>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl md:text-5xl font-display font-bold text-primary">
              [PRICE / PLAN HERE]
            </span>
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm md:text-base text-muted-foreground">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          onClick={onCtaClick}
          size="lg"
          className="w-full py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 group"
        >
          Buy Now — Instant Access
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>

      {/* Guarantee Box */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-lg mx-auto p-5 md:p-6 rounded-xl bg-primary/5 border border-primary/20 backdrop-blur-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-base text-foreground mb-1">
              Try risk-free.
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Try 7 days or refund.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingCard;
