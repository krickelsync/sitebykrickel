import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DesignBentoGrid from "@/components/DesignBentoGrid";
import { useDesignPortfolio } from "@/hooks/useDesignPortfolio";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useState, useRef, MouseEvent } from "react";
import { Link } from "react-router-dom";

const templates = [
  {
    name: "Voltura",
    url: "https://voltura.sitebykrickel.com",
    description: "Premium E-commerce Experience",
    tagline: "Modern shopping with bold aesthetics",
    category: "E-commerce"
  },
  {
    name: "Neuron",
    url: "https://neuron.sitebykrickel.com",
    description: "Modern E-commerce Experience",
    tagline: "Bold streetwear vibes for fashion brands",
    category: "E-commerce"
  },
  {
    name: "Glassy",
    url: "https://kcklsite.myshopify.com/",
    description: "Shopify Template for Clothing Brand",
    tagline: "Pure Front End And Backend Shopify",
    category: "E-commerce"
  },
  {
    name: "SUP",
    url: "https://sup.sitebykrickel.com",
    description: "Supreme-Inspired Streetwear Store",
    tagline: "Bold drops and hype culture aesthetics",
    category: "E-commerce"
  },
  {
    name: "Genes",
    url: "https://genes.clothing",
    description: "Vintage Luxury Clothing Brand",
    tagline: "Timeless elegance meets modern streetwear",
    category: "E-commerce"
  },
  {
    name: "Kulipixel",
    url: "https://kulipixel.com",
    description: "Freelance Designer Project Management",
    tagline: "Organize clients, projects, and invoices in one place",
    category: "SAAS"
  }
];

const categories = ["All", "E-commerce", "SAAS", "COMPANY PROFILE", "Portfolio", "Landing Page"];

interface TiltCardProps {
  template: typeof templates[0];
  index: number;
}

const TiltCard = ({ template, index }: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{ perspective: "1000px" }}
      className="relative"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative group cursor-pointer"
      >
        <a
          href={template.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {/* Card Container */}
          <motion.div
            animate={{
              scale: isHovered ? 1.02 : 1,
              z: isHovered ? 50 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="relative glass-card rounded-2xl overflow-hidden border border-white/10 max-w-full mx-auto"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Glare Effect */}
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(163, 230, 53, 0.15) 0%, transparent 50%)`,
              }}
            />

            {/* Browser Mockup */}
            <div className="bg-background/80 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-muted/50 rounded-full px-4 py-1.5 text-xs font-mono text-muted-foreground truncate">
                  {template.url.replace("https://", "")}
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="relative aspect-[4/3] bg-muted/20 overflow-hidden">
              <iframe
                src={template.url}
                className="w-full h-full scale-100 origin-top-left pointer-events-none"
                title={`${template.name} preview`}
                loading="lazy"
                data-no-invert
              />
              
              {/* Hover Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center"
                style={{ transform: "translateZ(30px)" }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: isHovered ? 1 : 0.8, 
                    opacity: isHovered ? 1 : 0 
                  }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider"
                >
                  <span>View Live Demo</span>
                  <ExternalLink size={16} />
                </motion.div>
              </motion.div>
            </div>

            {/* Template Info */}
            <div 
              className="p-4 md:p-6 relative"
              style={{ transform: "translateZ(20px)" }}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="font-display text-lg md:text-2xl font-bold uppercase tracking-wide">
                  {template.name}
                </h3>
                <span className="px-2 md:px-3 py-1 text-[10px] md:text-xs font-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded-full whitespace-nowrap">
                  {template.category}
                </span>
              </div>
              <p className="font-mono text-xs md:text-sm text-muted-foreground mb-1">
                {template.description}
              </p>
              <p className="font-mono text-[10px] md:text-xs text-muted-foreground/70 italic">
                "{template.tagline}"
              </p>
            </div>

            {/* Dynamic Shadow */}
            <motion.div
              className="absolute -inset-4 -z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "radial-gradient(circle at center, hsl(var(--primary) / 0.2) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
          </motion.div>
        </a>
      </motion.div>
    </motion.div>
  );
};

const designCategories = ["All", "Logo", "Clothing", "Packaging"];

const Showcase = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDesignCategory, setActiveDesignCategory] = useState("All");
  
  const { data: designs = [], isLoading: designsLoading } = useDesignPortfolio(activeDesignCategory);

  const filteredTemplates = templates.filter(
    (t) => activeCategory === "All" || t.category === activeCategory
  );

  return (
    <div className="min-h-dvh bg-background overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-16 pb-4 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 md:mb-8"
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight mb-3 md:mb-4">
              <span className="glow-text-luxury">WEBSITES</span>
            </h1>
            <p className="font-mono text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-2">
              Explore our premium Shopify themes. Click any template to see it live.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-2 px-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 md:px-5 py-1.5 md:py-2 font-mono text-[10px] md:text-xs uppercase tracking-wider rounded-full border transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground border-primary glow-box"
                    : "glass-card border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-[calc(100%-2rem)] md:max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredTemplates.map((template, index) => (
              <TiltCard key={template.name} template={template} index={index} />
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="font-mono text-muted-foreground">
                No templates in this category yet. Coming soon!
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Design Portfolio Section */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tight mb-3 md:mb-4">
              <span className="glow-text-luxury">DESIGN</span>
            </h2>
            <p className="font-mono text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-2">
              Creative design works across branding, packaging, and apparel.
            </p>
          </motion.div>

          {/* Design Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 px-2"
          >
            {designCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveDesignCategory(category)}
                className={`px-3 md:px-5 py-1.5 md:py-2 font-mono text-[10px] md:text-xs uppercase tracking-wider rounded-full border transition-all duration-300 ${
                  activeDesignCategory === category
                    ? "bg-primary text-primary-foreground border-primary glow-box"
                    : "glass-card border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Bento Grid */}
          <div className="max-w-6xl mx-auto">
            <DesignBentoGrid designs={designs} isLoading={designsLoading} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Showcase;
