import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LandingBlock =
  | { type: "hero"; title?: string; subtitle?: string; image?: string }
  | { type: "text"; body: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "gallery"; images: string[] }
  | { type: "features"; items: { title: string; description?: string }[] }
  | { type: "video"; url: string }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "animated_hero"; eyebrow?: string; title: string; subtitle?: string; badge?: string; ctaLabel?: string; ctaHref?: string; bgVariant?: "grid" | "prism" | "noise" | "none" }
  | { type: "marquee"; items: string[]; speed?: number; direction?: "left" | "right"; color?: string }
  | { type: "velocity_text"; rows: { text: string; velocity?: number; color?: string }[] }
  | { type: "showcase_grid"; items: { image: string; caption?: string }[]; columns?: 2 | 3 | 4 }
  | { type: "reviews_wall"; columns: { name: string; initials?: string; rating?: number; content: string; avatarColor?: string }[][] }
  | { type: "stats_strip"; items: { value: string; label: string }[] }
  | { type: "big_text"; lines: string[]; emphasisColor?: string; align?: "left" | "center" | "right" }
  | { type: "before_after"; beforeImage: string; afterImage: string; beforeLabel?: string; afterLabel?: string; title?: string }
  | { type: "cta_banner"; title: string; subtitle?: string; ctaLabel?: string; ctaHref?: string; bgVariant?: "glow" | "grid" | "none" };

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  price: number;
  original_price: number | null;
  cover_image: string | null;
  gallery: string[];
  features: { title: string; description?: string }[];
  landing_content: LandingBlock[];
  is_published: boolean;
  sort_order: number;
}

function normalize(row: any): Product {
  return {
    ...row,
    price: Number(row.price),
    original_price: row.original_price != null ? Number(row.original_price) : null,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    features: Array.isArray(row.features) ? row.features : [],
    landing_content: Array.isArray(row.landing_content) ? row.landing_content : [],
  };
}

// Module-level cache so repeat visits paint instantly while we refresh in background.
const listCache: Record<string, Product[]> = {};
const productCache: Record<string, Product> = {};

export function useProducts(opts: { includeUnpublished?: boolean } = {}) {
  const cacheKey = opts.includeUnpublished ? "all" : "published";
  const [products, setProducts] = useState<Product[]>(() => listCache[cacheKey] ?? []);
  const [loading, setLoading] = useState(() => !listCache[cacheKey]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // Only the columns the listing needs . landing_content is huge and not used here.
      const cols = "id, slug, title, tagline, description, price, original_price, cover_image, is_published, sort_order";
      let q = supabase.from("products").select(cols).order("sort_order").order("created_at");
      if (!opts.includeUnpublished) q = q.eq("is_published", true);
      const { data, error } = await q;
      if (cancelled) return;
      if (error) {
        console.error("useProducts: load failed", error);
        setError(error as unknown as Error);
      } else {
        setError(null);
        const next = (data ?? []).map(normalize);
        listCache[cacheKey] = next;
        setProducts(next);
      }
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel("products-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, load)
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [opts.includeUnpublished]);

  return { products, loading, error };
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(() => (slug ? productCache[slug] ?? null : null));
  const [loading, setLoading] = useState(() => !(slug && productCache[slug]));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("useProduct: load failed", error);
        setError(error as unknown as Error);
      } else {
        setError(null);
        const next = data ? normalize(data) : null;
        if (next) productCache[slug] = next;
        setProduct(next);
      }
      setLoading(false);
    };
    load();
    const ch = supabase
      .channel(`product-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `slug=eq.${slug}` }, load)
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
    };
  }, [slug]);

  return { product, loading, error };
}

/** Resolve cover_image: external URL passes through; storage path → signed URL. */
export async function resolveImageUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (value.startsWith("http") || value.startsWith("/") || value.startsWith("data:") || value.startsWith("blob:"))
    return value;
  const { data } = await supabase.storage.from("product-images").createSignedUrl(value, 60 * 60 * 24 * 365);
  return data?.signedUrl ?? null;
}

export function useResolvedImage(value: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    resolveImageUrl(value).then((u) => {
      if (!cancelled) setUrl(u);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);
  return url;
}