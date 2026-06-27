import { motion } from "framer-motion";
import { ShoppingCart, Palette } from "lucide-react";

interface ProblemCardProps {
  badge: string;
  icon: React.ReactNode;
  problemStatement: string;
  bullets: string[];
  closingLines: string[];
  delay?: number;
}

const ProblemCard = ({
  badge,
  icon,
  problemStatement,
  bullets,
  closingLines,
  delay = 0,
}: ProblemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
    >
      <div className="h-full p-4 sm:p-5 md:p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/40 hover:border-orange-500/20 transition-all duration-300">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-3 sm:mb-4">
          <span className="text-orange-400">{icon}</span>
          <span className="text-[10px] sm:text-xs font-mono text-orange-400 tracking-wide uppercase">
            {badge}
          </span>
        </div>

        {/* Problem Statement */}
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-3 sm:mb-4 leading-snug">
          {problemStatement}
        </h3>

        {/* Bullets */}
        <div className="space-y-2 mb-4 sm:mb-5">
          {bullets.map((bullet, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.15 + index * 0.08 }}
              className="flex items-start gap-2"
            >
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 sm:mt-2" />
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {bullet}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing Lines */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.4 }}
          className="pt-3 sm:pt-4 border-t border-border/40 space-y-0.5"
        >
          {closingLines.map((line, index) => (
            <p
              key={index}
              className={`text-xs sm:text-sm leading-relaxed ${
                index === 0 ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {line}
            </p>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const ProblemBlock = () => {
  const problemCards = [
    {
      badge: "For Clothing Brand Owners",
      icon: <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      problemStatement: "Built for new clothing brand owners with limited budgets.",
      bullets: [
        "Product is ready, photos aren't",
        "Finding models is expensive and time-consuming",
        "Scheduling shoots slows everything down",
      ],
      closingLines: [
        "AI Model Studio removes those problems.",
        "Generate product photos whenever you need them.",
      ],
    },
    {
      badge: "For Clothing Brand Designers",
      icon: <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      problemStatement: "Your designs are finished, but mockups all look the same.",
      bullets: [
        "Clients struggle to visualize the final result",
        "Flat mockups don't show how the product really looks",
        '"Is this design actually good?"',
      ],
      closingLines: [
        "Stop paying $20–$50 for a single mockup.",
        "Create realistic model mockups in minutes.",
        "Sell your own mockups with blank products on AI models.",
      ],
    },
  ];

  return (
    <section className="mb-12 sm:mb-16 md:mb-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6 sm:mb-8 md:mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono text-orange-400 tracking-wide">
            THE PROBLEM
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground">
          Use Cases
        </h2>
      </motion.div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto px-1">
        {problemCards.map((card, index) => (
          <ProblemCard key={index} {...card} delay={index * 0.12} />
        ))}
      </div>
    </section>
  );
};

export default ProblemBlock;
