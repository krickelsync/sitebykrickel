import ReviewsWall from "@/components/products/landing/ReviewsWall";
import SectionHeader from "@/components/shared/SectionHeader";

const columns = [
  [
    { initials: "BM", name: "Brandon M.", rating: 5, avatarColor: "bg-green-500", content: "bro this AI is lowkey insane saved my whole budget fr fr. my product photos look professional af now" },
    { initials: "JT", name: "Jasmine T.", rating: 4, avatarColor: "bg-blue-500", content: "no cap, my sales went UP after using these pics. W tool" },
    { initials: "DR", name: "Devon R.", rating: 5, avatarColor: "bg-purple-500", content: "finally some AI that actually gets product aesthetics" },
  ],
  [
    { initials: "ZP", name: "Zara P.", rating: 5, avatarColor: "bg-teal-500", content: "saved me so much money on photoshoots. this is the future fr" },
    { initials: "TJ", name: "Tyler J.", rating: 4, avatarColor: "bg-indigo-500", content: "ok but why is this so good??? straight fire" },
    { initials: "AK", name: "Aaliyah K.", rating: 5, avatarColor: "bg-pink-500", content: "used this for my drop and it went crazy. 10/10" },
  ],
  [
    { initials: "MW", name: "Marcus W.", rating: 5, avatarColor: "bg-orange-500", content: "the vibes are immaculate ngl. customers love it" },
    { initials: "NB", name: "Naomi B.", rating: 4, avatarColor: "bg-yellow-500", content: "my Shopify store looks 10x better now. legit" },
    { initials: "EF", name: "Ethan F.", rating: 5, avatarColor: "bg-red-500", content: "replaced my entire photo workflow. wild" },
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