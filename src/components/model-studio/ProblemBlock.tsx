import { motion } from "framer-motion";
import { ShoppingBag, Palette } from "lucide-react";

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="relative group"
    >
      <div className="h-full p-6 md:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-orange-500/30 transition-all duration-300">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-5">
          <span className="text-orange-400">{icon}</span>
          <span className="text-xs font-mono text-orange-400 tracking-wide uppercase">
            {badge}
          </span>
        </div>

        {/* Problem Statement */}
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-5 leading-snug">
          {problemStatement}
        </h3>

        {/* Bullets */}
        <div className="space-y-3 mb-6">
          {bullets.map((bullet, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.2 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 mt-2" />
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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
          transition={{ delay: delay + 0.5 }}
          className="pt-5 border-t border-border/50"
        >
          {closingLines.map((line, index) => (
            <p
              key={index}
              className={`text-sm md:text-base leading-relaxed ${
                index === 0 ? "text-primary font-medium" : "text-muted-foreground mt-1"
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
      icon: <ShoppingBag className="w-4 h-4" />,
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
      icon: <Palette className="w-4 h-4" />,
      problemStatement: "Your designs are finished, but mockups all look the same.",
      bullets: [
        "Clients struggle to visualize the final result",
        "Flat mockups don't show how the product really looks",
        'Feedback becomes uncertain: "Is this design actually good?"',
      ],
      closingLines: [
        "Stop paying $20–$50 for a single mockup.",
        "Create realistic model mockups in minutes with AI Model Studio. You can even sell your own mockups by placing blank white products on AI models.",
      ],
    },
  ];

  return (
    <section className="mb-16 md:mb-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-xs md:text-sm font-mono text-orange-400 tracking-wide">
            THE PROBLEM
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
          Sound familiar?
        </h2>
      </motion.div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {problemCards.map((card, index) => (
          <ProblemCard key={index} {...card} delay={index * 0.15} />
        ))}
      </div>
    </section>
  );
};

export default ProblemBlock;
