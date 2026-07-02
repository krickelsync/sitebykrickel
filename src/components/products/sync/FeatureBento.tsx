import { motion } from "framer-motion";
import { FEATURE_GROUPS } from "@/components/Pricing";
import { typography, textSize } from "@/components/ui/typography";

/**
 * Asymmetric bento grid . reuses the pricing feature groups so every
 * capability shown on the pricing card is also merchandised as a card
 * on the product page.
 */
const FeatureBento = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto">
    {FEATURE_GROUPS.map((group, idx) => {
      const Icon = group.icon;
      // Make first + last cards wider on desktop for asymmetric rhythm.
      const wide = idx === 0 || idx === FEATURE_GROUPS.length - 1;
      return (
        <motion.article
          key={group.category}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
          className={`relative rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-primary/40 hover:bg-foreground/[0.04] transition-colors p-5 md:p-6 flex flex-col ${
            wide ? "md:col-span-2" : ""
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Icon aria-hidden="true" className="w-5 h-5 text-primary" />
            <span className={`${typography.eyebrow} text-foreground`}>
              {group.category}
            </span>
          </div>
          <ul className="space-y-1.5 flex-1">
            {group.items.slice(0, 4).map((item) => (
              <li
                key={item.label}
                className={`flex items-baseline gap-2 leading-snug ${textSize.ui}`}
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 w-1 h-1 rounded-full bg-primary/70 shrink-0"
                />
                <span className="font-mono text-muted-foreground">
                  {item.label}
                  {item.value && (
                    <span className="text-foreground"> {item.value}</span>
                  )}
                </span>
              </li>
            ))}
            {group.items.length > 4 && (
              <li className={`${typography.meta} pl-3 pt-1`}>
                + {group.items.length - 4} more
              </li>
            )}
          </ul>
        </motion.article>
      );
    })}
  </div>
);

export default FeatureBento;