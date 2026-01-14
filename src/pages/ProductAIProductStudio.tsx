import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronRight, Zap, Camera, Clock, Sparkles, Star, Pen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BundleOfferModal from "@/components/products/BundleOfferModal";
import CheckoutModal from "@/components/products/CheckoutModal";
import PayPalProvider from "@/components/PayPalProvider";
import ProductMarquee from "@/components/products/ProductMarquee";
import ProductVelocityText from "@/components/products/ProductVelocityText";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Import portfolio images
import modelAlleyStreetwear from "@/assets/portfolio/model-alley-streetwear.png";
import modelTracksuitConcrete from "@/assets/portfolio/model-tracksuit-concrete.png";
import modelSilverBasquiat from "@/assets/portfolio/model-silver-basquiat.png";
import modelRooftopHoodie from "@/assets/portfolio/model-rooftop-hoodie.png";
import modelSkateparkPuffer from "@/assets/portfolio/model-skatepark-puffer.png";
import modelStudioFisheye from "@/assets/portfolio/model-studio-fisheye.png";
import modelLibraryGrunge from "@/assets/portfolio/model-library-grunge.png";
import modelStudioPatches from "@/assets/portfolio/model-studio-patches.png";
import modelStairsTechwear from "@/assets/portfolio/model-stairs-techwear.png";
import modelLoungingHelmet from "@/assets/portfolio/model-lounging-helmet.jpg";

// Customer showcase data (without username)
const customerShowcase = [
  { src: modelAlleyStreetwear, caption: "bro this AI is lowkey insane saved my whole budget fr fr", profileInitials: "BM", profileColor: "bg-green-500" },
  { src: modelTracksuitConcrete, caption: "no cap, my sales went UP after using these pics. W tool", profileInitials: "JT", profileColor: "bg-blue-500" },
  { src: modelSilverBasquiat, caption: "finally some AI that actually gets streetwear aesthetics", profileInitials: "DR", profileColor: "bg-purple-500" },
  { src: modelRooftopHoodie, caption: "used this for my drop and it went crazy. 10/10 would recommend", profileInitials: "AK", profileColor: "bg-pink-500" },
  { src: modelSkateparkPuffer, caption: "the vibes are immaculate ngl. my brand looks so professional now", profileInitials: "MW", profileColor: "bg-orange-500" },
  { src: modelStudioFisheye, caption: "saved me so much money on photoshoots. this is the future fr", profileInitials: "ZP", profileColor: "bg-teal-500" },
];

// Reviews data with mixed 4 and 5 star ratings
const reviewsColumn1 = [
  { id: 1, name: "Brandon M.", initials: "BM", rating: 5, content: "bro this AI is lowkey insane 🔥 saved my whole budget fr fr. my product photos look professional af now", avatarColor: "bg-green-500" },
  { id: 2, name: "Jasmine T.", initials: "JT", rating: 4, content: "no cap, my sales went UP after using these pics. W tool. the quality is chef's kiss", avatarColor: "bg-blue-500" },
  { id: 3, name: "Devon R.", initials: "DR", rating: 5, content: "finally some AI that actually gets product aesthetics. been looking for this FOREVER", avatarColor: "bg-purple-500" },
  { id: 4, name: "Aaliyah K.", initials: "AK", rating: 4, content: "used this for my drop and it went crazy. 10/10 would recommend to any brand owner", avatarColor: "bg-pink-500" },
  { id: 5, name: "Marcus W.", initials: "MW", rating: 5, content: "the vibes are immaculate ngl. my brand looks so professional now. customers love it", avatarColor: "bg-orange-500" },
];

const reviewsColumn2 = [
  { id: 6, name: "Zara P.", initials: "ZP", rating: 5, content: "saved me so much money on photoshoots. this is the future fr. cant believe I was paying photographers before", avatarColor: "bg-teal-500" },
  { id: 7, name: "Tyler J.", initials: "TJ", rating: 4, content: "ok but why is this so good??? my whole feed is about to be different. straight fire", avatarColor: "bg-indigo-500" },
  { id: 8, name: "Kira L.", initials: "KL", rating: 5, content: "this tool understood the assignment. my products never looked this good.", avatarColor: "bg-red-500" },
  { id: 9, name: "Andre S.", initials: "AS", rating: 4, content: "been in e-commerce for 5 years and this is a game changer. not even exaggerating rn", avatarColor: "bg-yellow-500" },
  { id: 10, name: "Nina C.", initials: "NC", rating: 5, content: "the way this captured my product aesthetic... im shook. literally perfect every time", avatarColor: "bg-cyan-500" },
];

const reviewsColumn3 = [
  { id: 11, name: "Jordan F.", initials: "JF", rating: 5, content: "just dropped my collection with these visuals and its getting crazy engagement. thank u sm", avatarColor: "bg-emerald-500" },
  { id: 12, name: "Destiny H.", initials: "DH", rating: 4, content: "idk how but this AI gets it. every shot is exactly what I envisioned for my brand", avatarColor: "bg-violet-500" },
  { id: 13, name: "Chris B.", initials: "CB", rating: 5, content: "went from amateur product pics to pro level instantly. my competitors are shaking rn", avatarColor: "bg-rose-500" },
  { id: 14, name: "Layla N.", initials: "LN", rating: 4, content: "the versatility is unmatched. studio shots, lifestyle shots, this tool does it all", avatarColor: "bg-amber-500" },
  { id: 15, name: "Malik G.", initials: "MG", rating: 5, content: "finally a tool that matches my creative vision. my brand identity is SO cohesive now", avatarColor: "bg-lime-500" },
];

const campaignModes = [
  {
    title: "Clean Catalog",
    description: "Studio white, minimal styling",
    image: modelStudioPatches,
  },
  {
    title: "Campaign",
    description: "Creative lighting, premium feel",
    image: modelStairsTechwear,
  },
  {
    title: "Concept Campaign",
    description: "Bold concepts, campaign-style",
    image: modelLoungingHelmet,
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
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [userReviews, setUserReviews] = useState<Array<{
    id: number;
    name: string;
    initials: string;
    rating: number;
    content: string;
    avatarColor: string;
  }>>([]);
  const [checkoutProduct, setCheckoutProduct] = useState<{
    name: string;
    price: number;
    isBundle: boolean;
  } | null>(null);

  const examplesRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

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

  const handleSubmitReview = () => {
    if (reviewRating >= 4 && reviewName.trim() && reviewContent.trim()) {
      const newReview = {
        id: Date.now(),
        name: reviewName,
        initials: reviewName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        rating: reviewRating,
        content: reviewContent,
        avatarColor: "bg-primary",
      };
      setUserReviews(prev => [newReview, ...prev]);
      toast({
        title: "Review submitted! 🎉",
        description: "Thanks for sharing your experience!",
      });
    } else if (reviewRating < 4) {
      toast({
        title: "Thanks for your feedback!",
        description: "We appreciate your honest review and will work to improve.",
      });
    } else {
      toast({
        title: "Please fill in all fields",
        description: "Name and review content are required.",
        variant: "destructive",
      });
      return;
    }
    setShowReviewDialog(false);
    setReviewName("");
    setReviewContent("");
    setReviewRating(5);
  };

  // Combine user reviews with existing reviews for display
  const displayReviews1 = [...userReviews, ...reviewsColumn1];

  return (
    <PayPalProvider>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* HERO SECTION - FOMO Style */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={modelSilverBasquiat}
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

        {/* CUSTOMER SHOWCASE */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-mono mb-4">
                REAL RESULTS
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Customer Showcase
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto">
              {customerShowcase.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.src}
                    alt={`Customer showcase ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 md:gap-3">
                      <p className="text-xs md:text-sm text-foreground font-medium flex-1 line-clamp-2">
                        "{item.caption}"
                      </p>
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${item.profileColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {item.profileInitials}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS - Vertical Marquee */}
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-12"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-mono mb-4">
                ⭐ 4.8/5 RATING
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                What Customers Say
              </h2>
              <Button
                onClick={() => setShowReviewDialog(true)}
                variant="outline"
                className="gap-2"
              >
                <Pen className="w-4 h-4" />
                Write A Review
              </Button>
            </motion.div>

            {/* Vertical Marquee Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto h-[400px] md:h-[600px] overflow-hidden">
              {/* Column 1 */}
              <div className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-secondary to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary to-transparent z-10 pointer-events-none" />
                <div 
                  className="animate-marquee-vertical hover:[animation-play-state:paused] space-y-3 md:space-y-4"
                  style={{ animationDuration: "30s" }}
                >
                  {[...displayReviews1, ...displayReviews1].map((review, index) => (
                    <div
                      key={`${review.id}-${index}`}
                      className="glass-card p-3 md:p-4 space-y-2 md:space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-xs md:text-sm`}>
                          {review.initials}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-sm">{review.name}</span>
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-muted-foreground" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2 */}
              <div className="relative overflow-hidden hidden md:block">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-secondary to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary to-transparent z-10 pointer-events-none" />
                <div 
                  className="animate-marquee-vertical hover:[animation-play-state:paused] space-y-4"
                  style={{ animationDuration: "25s", animationDirection: "reverse" }}
                >
                  {[...reviewsColumn2, ...reviewsColumn2].map((review, index) => (
                    <div
                      key={`${review.id}-${index}`}
                      className="glass-card p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                          {review.initials}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-sm">{review.name}</span>
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-muted-foreground" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3 */}
              <div className="relative overflow-hidden hidden md:block">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-secondary to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary to-transparent z-10 pointer-events-none" />
                <div 
                  className="animate-marquee-vertical hover:[animation-play-state:paused] space-y-4"
                  style={{ animationDuration: "35s" }}
                >
                  {[...reviewsColumn3, ...reviewsColumn3].map((review, index) => (
                    <div
                      key={`${review.id}-${index}`}
                      className="glass-card p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                          {review.initials}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-sm">{review.name}</span>
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-muted-foreground" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

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
                    src={modelLibraryGrunge}
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
                    src={modelStudioFisheye}
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
              className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border p-4"
            >
              <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="hidden sm:block">
                  <p className="font-bold">AI Product Studio</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="line-through">$100</span>{" "}
                    <span className="text-primary font-bold">$70</span>
                  </p>
                </div>
                <button
                  onClick={handleBuyClick}
                  className="flex-1 sm:flex-none px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-lg hover:opacity-90 transition-all"
                >
                  GET INSTANT ACCESS →
                </button>
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
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          productName={checkoutProduct?.name || "AI Product Studio"}
          price={checkoutProduct?.price || 70}
          isBundle={checkoutProduct?.isBundle}
        />

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Name</label>
                <Input
                  placeholder="Enter your name"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewRating
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Your Review</label>
                <Textarea
                  placeholder="Share your experience..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitReview} className="w-full">
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PayPalProvider>
  );
};

export default ProductAIProductStudio;
