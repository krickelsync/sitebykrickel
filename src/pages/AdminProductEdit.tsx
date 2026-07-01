import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { resolveImageUrl, type LandingBlock } from "@/hooks/useProducts";
import { toast } from "sonner";
import { getFriendlyError } from "@/lib/errors";

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
    // Bounce non-admins out of the editor (after the role check resolves).
    if (isAdmin === false) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        toast.error(getFriendlyError(error));
        setLoading(false);
        return;
      }
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
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  useEffect(() => {
    resolveImageUrl(form.cover_image).then(setCoverPreview);
  }, [form.cover_image]);

  if (authLoading || isAdmin === null || loading) {
    return <div className="min-h-dvh bg-background flex items-center justify-center font-mono text-sm">Loading…</div>;
  }
  if (!isAdmin) {
    // Redirect is handled by the effect above; render nothing in the meantime.
    return null;
  }

  const handleUpload = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    if (error) { toast.error(getFriendlyError(error)); return; }
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
    if (res.error) { toast.error(getFriendlyError(res.error)); return; }
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
    case "animated_hero":
      return (
        <div className="space-y-2">
          <input className={inputCls} placeholder="Eyebrow" value={block.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />
          <input className={inputCls} placeholder="Badge (small pill)" value={block.badge ?? ""} onChange={(e) => onChange({ badge: e.target.value })} />
          <textarea rows={2} className={inputCls} placeholder="Title (use new line for multi-line)" value={block.title} onChange={(e) => onChange({ title: e.target.value })} />
          <textarea rows={2} className={inputCls} placeholder="Subtitle" value={block.subtitle ?? ""} onChange={(e) => onChange({ subtitle: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="CTA label" value={block.ctaLabel ?? ""} onChange={(e) => onChange({ ctaLabel: e.target.value })} />
            <input className={inputCls} placeholder="CTA href" value={block.ctaHref ?? ""} onChange={(e) => onChange({ ctaHref: e.target.value })} />
          </div>
          <select className={inputCls} value={block.bgVariant ?? "grid"} onChange={(e) => onChange({ bgVariant: e.target.value })}>
            <option value="grid">Background: Grid drift</option>
            <option value="prism">Background: Prism glow</option>
            <option value="noise">Background: Noise grain</option>
            <option value="none">Background: None</option>
          </select>
        </div>
      );
    case "marquee":
      return (
        <div className="space-y-2">
          <textarea rows={4} className={inputCls} placeholder="One item per line"
            value={block.items.join("\n")}
            onChange={(e) => onChange({ items: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
          <div className="grid grid-cols-3 gap-2">
            <input type="number" className={inputCls} placeholder="Speed (sec)" value={block.speed ?? 30} onChange={(e) => onChange({ speed: Number(e.target.value) })} />
            <select className={inputCls} value={block.direction ?? "left"} onChange={(e) => onChange({ direction: e.target.value })}>
              <option value="left">← Left</option>
              <option value="right">Right →</option>
            </select>
            <input className={inputCls} placeholder="Color (#hex)" value={block.color ?? ""} onChange={(e) => onChange({ color: e.target.value })} />
          </div>
        </div>
      );
    case "velocity_text":
      return (
        <div className="space-y-2">
          {block.rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[2fr_80px_100px_auto] gap-2">
              <input className={inputCls} placeholder="Text" value={r.text} onChange={(e) => onChange({ rows: block.rows.map((x, idx) => idx === i ? { ...x, text: e.target.value } : x) })} />
              <input type="number" className={inputCls} placeholder="Velocity" value={r.velocity ?? -2} onChange={(e) => onChange({ rows: block.rows.map((x, idx) => idx === i ? { ...x, velocity: Number(e.target.value) } : x) })} />
              <input className={inputCls} placeholder="Color" value={r.color ?? ""} onChange={(e) => onChange({ rows: block.rows.map((x, idx) => idx === i ? { ...x, color: e.target.value } : x) })} />
              <button onClick={() => onChange({ rows: block.rows.filter((_, idx) => idx !== i) })} className="p-2 rounded bg-secondary"><Trash2 className="w-3 h-3 text-destructive" /></button>
            </div>
          ))}
          <button onClick={() => onChange({ rows: [...block.rows, { text: "", velocity: 2 }] })} className="px-3 py-1 rounded bg-secondary text-xs font-mono">+ Add row</button>
        </div>
      );
    case "showcase_grid":
      return (
        <div className="space-y-2">
          <select className={inputCls} value={block.columns ?? 3} onChange={(e) => onChange({ columns: Number(e.target.value) })}>
            <option value={2}>2 columns</option>
            <option value={3}>3 columns</option>
            <option value={4}>4 columns</option>
          </select>
          {block.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[2fr_2fr_auto] gap-2">
              <input className={inputCls} placeholder="Image URL" value={it.image} onChange={(e) => onChange({ items: block.items.map((x, idx) => idx === i ? { ...x, image: e.target.value } : x) })} />
              <input className={inputCls} placeholder="Caption" value={it.caption ?? ""} onChange={(e) => onChange({ items: block.items.map((x, idx) => idx === i ? { ...x, caption: e.target.value } : x) })} />
              <button onClick={() => onChange({ items: block.items.filter((_, idx) => idx !== i) })} className="p-2 rounded bg-secondary"><Trash2 className="w-3 h-3 text-destructive" /></button>
            </div>
          ))}
          <button onClick={() => onChange({ items: [...block.items, { image: "", caption: "" }] })} className="px-3 py-1 rounded bg-secondary text-xs font-mono">+ Add image</button>
        </div>
      );
    case "reviews_wall":
      return (
        <div className="space-y-3">
          {block.columns.map((col, ci) => (
            <div key={ci} className="border border-border/50 rounded p-2 space-y-2">
              <p className="text-xs font-mono text-muted-foreground">Column {ci + 1}</p>
              {col.map((r, i) => (
                <div key={i} className="space-y-1 bg-secondary/30 p-2 rounded">
                  <div className="grid grid-cols-3 gap-1">
                    <input className={inputCls} placeholder="Name" value={r.name} onChange={(e) => onChange({ columns: block.columns.map((c, cidx) => cidx === ci ? c.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x) : c) })} />
                    <input type="number" min={1} max={5} className={inputCls} placeholder="Rating" value={r.rating ?? 5} onChange={(e) => onChange({ columns: block.columns.map((c, cidx) => cidx === ci ? c.map((x, idx) => idx === i ? { ...x, rating: Number(e.target.value) } : x) : c) })} />
                    <input className={inputCls} placeholder="Avatar color (tw class)" value={r.avatarColor ?? ""} onChange={(e) => onChange({ columns: block.columns.map((c, cidx) => cidx === ci ? c.map((x, idx) => idx === i ? { ...x, avatarColor: e.target.value } : x) : c) })} />
                  </div>
                  <textarea rows={2} className={inputCls} placeholder="Content" value={r.content} onChange={(e) => onChange({ columns: block.columns.map((c, cidx) => cidx === ci ? c.map((x, idx) => idx === i ? { ...x, content: e.target.value } : x) : c) })} />
                  <button onClick={() => onChange({ columns: block.columns.map((c, cidx) => cidx === ci ? c.filter((_, idx) => idx !== i) : c) })} className="text-xs text-destructive font-mono">Remove review</button>
                </div>
              ))}
              <button onClick={() => onChange({ columns: block.columns.map((c, cidx) => cidx === ci ? [...c, { name: "", content: "", rating: 5 }] : c) })} className="px-2 py-1 rounded bg-secondary text-xs font-mono">+ Add review</button>
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={() => onChange({ columns: [...block.columns, []] })} className="px-3 py-1 rounded bg-secondary text-xs font-mono">+ Add column</button>
            {block.columns.length > 1 && (
              <button onClick={() => onChange({ columns: block.columns.slice(0, -1) })} className="px-3 py-1 rounded bg-secondary text-xs font-mono">- Remove last column</button>
            )}
          </div>
        </div>
      );
    case "stats_strip":
      return (
        <div className="space-y-2">
          {block.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className={inputCls} placeholder="Value (e.g. 500+)" value={it.value} onChange={(e) => onChange({ items: block.items.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x) })} />
              <input className={inputCls} placeholder="Label" value={it.label} onChange={(e) => onChange({ items: block.items.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x) })} />
              <button onClick={() => onChange({ items: block.items.filter((_, idx) => idx !== i) })} className="p-2 rounded bg-secondary"><Trash2 className="w-3 h-3 text-destructive" /></button>
            </div>
          ))}
          <button onClick={() => onChange({ items: [...block.items, { value: "", label: "" }] })} className="px-3 py-1 rounded bg-secondary text-xs font-mono">+ Add stat</button>
        </div>
      );
    case "big_text":
      return (
        <div className="space-y-2">
          <select className={inputCls} value={block.align ?? "center"} onChange={(e) => onChange({ align: e.target.value })}>
            <option value="left">Align left</option>
            <option value="center">Align center</option>
            <option value="right">Align right</option>
          </select>
          <input className={inputCls} placeholder="Emphasis color (#hex) . apply to lines starting with *" value={block.emphasisColor ?? ""} onChange={(e) => onChange({ emphasisColor: e.target.value })} />
          <textarea rows={5} className={inputCls} placeholder="One line per row. Prefix with * for emphasis color." value={block.lines.join("\n")}
            onChange={(e) => onChange({ lines: e.target.value.split("\n") })} />
        </div>
      );
    case "before_after":
      return (
        <div className="space-y-2">
          <input className={inputCls} placeholder="Title (optional)" value={block.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Before image URL" value={block.beforeImage} onChange={(e) => onChange({ beforeImage: e.target.value })} />
            <input className={inputCls} placeholder="After image URL" value={block.afterImage} onChange={(e) => onChange({ afterImage: e.target.value })} />
            <input className={inputCls} placeholder="Before label" value={block.beforeLabel ?? "BEFORE"} onChange={(e) => onChange({ beforeLabel: e.target.value })} />
            <input className={inputCls} placeholder="After label" value={block.afterLabel ?? "AFTER"} onChange={(e) => onChange({ afterLabel: e.target.value })} />
          </div>
        </div>
      );
    case "cta_banner":
      return (
        <div className="space-y-2">
          <input className={inputCls} placeholder="Title" value={block.title} onChange={(e) => onChange({ title: e.target.value })} />
          <textarea rows={2} className={inputCls} placeholder="Subtitle" value={block.subtitle ?? ""} onChange={(e) => onChange({ subtitle: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="CTA label" value={block.ctaLabel ?? ""} onChange={(e) => onChange({ ctaLabel: e.target.value })} />
            <input className={inputCls} placeholder="CTA href" value={block.ctaHref ?? ""} onChange={(e) => onChange({ ctaHref: e.target.value })} />
          </div>
          <select className={inputCls} value={block.bgVariant ?? "glow"} onChange={(e) => onChange({ bgVariant: e.target.value })}>
            <option value="glow">Background: Glow</option>
            <option value="grid">Background: Grid</option>
            <option value="none">Background: None</option>
          </select>
        </div>
      );
    default:
      return null;
  }
};

export default AdminProductEdit;
