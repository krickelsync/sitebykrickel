import { motion } from "framer-motion";
import { Check, X, Sparkles, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingFeatureItem {
  feature: string;
  value?: string;
  included?: boolean;
}

export interface PricingFeatureSection {
  category: string;
  items: PricingFeatureItem[];
}

interface PricingCardProps {
  tier: string;
  price: string;
  tagline: string;
  sections: PricingFeatureSection[];
  notIncluded?: string[];
  ctaLabel: string;
  onCtaClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  ctaHref?: string;
  variant?: "standard" | "premium";
  badge?: string;
  delay?: number;
}

/**
 * Pricing card used for both Standard and Ultimate tiers.
 * Variant switches the visual treatment (border accent, glow, CTA).
 */
const PricingCard = ({
  tier,
  price,
  tagline,
  sections,
  notIncluded,
  ctaLabel,
  onCtaClick,
  ctaHref = "/about#contact",
  variant = "standard",
  badge,
  delay = 0,
}: PricingCardProps) => {
  const isPremium = variant === "premium";

  const card = (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: isPremium ? 0.98 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={isPremium ? { y: -5 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "glass-card p-3 md:p-8 flex flex-col",
        isPremium &&
          "relative shiny-card rounded-xl pt-6 md:pt-10 hover:border-primary/30 transition-all duration-500",
      )}
    >
      {isPremium && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none rounded-xl" />
      )}

      {/* Header */}
      <div
        className={cn(
          "text-center mb-4 md:mb-6 pb-4 md:pb-6 border-b",
          isPremium ? "border-primary/20" : "border-border/50",
        )}
      >
        <span
          className={cn(
            "font-display text-[10px] md:text-sm uppercase tracking-widest",
            isPremium ? "text-primary" : "text-muted-foreground",
          )}
        >
          {tier}
        </span>
        <div className="mt-1 md:mt-2">
          <span
            className={cn(
              "font-display text-2xl md:text-5xl font-bold",
              isPremium && "text-primary glow-text",
            )}
          >
            {price}
          </span>
        </div>
        <p className="font-mono text-[8px] md:text-xs text-muted-foreground mt-1 md:mt-2">
          {tagline}
        </p>
      </div>

      {/* Features */}
      <div className="flex-1 space-y-3 md:space-y-5">
        {sections.map((section) => (
          <div key={section.category}>
            <span className="font-mono text-[8px] md:text-[10px] text-primary uppercase tracking-widest">
              {section.category}
            </span>
            <ul className="mt-1 md:mt-2 space-y-1 md:space-y-2">
              {section.items.map((item) => (
                <li
                  key={item.feature}
                  className="flex items-start gap-1 md:gap-2"
                >
                  <Check
                    className={cn(
                      "mt-0.5 shrink-0 w-3 h-3 md:w-[14px] md:h-[14px]",
                      isPremium ? "text-primary" : "text-foreground",
                    )}
                  />
                  <span className="font-mono text-[9px] md:text-xs text-muted-foreground">
                    {item.feature}
                    {item.value && (
                      <>
                        : <span className="text-foreground">{item.value}</span>
                      </>
                    )}
                  </span>
                  {isPremium && item.value && (
                    <Sparkles className="text-primary shrink-0 ml-auto w-2 h-2 md:w-2.5 md:h-2.5" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {notIncluded && notIncluded.length > 0 && (
          <div>
            <span className="font-mono text-[8px] md:text-[10px] text-muted-foreground/50 uppercase tracking-widest">
              Not Included
            </span>
            <ul className="mt-1 md:mt-2 space-y-1">
              {notIncluded.map((item) => (
                <li key={item} className="flex items-center gap-1 md:gap-2">
                  <X className="text-muted-foreground/30 shrink-0 w-2.5 h-2.5 md:w-3 md:h-3" />
                  <span className="font-mono text-[8px] md:text-xs text-muted-foreground/40">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* CTA */}
      <a
        href={ctaHref}
        onClick={onCtaClick}
        className={cn(
          "mt-4 md:mt-6 block w-full text-center py-2 md:py-4 font-mono text-[10px] md:text-sm uppercase tracking-wider transition-all duration-300 cursor-pointer",
          isPremium
            ? "group relative bg-primary text-primary-foreground overflow-hidden hover:glow-box"
            : "border border-border hover:bg-foreground hover:text-background",
        )}
      >
        {isPremium ? (
          <>
            <span className="relative z-10 flex items-center justify-center gap-1 md:gap-2">
              {ctaLabel}
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            </span>
            <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </>
        ) : (
          ctaLabel
        )}
      </a>
    </motion.div>
  );

  if (!badge) return card;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: (delay ?? 0) + 0.2 }}
        className="absolute -top-2.5 md:-top-3 left-1/2 -translate-x-1/2 z-20"
      >
        <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-4 py-0.5 md:py-1 bg-primary text-primary-foreground font-mono text-[8px] md:text-[10px] uppercase tracking-wider rounded-full shadow-lg animate-pulse-glow">
          <AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3" aria-hidden="true" />
          {badge}
        </span>
      </motion.div>
      {card}
    </div>
  );
};

export default PricingCard;