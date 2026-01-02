import { motion } from "framer-motion";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const templates = [
  {
    name: "Voltura",
    url: "https://voltura.sitebykrickel.com",
    description: "Modern E-commerce Theme",
    tagline: "Bold • Dynamic • Conversion-Focused",
  },
  {
    name: "Neuron",
    url: "https://neuron.sitebykrickel.com",
    description: "Minimalist Portfolio Theme",
    tagline: "Clean • Elegant • Professional",
  },
];

const Showcase = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono text-sm"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            
            <h1 className="heading-display text-4xl md:text-6xl lg:text-7xl mb-6">
              <span className="text-gradient">Our Templates</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-mono">
              Premium Shopify themes crafted with precision and style
            </p>
          </motion.div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-32 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {templates.map((template, index) => (
              <motion.a
                key={template.name}
                href={template.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative"
              >
                <div className="glass-card rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(57,255,20,0.15)]">
                  {/* Preview Frame */}
                  <div className="relative aspect-[16/10] bg-black/40 overflow-hidden">
                    {/* Browser Mockup */}
                    <div className="absolute inset-0 flex flex-col">
                      {/* Browser Bar */}
                      <div className="h-8 bg-black/60 flex items-center px-4 gap-2 border-b border-white/10">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <div className="flex-1 ml-4">
                          <div className="bg-white/10 rounded-md h-4 max-w-xs flex items-center px-2">
                            <span className="text-[10px] text-muted-foreground font-mono truncate">
                              {template.url.replace('https://', '')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Website Preview Area */}
                      <div className="flex-1 relative overflow-hidden">
                        <iframe
                          src={template.url}
                          className="absolute inset-0 w-full h-full pointer-events-none scale-[0.5] origin-top-left"
                          style={{ 
                            width: '200%', 
                            height: '200%',
                            border: 'none'
                          }}
                          title={`${template.name} Preview`}
                          loading="lazy"
                        />
                        {/* Overlay for click interaction */}
                        <div className="absolute inset-0 bg-transparent group-hover:bg-primary/5 transition-colors duration-300" />
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-mono text-primary">
                        <ExternalLink size={14} />
                        View Live Demo
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="heading-display text-2xl group-hover:text-primary transition-colors duration-300">
                        {template.name}
                      </h3>
                      <ExternalLink 
                        size={18} 
                        className="text-muted-foreground group-hover:text-primary transition-colors duration-300 mt-1" 
                      />
                    </div>
                    <p className="text-muted-foreground font-mono text-sm mb-2">
                      {template.description}
                    </p>
                    <p className="text-primary/70 font-mono text-xs">
                      {template.tagline}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Showcase;
