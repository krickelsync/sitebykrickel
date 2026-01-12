import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ChevronRight, Zap, Camera, Clock, Sparkles, Users, Check, Upload, Palette, Download, MessageSquare, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BundleOfferModal from "@/components/products/BundleOfferModal";
import CheckoutModal from "@/components/products/CheckoutModal";
import PayPalProvider from "@/components/PayPalProvider";
import ProductMarquee from "@/components/products/ProductMarquee";
import ProductVelocityText from "@/components/products/ProductVelocityText";
import BeforeAfterSlider from "@/components/products/BeforeAfterSlider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Import portfolio images
import modelAlleyStreetwear from "@/assets/portfolio/model-alley-streetwear.png";
import modelTracksuitConcrete from "@/assets/portfolio/model-tracksuit-concrete.png";
import modelStairsTechwear from "@/assets/portfolio/model-stairs-techwear.png";
import modelLibraryGrunge from "@/assets/portfolio/model-library-grunge.png";
import modelRooftopHoodie from "@/assets/portfolio/model-rooftop-hoodie.png";
import modelSkateparkPuffer from "@/assets/portfolio/model-skatepark-puffer.png";
import modelStudioPatches from "@/assets/portfolio/model-studio-patches.png";
import modelSilverBasquiat from "@/assets/portfolio/model-silver-basquiat.png";
import modelLoungingHelmet from "@/assets/portfolio/model-lounging-helmet.jpg";
import modelStudioFisheye from "@/assets/portfolio/model-studio-fisheye.png";

// Customer showcase with slang American captions
const customerShowcase = [
  { src: modelAlleyStreetwear, customerName: "@drip.collective", caption: "bro this AI is lowkey insane 🔥 saved my whole budget fr fr" },
  { src: modelTracksuitConcrete, customerName: "@urban.threads.co", caption: "no cap, my sales went UP after using these pics. W tool 💯" },
  { src: modelStairsTechwear, customerName: "@techwear.labs", caption: "the vibes are immaculate. customers think we hired real models lmaooo" },
  { src: modelLibraryGrunge, customerName: "@grunge.szn", caption: "this hits different. whole lookbook done in a day 🤯" },
  { src: modelRooftopHoodie, customerName: "@elevated.fits", caption: "deadass thought it was a real photoshoot. AI be wilding" },
  { src: modelSkateparkPuffer, customerName: "@skate.drip.official", caption: "aight whoever made this deserves a raise fr 🙌" },
  { src: modelStudioPatches, customerName: "@patch.works.co", caption: "we're cooked (in a good way). this changed the game ngl" },
  { src: modelSilverBasquiat, customerName: "@basquiat.vintage", caption: "its giving high fashion but make it affordable 💀✨" },
  { src: modelLoungingHelmet, customerName: "@helmet.head.fits", caption: "POV: you saved $2k and got better pics than Nike 😭" },
  { src: modelStudioFisheye, customerName: "@fisheye.fashion", caption: "sheeeesh the quality is unmatched. take my money 💸" },
];

// Reviews data for 3 columns with vertical marquee
const reviewsColumn1 = [
  {
    id: 1,
    name: "Brandon M.",
    initials: "BM",
    rating: 5,
    content: "No cap, this saved me at least $3k on my first drop. The AI models look legit af and my customers couldn't even tell the difference.",
    avatarColor: "bg-green-500",
  },
  {
    id: 2,
    name: "Jasmine T.",
    initials: "JT",
    rating: 5,
    content: "Was spending way too much on product photography. This tool hits different - got my whole catalog done in 2 days instead of 2 weeks.",
    avatarColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "Marcus L.",
    initials: "ML",
    rating: 5,
    content: "Genuinely one of the best tools for running a clothing brand. $700 days as of rn and I plan on achieving way more with this.",
    avatarColor: "bg-purple-500",
  },
  {
    id: 4,
    name: "Ashley K.",
    initials: "AK",
    rating: 5,
    content: "I would tell my friends that this is the perfect tool for their brand. No cap, it's fire. 🔥",
    avatarColor: "bg-pink-500",
  },
  {
    id: 5,
    name: "Devon R.",
    initials: "DR",
    rating: 5,
    content: "The vibes are immaculate. My customers literally thought we hired real models lmaooo",
    avatarColor: "bg-orange-500",
  },
];

const reviewsColumn2 = [
  {
    id: 6,
    name: "DeShawn W.",
    initials: "DW",
    rating: 5,
    content: "I was skeptical at first but bruh... the results are insane. My IG engagement went up 40% after switching to these AI model pics.",
    avatarColor: "bg-purple-500",
  },
  {
    id: 7,
    name: "Maria G.",
    initials: "MG",
    rating: 5,
    content: "As a small business owner, I couldn't afford real model shoots. This is literally a lifesaver. The quality is unreal!",
    avatarColor: "bg-yellow-500",
  },
  {
    id: 8,
    name: "Tyler K.",
    initials: "TK",
    rating: 5,
    content: "Super impressed overall. My Shopify store looks way more professional now. Deadass the best investment I made this year.",
    avatarColor: "bg-teal-500",
  },
  {
    id: 9,
    name: "Nina P.",
    initials: "NP",
    rating: 5,
    content: "It was super easy to use. Loving all the features. Cannot wait to go live in a couple of weeks!",
    avatarColor: "bg-indigo-500",
  },
  {
    id: 10,
    name: "Chris H.",
    initials: "CH",
    rating: 5,
    content: "CUSTOMIZABLE AND THE OPTIONS ARE VERY GOOD. This changed the game fr fr 🙌",
    avatarColor: "bg-red-500",
  },
];

const reviewsColumn3 = [
  {
    id: 11,
    name: "Jordan B.",
    initials: "JB",
    rating: 5,
    content: "So grateful to find this tool and the team is always so on top of everything. Couldn't thank you guys enough",
    avatarColor: "bg-cyan-500",
  },
  {
    id: 12,
    name: "Samantha L.",
    initials: "SL",
    rating: 5,
    content: "I purchased a few AI tools in the past but they don't compare to this... Best tool hands down and easy to use.",
    avatarColor: "bg-emerald-500",
  },
  {
    id: 13,
    name: "Kevin D.",
    initials: "KD",
    rating: 5,
    content: "Still can't believe this is AI. My customers literally thought we hired real models lmaooo 💀",
    avatarColor: "bg-violet-500",
  },
  {
    id: 14,
    name: "Rachel M.",
    initials: "RM",
    rating: 5,
    content: "If you're wondering whether to get this, go ahead — it's straightforward and easy to use. W tool 💯",
    avatarColor: "bg-rose-500",
  },
  {
    id: 15,
    name: "Andre J.",
    initials: "AJ",
    rating: 5,
    content: "POV: you saved $2k and got better pics than Nike 😭 This hits different fr fr",
    avatarColor: "bg-amber-500",
  },
];

const campaignModes = [
  {
    title: "Editorial Pose",
    description: "High fashion, magazine-ready",
    image: modelRooftopHoodie,
  },
  {
    title: "Lifestyle Look",
    description: "Natural, relatable poses",
    image: modelLibraryGrunge,
  },
  {
    title: "Lookbook Style",
    description: "Clean, catalog-perfect",
    image: modelStudioPatches,
  },
];

const targetUsers = [
  "Fashion brands & designers",
  "E-commerce stores",
  "Marketing agencies",
  "Clothing manufacturers",
];

const valueCards = [
  {
    icon: Users,
    title: "Skip $1,000+ per model shoot",
    description: "No model fees, no agency costs",
  },
  {
    icon: Sparkles,
    title: "Get unlimited variations",
    description: "Different poses, angles, styles",
  },
  {
    icon: Clock,
    title: "Lookbook-ready in minutes",
    description: "From upload to publish instantly",
  },
  {
    icon: Camera,
    title: "No model agency needed",
    description: "AI generates perfect models",
  },
];

const pricingFeatures = [
  "10 High-Quality AI Model Photos",
  "Multiple Pose Variations",
  "Different Ethnic Model Options",
  "Commercial Usage Rights",
  "High-Resolution Downloads (4K)",
  "3 Revision Rounds",
  "Lookbook-Ready Output",
  "Fast 24-48h Turnaround",
  "Unlimited Background Options",
  "Direct Support via WhatsApp",
];

const howItWorks = [
  {
    number: "01",
    title: "Upload Your Product",
    description: "Send us your clothing photos via WhatsApp or email",
    icon: Upload,
  },
  {
    number: "02",
    title: "Choose Model Style",
    description: "Select pose, ethnicity, background preference",
    icon: Palette,
  },
  {
    number: "03",
    title: "Get AI Results",
    description: "Receive lookbook-ready photos in 24-48h",
    icon: Download,
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    brand: "Streetwear Brand Owner",
    quote: "Saved me $2,000+ on our first collection lookbook! The AI models look incredibly realistic.",
    avatar: "S",
  },
  {
    name: "Marcus T.",
    brand: "E-commerce Store",
    quote: "10x faster than hiring real models. Complete game changer for our product listings.",
    avatar: "M",
  },
  {
    name: "Jessica L.",
    brand: "Fashion Designer",
    quote: "Finally I can visualize my designs on models without breaking the bank. Highly recommend!",
    avatar: "J",
  },
];

const faqs = [
  {
    question: "How does the AI model generation work?",
    answer: "Simply upload your product photos, choose your preferred model style (pose, ethnicity, background), and our AI generates realistic model photos wearing your items within 24-48 hours.",
  },
  {
    question: "Can I use these photos commercially?",
    answer: "Yes! All generated photos come with full commercial usage rights. You can use them for your website, social media, ads, and print materials.",
  },
  {
    question: "What's the turnaround time?",
    answer: "Most orders are completed within 24-48 hours. Complex requests with many variations may take up to 72 hours.",
  },
  {
    question: "What if I'm not satisfied with the results?",
    answer: "You get 3 revision rounds included. If you need adjustments to poses, backgrounds, or styling, just let us know and we'll regenerate.",
  },
  {
    question: "What file formats do I receive?",
    answer: "You receive high-resolution PNG files (4K quality) optimized for both web and print use.",
  },
];

const trustStats = [
  { value: "500+", label: "Brands Served" },
  { value: "10,000+", label: "Photos Generated" },
  { value: "4.9★", label: "Customer Rating" },
];

const ProductAIModelStudio = () => {
  const [showBundleOffer, setShowBundleOffer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [checkoutProduct, setCheckoutProduct] = useState<{
    name: string;
    price: number;
    isBundle: boolean;
  } | null>(null);

  const { toast } = useToast();
  const examplesRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const handleSubmitReview = () => {
    setShowReviewDialog(false);
    setReviewRating(5);
    toast({
      title: "Thanks for your review! 🙌",
      description: "Your review is currently under review and will be published soon.",
    });
  };

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
      price: 100,
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

        {/* HERO SECTION - FOMO Style */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={modelSilverBasquiat}
              alt="AI Model visual"
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
              {/* FOR CLOTHING BRAND OWNERS Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-block px-4 py-2 bg-secondary border border-primary/30 rounded-full text-sm font-mono mb-2"
              >
                👕 FOR CLOTHING BRAND OWNERS
              </motion.span>

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
                NO MORE EXPENSIVE
                <br />
                <span className="text-primary">MODELS.</span>
                <br />
                AI CREATES THEM.
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

        {/* TRUST BADGES */}
        <section className="py-12 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {trustStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <ProductMarquee />

        {/* BEFORE / AFTER INTERACTIVE SLIDER */}
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
                $3,000+ WORTH OF MODEL SHOOT → JUST $70
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                The Transformation
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Drag the slider to compare: boring flat lay vs. AI-generated model wearing your product
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <BeforeAfterSlider
                beforeImage="/placeholder.svg"
                afterImage={modelAlleyStreetwear}
                beforeLabel="OLD WAY"
                afterLabel="AI WAY"
              />
              <div className="flex justify-center gap-8 mt-6 text-sm">
                <p className="text-muted-foreground">
                  <span className="text-destructive font-bold">❌ OLD:</span> $3,000+ & weeks of waiting
                </p>
                <p className="text-foreground font-medium">
                  <span className="text-primary font-bold">✅ AI:</span> $70 & done in 24-48h
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CUSTOMER SHOWCASE GALLERY */}
        <section className="py-24 bg-secondary/10">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-mono mb-4">
                REAL RESULTS FROM REAL BRANDS
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                What Our Customers Made
              </h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                These are actual results from brands using AI Model Studio. Their words, not ours.
              </p>
            </motion.div>

            {/* Masonry Grid with Testimonial Captions */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-7xl mx-auto">
              {customerShowcase.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-4 break-inside-avoid rounded-xl overflow-hidden group cursor-pointer bg-secondary/50"
                >
                  <img
                    src={item.src}
                    alt={`Customer showcase ${item.customerName}`}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <p className="font-bold text-sm text-primary">{item.customerName}</p>
                    <p className="text-xs text-muted-foreground italic mt-1">"{item.caption}"</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS SECTION - VERTICAL MARQUEE */}
        <section className="py-24 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-mono mb-4">
                CUSTOMER REVIEWS
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                What People Say
              </h2>
            </motion.div>

            {/* 3 Column Vertical Marquee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] overflow-hidden max-w-6xl mx-auto">
              {/* Column 1 */}
              <div className="overflow-hidden relative">
                <div 
                  className="animate-marquee-vertical hover:pause"
                  style={{ animationDuration: "30s" }}
                >
                  {[...reviewsColumn1, ...reviewsColumn1].map((review, i) => (
                    <div key={`col1-${review.id}-${i}`} className="glass-card p-6 mb-4 space-y-4">
                      <p className="text-muted-foreground italic leading-relaxed">
                        "{review.content}"
                      </p>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                          {review.initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">Verified Buyer</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2 - different speed for organic feel */}
              <div className="overflow-hidden relative hidden md:block">
                <div 
                  className="animate-marquee-vertical hover:pause"
                  style={{ animationDuration: "25s" }}
                >
                  {[...reviewsColumn2, ...reviewsColumn2].map((review, i) => (
                    <div key={`col2-${review.id}-${i}`} className="glass-card p-6 mb-4 space-y-4">
                      <p className="text-muted-foreground italic leading-relaxed">
                        "{review.content}"
                      </p>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                          {review.initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">Verified Buyer</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3 */}
              <div className="overflow-hidden relative hidden md:block">
                <div 
                  className="animate-marquee-vertical hover:pause"
                  style={{ animationDuration: "35s" }}
                >
                  {[...reviewsColumn3, ...reviewsColumn3].map((review, i) => (
                    <div key={`col3-${review.id}-${i}`} className="glass-card p-6 mb-4 space-y-4">
                      <p className="text-muted-foreground italic leading-relaxed">
                        "{review.content}"
                      </p>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                          {review.initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{review.name}</p>
                          <p className="text-xs text-muted-foreground">Verified Buyer</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Write Review Button */}
            <div className="text-center mt-12">
              <Button
                onClick={() => setShowReviewDialog(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Write A Review
              </Button>
            </div>
          </div>
        </section>

        {/* VELOCITY TEXT */}
        <ProductVelocityText />

        {/* HOW IT WORKS */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-mono mb-4">
                SIMPLE PROCESS
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                How It Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center space-y-4"
                >
                  {/* Step Number */}
                  <div className="relative inline-block">
                    <span className="text-7xl font-bold text-primary/10 font-mono">
                      {step.number}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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

        {/* CAMPAIGN MODES */}
        <section className="py-32 bg-background">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-center mb-16"
            >
              Model Styles
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
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
                Built for <span className="text-primary">Clothing Brand Owners</span>
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

        {/* TESTIMONIALS */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-mono mb-4">
                CUSTOMER LOVE
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                What Brands Say
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.brand}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICE SECTION - FOMO Style with Features */}
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
                <div className="relative glass-card p-10 space-y-6 border-primary/30">
                  {/* PROMO Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-2 bg-destructive text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                      🔥 PROMO ENDS SOON!
                    </span>
                  </div>

                  <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider pt-4 text-center">
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

                  {/* Features List */}
                  <div className="text-left space-y-3 py-6 border-y border-border">
                    <p className="font-mono text-sm text-muted-foreground mb-4 text-center">
                      WHAT YOU GET:
                    </p>
                    {pricingFeatures.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </span>
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={handleBuyClick}
                    className="w-full py-4 px-8 bg-primary text-primary-foreground font-mono font-bold rounded-xl hover:opacity-90 transition-all text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40"
                  >
                    GET INSTANT ACCESS →
                  </button>

                  {/* Social Proof */}
                  <p className="text-xs text-muted-foreground font-mono text-center">
                    ⚡ 89 people bought this week
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-mono mb-4">
                FAQ
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Questions? <span className="text-primary">Answered.</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="glass-card px-6 border-none"
                  >
                    <AccordionTrigger className="font-display text-left text-base md:text-lg tracking-tight hover:text-primary transition-colors py-6 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-mono text-sm text-muted-foreground leading-relaxed pb-6">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
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
              className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border py-4"
            >
              <div className="container mx-auto px-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-bold hidden sm:inline">AI Model Studio</span>
                  <span className="line-through text-muted-foreground text-sm">$100</span>
                  <span className="text-2xl font-bold text-primary">$70</span>
                </div>
                <button
                  onClick={handleBuyClick}
                  className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                >
                  Get Now →
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

        {/* Write Review Dialog (Fake - just shows "under review" toast) */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Write A Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Star Rating Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= reviewRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Review Title</label>
                <Input placeholder="Summarize your experience" className="bg-secondary/50" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Your Review</label>
                <Textarea
                  placeholder="Tell us what you think about AI Model Studio..."
                  rows={4}
                  className="bg-secondary/50"
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

export default ProductAIModelStudio;
