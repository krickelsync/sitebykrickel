import ReviewsWall from "@/components/products/landing/ReviewsWall";
import SectionHeader from "@/components/shared/SectionHeader";

const columns = [
  [
    { initials: "BM", name: "Brandon M.", rating: 5, avatarColor: "bg-green-500", content: "this theme hits different. store looks premium instantly and conversions jumped within a week fr fr" },
    { initials: "JT", name: "Jasmine T.", rating: 4, avatarColor: "bg-blue-500", content: "my Shopify hits 98 on Lighthouse now. customers actually stick around. W theme no cap" },
    { initials: "DR", name: "Devon R.", rating: 5, avatarColor: "bg-purple-500", content: "finally a Shopify theme that doesn't scream template. clean as hell" },
  ],
  [
    { initials: "ZP", name: "Zara P.", rating: 5, avatarColor: "bg-teal-500", content: "saved thousands not having to hire a dev. setup was crazy fast for my clothing brand" },
    { initials: "TJ", name: "Tyler J.", rating: 4, avatarColor: "bg-indigo-500", content: "ok but why is this theme so smooth??? straight fire on mobile" },
    { initials: "AK", name: "Aaliyah K.", rating: 5, avatarColor: "bg-pink-500", content: "used it for my streetwear drop, sold out in 2 hours. 10/10 theme" },
  ],
  [
    { initials: "MW", name: "Marcus W.", rating: 5, avatarColor: "bg-orange-500", content: "the vibes on my Shopify store are immaculate now. customers actually feel the brand" },
    { initials: "NB", name: "Naomi B.", rating: 4, avatarColor: "bg-yellow-500", content: "store looks 10x more premium now. legit the best theme out there" },
    { initials: "EF", name: "Ethan F.", rating: 5, avatarColor: "bg-red-500", content: "swapped my old laggy theme for SYNC. checkout rate went crazy" },
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