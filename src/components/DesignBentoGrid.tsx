import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { DesignItem } from "@/hooks/useDesignPortfolio";

interface DesignBentoGridProps {
  designs: DesignItem[];
  isLoading?: boolean;
}

const DesignBentoGrid = ({ designs, isLoading }: DesignBentoGridProps) => {
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);

  if (isLoading) {
    return (
      <div className="bento-grid">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`${i === 0 ? 'col-span-2 row-span-2' : i === 3 ? 'col-span-2' : ''} bg-muted/20 rounded-xl animate-pulse`}
            style={{ minHeight: '200px' }}
          />
        ))}
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="font-mono text-muted-foreground">
          No designs in this category yet. Coming soon!
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="bento-grid">
        <AnimatePresence mode="popLayout">
          {designs.map((design) => (
            <motion.button
              key={design.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => setSelectedDesign(design)}
              className="group relative overflow-hidden rounded-xl glass-card text-left"
            >
              <img
                src={design.image_url}
                alt={design.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                <p className="font-mono text-xs uppercase tracking-wider text-foreground">
                  {design.title}
                </p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
            onClick={() => setSelectedDesign(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedDesign(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors"
              >
                <X size={20} />
              </button>

              <img
                src={selectedDesign.image_url}
                alt={selectedDesign.title}
                className="w-full max-h-[70vh] object-contain bg-muted/10"
              />

              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 rounded-full mb-3">
                  {selectedDesign.category}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">
                  {selectedDesign.title}
                </h2>
                {selectedDesign.description && (
                  <p className="font-mono text-sm text-muted-foreground">
                    {selectedDesign.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DesignBentoGrid;
