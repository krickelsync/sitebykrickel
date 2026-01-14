import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Pen } from "lucide-react";

// Components
import ModelStudioNavbar from "@/components/model-studio/ModelStudioNavbar";
import HeroSection from "@/components/model-studio/HeroSection";
import SectionHeader from "@/components/model-studio/SectionHeader";
import ProblemBlock from "@/components/model-studio/ProblemBlock";
import Steps from "@/components/model-studio/Steps";
import FeatureGrid from "@/components/model-studio/FeatureGrid";
import PresetCards from "@/components/model-studio/PresetCards";
import PricingCard from "@/components/model-studio/PricingCard";
import FAQAccordion from "@/components/model-studio/FAQAccordion";
import FinalCTA from "@/components/model-studio/FinalCTA";
import MobileStickyBar from "@/components/model-studio/MobileStickyBar";
import CheckoutModal from "@/components/products/CheckoutModal";
import BundleOfferModal from "@/components/products/BundleOfferModal";
import ProductMarquee from "@/components/products/ProductMarquee";
import ProductVelocityText from "@/components/products/ProductVelocityText";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Portfolio images for showcase
import modelAlleyStreetwear from "@/assets/portfolio/model-alley-streetwear.png";
import modelTracksuitConcrete from "@/assets/portfolio/model-tracksuit-concrete.png";
import modelSilverBasquiat from "@/assets/portfolio/model-silver-basquiat.png";
import modelRooftopHoodie from "@/assets/portfolio/model-rooftop-hoodie.png";
import modelSkateparkPuffer from "@/assets/portfolio/model-skatepark-puffer.png";
import modelStudioFisheye from "@/assets/portfolio/model-studio-fisheye.png";

// Customer showcase data
const customerShowcase = [
  { src: modelAlleyStreetwear, caption: "finally some AI that gets streetwear aesthetics" },
  { src: modelTracksuitConcrete, caption: "used this for my drop and it went crazy" },
  { src: modelSilverBasquiat, caption: "the quality is unreal, saved us thousands" },
  { src: modelRooftopHoodie, caption: "our brand photos never looked this good" },
  { src: modelSkateparkPuffer, caption: "game changer for small fashion brands" },
  { src: modelStudioFisheye, caption: "replaced our entire photoshoot budget" },
];

// Reviews data - 3 columns
const reviewsColumn1 = [
  { id: 1, name: "Brandon M.", initials: "BM", rating: 5, content: "bro this AI model studio is insane 🔥 my lookbook never looked this good fr fr", avatarColor: "bg-green-500" },
  { id: 2, name: "Jasmine T.", initials: "JT", rating: 5, content: "no cap, saved us like $3k on our first campaign. the model poses look so natural", avatarColor: "bg-purple-500" },
  { id: 3, name: "Marcus L.", initials: "ML", rating: 4, content: "W tool for fashion brands. my IG engagement went up 40% with these photos", avatarColor: "bg-blue-500" },
  { id: 4, name: "Aisha K.", initials: "AK", rating: 5, content: "finally someone made AI that actually understands fashion aesthetics 💯", avatarColor: "bg-pink-500" },
  { id: 5, name: "Tyler R.", initials: "TR", rating: 5, content: "used this for my streetwear drop. sold out in 2 hours. nuff said 🔥", avatarColor: "bg-orange-500" },
];

const reviewsColumn2 = [
  { id: 6, name: "Destiny W.", initials: "DW", rating: 5, content: "the presets are lowkey fire. campaign mode hits different for ads", avatarColor: "bg-cyan-500" },
  { id: 7, name: "Jordan P.", initials: "JP", rating: 4, content: "stopped paying $500/day for models. this is the future fr", avatarColor: "bg-red-500" },
  { id: 8, name: "Kenji S.", initials: "KS", rating: 5, content: "my clients think I hired real models 😭 the quality is crazy good", avatarColor: "bg-yellow-500" },
  { id: 9, name: "Brianna C.", initials: "BC", rating: 5, content: "small brand owner here - this leveled up my product photos so much", avatarColor: "bg-indigo-500" },
  { id: 10, name: "Andre H.", initials: "AH", rating: 5, content: "the diversity options are 🔥 finally can show my clothes on different body types", avatarColor: "bg-teal-500" },
];

const reviewsColumn3 = [
  { id: 11, name: "Mia L.", initials: "ML", rating: 5, content: "went from amateur product shots to professional lookbook in one day 💀", avatarColor: "bg-rose-500" },
  { id: 12, name: "Chris D.", initials: "CD", rating: 4, content: "background options are sick. makes my stuff look high fashion instantly", avatarColor: "bg-emerald-500" },
  { id: 13, name: "Taylor N.", initials: "TN", rating: 5, content: "my shopify store conversion rate went up 25% after using these photos", avatarColor: "bg-violet-500" },
  { id: 14, name: "Devon M.", initials: "DM", rating: 5, content: "no more awkward photoshoots. just upload and get fire results 🔥", avatarColor: "bg-amber-500" },
  { id: 15, name: "Zara F.", initials: "ZF", rating: 5, content: "the lighting presets understand fashion photography. finally!", avatarColor: "bg-lime-500" },
];

const ProductAIModelStudio = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showBundle, setShowBundle] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<"model" | "bundle">("model");
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

  const handleCtaClick = () => {
    setShowBundle(true);
  };

  const handleAcceptBundle = () => {
    setShowBundle(false);
    setSelectedProduct("bundle");
    setShowCheckout(true);
  };

  const handleDeclineBundle = () => {
    setShowBundle(false);
    setSelectedProduct("model");
    setShowCheckout(true);
  };

  const handlePricingClick = () => {
    const element = document.querySelector("#pricing");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitReview = () => {
    if (!reviewName.trim() || !reviewContent.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewName,
      initials: reviewName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      rating: reviewRating,
      content: reviewContent,
      avatarColor: "bg-primary",
    };

    setUserReviews([newReview, ...userReviews]);
    setShowReviewDialog(false);
    setReviewName("");
    setReviewContent("");
    setReviewRating(5);
    toast.success("Thanks for your review! 🔥");
  };

  // Combine user reviews with existing reviews
  const allColumn1 = [...userReviews, ...reviewsColumn1];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      {/* Navbar */}
      <ModelStudioNavbar onCtaClick={handleCtaClick} />

      {/* Hero Section */}
      <HeroSection onCtaClick={handleCtaClick} />

      {/* Marquee */}
      <ProductMarquee />

      {/* Velocity Text Animation */}
      <ProductVelocityText />

      {/* How It Works */}
      <section id="how-it-works" className="py-14 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Block A: Problem */}
          <ProblemBlock />

          {/* Block B: Steps */}
          <SectionHeader
            eyebrow="3 SIMPLE STEPS"
            title="From Upload to Campaign-Ready"
            description="Get professional model photos in minutes, not days."
          />
          <div className="mt-12 md:mt-16">
            <Steps />
          </div>
        </div>
      </section>

      {/* Customer Showcase */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-card/10">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="SHOWCASE"
            title="See What Others Are Creating"
            description="Real results from real brands using AI Model Studio"
          />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {customerShowcase.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer"
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <p className="text-xs md:text-sm text-white/90 font-medium">
                      "{item.caption}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Controls / Features */}
      <section id="controls" className="py-14 md:py-32 px-4 md:px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="CONTROLS"
            title="You control the look—not the AI doing random ideas."
          />
          <div className="mt-12 md:mt-16">
            <FeatureGrid />
          </div>
        </div>
      </section>

      {/* Presets */}
      <section id="presets" className="py-14 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="PRESETS"
            title="Ready-to-use Shot Recipes"
          />
          <div className="mt-12 md:mt-16">
            <PresetCards />
          </div>
        </div>
      </section>

      {/* Customer Reviews - 3 Column Vertical Marquee */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-card/10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <SectionHeader
              eyebrow="REVIEWS"
              title="What Creators Are Saying"
              description="Real feedback from fashion brands and creators"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewDialog(true)}
              className="hidden md:flex items-center gap-2 border-white/10 hover:bg-white/5"
            >
              <Pen className="w-4 h-4" />
              Write a Review
            </Button>
          </div>

          {/* Mobile Write Review Button */}
          <div className="flex justify-center mb-6 md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReviewDialog(true)}
              className="flex items-center gap-2 border-white/10 hover:bg-white/5"
            >
              <Pen className="w-4 h-4" />
              Write a Review
            </Button>
          </div>

          {/* Reviews Marquee Container */}
          <div className="relative h-[320px] md:h-[600px] overflow-hidden">
            {/* Top shadow gradient */}
            <div className="absolute top-0 left-0 right-0 h-12 md:h-24 bg-gradient-to-b from-background via-background/50 to-transparent z-10 pointer-events-none" />
            
            {/* Bottom shadow gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-12 md:h-24 bg-gradient-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />

            {/* 3 Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 h-full">
              {/* Column 1 - Scroll Up */}
              <div className="overflow-hidden h-full">
                <motion.div
                  animate={{ y: [0, -50 * allColumn1.length] }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 20,
                      ease: "linear",
                    },
                  }}
                  className="flex flex-col gap-3 md:gap-4"
                >
                  {[...allColumn1, ...allColumn1].map((review, index) => (
                    <ReviewCard key={`col1-${index}`} review={review} />
                  ))}
                </motion.div>
              </div>

              {/* Column 2 - Scroll Down (hidden on mobile) */}
              <div className="overflow-hidden h-full hidden md:block">
                <motion.div
                  animate={{ y: [-50 * reviewsColumn2.length, 0] }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 25,
                      ease: "linear",
                    },
                  }}
                  className="flex flex-col gap-3 md:gap-4"
                >
                  {[...reviewsColumn2, ...reviewsColumn2].map((review, index) => (
                    <ReviewCard key={`col2-${index}`} review={review} />
                  ))}
                </motion.div>
              </div>

              {/* Column 3 - Scroll Up (hidden on mobile) */}
              <div className="overflow-hidden h-full hidden md:block">
                <motion.div
                  animate={{ y: [0, -50 * reviewsColumn3.length] }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 22,
                      ease: "linear",
                    },
                  }}
                  className="flex flex-col gap-3 md:gap-4"
                >
                  {[...reviewsColumn3, ...reviewsColumn3].map((review, index) => (
                    <ReviewCard key={`col3-${index}`} review={review} />
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 md:py-32 px-4 md:px-6 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="PRICING"
            title="AI Model Studio — Access"
          />
          <div className="mt-12 md:mt-16">
            <PricingCard onCtaClick={handleCtaClick} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14 md:py-32 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            eyebrow="FAQ"
            title="Frequently Asked Questions"
          />
          <div className="mt-12 md:mt-16">
            <FAQAccordion onCtaClick={handleCtaClick} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-32 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <FinalCTA onCtaClick={handleCtaClick} />
        </div>
      </section>

      {/* Mobile Sticky Bar */}
      <MobileStickyBar onCtaClick={handleCtaClick} />

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="bg-card border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Your Name</label>
              <Input
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="e.g. Jordan P."
                className="bg-background/50 border-white/10"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Your Review</label>
              <Textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Share your experience..."
                className="bg-background/50 border-white/10 min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleSubmitReview}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <BundleOfferModal
        isOpen={showBundle}
        onClose={() => setShowBundle(false)}
        onAcceptBundle={handleAcceptBundle}
        onDeclineBundle={handleDeclineBundle}
        originalProduct="AI Model Studio"
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        productName={selectedProduct === "bundle" ? "AI Product + Model Studio Bundle" : "AI Model Studio"}
        price={selectedProduct === "bundle" ? 100 : 100}
        isBundle={selectedProduct === "bundle"}
      />
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }: { review: { name: string; initials: string; rating: number; content: string; avatarColor: string } }) => (
  <div className="glass-card p-3 md:p-4 space-y-2 md:space-y-3 hover:bg-white/5 transition-colors">
    <div className="flex items-center gap-2 md:gap-3">
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${review.avatarColor} flex items-center justify-center text-white font-bold text-xs md:text-sm`}>
        {review.initials}
      </div>
      <div>
        <span className="font-semibold text-xs md:text-sm block">{review.name}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
    <p className="text-xs md:text-sm text-muted-foreground line-clamp-3">{review.content}</p>
  </div>
);

export default ProductAIModelStudio;
