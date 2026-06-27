import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, Sparkles, RefreshCw, Infinity as InfinityIcon, Zap, Star } from "lucide-react";
import Footer from "@/components/Footer";
import PayPalProvider from "@/components/PayPalProvider";
import CheckoutModal from "@/components/products/CheckoutModal";
import LandingBlocks from "@/components/products/LandingBlocks";
import { useProduct, useProducts, useResolvedImage, resolveImageUrl, type Product } from "@/hooks/useProducts";
import { AnimatePresence } from "framer-motion";
import { H1, H2, Tagline, Body, Eyebrow, Meta, Price, spacing } from "@/components/ui/typography";

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

            <div className="relative rounded-3xl border border-border/60 overflow-hidden p-4 sm:p-6 lg:p-10">
              {/* Prism ambient bg (like AnimatedHero) */}
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
                <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />
                <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-accent/30 blur-3xl animate-pulse-glow" />
                <div className="absolute inset-0 hero-grid-overlay opacity-30" />
              </div>
              <div className="relative z-10">
                <ProductHero product={product} onBuy={() => setCheckoutOpen(true)} />
              </div>
            </div>

            {related.length > 0 && <RelatedProducts items={related} />}

            {/* Landing content below */}
            <div className={spacing.section}>
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
          productId={product.id}
        />

        {/* Mobile sticky glass CTA */}
        <AnimatePresence>
          {showStickyCTA && (
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
    <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 md:gap-10 lg:gap-14 items-start">
      {/* Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3 min-w-0 lg:sticky lg:top-28"
      >
        <div className="relative w-full aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden border border-border/60 bg-card/40 isolate">
          <div className="absolute inset-0 bg-secondary/40 overflow-hidden">
            {active && (
              <motion.img
                key={active}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                src={active}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="eager"
              />
            )}
          </div>
        </div>

        {allImages.length > 1 && (
          <div className="grid grid-cols-6 gap-2 w-full">
            {allImages.map((img, i) => (
              <Thumb
                key={img + i}
                src={img}
                active={img === activeRaw}
                onClick={() => setActiveRaw(img)}
                index={i}
                total={allImages.length}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="min-w-0 lg:pt-2"
      >
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.18em] bg-primary/10 text-primary border border-primary/30 rounded-full">
            <Sparkles className="w-3 h-3" /> Just released
          </span>
          <div className="inline-flex items-center gap-1.5 text-[12px] md:text-[13px]" aria-label="Rated 4.9 out of 5">
            <div className="flex text-primary">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="font-mono font-semibold">4.9</span>
            <span className="font-mono text-muted-foreground">(200)</span>
          </div>
        </div>

        <H1 className="mb-5">{product.title}</H1>

        {product.tagline && (
          <Tagline className="mb-4 max-w-lg">{product.tagline}</Tagline>
        )}
        {product.description && (
          <Body className="mb-7 max-w-md">{product.description}</Body>
        )}

        {/* License card */}
        <div className="mb-5">
          <Eyebrow as="p" className="block mb-2.5">License</Eyebrow>
          <div className="relative rounded-2xl border-2 border-primary bg-primary/[0.06] py-3.5 pl-4 pr-5 flex items-center justify-between gap-4">
            {hasDiscount && (
              <span className="absolute -top-2.5 left-4 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground shadow-sm">
                -{discountPct}% OFF
              </span>
            )}
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-4 h-4 shrink-0 rounded-full border-2 border-primary grid place-items-center">
                <span className="w-2 h-2 rounded-full bg-primary" />
              </span>
              <div className="min-w-0">
                <span className="block font-display font-bold leading-tight text-sm md:text-base">
                  Lifetime License
                </span>
                <Meta as="span" className="block mt-0.5 truncate text-[11px]">
                  Free updates · Unlimited dev
                </Meta>
              </div>
            </div>
            <div className="text-right shrink-0 flex items-baseline gap-2">
              {hasDiscount && (
                <Meta as="span" className="line-through">${product.original_price}</Meta>
              )}
              <Price as="span">${product.price}</Price>
            </div>
          </div>
        </div>

        {/* CTA stack */}
        <div className="flex flex-col gap-2.5">
        <button
          onClick={onBuy}
          className="group relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-display font-extrabold uppercase tracking-[0.18em] text-xs md:text-sm shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_45px_-5px_hsl(var(--primary)/0.9)] hover:bg-primary/90 active:scale-[0.99] transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to cart</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </button>

        {/* Live demo button removed until a real demo URL exists per product. */}
        </div>

        <div className="mt-7 pt-6 border-t border-border/60 grid grid-cols-3 gap-3">
          <TrustBadge icon={<RefreshCw className="w-4 h-4" />} title="Free updates" desc="Every update, on the house." />
          <TrustBadge icon={<InfinityIcon className="w-4 h-4" />} title="No subscription" desc="Pay once, lifetime access." />
          <TrustBadge icon={<Zap className="w-4 h-4" />} title="Instant delivery" desc="Download right after purchase." />
        </div>
      </motion.div>
    </section>
  );
}

function Thumb({ src, active, onClick, index, total }: { src: string; active: boolean; onClick: () => void; index?: number; total?: number }) {
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
      type="button"
      aria-label={index != null && total != null ? `Show image ${index + 1} of ${total}` : "Show image"}
      aria-pressed={active}
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
    <div className="rounded-xl border border-border bg-card/40 backdrop-blur p-3 min-w-0 flex flex-col items-start gap-2">
      <span className="inline-flex w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center text-primary">
        {icon}
      </span>
      <span className="text-[10px] md:text-[11px] font-mono uppercase tracking-[0.06em] text-foreground font-bold leading-tight">
        {title}
      </span>
      <p className="text-[10px] md:text-[11px] text-muted-foreground leading-snug font-mono">{desc}</p>
    </div>
  );
}

/* --------------------------- Related products --------------------------- */

function RelatedProducts({ items }: { items: Product[] }) {
  return (
    <section className={spacing.section}>
      <H2 className={`text-xl ${spacing.headingGap}`}>You might also like</H2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${spacing.gridGap}`}>
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