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
import MobileBottomNav from "./components/MobileBottomNav";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { installGlobalClickSound } from "@/lib/sound";

const MusicPlayer = lazy(() => import("./components/MusicPlayer"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminProductEdit = lazy(() => import("./pages/AdminProductEdit"));

const queryClient = new QueryClient();

const AppInner = () => {
  useEffect(() => {
    installGlobalClickSound();
  }, []);
  const location = useLocation();
  const hideChrome = location.pathname.startsWith("/admin");
  const hideMobileNav = hideChrome || /^\/products\/[^/]+$/.test(location.pathname);
  return (
    <>
      <SmoothScroll />
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<Suspense fallback={null}><ProductDetail /></Suspense>} />
        <Route path="/admin/login" element={<Suspense fallback={null}><AdminLogin /></Suspense>} />
        <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
        <Route path="/admin/products/:id" element={<Suspense fallback={null}><AdminProductEdit /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Suspense fallback={null}>
        <MusicPlayer />
      </Suspense>
      {!hideMobileNav && <MobileBottomNav />}
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
