import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import ProductCard from "@/components/products/ProductCard";
import { useProducts, useResolvedImage, type Product } from "@/hooks/useProducts";
import { H1, Body, Eyebrow, spacing } from "@/components/ui/typography";

const ProductCardWrapper = ({ product, index }: { product: Product; index: number }) => {
  const image = useResolvedImage(product.cover_image);
  return (
    <ProductCard
      title={product.title}
      description={product.description ?? ""}
      price={product.price}
      originalPrice={product.original_price ?? undefined}
      image={image ?? "/placeholder.svg"}
      href={`/products/${product.slug}`}
      index={index}
    />
  );
};

const Products = () => {
  const { products, loading } = useProducts();
  return (
    <div className="min-h-dvh bg-background">


      <main className={`pt-32 ${spacing.sectionY}`}>
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-center max-w-3xl mx-auto ${spacing.headingGap} md:mb-16`}
          >
            <Eyebrow
              as={motion.span}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 mb-6 bg-primary/10 text-primary border border-primary/30 rounded-full"
            >
              Digital Products
            </Eyebrow>
            <H1 className="mb-5">Products & Tools</H1>
            <Body className="max-w-xl mx-auto">
              Internal AI systems we use to create catalog and campaign visuals
              for brands.
            </Body>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <p className="text-center text-muted-foreground font-mono">Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground font-mono">
              New products coming soon.
            </p>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${spacing.gridGap} max-w-4xl mx-auto`}>
              {products.map((product, index) => (
                <ProductCardWrapper key={product.id} product={product} index={index} />
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
