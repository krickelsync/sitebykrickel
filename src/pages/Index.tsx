import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ScrollProgress from "@/components/ScrollProgress";

// Lazy load below-the-fold components
const ProblemSection = lazy(() => import("@/components/sections/ProblemSection"));
const FeatureGrid = lazy(() => import("@/components/sections/FeatureGrid"));
const MobileFirstSection = lazy(() => import("@/components/sections/MobileFirstSection"));
const DesktopShowcase = lazy(() => import("@/components/sections/DesktopShowcase"));
const CustomizationSection = lazy(() => import("@/components/sections/CustomizationSection"));
const CostComparison = lazy(() => import("@/components/sections/CostComparison"));
const TrustBadges = lazy(() => import("@/components/sections/TrustBadges"));
const ServicesAddon = lazy(() => import("@/components/sections/ServicesAddon"));
const FinalCTA = lazy(() => import("@/components/sections/FinalCTA"));
const HomeReviewsWall = lazy(() => import("@/components/sections/HomeReviewsWall"));
const HomeVelocityText = lazy(() => import("@/components/sections/HomeVelocityText"));
const Pricing = lazy(() => import("@/components/Pricing"));
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
    <main className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      <ScrollProgress />
      <Hero />
      <Marquee />
      <Suspense fallback={<SectionLoader />}>
        <TrustBadges />
      </Suspense>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><ProblemSection /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><FeatureGrid /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><MobileFirstSection /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><DesktopShowcase /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><CustomizationSection /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><CostComparison /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><Pricing /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><HomeVelocityText /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><HomeReviewsWall /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><ServicesAddon /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><CurvedLoop /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><FAQ /></Suspense></div>
      <div className="cv-auto"><Suspense fallback={<SectionLoader />}><FinalCTA /></Suspense></div>
      <Suspense fallback={<SectionLoader />}><Footer /></Suspense>
    </main>
  );
};

export default Index;
