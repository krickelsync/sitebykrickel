export interface NavLinkItem {
  name: string;
  href: string;
  external?: boolean;
}

export const PRIMARY_NAV: NavLinkItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portofolio", href: "/showcase" },
  { name: "Products", href: "/products" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Contact", href: "/about#contact" },
];

export const FOOTER_QUICK_LINKS: NavLinkItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portofolio", href: "/showcase" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Contact", href: "/about#contact" },
];