import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Copy, Download, LogOut, Mail, Loader2, Check, Package } from "lucide-react";

type Order = {
  id: string;
  paypal_order_id: string;
  product_title: string | null;
  buyer_email: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  theme_slug: string | null;
  license_key: string | null;
  download_url: string | null;
  license_issued_at: string | null;
  license_error: string | null;
  addons: Record<string, boolean> | null;
  install_status: string | null;
  created_at: string;
};

const Account = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Your account — SitebyKrickel";
  }, []);

  const fetchOrders = useMemo(
    () => async () => {
      setOrdersLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, paypal_order_id, product_title, buyer_email, amount, currency, status, theme_slug, license_key, download_url, license_issued_at, license_error, addons, install_status, created_at"
        )
        .order("created_at", { ascending: false });
      setOrdersLoading(false);
      if (error) {
        toast.error("Couldn't load your orders");
        return;
      }
      setOrders((data ?? []) as Order[]);
    },
    []
  );

  useEffect(() => {
    if (user) void fetchOrders();
    else setOrders(null);
  }, [user, fetchOrders]);

  const handleGoogle = async () => {
    setSending(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/account",
    });
    if (result.error) {
      setSending(false);
      toast.error(result.error.message || "Sign in failed");
      return;
    }
    if (result.redirected) return;
    setSending(false);
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + "/account" },
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your inbox for a sign-in link");
  };

  const copyKey = async (order: Order) => {
    if (!order.license_key) return;
    try {
      await navigator.clipboard.writeText(order.license_key);
      setCopiedId(order.id);
      toast.success("License key copied");
      setTimeout(() => setCopiedId((v) => (v === order.id ? null : v)), 1800);
    } catch {
      toast.error("Copy failed");
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  if (loading) {
    return <div className="min-h-[100svh]" aria-hidden />;
  }

  if (!user) {
    return (
      <main className="min-h-[100svh] pt-28 pb-16 px-4 flex items-start justify-center">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-8 space-y-6">
          <div>
            <h1 className="font-syne font-bold text-3xl uppercase tracking-tighter">
              Your account
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-2">
              Sign in with the email you used at checkout to see every receipt, license key
              and download link.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={sending}
            className="w-full py-3 rounded-full bg-foreground text-background font-mono uppercase tracking-wider text-xs disabled:opacity-50 flex items-center justify-center gap-3 hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.5-4.8 9.5-9.6 0-.6 0-1.2-.1-1.8H12z" />
            </svg>
            {sending ? "Signing in…" : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or email link <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleMagicLink} className="space-y-3">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-border bg-background/60 px-4 py-3 text-sm font-mono outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={sending || !email.trim()}
              className="w-full py-3 rounded-full border border-border font-mono uppercase tracking-wider text-xs disabled:opacity-50 hover:bg-foreground/5 flex items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" /> Send magic link
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] pt-28 pb-24 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Signed in as {user.email}
            </p>
            <h1 className="font-syne font-bold text-4xl md:text-5xl uppercase tracking-tighter mt-1">
              Your library
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-2 max-w-lg">
              Every SYNC theme you own, with license keys and download links. Nothing gets lost.
            </p>
          </div>
          <button
            onClick={signOut}
            className="font-mono text-[11px] uppercase tracking-wider inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 hover:bg-foreground/5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </header>

        {ordersLoading && !orders ? (
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading orders…
          </div>
        ) : orders && orders.length > 0 ? (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-5 md:p-6 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-syne font-bold text-lg md:text-xl truncate">
                      {order.product_title ?? order.theme_slug ?? "SYNC theme"}
                    </h2>
                    <p className="font-mono text-[11px] text-muted-foreground mt-1">
                      {new Date(order.created_at).toLocaleString()} · Order {order.paypal_order_id}
                    </p>
                    {order.addons && (order.addons.remove_watermark || order.addons.install_setup) && (
                      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                        {order.addons.remove_watermark && "Remove watermark"}
                        {order.addons.remove_watermark && order.addons.install_setup && " · "}
                        {order.addons.install_setup &&
                          `Theme install (${order.install_status ?? "pending"})`}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-syne font-bold text-lg">
                      ${Number(order.amount ?? 0).toFixed(2)}{" "}
                      <span className="text-xs text-muted-foreground font-mono">{order.currency ?? "USD"}</span>
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                      {order.status ?? "—"}
                    </p>
                  </div>
                </div>

                {order.license_key && order.download_url ? (
                  <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Lifetime license key
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-xs md:text-sm break-all bg-background/60 rounded-lg px-3 py-2 border border-border">
                        {order.license_key}
                      </code>
                      <button
                        onClick={() => copyKey(order)}
                        className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-foreground/5"
                        aria-label="Copy license key"
                      >
                        {copiedId === order.id ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <a
                        href={order.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-mono uppercase tracking-wider text-xs py-3 hover:opacity-90"
                      >
                        <Download className="w-4 h-4" /> Download theme ZIP
                      </a>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 font-mono text-xs text-muted-foreground">
                    {order.license_error
                      ? `License pending. Reason: ${order.license_error}. We're on it.`
                      : "License is being issued. Refresh in a moment."}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full border border-border mx-auto flex items-center justify-center">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-syne font-bold text-xl uppercase tracking-tighter">
              No orders yet
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              If you bought using a different email, sign in with that one instead.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Account;