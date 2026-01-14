import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FinalCTAProps {
  onCtaClick: () => void;
}

const FinalCTA = ({ onCtaClick }: FinalCTAProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="relative text-center"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl" />

      <div className="relative">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
          You can wait for a photoshoot… or you can publish today.
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          If your product is ready to sell, high quality visuals shouldn't delay launch. That's one of the fastest ways to win.
        </p>
        <Button
          onClick={onCtaClick}
          size="lg"
          className="px-8 py-6 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 group"
        >
          Get Access to AI Model Studio
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
};

export default FinalCTA;
