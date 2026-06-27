import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";

const themes = [
  {
    name: "SYNC Theme",
    license: "1 License • With Footer Watermark",
    price: "$95",
    features: ["Shopify 2.0 Ready", "Mobile-first Layout", "Lifetime Updates"],
    href: "/products",
  },
  {
    name: "SYNC Theme",
    license: "1 License • No Watermark",
    price: "$145",
    features: ["Shopify 2.0 Ready", "Mobile-first Layout", "Lifetime Updates", "White-label Footer"],
    href: "/products",
    featured: true,
  },
];

const ThemeCollection = () => (
  <section id="themes" className="py-24 md:py-32 border-t border-border">
    <div className="container px-4">
      <SectionHeader
        eyebrow="THEME COLLECTION"
        title="PREMIUM THEMES"
        accent="BUILT FOR BRANDS."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {themes.map((t, i) => (
          <motion.a
            href={t.href}
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={`group glass-card p-6 md:p-8 flex flex-col transition-all duration-500 hover:border-primary/40 ${
              t.featured ? "shiny-card" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-syne font-bold uppercase text-xl md:text-2xl tracking-tight">
                  {t.name}
                </h3>
                <p className="font-mono text-[10px] md:text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                  {t.license}
                </p>
              </div>
              <span className="font-syne font-bold text-2xl md:text-3xl text-primary">{t.price}</span>
            </div>
            <ul className="space-y-2 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2 font-mono text-xs md:text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
              View Theme <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ThemeCollection;