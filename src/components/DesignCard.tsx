import { motion } from "framer-motion";
import type { DesignItem } from "@/hooks/useDesignPortfolio";

interface DesignCardProps {
  design: DesignItem;
  onClick?: () => void;
}

const sizeClasses: Record<string, string> = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 row-span-1",
  large: "col-span-2 row-span-2",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
};

const DesignCard = ({ design, onClick }: DesignCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.01 }}
      className={`${sizeClasses[design.size]} relative group cursor-pointer overflow-hidden rounded-xl bg-card border border-border`}
      onClick={onClick}
    >
      {/* Image */}
      <img
        src={design.image_url}
        alt={design.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 rounded-full mb-2">
          {design.category}
        </span>
        <h3 className="font-display text-lg font-bold uppercase tracking-wide text-foreground">
          {design.title}
        </h3>
        {design.description && (
          <p className="font-mono text-xs text-muted-foreground mt-1 line-clamp-2">
            {design.description}
          </p>
        )}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 30px hsl(var(--primary) / 0.2)"
        }}
      />
    </motion.div>
  );
};

export default DesignCard;
