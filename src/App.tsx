import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MusicProvider } from "./contexts/MusicContext";
import Index from "./pages/Index";
import Showcase from "./pages/Showcase";
import About from "./pages/About";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import MusicPlayer from "./components/MusicPlayer";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import MobileBottomNav from "./components/MobileBottomNav";
import SoundToggle from "./components/SoundToggle";
import SmoothScroll from "./components/SmoothScroll";
import { useEffect } from "react";
import { installGlobalClickSound } from "@/lib/sound";

const queryClient = new QueryClient();

const AppInner = () => {
  useEffect(() => {
    installGlobalClickSound();
  }, []);
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <PageTransition />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MusicPlayer />
      <MobileBottomNav />
      <SoundToggle />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MusicProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppInner />
          </BrowserRouter>
        </TooltipProvider>
      </MusicProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
