import { ShoppingCart, Smartphone, Zap, Box, Package, type LucideIcon } from "lucide-react";

export type ReactorFeature = {
  key: string;
  label: string;
  Icon: LucideIcon;
  title: string;
  copy: string;
  metric: string;
};

export const REACTOR_FEATURES: ReactorFeature[] = [
  {
    key: "cart",
    label: "Cart",
    Icon: ShoppingCart,
    title: "1-Click Checkout",
    copy: "Frictionless cart drawer with PayPal, Shop Pay & local methods baked in.",
    metric: "+38% conversion",
  },
  {
    key: "product",
    label: "Product",
    Icon: Package,
    title: "Smart Product Pages",
    copy: "Sticky ATC, dynamic variants and built-in upsell blocks that just work.",
    metric: "Built-in upsell",
  },
  {
    key: "mobile",
    label: "Mobile",
    Icon: Smartphone,
    title: "Mobile-First",
    copy: "Engineered for thumbs. Every interaction tuned for small screens first.",
    metric: "100 / 100 Lighthouse",
  },
  {
    key: "speed",
    label: "Speed",
    Icon: Zap,
    title: "Edge Performance",
    copy: "Lazy media, critical CSS and zero-bloat Liquid for instant page loads.",
    metric: "< 1s LCP",
  },
  {
    key: "3d",
    label: "3D",
    Icon: Box,
    title: "3D & Video Showcase",
    copy: "Native 3D model and video media. Show product like a luxury house.",
    metric: "Native support",
  },
];