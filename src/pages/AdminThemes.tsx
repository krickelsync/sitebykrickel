import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";

type Theme = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  download_url: string | null;
  price: number;
  currency: string;
  active: boolean;
};

const empty = {
  slug: "",
  name: "",
  description: "",
  download_url: "",
  price: "0",
  currency: "USD",
};

const AdminThemes = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [rows, setRows] = useState<Theme[]>([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, loading, navigate]);

  const load = async () => {
    const { data } = await supabase.from("themes").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Theme[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (loading || isAdmin === null)
    return <div className="min-h-dvh bg-background flex items-center justify-center font-mono text-sm">Loading…</div>;
  if (!isAdmin) return null;

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (!slug || !form.name.trim()) return toast.error("Slug and name required");
    setSaving(true);
    const { error } = await supabase.from("themes").insert({
      slug,
      name: form.name.trim(),
      description: form.description || null,
      download_url: form.download_url || null,
      price: Number(form.price) || 0,
      currency: form.currency.toUpperCase(),
      active: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Theme created");
    setForm(empty);
    load();
  };

  const patch = async (id: string, values: Partial<Theme>) => {
    const { error } = await supabase.from("themes").update(values).eq("id", id);
    if (error) toast.error(error.message);
    else load();
  };

  const remove = async (t: Theme) => {
    if (!confirm(`Delete theme ${t.slug}?`)) return;
    const { error } = await supabase.from("themes").delete().eq("id", t.id);
    if (error) toast.error(error.message);
    else load();
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display text-xl font-bold uppercase tracking-wider">Themes</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-5xl">
        <form onSubmit={create} className="glass-card p-5 grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="theme-slug"
            className="md:col-span-2 px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
          />
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Display name"
            className="md:col-span-2 px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
          />
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            className="px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
          />
          <input
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            placeholder="USD"
            maxLength={3}
            className="px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
          />
          <input
            value={form.download_url}
            onChange={(e) => setForm({ ...form, download_url: e.target.value })}
            placeholder="Download URL (optional)"
            className="md:col-span-3 px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
          />
          <input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description (optional)"
            className="md:col-span-3 px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
          />
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm disabled:opacity-60"
          >
            <Plus className="w-4 h-4" /> {saving ? "Creating." : "Create theme"}
          </button>
        </form>

        <div className="glass-card divide-y divide-border">
          {rows.length === 0 && (
            <p className="p-6 text-sm font-mono text-muted-foreground">No themes yet.</p>
          )}
          {rows.map((t) => (
            <ThemeRow key={t.id} theme={t} onPatch={patch} onRemove={remove} />
          ))}
        </div>
      </main>
    </div>
  );
};

function ThemeRow({
  theme,
  onPatch,
  onRemove,
}: {
  theme: Theme;
  onPatch: (id: string, values: Partial<Theme>) => void;
  onRemove: (t: Theme) => void;
}) {
  const [name, setName] = useState(theme.name);
  const [price, setPrice] = useState(String(theme.price));
  const [url, setUrl] = useState(theme.download_url ?? "");

  const dirty = name !== theme.name || Number(price) !== Number(theme.price) || url !== (theme.download_url ?? "");

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-[1fr_2fr_100px_auto_auto_auto] gap-3 items-center">
      <code className="text-xs font-mono text-primary truncate">{theme.slug}</code>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-2 py-1.5 rounded bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
      />
      <input
        type="number"
        step="0.01"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="px-2 py-1.5 rounded bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="download url"
        className="md:col-span-1 px-2 py-1.5 rounded bg-secondary/50 border border-border text-xs font-mono focus:outline-none focus:border-primary/60"
      />
      <button
        onClick={() => onPatch(theme.id, { active: !theme.active })}
        className={`px-2 py-1 rounded text-[10px] font-mono uppercase ${
          theme.active ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"
        }`}
      >
        {theme.active ? "Active" : "Hidden"}
      </button>
      <div className="flex items-center gap-1">
        {dirty && (
          <button
            onClick={() => onPatch(theme.id, { name, price: Number(price), download_url: url || null })}
            className="p-2 rounded-lg hover:bg-secondary text-primary"
            aria-label="Save"
          >
            <Save className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => onRemove(theme)} className="p-2 rounded-lg hover:bg-secondary">
          <Trash2 className="w-4 h-4 text-destructive" />
        </button>
      </div>
    </div>
  );
}

export default AdminThemes;