import VelocityTextBlock from "@/components/products/landing/VelocityTextBlock";

const HomeVelocityText = () => (
  <VelocityTextBlock
    rows={[
      { text: "TRUSTED BY 1,900+ BRANDS ✦ PREMIUM SHOPIFY THEMES ✦ INSTANT DELIVERY ✦ ", velocity: -2 },
      { text: "PRICE CAN CHANGE ANYTIME ✦ LIMITED OFFER ✦ DON'T MISS OUT ✦ ", velocity: 2, color: "#39FF14" },
    ]}
  />
);

export default HomeVelocityText;