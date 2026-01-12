import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronRight, Zap, Camera, Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BundleOfferModal from "@/components/products/BundleOfferModal";
import CheckoutModal from "@/components/products/CheckoutModal";
import PayPalProvider from "@/components/PayPalProvider";
import ProductMarquee from "@/components/products/ProductMarquee";
import ProductVelocityText from "@/components/products/ProductVelocityText";

const campaignModes = [
  {
    title: "Clean Catalog",
    description: "Studio white, minimal styling",
    image: "/placeholder.svg",
  },
  {
    title: "Studio Editorial",
    description: "Creative lighting, premium feel",
    image: "/placeholder.svg",
  },
  {
    title: "Concept Campaign",
    description: "Bold concepts, campaign-style",
    image: "/placeholder.svg",
  },
];

const targetUsers = [
  "Fashion & apparel brands",
  "E-commerce stores",
  "Creative agencies",
  "Product photographers",
];

const valueCards = [
  {
    icon: Camera,
    title: "Skip $500+ per photoshoot",
    description: "No studio rental, no photographer fees",
  },
  {
    icon: Sparkles,
    title: "Get 100+ variations",
    description: "Unlimited creative possibilities instantly",
  },
  {
    icon: Clock,
    title: "Campaign-ready in minutes",
    description: "From upload to publish in no time",
  },
  {
    icon: Zap,
    title: "No photographer needed",
    description: "AI handles everything for you",
  },
];

const ProductAIProductStudio = () => {
  const [showBundleOffer, setShowBundleOffer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{
    name: string;
    price: number;
    isBundle: boolean;
  } | null>(null);

  const examplesRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Track scroll position for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
        setShowStickyCTA(window.scrollY > heroBottom);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToExamples = () => {
    examplesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBuyClick = () => {
    const hasSeenOffer = sessionStorage.getItem("bundleOfferSeen");
    if (!hasSeenOffer) {
      sessionStorage.setItem("bundleOfferSeen", "true");
      setShowBundleOffer(true);
    } else {
      setCheckoutProduct({
        name: "AI Product Studio",
        price: 70,
        isBundle: false,
      });
      setShowCheckout(true);
    }
  };

  const handleAcceptBundle = () => {
    setShowBundleOffer(false);
    setCheckoutProduct({
      name: "AI Product Studio + AI Model Studio",
      price: 100,
      isBundle: true,
    });
    setShowCheckout(true);
  };

  const handleDeclineBundle = () => {
    setShowBundleOffer(false);
    setCheckoutProduct({
      name: "AI Product Studio",
      price: 70,
      isBundle: false,
    });
    setShowCheckout(true);
  };

  return (
    <PayPalProvider>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* HERO SECTION - FOMO Style */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/placeholder.svg"
              alt="Campaign visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-5xl mx-auto space-y-8"
            >
              {/* LIMITED TIME Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-block px-4 py-2 bg-destructive/20 text-destructive rounded-full text-sm font-mono font-bold animate-pulse"
              >
                🔥 LIMITED TIME: 30% OFF
              </motion.span>

              {/* Main Headline */}
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                STOP WASTING $$$
                <br />
                <span className="text-primary">ON PHOTOSHOOTS.</span>
                <br />
                AI DOES IT BETTER.
              </h1>

              {/* Social Proof */}
              <p className="text-sm font-mono text-muted-foreground tracking-wider">
                ✦ TRUSTED BY 500+ BRANDS ✦
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <motion.button
                  onClick={handleBuyClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary text-primary-foreground font-mono font-bold rounded-xl text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                >
                  GET INSTANT ACCESS → $70
                </motion.button>
              </div>

              {/* Scroll CTA */}
              <motion.button
                onClick={scrollToExamples}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mt-8"
              >
                See the magic
                <motion.span
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowDown className="w-4 h-4" />
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* MARQUEE */}
        <ProductMarquee />

        {/* BEFORE / AFTER SECTION */}
        <section ref={examplesRef} className="py-32 bg-background">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-mono mb-4">
                $2,000+ WORTH OF PHOTOSHOOT → JUST $70
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                The Transformation
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {/* Before */}
              <div className="space-y-4">
                <p className="text-sm font-mono text-destructive uppercase tracking-wider flex items-center gap-2">
                  ❌ THE OLD WAY
                </p>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary/30 border border-destructive/20">
                  <img
                    src="/placeholder.svg"
                    alt="Raw product"
                    className="w-full h-full object-cover opacity-60 grayscale"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Hire photographer, rent studio, wait weeks, spend $2,000+
                </p>
              </div>

              {/* After */}
              <div className="space-y-4">
                <p className="text-sm font-mono text-primary uppercase tracking-wider flex items-center gap-2">
                  ✅ THE NEW WAY
                </p>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary/30 ring-2 ring-primary/30 shadow-lg shadow-primary/10">
                  <img
                    src="/placeholder.svg"
                    alt="AI generated campaign"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-foreground font-medium">
                  Upload. Generate. Done in minutes. Just $70.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* VELOCITY TEXT */}
        <ProductVelocityText />

        {/* VALUE PROPOSITION CARDS */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {valueCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 text-center space-y-3 hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <card.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONCEPT SECTION - Why Brands Use This */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center space-y-8"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Why brands use this
              </h2>
              <div className="w-16 h-px bg-primary mx-auto" />
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Skip the traditional photoshoot. AI Product Studio transforms raw
                product photos into polished, campaign-ready visuals in minutes—giving
                you creative freedom at a fraction of the cost.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CAMPAIGN MODES */}
        <section className="py-32 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-center mb-16"
            >
              Campaign Modes
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {campaignModes.map((mode, index) => (
                <motion.div
                  key={mode.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={mode.image}
                    alt={mode.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl font-bold mb-1">
                      {mode.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {mode.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
                Built for
              </h2>
              <ul className="space-y-4">
                {targetUsers.map((user, index) => (
                  <motion.li
                    key={user}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-center gap-3 text-lg text-muted-foreground"
                  >
                    <ChevronRight className="w-4 h-4 text-primary" />
                    {user}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* PRICE SECTION - FOMO Style */}
        <section className="py-32 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-lg mx-auto"
            >
              {/* Pricing Card with Glow */}
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-3xl" />
                
                {/* Card */}
                <div className="relative glass-card p-10 text-center space-y-6 border-primary/30">
                  {/* PROMO Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-2 bg-destructive text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                      🔥 PROMO ENDS SOON!
                    </span>
                  </div>

                  <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider pt-4">
                    One-time access
                  </p>

                  {/* Price with SAVE badge */}
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-2xl text-muted-foreground line-through font-mono">
                      $100
                    </span>
                    <span className="text-5xl md:text-6xl font-bold font-mono text-primary">
                      $70
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 text-sm font-bold rounded">
                      SAVE 30%
                    </span>
                  </div>

                  <button
                    onClick={handleBuyClick}
                    className="w-full py-4 px-8 bg-primary text-primary-foreground font-mono font-bold rounded-xl hover:opacity-90 transition-all text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  >
                    GET INSTANT ACCESS →
                  </button>

                  {/* Social Proof */}
                  <p className="text-xs text-muted-foreground font-mono">
                    ⚡ 127 people bought this week
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />

        {/* Sticky CTA Bar */}
        <AnimatePresence>
          {showStickyCTA && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border py-4 shadow-lg shadow-black/10"
            >
              <div className="container mx-auto px-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm md:text-base">AI Product Studio</span>
                  <span className="text-muted-foreground line-through text-sm">$100</span>
                  <span className="text-xl md:text-2xl font-bold text-primary font-mono">$70</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 bg-green-500/20 text-green-500 text-xs font-bold rounded">
                    SAVE 30%
                  </span>
                </div>
                <motion.button
                  onClick={handleBuyClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 md:px-6 py-2 md:py-3 bg-primary text-primary-foreground font-mono font-bold rounded-xl text-sm md:text-base shadow-lg shadow-primary/25"
                >
                  Get Now →
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bundle Offer Modal */}
        <BundleOfferModal
          isOpen={showBundleOffer}
          onClose={() => setShowBundleOffer(false)}
          onAcceptBundle={handleAcceptBundle}
          onDeclineBundle={handleDeclineBundle}
          originalProduct="AI Product Studio"
        />

        {/* Checkout Modal */}
        {checkoutProduct && (
          <CheckoutModal
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            productName={checkoutProduct.name}
            price={checkoutProduct.price}
            isBundle={checkoutProduct.isBundle}
          />
        )}
      </div>
    </PayPalProvider>
  );
};

export default ProductAIProductStudio;
