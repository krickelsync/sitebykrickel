import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  href: string;
  index: number;
}

const ProductCard = ({
  title,
  description,
  price,
  originalPrice,
  image,
  href,
  index,
}: ProductCardProps) => {
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={href}>
        <div className="glass-card overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-mono font-bold">
                SAVE ${originalPrice - price}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <h3 className="font-display text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-3">
              {hasDiscount && (
                <span className="text-muted-foreground line-through font-mono">
                  ${originalPrice}
                </span>
              )}
              <span className="text-2xl font-bold font-mono text-primary">
                ${price}
              </span>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground group-hover:text-primary transition-colors">
              <span>View Product</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
