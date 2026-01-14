import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const problemBullets = [
  "Product is ready, but photos won't be ready for days (waiting for photoshoot).",
  "One model looked great, others didn't fit the brand vibe.",
  "Result: mediocre uploads → traffic happens → conversions lag.",
];

const ProblemBlock = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="mb-16 md:mb-24"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Problem Headline */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
          <AlertCircle className="w-4 h-4 text-orange-400" />
          <span className="text-xs md:text-sm font-mono text-orange-400 tracking-wide">
            THE PROBLEM
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground leading-tight mb-6">
          You can have a great product… but still lose at first scroll.
        </h2>

        {/* Problem Bullets */}
        <div className="space-y-4 mb-8">
          {problemBullets.map((bullet, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-3 text-left max-w-xl mx-auto"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mt-0.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
              </span>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {bullet}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          <p className="relative py-4 px-6 text-base md:text-lg text-foreground font-medium">
            <span className="text-primary">AI Model Studio</span> is built for
            one thing: get your best-looking photos published{" "}
            <span className="underline decoration-primary/50 underline-offset-4">
              today
            </span>
            —not later.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProblemBlock;
