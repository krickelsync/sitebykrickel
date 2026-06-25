import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { resolveImageUrl, type LandingBlock } from "@/hooks/useProducts";
import { toast } from "sonner";

type Feature = { title: string; description?: string };

interface Form {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: string;
  original_price: string;
  cover_image: string;
  is_published: boolean;
  sort_order: number;
  features: Feature[];
  landing_content: LandingBlock[];
}

const empty: Form = {
  slug: "", title: "", tagline: "", description: "",
  price: "0", original_price: "", cover_image: "",
  is_published: false, sort_order: 0,
  features: [], landing_content: [],
};

const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [form, setForm] = useState<Form>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isNew) return;
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          slug: data.slug,
          title: data.title,
          tagline: data.tagline ?? "",
          description: data.description ?? "",
          price: String(data.price),
          original_price: data.original_price != null ? String(data.original_price) : "",
          cover_image: data.cover_image ?? "",
          is_published: data.is_published,
          sort_order: data.sort_order ?? 0,
          features: Array.isArray(data.features) ? data.features as Feature[] : [],
          landing_content: Array.isArray(data.landing_content) ? data.landing_content as LandingBlock[] : [],
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  useEffect(() => {
    resolveImageUrl(form.cover_image).then(setCoverPreview);
  }, [form.cover_image]);

  if (authLoading || isAdmin === null || loading) {
    return <div className="min-h-dvh bg-background flex items-center justify-center font-mono text-sm">Loading…</div>;
  }
  if (!isAdmin) {
    navigate("/admin");
    return null;
  }

  const handleUpload = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    if (error) { toast.error(error.message); return; }
    setForm((f) => ({ ...f, cover_image: path }));
    toast.success("Image uploaded");
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      slug: form.slug.trim().toLowerCase(),
      title: form.title.trim(),
      tagline: form.tagline || null,
      description: form.description || null,
      price: Number(form.price) || 0,
      original_price: form.original_price ? Number(form.original_price) : null,
      cover_image: form.cover_image || null,
      is_published: form.is_published,
      sort_order: Number(form.sort_order) || 0,
      features: form.features,
      landing_content: form.landing_content,
    };
    const res = isNew
      ? await supabase.from("products").insert(payload).select().single()
      : await supabase.from("products").update(payload).eq("id", id!).select().single();
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved");
    navigate("/admin");
  };

  const setField = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const addBlock = (type: LandingBlock["type"]) => {
    const defaults: Record<string, LandingBlock> = {
      hero: { type: "hero", title: "", subtitle: "", image: "" },
      text: { type: "text", body: "" },
      image: { type: "image", src: "", alt: "" },
      gallery: { type: "gallery", images: [] },
      features: { type: "features", items: [] },
      video: { type: "video", url: "" },
      faq: { type: "faq", items: [] },
      animated_hero: { type: "animated_hero", title: "", subtitle: "", badge: "", eyebrow: "", ctaLabel: "", ctaHref: "", bgVariant: "grid" },
      marquee: { type: "marquee", items: [], speed: 30, direction: "left" },
      velocity_text: { type: "velocity_text", rows: [{ text: "", velocity: -2 }] },
      showcase_grid: { type: "showcase_grid", items: [], columns: 3 },
      reviews_wall: { type: "reviews_wall", columns: [[]] },
      stats_strip: { type: "stats_strip", items: [] },
      big_text: { type: "big_text", lines: [""], align: "center" },
      before_after: { type: "before_after", beforeImage: "", afterImage: "", beforeLabel: "BEFORE", afterLabel: "AFTER" },
      cta_banner: { type: "cta_banner", title: "", subtitle: "", ctaLabel: "", ctaHref: "", bgVariant: "glow" },
    };
    setForm((f) => ({ ...f, landing_content: [...f.landing_content, defaults[type]] }));
  };

  const updateBlock = (i: number, patch: any) => {
    setForm((f) => ({
      ...f,
      landing_content: f.landing_content.map((b, idx) => idx === i ? { ...b, ...patch } : b),
    }));
  };

  const removeBlock = (i: number) => {
    setForm((f) => ({ ...f, landing_content: f.landing_content.filter((_, idx) => idx !== i) }));
  };

  const moveBlock = (i: number, dir: -1 | 1) => {
    setForm((f) => {
      const arr = [...f.landing_content];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return f;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...f, landing_content: arr };
    });
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <button onClick={save} disabled={saving}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <h1 className="font-display text-2xl font-bold">{isNew ? "New product" : "Edit product"}</h1>

        <div className="glass-card p-6 space-y-4">
          <Field label="Title">
            <input className={inputCls} value={form.title} onChange={(e) => setField("title", e.target.value)} />
          </Field>
          <Field label="Slug (URL)">
            <input className={inputCls} value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="my-product" />
          </Field>
          <Field label="Tagline">
            <input className={inputCls} value={form.tagline} onChange={(e) => setField("tagline", e.target.value)} />
          </Field>
          <Field label="Short description">
            <textarea rows={3} className={inputCls} value={form.description} onChange={(e) => setField("description", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (USD)">
              <input type="number" step="0.01" className={inputCls} value={form.price} onChange={(e) => setField("price", e.target.value)} />
            </Field>
            <Field label="Original price (optional)">
              <input type="number" step="0.01" className={inputCls} value={form.original_price} onChange={(e) => setField("original_price", e.target.value)} />
            </Field>
          </div>

          <Field label="Cover image">
            <div className="space-y-2">
              {coverPreview && <img src={coverPreview} alt="" className="w-32 h-32 rounded-lg object-cover" />}
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/70 cursor-pointer font-mono text-sm w-fit">
                <Upload className="w-4 h-4" /> Upload image
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
              </label>
              <input className={inputCls} value={form.cover_image} onChange={(e) => setField("cover_image", e.target.value)} placeholder="…or paste URL / storage path" />
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Sort order">
              <input type="number" className={inputCls} value={form.sort_order} onChange={(e) => setField("sort_order", Number(e.target.value))} />
            </Field>
            <label className="flex items-center gap-2 font-mono text-sm pb-3">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setField("is_published", e.target.checked)} />
              Published
            </label>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold">Features (bullet list)</h2>
            <button onClick={() => setField("features", [...form.features, { title: "", description: "" }])}
              className="px-3 py-1 rounded bg-secondary text-sm font-mono">+ Add</button>
          </div>
          {form.features.map((f, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className={inputCls} placeholder="Title" value={f.title}
                onChange={(e) => setField("features", form.features.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
              <input className={inputCls} placeholder="Description" value={f.description ?? ""}
                onChange={(e) => setField("features", form.features.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} />
              <button onClick={() => setField("features", form.features.filter((_, idx) => idx !== i))}
                className="p-2 rounded bg-secondary"><Trash2 className="w-4 h-4 text-destructive" /></button>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="font-display font-bold">Landing page blocks</h2>
            <div className="flex flex-wrap gap-1">
              {([
                "animated_hero", "big_text", "marquee", "velocity_text", "showcase_grid",
                "reviews_wall", "stats_strip", "before_after", "cta_banner",
                "hero", "text", "image", "gallery", "features", "video", "faq",
              ] as const).map((t) => (
                <button key={t} onClick={() => addBlock(t)} className="px-2 py-1 rounded bg-secondary text-xs font-mono">
                  <Plus className="w-3 h-3 inline" /> {t}
                </button>
              ))}
            </div>
          </div>

          {form.landing_content.length === 0 && (
            <p className="text-sm font-mono text-muted-foreground">No blocks yet. Add hero/text/image/etc.</p>
          )}

          {form.landing_content.map((b, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-primary">{b.type}</span>
                <div className="flex gap-1">
                  <button onClick={() => moveBlock(i, -1)} className="px-2 py-1 rounded bg-secondary text-xs">↑</button>
                  <button onClick={() => moveBlock(i, 1)} className="px-2 py-1 rounded bg-secondary text-xs">↓</button>
                  <button onClick={() => removeBlock(i)} className="px-2 py-1 rounded bg-secondary text-xs"><Trash2 className="w-3 h-3 text-destructive" /></button>
                </div>
              </div>
              <BlockEditor block={b} onChange={(patch) => updateBlock(i, patch)} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const inputCls = "w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none font-mono text-sm";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</label>
    {children}
  </div>
);

const BlockEditor = ({ block, onChange }: { block: LandingBlock; onChange: (p: any) => void }) => {
  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-2">
          <input className={inputCls} placeholder="Title" value={block.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} />
          <input className={inputCls} placeholder="Subtitle" value={block.subtitle ?? ""} onChange={(e) => onChange({ subtitle: e.target.value })} />
          <input className={inputCls} placeholder="Image URL" value={block.image ?? ""} onChange={(e) => onChange({ image: e.target.value })} />
        </div>
      );
    case "text":
      return <textarea rows={5} className={inputCls} placeholder="Body" value={block.body} onChange={(e) => onChange({ body: e.target.value })} />;
    case "image":
      return (
        <div className="space-y-2">
          <input className={inputCls} placeholder="Image URL" value={block.src} onChange={(e) => onChange({ src: e.target.value })} />
          <input className={inputCls} placeholder="Alt text" value={block.alt ?? ""} onChange={(e) => onChange({ alt: e.target.value })} />
        </div>
      );
    case "gallery":
      return (
        <textarea rows={4} className={inputCls} placeholder="One image URL per line"
          value={block.images.join("\n")}
          onChange={(e) => onChange({ images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
      );
    case "video":
      return <input className={inputCls} placeholder="Embed URL (YouTube/Vimeo)" value={block.url} onChange={(e) => onChange({ url: e.target.value })} />;
    case "features":
      return (
        <div className="space-y-2">
          {block.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className={inputCls} placeholder="Title" value={it.title}
                onChange={(e) => onChange({ items: block.items.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x) })} />
              <input className={inputCls} placeholder="Description" value={it.description ?? ""}
                onChange={(e) => onChange({ items: block.items.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x) })} />
              <button onClick={() => onChange({ items: block.items.filter((_, idx) => idx !== i) })}
                className="p-2 rounded bg-secondary"><Trash2 className="w-3 h-3 text-destructive" /></button>
            </div>
          ))}
          <button onClick={() => onChange({ items: [...block.items, { title: "", description: "" }] })}
            className="px-3 py-1 rounded bg-secondary text-xs font-mono">+ Add item</button>
        </div>
      );
    case "faq":
      return (
        <div className="space-y-2">
          {block.items.map((it, i) => (
            <div key={i} className="space-y-1">
              <input className={inputCls} placeholder="Question" value={it.q}
                onChange={(e) => onChange({ items: block.items.map((x, idx) => idx === i ? { ...x, q: e.target.value } : x) })} />
              <textarea rows={2} className={inputCls} placeholder="Answer" value={it.a}
                onChange={(e) => onChange({ items: block.items.map((x, idx) => idx === i ? { ...x, a: e.target.value } : x) })} />
              <button onClick={() => onChange({ items: block.items.filter((_, idx) => idx !== i) })}
                className="text-xs text-destructive font-mono">Remove</button>
            </div>
          ))}
          <button onClick={() => onChange({ items: [...block.items, { q: "", a: "" }] })}
            className="px-3 py-1 rounded bg-secondary text-xs font-mono">+ Add Q&amp;A</button>
        </div>
      );
    default:
      return null;
  }
};

export default AdminProductEdit;