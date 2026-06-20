import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/products/ProductCard";

const products: Array<{
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  href: string;
}> = [];

const Products = () => {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 mb-6 text-xs font-mono uppercase tracking-wider bg-primary/10 text-primary rounded-full"
            >
              Digital Products
            </motion.span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Products & Tools
            </h1>
            <p className="text-lg text-muted-foreground font-mono">
              Internal AI systems we use to create catalog and campaign visuals
              for brands.
            </p>
          </motion.div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground font-mono">
              New products coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {products.map((product, index) => (
                <ProductCard
                  key={product.title}
                  {...product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
