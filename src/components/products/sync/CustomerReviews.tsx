import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, Loader2, Send } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import SectionHeader from "@/components/shared/SectionHeader";
import { typography, textSize } from "@/components/ui/typography";
import { toast } from "sonner";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  content: string;
  created_at: string;
};

const PRODUCT_SLUG = "sync";

const reviewSchema = z.object({
  author_name: z.string().trim().min(2, "Name too short").max(60, "Name too long"),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120, "Title too long").optional(),
  content: z.string().trim().min(10, "Tell us a bit more (min 10 chars)").max(1000, "Too long"),
});

const StarRow = ({ value, size = 16 }: { value: number; size?: number }) => (
  <div className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        className={n <= value ? "fill-gold text-gold" : "fill-transparent text-foreground/25"}
        strokeWidth={1.5}
      />
    ))}
  </div>
);

const StarInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="inline-flex items-center gap-1"
      onMouseLeave={() => setHover(0)}
      role="radiogroup"
      aria-label="Your rating"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            className="p-1 -m-1 transition-transform hover:scale-110"
          >
            <Star
              size={26}
              className={active ? "fill-gold text-gold" : "fill-transparent text-foreground/30"}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

const CustomerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    author_name: "",
    rating: 5,
    title: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id,author_name,rating,title,content,created_at")
      .eq("product_slug", PRODUCT_SLUG)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) console.error(error);
    setReviews((data ?? []) as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = reviews.length;
    const buckets = [0, 0, 0, 0, 0];
    let sum = 0;
    for (const r of reviews) {
      buckets[r.rating - 1] += 1;
      sum += r.rating;
    }
    const avg = total ? sum / total : 0;
    return { total, buckets, avg };
  }, [reviews]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse({
      author_name: form.author_name,
      rating: form.rating,
      title: form.title || undefined,
      content: form.content,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your input");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").insert({
      product_slug: PRODUCT_SLUG,
      author_name: parsed.data.author_name,
      rating: parsed.data.rating,
      title: parsed.data.title ?? null,
      content: parsed.data.content,
      approved: false,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit review");
      console.error(error);
      return;
    }
    toast.success("Thanks! Your review is pending approval.");
    setForm({ author_name: "", rating: 5, title: "", content: "" });
    setOpen(false);
  };

  return (
    <section id="reviews" className="container mx-auto px-4 md:px-8 py-20 md:py-28">
      <SectionHeader
        eyebrow="Customer Reviews"
        title="WHAT PEOPLE"
        accent="ACTUALLY SAY."
        accentTone="gold"
      />

      {/* ============ Summary ============ */}
      <div className="max-w-3xl mx-auto glass-card p-5 md:p-8">
        <div className="flex flex-col items-center gap-2 mb-6">
          <StarRow value={Math.round(stats.avg)} size={22} />
          <div className="font-mono text-sm md:text-base text-foreground/90">
            <span className="font-syne font-bold text-lg md:text-xl text-gold">
              {stats.avg.toFixed(1)}
            </span>
            <span className="text-foreground/50"> / 5 </span>
            <span className="text-foreground/60">
              {stats.total} {stats.total === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        <div className="space-y-2 md:space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.buckets[star - 1];
            const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 md:gap-4">
                <div className="font-mono text-[11px] md:text-xs w-8 text-foreground/70 flex items-center gap-1">
                  {star}
                  <Star size={11} className="fill-gold text-gold" strokeWidth={1.5} />
                </div>
                <div className="flex-1 h-2 md:h-2.5 rounded-full bg-foreground/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full bg-gold rounded-full"
                  />
                </div>
                <div className="font-mono text-[11px] md:text-xs w-10 text-right text-foreground/60">
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 text-gold px-5 py-2.5 font-mono text-[11px] md:text-xs uppercase tracking-widest hover:bg-gold/10 transition-colors"
          >
            {open ? "Close" : "Write a Review"}
          </button>
        </div>
      </div>

      {/* ============ Write form ============ */}
      {open && (
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="max-w-2xl mx-auto mt-6 glass-card p-5 md:p-7 space-y-4"
        >
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-foreground/60 mb-2">
              Your Rating
            </label>
            <StarInput value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-foreground/60 mb-2">
                Name
              </label>
              <input
                type="text"
                required
                maxLength={60}
                value={form.author_name}
                onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                className="w-full bg-background/60 border border-foreground/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:border-primary/60 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-foreground/60 mb-2">
                Title <span className="text-foreground/40">(optional)</span>
              </label>
              <input
                type="text"
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full bg-background/60 border border-foreground/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:border-primary/60 focus:outline-none"
                placeholder="Straight fire"
              />
            </div>
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-foreground/60 mb-2">
              Review
            </label>
            <textarea
              required
              rows={4}
              maxLength={1000}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              className="w-full bg-background/60 border border-foreground/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:border-primary/60 focus:outline-none resize-none"
              placeholder="Tell us how SYNC changed your store..."
            />
            <p className={`${textSize.micro} text-foreground/40 mt-1 text-right font-mono`}>
              {form.content.length}/1000
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2">
            <p className={`${textSize.micro} text-foreground/50 font-mono`}>
              Reviews are checked before going live.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 font-mono text-[11px] md:text-xs uppercase tracking-widest disabled:opacity-50 hover:glow-box transition-all"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Submit
            </button>
          </div>
        </motion.form>
      )}

      {/* ============ Review list ============ */}
      <div className="max-w-3xl mx-auto mt-10 space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-foreground/50" />
          </div>
        ) : reviews.length === 0 ? (
          <p className={`${typography.body} text-center py-8 text-foreground/50`}>
            No reviews yet. Be the first to drop one.
          </p>
        ) : (
          reviews.map((r) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-4 md:p-5"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center font-syne font-bold text-background text-xs shrink-0">
                    {r.author_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm md:text-base truncate">
                      {r.author_name}
                    </p>
                    <StarRow value={r.rating} size={12} />
                  </div>
                </div>
                <time
                  dateTime={r.created_at}
                  className="font-mono text-[10px] md:text-[11px] text-foreground/40 shrink-0"
                >
                  {new Date(r.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              {r.title && (
                <h3 className="font-syne font-bold text-base md:text-lg mt-2 leading-tight">
                  {r.title}
                </h3>
              )}
              <p className="mt-1.5 text-sm md:text-[15px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {r.content}
              </p>
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;