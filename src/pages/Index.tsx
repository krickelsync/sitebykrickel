import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ScrollProgress from "@/components/ScrollProgress";
import AnnouncementBar from "@/components/sections/AnnouncementBar";

// Lazy load below-the-fold components
const ProblemSection = lazy(() => import("@/components/sections/ProblemSection"));
const FeatureGrid = lazy(() => import("@/components/sections/FeatureGrid"));
const MobileFirstSection = lazy(() => import("@/components/sections/MobileFirstSection"));
const CustomizationSection = lazy(() => import("@/components/sections/CustomizationSection"));
const CostComparison = lazy(() => import("@/components/sections/CostComparison"));
const TrustBadges = lazy(() => import("@/components/sections/TrustBadges"));
const ServicesAddon = lazy(() => import("@/components/sections/ServicesAddon"));
const FinalCTA = lazy(() => import("@/components/sections/FinalCTA"));
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
      <AnnouncementBar />
      <Hero />
      <Marquee />
      <Suspense fallback={<SectionLoader />}>
        <ProblemSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FeatureGrid />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <MobileFirstSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CustomizationSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CostComparison />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TrustBadges />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <ServicesAddon />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CurvedLoop />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <FinalCTA />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Footer />
      </Suspense>
    </main>
  );
};

export default Index;
