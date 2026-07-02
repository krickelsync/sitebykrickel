import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { MusicProvider } from "./contexts/MusicContext";
import { CartProvider } from "./contexts/CartContext";
import CartDrawer from "./components/cart/CartDrawer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MobileBottomNav from "./components/MobileBottomNav";
import SmoothScroll from "./components/SmoothScroll";
import Navbar from "./components/Navbar";
import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { installGlobalClickSound } from "@/lib/sound";
import ChunkErrorBoundary from "./components/ChunkErrorBoundary";
import ErrorBoundary from "./components/ErrorBoundary";

const MusicPlayer = lazy(() => import("./components/MusicPlayer"));
const Showcase = lazy(() => import("./pages/Showcase"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const SyncProduct = lazy(() => import("./pages/SyncProduct"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminProductEdit = lazy(() => import("./pages/AdminProductEdit"));
const AdminIssueLicense = lazy(() => import("./pages/AdminIssueLicense"));
const AdminCoupons = lazy(() => import("./pages/AdminCoupons"));
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const AdminThemes = lazy(() => import("./pages/AdminThemes"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const StyleGuide = lazy(() => import("./pages/StyleGuide"));
const Account = lazy(() => import("./pages/Account"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
      <ChunkErrorBoundary>
      <ErrorBoundary>
      <Suspense fallback={<div className="min-h-[100svh]" aria-hidden />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/themes/sync" element={<SyncProduct />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/orders/:id" element={<OrderDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products/:id" element={<AdminProductEdit />} />
          <Route path="/admin/issue" element={<AdminIssueLicense />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/themes" element={<AdminThemes />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
      </ChunkErrorBoundary>
      <Suspense fallback={null}>
        <MusicPlayer />
      </Suspense>
      {!hideChrome && <CartDrawer />}
      {!hideMobileNav && <MobileBottomNav />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MusicProvider>
       <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppInner />
          </BrowserRouter>
        </TooltipProvider>
       </CartProvider>
      </MusicProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
