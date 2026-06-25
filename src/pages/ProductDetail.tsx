import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Footer from "@/components/Footer";
import PayPalProvider from "@/components/PayPalProvider";
import CheckoutModal from "@/components/products/CheckoutModal";
import LandingBlocks from "@/components/products/LandingBlocks";
import { useProduct, useResolvedImage } from "@/hooks/useProducts";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProduct(slug);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cover = useResolvedImage(product?.cover_image);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">

        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-secondary/50 rounded" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-secondary/50 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-secondary/50 rounded" />
                <div className="h-4 w-full bg-secondary/50 rounded" />
                <div className="h-12 w-40 bg-secondary/50 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-dvh bg-background">

        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Product not found</h1>
          <Link to="/products" className="text-primary font-mono">← Back to products</Link>
        </div>
      </div>
    );
  }

  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <PayPalProvider>
      <div className="min-h-dvh bg-background">


        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> All products
            </Link>

            {/* Buy section */}
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 glass-card p-2"
              >
                {cover && (
                  <img src={cover} alt={product.title} className="w-full h-full object-cover rounded-xl" />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col justify-center"
              >
                {product.tagline && (
                  <span className="inline-block w-fit px-3 py-1 mb-4 text-[10px] font-mono uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                    {product.tagline}
                  </span>
                )}
                <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">{product.title}</h1>
                {product.description && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
                )}

                <div className="flex items-baseline gap-3 mb-6">
                  {hasDiscount && (
                    <span className="text-xl text-muted-foreground line-through font-mono">
                      ${product.original_price}
                    </span>
                  )}
                  <span className="text-4xl font-bold font-mono text-primary">${product.price}</span>
                </div>

                {product.features?.length > 0 && (
                  <ul className="space-y-2 mb-8">
                    {product.features.map((f, i) => (
                      <li key={i} className="text-sm font-mono text-foreground/80 flex gap-2">
                        <span className="text-primary">→</span>
                        <span>
                          <strong className="text-foreground">{f.title}</strong>
                          {f.description ? ` — ${f.description}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-bold uppercase tracking-wider hover:opacity-90 transition w-full md:w-auto"
                >
                  <ShoppingBag className="w-5 h-5" /> Buy now — ${product.price}
                </button>
                <p className="text-xs text-muted-foreground mt-3 font-mono">
                  Instant access · Secure checkout via PayPal
                </p>
              </motion.div>
            </div>

            {/* Landing content below */}
            <LandingBlocks blocks={product.landing_content} />
          </div>
        </main>

        <Footer />

        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          productName={product.title}
          price={product.price}
        />
      </div>
    </PayPalProvider>
  );
};

export default ProductDetail;