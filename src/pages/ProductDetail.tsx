import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Sparkles, Play, RefreshCw, Infinity as InfinityIcon, Zap, Check } from "lucide-react";
import Footer from "@/components/Footer";
import PayPalProvider from "@/components/PayPalProvider";
import CheckoutModal from "@/components/products/CheckoutModal";
import LandingBlocks from "@/components/products/LandingBlocks";
import { useProduct, useProducts, useResolvedImage, resolveImageUrl, type Product } from "@/hooks/useProducts";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProduct(slug);
  const { products: allProducts } = useProducts();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background">
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="animate-pulse grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-secondary/40 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-6 w-32 bg-secondary/40 rounded-full" />
              <div className="h-12 w-3/4 bg-secondary/40 rounded" />
              <div className="h-4 w-full bg-secondary/40 rounded" />
              <div className="h-24 w-full bg-secondary/40 rounded-2xl" />
              <div className="h-14 w-full bg-secondary/40 rounded-full" />
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

  const related = allProducts.filter((p) => p.slug !== product.slug).slice(0, 2);

  return (
    <PayPalProvider>
      <div className="min-h-dvh bg-background relative overflow-hidden">
        {/* Ambient gradient bg */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute inset-0 hero-grid-overlay opacity-[0.18]" />
        </div>

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> All products
            </Link>

            <ProductHero product={product} onBuy={() => setCheckoutOpen(true)} />

            {related.length > 0 && (
              <RelatedProducts items={related} />
            )}

            {/* Landing content below */}
            <div className="mt-24">
              <LandingBlocks blocks={product.landing_content} />
            </div>
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

/* ------------------------------- Hero ------------------------------- */

function ProductHero({ product, onBuy }: { product: Product; onBuy: () => void }) {
  const allImages = [product.cover_image, ...(product.gallery ?? [])].filter(Boolean) as string[];
  const [activeRaw, setActiveRaw] = useState<string | null>(allImages[0] ?? null);
  const active = useResolvedImage(activeRaw);

  useEffect(() => {
    setActiveRaw(allImages[0] ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / (product.original_price as number)) * 100)
    : 0;

  return (
    <section className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14 items-start">
      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <div className="relative aspect-square rounded-3xl overflow-hidden glass-card p-2">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-secondary/40 grid place-items-center">
            {active && (
              <motion.img
                key={active}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                src={active}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {allImages.length > 1 && (
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {allImages.map((img, i) => (
              <Thumb key={img + i} src={img} active={img === activeRaw} onClick={() => setActiveRaw(img)} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:pt-2"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 text-[11px] font-mono uppercase tracking-widest bg-primary/10 text-primary border border-primary/30 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Just released
        </span>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] mb-5">
          {product.title}
        </h1>

        {product.tagline && (
          <p className="text-lg md:text-xl text-foreground/90 mb-4 font-display">{product.tagline}</p>
        )}
        {product.description && (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 font-mono">
            {product.description}
          </p>
        )}

        {/* License card */}
        <div className="mb-5">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Choose your license type
          </p>
          <div className="relative rounded-2xl border-2 border-primary/60 bg-primary/[0.04] p-5 flex items-center justify-between gap-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <Check className="w-4 h-4" strokeWidth={3} />
              </span>
              <span className="font-display font-bold text-lg">Lifetime</span>
            </div>
            <div className="relative flex items-center gap-3">
              {hasDiscount && (
                <span className="text-base text-muted-foreground line-through font-mono">
                  ${product.original_price}
                </span>
              )}
              <span className="text-2xl md:text-3xl font-bold font-mono text-primary">
                ${product.price}
              </span>
              {hasDiscount && (
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-destructive/15 text-destructive">
                  -{discountPct}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onBuy}
          className="group relative w-full inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground font-display font-bold uppercase tracking-wider text-base shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] hover:shadow-[0_15px_50px_-10px_hsl(var(--primary)/0.8)] transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Add to cart</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </button>

        <a
          href="#demo"
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border bg-card/40 backdrop-blur font-display font-bold uppercase tracking-wider text-sm hover:bg-card/70 transition"
        >
          <Play className="w-4 h-4 fill-current" /> View Demo
        </a>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <TrustBadge icon={<RefreshCw className="w-4 h-4" />} title="Free updates" desc="Every update, on the house." />
          <TrustBadge icon={<InfinityIcon className="w-4 h-4" />} title="No subscription" desc="Pay once, lifetime access." />
          <TrustBadge icon={<Zap className="w-4 h-4" />} title="Instant delivery" desc="Download right after purchase." />
        </div>
      </motion.div>
    </section>
  );
}

function Thumb({ src, active, onClick }: { src: string; active: boolean; onClick: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    resolveImageUrl(src).then((u) => !cancelled && setUrl(u));
    return () => {
      cancelled = true;
    };
  }, [src]);
  return (
    <button
      onClick={onClick}
      aria-label="Show image"
      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
        active ? "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]" : "border-border/60 hover:border-primary/50"
      }`}
    >
      {url && <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />}
    </button>
  );
}

function TrustBadge({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/40 backdrop-blur p-3">
      <div className="flex items-center gap-2 text-primary mb-1">
        {icon}
        <span className="text-[11px] font-mono uppercase tracking-widest text-foreground font-bold">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
    </div>
  );
}

/* --------------------------- Related products --------------------------- */

function RelatedProducts({ items }: { items: Product[] }) {
  return (
    <section className="mt-24">
      <h2 className="font-display text-xl font-bold uppercase tracking-wider mb-5">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {items.map((p) => (
          <RelatedCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const cover = useResolvedImage(product.cover_image);
  const hasDiscount = product.original_price && product.original_price > product.price;
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block rounded-2xl overflow-hidden glass-card hover:border-primary/40 transition"
    >
      <div className="aspect-[4/3] overflow-hidden bg-secondary/40">
        {cover && (
          <img
            src={cover}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-5 flex items-center justify-between gap-3">
        <h3 className="font-display font-bold text-base md:text-lg">{product.title}</h3>
        <div className="flex items-baseline gap-2 font-mono">
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">${product.original_price}</span>
          )}
          <span className="text-base font-bold text-primary">${product.price}</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductDetail;