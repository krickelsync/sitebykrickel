import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";

type Result = {
  license_key: string;
  download_url: string;
  paypal_order_id: string;
  order_id: string | null;
};

const AdminIssueLicense = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const { products } = useProducts({ includeUnpublished: true });

  const [themeSlug, setThemeSlug] = useState("sync");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/admin/login", { replace: true });
  }, [user, authLoading, navigate]);

  if (authLoading || isAdmin === null) {
    return <div className="min-h-dvh bg-background flex items-center justify-center font-mono text-sm">Loading…</div>;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center p-6">
        <p className="font-mono text-sm text-muted-foreground">Admin only.</p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail.trim()) {
      toast.error("Buyer email required");
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("admin-issue-license", {
        body: {
          theme_slug: themeSlug.trim(),
          buyer_email: buyerEmail.trim(),
          buyer_name: buyerName.trim() || null,
          amount: amount ? Number(amount) : undefined,
          note: note.trim() || null,
          send_email: sendEmail,
        },
      });
      if (error) throw error;
      if (!data?.ok) throw new Error(data?.error ?? "Issue failed");
      setResult(data as Result);
      toast.success("License issued");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Issue failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const copy = (v: string, label: string) => {
    navigator.clipboard.writeText(v);
    toast.success(`${label} copied`);
  };

  const themeOptions = Array.from(
    new Set(["sync", ...products.map((p) => p.slug)]),
  );

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg hover:bg-secondary" aria-label="Back">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-display text-xl font-bold uppercase tracking-wider">
              Manual Issue License
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <form onSubmit={submit} className="glass-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1.5 block">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Theme slug
              </span>
              <input
                list="theme-slugs"
                value={themeSlug}
                onChange={(e) => setThemeSlug(e.target.value)}
                required
                className="w-full rounded-md bg-secondary/40 border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
              />
              <datalist id="theme-slugs">
                {themeOptions.map((s) => <option key={s} value={s} />)}
              </datalist>
            </label>
            <label className="space-y-1.5 block">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Buyer email <span className="text-red-400">*</span>
              </span>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                required
                className="w-full rounded-md bg-secondary/40 border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
              />
            </label>
            <label className="space-y-1.5 block">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Buyer name
              </span>
              <input
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full rounded-md bg-secondary/40 border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
              />
            </label>
            <label className="space-y-1.5 block">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Amount (USD, optional)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-md bg-secondary/40 border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary/60"
              />
            </label>
          </div>

          <label className="space-y-1.5 block">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Internal note
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Reason. gift, comp, migration from Gumroad, etc."
              className="w-full rounded-md bg-secondary/40 border border-border px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:border-primary/60"
            />
          </label>

          <label className="flex items-center gap-2 text-xs font-mono">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded border-border"
            />
            Send receipt email to buyer
          </label>

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Issuing…" : "Issue license"}
            </button>
            <p className="text-[11px] font-mono text-muted-foreground">
              Reference will be tagged MANUAL-&lt;uuid&gt; in orders.
            </p>
          </div>
        </form>

        {result && (
          <div className="glass-card p-6 space-y-4 border border-emerald-500/30">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono uppercase">
                Issued
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {result.paypal_order_id}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
                License key
              </p>
              <div className="flex items-center gap-2 glass-card p-3">
                <code className="flex-1 text-xs font-mono break-all">{result.license_key}</code>
                <button
                  onClick={() => copy(result.license_key, "License")}
                  className="p-1.5 rounded hover:bg-secondary"
                  aria-label="Copy license"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <a
              href={result.download_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
            >
              Download ZIP <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminIssueLicense;