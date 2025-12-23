import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import ScrollVelocity from "@/components/ScrollVelocity";
import CurvedLoop from "@/components/CurvedLoop";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <ScrollVelocity />
      <Pricing />
      <CurvedLoop />
      <FAQ />
      <Footer />
      <MusicPlayer />
    </main>
  );
};

export default Index;
