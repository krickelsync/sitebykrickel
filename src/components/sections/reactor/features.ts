import { ShoppingCart, DollarSign, Palette, Settings2, Box, type LucideIcon } from "lucide-react";

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
    key: "price",
    label: "Trust",
    Icon: DollarSign,
    title: "Trusted Pricing",
    copy: "Transparent flat pricing — no hidden fees, no surprises.",
    metric: "Trusted by 1,900+",
  },
  {
    key: "theme",
    label: "Theme",
    Icon: Palette,
    title: "Premium Theme",
    copy: "Hand-crafted Shopify theme built for clothing brands.",
    metric: "Studio-grade",
  },
  {
    key: "customize",
    label: "Customize",
    Icon: Settings2,
    title: "Infinite Customization",
    copy: "Tweak every block, color and section without touching code.",
    metric: "100+ controls",
  },
  {
    key: "box",
    label: "Box",
    Icon: Box,
    title: "Modular Sections",
    copy: "Drag, drop and ship — every section is plug-and-play.",
    metric: "30+ blocks",
  },
  {
    key: "cart",
    label: "Cart",
    Icon: ShoppingCart,
    title: "1-Click Checkout",
    copy: "Frictionless cart drawer with PayPal, Shop Pay & local methods baked in.",
    metric: "+38% conversion",
  },
];