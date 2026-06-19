import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ScrollProgress from "@/components/ScrollProgress";
import LandingStickyCTA from "@/components/LandingStickyCTA";

// Lazy load below-the-fold components
const Features = lazy(() => import("@/components/Features"));
const Pricing = lazy(() => import("@/components/Pricing"));
const CountdownBanner = lazy(() => import("@/components/CountdownBanner"));
const CurvedLoop = lazy(() => import("@/components/CurvedLoop"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

// Simple loading fallback
const SectionLoader = () => (
  <div className="py-24 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <Suspense fallback={<SectionLoader />}>
        <Features />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CountdownBanner />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CurvedLoop />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
      <LandingStickyCTA />
    </main>
  );
};

export default Index;
