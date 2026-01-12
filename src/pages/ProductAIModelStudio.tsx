import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductFeatures from "@/components/products/ProductFeatures";
import BundleOfferModal from "@/components/products/BundleOfferModal";
import CheckoutModal from "@/components/products/CheckoutModal";
import PayPalProvider from "@/components/PayPalProvider";

const features = [
  "AI fashion models",
  "Campaign and editorial poses",
  "Lookbook-style visuals",
  "Multiple pose presets",
  "Clean or campaign backgrounds",
  "Fashion brand ready visuals",
];

const ProductAIModelStudio = () => {
  const [showBundleOffer, setShowBundleOffer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{
    name: string;
    price: number;
    isBundle: boolean;
  } | null>(null);

  const handleBuyClick = () => {
    // Check if user has already seen bundle offer
    const hasSeenOffer = sessionStorage.getItem("bundleOfferSeen");
    if (!hasSeenOffer) {
      sessionStorage.setItem("bundleOfferSeen", "true");
      setShowBundleOffer(true);
    } else {
      setCheckoutProduct({
        name: "AI Model Studio",
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
      price: 160,
      isBundle: true,
    });
    setShowCheckout(true);
  };

  const handleDeclineBundle = () => {
    setShowBundleOffer(false);
    setCheckoutProduct({
      name: "AI Model Studio",
      price: 70,
      isBundle: false,
    });
    setShowCheckout(true);
  };

  return (
    <PayPalProvider>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Link>
            </motion.div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <div className="aspect-square rounded-2xl overflow-hidden glass-card">
                  <img
                    src="/placeholder.svg"
                    alt="AI Model Studio"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="order-1 lg:order-2 space-y-6"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-block px-4 py-1.5 text-xs font-mono uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                    AI Tool
                  </span>
                  <span className="inline-block px-3 py-1 text-xs font-mono font-bold bg-destructive/10 text-destructive rounded-full">
                    30% OFF
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold">
                  AI Model Studio
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Generate fashion campaign visuals without models or
                  photoshoots. Create lookbook-ready content with AI-generated
                  fashion models.
                </p>

                {/* Price */}
                <div className="py-6 border-y border-border">
                  <p className="text-sm font-mono text-muted-foreground mb-2">
                    One-time purchase
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-mono text-muted-foreground line-through">
                      $100
                    </p>
                    <p className="text-4xl font-bold font-mono text-primary">
                      $70
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handleBuyClick}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-mono font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Buy AI Model Studio
                </button>
              </motion.div>
            </div>

            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="font-display text-2xl font-bold mb-8 text-center">
                What's Included
              </h2>
              <ProductFeatures features={features} />
            </motion.div>
          </div>
        </main>

        <Footer />

        {/* Bundle Offer Modal */}
        <BundleOfferModal
          isOpen={showBundleOffer}
          onClose={() => setShowBundleOffer(false)}
          onAcceptBundle={handleAcceptBundle}
          onDeclineBundle={handleDeclineBundle}
          originalProduct="AI Model Studio"
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

export default ProductAIModelStudio;
