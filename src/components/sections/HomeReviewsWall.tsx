import ReviewsWall from "@/components/products/landing/ReviewsWall";
import SectionHeader from "@/components/shared/SectionHeader";

const columns = [
  [
    { initials: "BM", name: "Brandon M.", rating: 5, avatarColor: "bg-green-500", content: "theme ini gila sih, store gw langsung keliatan premium. konversi naik dalam seminggu fr fr" },
    { initials: "JT", name: "Jasmine T.", rating: 4, avatarColor: "bg-blue-500", content: "load speed Shopify gw 98 di Lighthouse. customer ga kabur lagi. W theme" },
    { initials: "DR", name: "Devon R.", rating: 5, avatarColor: "bg-purple-500", content: "finally a Shopify theme yang ga keliatan template. clean banget" },
  ],
  [
    { initials: "ZP", name: "Zara P.", rating: 5, avatarColor: "bg-teal-500", content: "hemat jutaan ga perlu hire dev. setup-nya cepet bgt buat clothing brand gw" },
    { initials: "TJ", name: "Tyler J.", rating: 4, avatarColor: "bg-indigo-500", content: "ok tapi kenapa theme-nya smooth bgt??? straight fire di mobile" },
    { initials: "AK", name: "Aaliyah K.", rating: 5, avatarColor: "bg-pink-500", content: "pake buat drop streetwear gw, sold out 2 jam. 10/10 theme" },
  ],
  [
    { initials: "MW", name: "Marcus W.", rating: 5, avatarColor: "bg-orange-500", content: "vibes Shopify store gw immaculate skrg. customer ngerasa brand gw real" },
    { initials: "NB", name: "Naomi B.", rating: 4, avatarColor: "bg-yellow-500", content: "Shopify store gw skrg 10x lebih premium. legit theme terbaik" },
    { initials: "EF", name: "Ethan F.", rating: 5, avatarColor: "bg-red-500", content: "ganti theme lama gw yang lemot ke SYNC. checkout rate naik gila" },
  ],
];

const HomeReviewsWall = () => (
  <section className="container mx-auto px-6 md:px-8 py-20 md:py-28">
    <SectionHeader
      eyebrow="Loved by builders"
      title="REAL BRANDS."
      accent="REAL RESULTS."
    />
    <p className="-mt-4 md:-mt-8 mb-10 text-center font-mono text-[clamp(0.6875rem,1vw,0.9375rem)] text-muted-foreground max-w-xl mx-auto">
      Hundreds of clothing brands, dropshippers, and barbershops shipping faster with SitebyKrickel.
    </p>
    <div className="mt-12">
      <ReviewsWall columns={columns} />
    </div>
  </section>
);

export default HomeReviewsWall;