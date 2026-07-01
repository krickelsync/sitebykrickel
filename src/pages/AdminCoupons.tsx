import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getFriendlyError } from "@/lib/errors";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
  created_at: string;
};

const AdminCoupons = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [rows, setRows] = useState<Coupon[]>([]);
  const [form, setForm] = useState({
    code: "",
    type: "percent" as "percent" | "fixed",
    value: "10",
    max_uses: "",
    expires_at: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, loading, navigate]);

  const load = async () => {
    const { data } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as Coupon[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (loading || isAdmin === null)
    return <div className="min-h-dvh bg-background flex items-center justify-center font-mono text-sm">Loading…</div>;
  if (!isAdmin) return null;

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const value = Number(form.value);
    if (!code || !value || value <= 0) {
      toast.error("Code and value required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("coupons").insert({
      code,
      type: form.type,
      value: value,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      active: true,
    });
    setSaving(false);
    if (error) return toast.error(getFriendlyError(error));
    toast.success("Coupon created");
    setForm({ code: "", type: "percent", value: "10", max_uses: "", expires_at: "" });
    load();
  };

  const toggle = async (c: Coupon) => {
    const { error } = await supabase.from("coupons").update({ active: !c.active }).eq("id", c.id);
    if (error) toast.error(getFriendlyError(error));
    else load();
  };

  const remove = async (c: Coupon) => {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    const { error } = await supabase.from("coupons").delete().eq("id", c.id);
    if (error) toast.error(getFriendlyError(error));
    else {
      toast.success("Deleted");
      load();
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-secondary">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-display text-xl font-bold uppercase tracking-wider">Coupons</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
        <form onSubmit={create} className="glass-card p-5 grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <label className="md:col-span-2 space-y-1">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Code</span>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="LAUNCH20"
              className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Type</span>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })}
              className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
            >
              <option value="percent">%</option>
              <option value="fixed">$ fixed</option>
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Value</span>
            <input
              type="number"
              step="0.01"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Max uses</span>
            <input
              type="number"
              value={form.max_uses}
              onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
              placeholder="."
              className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-muted-foreground">Expires</span>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-secondary/50 border border-border text-sm font-mono focus:outline-none focus:border-primary/60"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="md:col-span-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm disabled:opacity-60"
          >
            <Plus className="w-4 h-4" /> {saving ? "Creating." : "Create coupon"}
          </button>
        </form>

        <div className="glass-card divide-y divide-border">
          {rows.length === 0 && (
            <p className="p-6 text-sm font-mono text-muted-foreground">No coupons yet.</p>
          )}
          {rows.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(c.code);
                  toast.success("Copied");
                }}
                className="font-display text-lg font-bold tracking-wider inline-flex items-center gap-1.5 hover:text-primary"
              >
                {c.code} <Copy className="w-3 h-3" />
              </button>
              <span className="text-xs font-mono text-muted-foreground">
                {c.type === "percent" ? `${c.value}%` : `$${c.value}`}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {c.used_count}/{c.max_uses ?? "∞"} used
              </span>
              {c.expires_at && (
                <span className="text-[10px] font-mono text-muted-foreground">
                  exp {new Date(c.expires_at).toLocaleDateString()}
                </span>
              )}
              <div className="flex-1" />
              <button
                onClick={() => toggle(c)}
                className={`px-2 py-1 rounded text-[10px] font-mono uppercase ${
                  c.active ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"
                }`}
              >
                {c.active ? "Active" : "Paused"}
              </button>
              <button onClick={() => remove(c)} className="p-2 rounded-lg hover:bg-secondary">
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminCoupons;
