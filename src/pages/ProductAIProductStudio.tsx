import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BundleOfferModal from "@/components/products/BundleOfferModal";
import CheckoutModal from "@/components/products/CheckoutModal";
import PayPalProvider from "@/components/PayPalProvider";

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

const ProductAIProductStudio = () => {
  const [showBundleOffer, setShowBundleOffer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{
    name: string;
    price: number;
    isBundle: boolean;
  } | null>(null);

  const examplesRef = useRef<HTMLDivElement>(null);

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

        {/* HERO SECTION - Full Width Cinematic */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/placeholder.svg"
              alt="Campaign visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tight">
                AI Product Studio
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
                Campaign-ready product visuals without photoshoots.
              </p>

              {/* Scroll CTA */}
              <motion.button
                onClick={scrollToExamples}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors mt-12"
              >
                View examples
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

        {/* BEFORE / AFTER SECTION */}
        <section ref={examplesRef} className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {/* Before */}
              <div className="space-y-4">
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  Before
                </p>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary/30">
                  <img
                    src="/placeholder.svg"
                    alt="Raw product"
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Raw product photo</p>
              </div>

              {/* After */}
              <div className="space-y-4">
                <p className="text-sm font-mono text-primary uppercase tracking-wider">
                  After
                </p>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary/30 ring-1 ring-primary/20">
                  <img
                    src="/placeholder.svg"
                    alt="AI generated campaign"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-foreground">AI-generated campaign visual</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CONCEPT SECTION - Why Brands Use This */}
        <section className="py-32 bg-secondary/20">
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
        <section className="py-32 bg-background">
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
        <section className="py-32 bg-secondary/20">
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

        {/* PRICE SECTION */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto"
            >
              <div className="glass-card p-10 text-center space-y-6">
                <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  One-time access
                </p>

                <div className="flex items-center justify-center gap-4">
                  <span className="text-2xl text-muted-foreground line-through font-mono">
                    $100
                  </span>
                  <span className="text-5xl md:text-6xl font-bold font-mono text-primary">
                    $70
                  </span>
                </div>

                <button
                  onClick={handleBuyClick}
                  className="w-full py-4 px-8 bg-primary text-primary-foreground font-mono font-bold rounded-xl hover:opacity-90 transition-opacity text-lg"
                >
                  Use AI Product Studio
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />

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
