import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Sparkles, Play, RefreshCw, Infinity as InfinityIcon, Zap, Star } from "lucide-react";
import Footer from "@/components/Footer";
import PayPalProvider from "@/components/PayPalProvider";
import CheckoutModal from "@/components/products/CheckoutModal";
import LandingBlocks from "@/components/products/LandingBlocks";
import { useProduct, useProducts, useResolvedImage, resolveImageUrl, type Product } from "@/hooks/useProducts";
import { AnimatePresence } from "framer-motion";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading } = useProduct(slug);
  const { products: allProducts } = useProducts();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    setShowStickyCTA(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    const onScroll = () => setShowStickyCTA(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      setShowStickyCTA(false);
    };
  }, [slug]);

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

            <div className="relative rounded-3xl border border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/40 backdrop-blur-xl p-5 md:p-8 lg:p-10 overflow-hidden">
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.15] hero-grid-overlay" />
              <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative">
                <ProductHero product={product} onBuy={() => setCheckoutOpen(true)} />
              </div>
            </div>

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

        {/* Mobile sticky glass CTA */}
        <AnimatePresence>
          {product && showStickyCTA && (
            <motion.div
              key="sticky-cta"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="md:hidden fixed left-3 right-3 bottom-3 z-40"
            >
              <div className="navbar-pill menu-rotating-glow rounded-2xl px-3 py-2.5 flex items-center gap-3">
                <div className="flex flex-col leading-tight min-w-0 flex-1 pl-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground truncate">
                    {product.title}
                  </span>
                  <span className="font-mono font-bold text-base text-primary">
                    ${product.price}
                    {product.original_price && product.original_price > product.price && (
                      <span className="ml-2 text-[11px] text-muted-foreground line-through font-normal">
                        ${product.original_price}
                      </span>
                    )}
                  </span>
                </div>
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground font-display font-bold uppercase tracking-wider text-xs shadow-[0_6px_24px_-8px_hsl(var(--primary)/0.7)]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    <section className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 items-start">
      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3 lg:sticky lg:top-28"
      >
        <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden border border-border/60 bg-card/40">
          <span aria-hidden className="absolute top-3 left-3 z-10 text-[10px] font-mono tracking-widest text-muted-foreground/70">
            SYS_REV_02 // COMP_01
          </span>
          <span aria-hidden className="absolute bottom-3 right-3 z-10 text-[10px] font-mono tracking-widest text-muted-foreground/70">
            SCALE_1.0_PRO
          </span>
          <div className="w-full h-full bg-secondary/40 grid place-items-center">
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
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
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
        {/* Meta row: badge + rating */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/30 rounded-full">
            <Sparkles className="w-3 h-3" /> Just released
          </span>
          <div className="inline-flex items-center gap-1.5">
            <div className="flex text-primary" aria-label="Rated 4.9 out of 5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-mono font-bold">4.9</span>
            <a href="#reviews" className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
              (200 reviews)
            </a>
          </div>
        </div>

        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-3">
          {product.title}
        </h1>

        {product.tagline && (
          <p className="text-sm md:text-base text-primary font-bold mb-4 border-l-2 border-primary pl-3 font-display">
            {product.tagline}
          </p>
        )}
        {product.description && (
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6 font-mono max-w-xl">
            {product.description}
          </p>
        )}

        {/* License card */}
        <div className="mb-5">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2.5">
            Choose Your License
          </p>
          <div className="relative rounded-full border-2 border-primary bg-primary/[0.06] py-3 pl-4 pr-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-5 h-5 shrink-0 rounded-full border-2 border-primary grid place-items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              </span>
              <div className="min-w-0">
                <span className="block font-display font-bold text-sm md:text-base leading-tight">Lifetime License</span>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5 truncate">
                  Free updates · Unlimited dev
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              {hasDiscount && (
                <span className="block text-[11px] text-muted-foreground line-through font-mono">
                  ${product.original_price}
                </span>
              )}
              <span className="block text-lg md:text-xl font-bold font-mono text-primary leading-none">
                ${product.price}
              </span>
            </div>
          </div>
          {hasDiscount && (
            <span className="inline-block mt-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/30">
              -{discountPct}% OFF
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={onBuy}
          className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-primary text-primary-foreground font-display font-extrabold uppercase tracking-[0.2em] text-xs md:text-sm shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.9)] hover:bg-primary/90 active:scale-[0.99] transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to cart</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </button>

        <a
          href="#demo"
          className="mt-2.5 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-card/40 backdrop-blur font-display font-bold uppercase tracking-[0.2em] text-[11px] hover:border-primary/50 hover:bg-card/70 transition"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> View Live Demo
        </a>

        <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-3 gap-2">
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
    <div className="rounded-sm border border-border bg-card/30 backdrop-blur p-3 space-y-1.5">
      <div className="flex items-center gap-1.5 text-primary">
        <span aria-hidden className="w-1 h-1 rounded-full bg-primary shrink-0" />
        {icon}
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground font-bold truncate">{title}</span>
      </div>
      <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-snug font-mono">{desc}</p>
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