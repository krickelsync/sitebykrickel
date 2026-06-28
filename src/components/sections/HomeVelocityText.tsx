import VelocityTextBlock from "@/components/products/landing/VelocityTextBlock";

const HomeVelocityText = () => (
  <VelocityTextBlock
    rows={[
      { text: "PREMIUM SHOPIFY THEMES ✦ BUILT FOR CLOTHING BRANDS ✦ STREETWEAR READY ✦ DROPSHIPPER APPROVED ✦ ", velocity: -0.6 },
      { text: "LIGHTNING FAST CHECKOUT ✦ MOBILE FIRST DESIGN ✦ INFINITE CUSTOMIZATION ✦ SHIP IN MINUTES ✦ ", velocity: 0.6, color: "#FACC15" },
    ]}
  />
);

export default HomeVelocityText;