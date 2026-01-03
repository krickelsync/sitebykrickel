import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import CurvedLoop from "@/components/CurvedLoop";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <Pricing />
      <CurvedLoop />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
