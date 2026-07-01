import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Loader2,
  Package,
  Receipt,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

type Order = {
  id: string;
  paypal_order_id: string;
  paypal_capture_id: string | null;
  product_title: string | null;
  theme_slug: string | null;
  buyer_email: string | null;
  buyer_name: string | null;
  amount: number | null;
  subtotal: number | null;
  processing_fee: number | null;
  discount_amount: number | null;
  coupon_code: string | null;
  currency: string | null;
  status: string | null;
  license_key: string | null;
  download_url: string | null;
  license_issued_at: string | null;
  license_error: string | null;
  license_revoked_at: string | null;
  email_sent_at: string | null;
  refunded_amount: number | null;
  refunded_at: string | null;
  addons: Record<string, boolean> | null;
  install_status: string | null;
  created_at: string;
};

const fmtMoney = (v: number | null | undefined, cur = "USD") =>
  `$${Number(v ?? 0).toFixed(2)} ${cur}`;

const fmtDate = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleString() : "—";

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-baseline justify-between gap-4 py-2 border-b border-border/60 last:border-b-0">
    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    <span className="font-mono text-xs md:text-sm text-right break-all">{value}</span>
  </div>
);

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [fetching, setFetching] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Order details — SitebyKrickel";
  }, []);

  useEffect(() => {
    if (!user || !id) return;
    let cancelled = false;
    (async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      setFetching(false);
      if (error) {
        toast.error("Couldn't load this order");
        return;
      }
      setOrder(data as unknown as Order);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const copy = async (label: string, value: string | null | undefined) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied((v) => (v === label ? null : v)), 1600);
    } catch {
      toast.error("Copy failed");
    }
  };

  if (loading || fetching) {
    return (
      <main className="min-h-[100svh] pt-28 pb-16 px-4 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-[100svh] pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="font-mono text-sm text-muted-foreground">
            Sign in to view your order.
          </p>
          <Link
            to="/account"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wider hover:bg-foreground/5"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-[100svh] pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Package className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="font-syne font-bold text-xl uppercase tracking-tighter">
            Order not found
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            It may belong to a different email.
          </p>
          <Link
            to="/account"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-wider hover:bg-foreground/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to library
          </Link>
        </div>
      </main>
    );
  }

  const hasLicense = !!order.license_key && !order.license_revoked_at;
  const wantsInstall = !!order.addons?.install_setup;
  const installStatus = order.install_status ?? (wantsInstall ? "pending" : "not_requested");

  const installLabel =
    installStatus === "completed"
      ? "Installed & activated in your store"
      : installStatus === "in_progress"
      ? "Install in progress"
      : installStatus === "pending"
      ? "Install queued"
      : wantsInstall
      ? "Install queued"
      : "Self-install (no add-on purchased)";

  const installTone =
    installStatus === "completed"
      ? "text-primary border-primary/40 bg-primary/10"
      : "text-muted-foreground border-border bg-secondary/30";

  return (
    <main className="min-h-[100svh] pt-28 pb-24 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to library
        </Link>

        <header className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6 md:p-8 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Order {order.paypal_order_id}
          </p>
          <h1 className="font-syne font-bold text-3xl md:text-4xl uppercase tracking-tighter">
            {order.product_title ?? order.theme_slug ?? "SYNC theme"}
          </h1>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
              <Receipt className="w-3 h-3" /> {order.status ?? "—"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 font-mono text-[10px] uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />{" "}
              {hasLicense ? "License active" : order.license_revoked_at ? "License revoked" : "License pending"}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${installTone}`}
            >
              <Truck className="w-3 h-3" /> {installLabel}
            </span>
          </div>
        </header>

        {/* License & download */}
        <section className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-syne font-bold text-lg uppercase tracking-tight">
              Product key & theme file
            </h2>
          </div>

          {hasLicense ? (
            <>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  Lifetime license key
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-xs md:text-sm break-all bg-background/60 rounded-lg px-3 py-2 border border-border">
                    {order.license_key}
                  </code>
                  <button
                    onClick={() => copy("License key", order.license_key)}
                    className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-foreground/5"
                    aria-label="Copy license key"
                  >
                    {copied === "License key" ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-2">
                  Issued {fmtDate(order.license_issued_at)}
                </p>
              </div>

              {order.download_url && (
                <a
                  href={order.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-mono uppercase tracking-wider text-xs py-3 hover:opacity-90"
                >
                  <Download className="w-4 h-4" /> Download theme ZIP
                </a>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 font-mono text-xs text-muted-foreground">
              {order.license_revoked_at
                ? `License was revoked on ${fmtDate(order.license_revoked_at)}. Contact support if this is unexpected.`
                : order.license_error
                ? `License pending. Reason: ${order.license_error}. We're on it.`
                : "License is being issued. Refresh in a moment."}
            </div>
          )}
        </section>

        {/* Install status */}
        <section className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-primary" />
            <h2 className="font-syne font-bold text-lg uppercase tracking-tight">
              Theme installation
            </h2>
          </div>
          {wantsInstall ? (
            <div className="space-y-2 font-mono text-xs">
              <Row label="Add-on purchased" value="Theme Install +$50" />
              <Row
                label="Status"
                value={
                  <span
                    className={
                      installStatus === "completed"
                        ? "text-primary"
                        : "text-foreground"
                    }
                  >
                    {installStatus.replace("_", " ")}
                  </span>
                }
              />
              <Row
                label="Activated in your Shopify store"
                value={installStatus === "completed" ? "Yes" : "Not yet"}
              />
              {installStatus !== "completed" && (
                <p className="text-[11px] text-muted-foreground pt-2">
                  We'll email {order.buyer_email} once the theme is published to your store.
                </p>
              )}
            </div>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">
              You're on self-install. Upload the theme ZIP to Shopify → Online Store → Themes.
              Need us to do it for you? Reply to your receipt email and we'll add it.
            </p>
          )}
        </section>

        {/* Receipt */}
        <section className="rounded-3xl border border-border bg-card/60 backdrop-blur-sm p-6 md:p-8 space-y-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <h2 className="font-syne font-bold text-lg uppercase tracking-tight">
              Receipt
            </h2>
          </div>
          <div>
            <Row label="Purchased" value={fmtDate(order.created_at)} />
            <Row label="Buyer" value={order.buyer_email ?? "—"} />
            <Row label="PayPal order" value={order.paypal_order_id} />
            {order.paypal_capture_id && (
              <Row label="PayPal capture" value={order.paypal_capture_id} />
            )}
            {order.subtotal != null && (
              <Row label="Subtotal" value={fmtMoney(order.subtotal, order.currency ?? "USD")} />
            )}
            {order.addons?.remove_watermark && (
              <Row label="Remove watermark" value="Included" />
            )}
            {order.addons?.install_setup && (
              <Row label="Theme install" value="Included" />
            )}
            {order.coupon_code && (
              <Row
                label={`Coupon (${order.coupon_code})`}
                value={`- ${fmtMoney(order.discount_amount ?? 0, order.currency ?? "USD")}`}
              />
            )}
            {order.processing_fee != null && Number(order.processing_fee) > 0 && (
              <Row label="Processing fee" value={fmtMoney(order.processing_fee, order.currency ?? "USD")} />
            )}
            <Row
              label="Total paid"
              value={<strong>{fmtMoney(order.amount, order.currency ?? "USD")}</strong>}
            />
            {order.refunded_amount != null && Number(order.refunded_amount) > 0 && (
              <Row
                label={`Refunded ${order.refunded_at ? fmtDate(order.refunded_at) : ""}`}
                value={`- ${fmtMoney(order.refunded_amount, order.currency ?? "USD")}`}
              />
            )}
            <Row
              label="Receipt email"
              value={order.email_sent_at ? `Sent ${fmtDate(order.email_sent_at)}` : "Not sent"}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrderDetail;