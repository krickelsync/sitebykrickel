import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Lock, Check, Copy, Download, Mail, Loader2, Tag, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import PayPalProvider from "@/components/PayPalProvider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { grossUp, PAYPAL_FEE_CONFIG } from "@/lib/paypal-fees";
import { useAuth } from "@/hooks/useAuth";

interface LicenseResult {
  license_key: string;
  download_url: string;
  paypal_order_id: string;
  buyer_email?: string | null;
  theme_slug?: string | null;
}

const CartDrawer = () => {
  const { items, isOpen, close, setQty, remove, total, clear } = useCart();
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "percent" | "fixed";
    value: number;
  } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.min(total, +((total * appliedCoupon.value) / 100).toFixed(2))
      : Math.min(total, appliedCoupon.value)
    : 0;
  const discountedSubtotal = Math.max(0, +(total - discountAmount).toFixed(2));
  const fees = grossUp(discountedSubtotal);
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [license, setLicense] = useState<LicenseResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [buyerEmail, setBuyerEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail.trim());

  // Prefill from signed-in account or previously used email.
  useEffect(() => {
    if (buyerEmail) return;
    if (user?.email) {
      setBuyerEmail(user.email);
      return;
    }
    try {
      const remembered = localStorage.getItem("buyer_email");
      if (remembered) setBuyerEmail(remembered);
    } catch {}
  }, [user, buyerEmail]);

  const handleClose = () => {
    close();
    setTimeout(() => {
      setStep("cart");
      setLicense(null);
      setCopied(false);
      setResendOpen(false);
      setResendEmail("");
      setResending(false);
      setResendCooldown(0);
      setCouponCode("");
      setAppliedCoupon(null);
    }, 200);
  };

  const applyCoupon = async () => {
    const raw = couponCode.trim();
    if (!raw || applyingCoupon) return;
    setApplyingCoupon(true);
    try {
      const { data, error } = await supabase
        .from("coupons")
        .select("code, type, value, min_amount, max_uses, used_count, expires_at, active")
        .ilike("code", raw)
        .maybeSingle();
      if (error) throw error;
      if (!data || !data.active) {
        toast.error("Coupon not found");
        return;
      }
      if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
        toast.error("Coupon expired");
        return;
      }
      if (data.max_uses != null && (data.used_count ?? 0) >= data.max_uses) {
        toast.error("Coupon fully redeemed");
        return;
      }
      if (data.min_amount != null && total < Number(data.min_amount)) {
        toast.error(`Minimum order $${Number(data.min_amount).toFixed(2)}`);
        return;
      }
      const type = (data.type === "percent" ? "percent" : "fixed") as "percent" | "fixed";
      setAppliedCoupon({ code: data.code, type, value: Number(data.value) });
      toast.success(`Coupon ${data.code} applied`);
    } catch {
      toast.error("Couldn't apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const copyKey = async () => {
    if (!license) return;
    try {
      await navigator.clipboard.writeText(license.license_key);
      setCopied(true);
      toast.success("License key copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed");
    }
  };

  const startCooldown = (secs: number) => {
    setResendCooldown(secs);
    const tick = () => {
      setResendCooldown((v) => {
        if (v <= 1) return 0;
        setTimeout(tick, 1000);
        return v - 1;
      });
    };
    setTimeout(tick, 1000);
  };

  const handleResend = async () => {
    if (!license || resending || resendCooldown > 0) return;
    const overrideRaw = resendEmail.trim();
    const override = overrideRaw.length > 0 ? overrideRaw : undefined;
    if (override && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(override)) {
      toast.error("Enter a valid email");
      return;
    }
    setResending(true);
    try {
      const { data, error } = await supabase.functions.invoke("resend-receipt", {
        body: { paypal_order_id: license.paypal_order_id, email: override },
      });
      if (error) throw error;
      const sentTo = (data as { sent_to?: string })?.sent_to ?? override ?? license.buyer_email;
      toast.success(`Receipt resent${sentTo ? ` to ${sentTo}` : ""}. Check spam too.`);
      setResendOpen(false);
      startCooldown(30);
    } catch (e) {
      const msg = (e as Error).message ?? "";
      toast.error(msg || "Could not resend right now. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : handleClose())}>
      <SheetContent
        side="right"
        overlayClassName="bg-transparent"
        className="cart-drawer-panel !fixed !top-[4.25rem] !bottom-auto !right-3 sm:!right-6 !left-auto !h-[calc(100svh-5.5rem)] !w-[22rem] !max-w-[calc(100vw-1.5rem)] navbar-pill menu-rotating-glow !rounded-2xl !border-0 !p-0 !shadow-2xl flex flex-col z-[60]"
      >
       <div className="flex flex-col h-full px-4 pt-4 pb-3">
        <SheetHeader>
          <SheetTitle className="font-syne uppercase tracking-tighter text-2xl flex items-center gap-2">
            {step === "checkout" ? (
              <>
                <button
                  onClick={() => setStep("cart")}
                  aria-label="Back to cart"
                  className="inline-flex w-7 h-7 items-center justify-center rounded-full hover:bg-foreground/5"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                Checkout
              </>
            ) : step === "success" ? (
              <>
                <Check className="w-5 h-5 text-primary" /> Payment complete
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Your Cart
                {items.length > 0 && (
                  <span className="ml-1 font-mono text-xs text-muted-foreground normal-case tracking-normal">
                    ({items.reduce((s, i) => s + i.qty, 0)})
                  </span>
                )}
              </>
            )}
          </SheetTitle>
        </SheetHeader>

        {step === "success" && license ? (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Your lifetime license key
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-xs break-all bg-background/60 rounded-lg px-3 py-2 border border-border">
                  {license.license_key}
                </code>
                <button
                  onClick={copyKey}
                  className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-foreground/5"
                  aria-label="Copy license key"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <a
                href={license.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-mono uppercase tracking-wider text-xs py-3 hover:opacity-90"
              >
                <Download className="w-4 h-4" /> Download theme ZIP
              </a>
            </div>

            <div className="rounded-2xl border border-border p-4 text-xs font-mono space-y-2 text-muted-foreground">
              <p className="uppercase tracking-wider text-foreground text-[10px]">How to install</p>
              <ol className="list-decimal pl-4 space-y-1 leading-relaxed">
                <li>Download the ZIP.</li>
                <li>Shopify. Online Store, Themes, Add theme, Upload ZIP.</li>
                <li>Open theme editor. Activation popup appears.</li>
                <li>Paste your license key. Locked lifetime to your store.</li>
              </ol>
              {license.buyer_email && (
                <p className="pt-2 text-[10px]">
                  A copy was emailed to {license.buyer_email}.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-border p-4 text-xs font-mono space-y-3">
              <p className="uppercase tracking-wider text-foreground text-[10px]">
                Didn't get the email?
              </p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Check spam or promotions first. Still nothing after a few minutes? Resend it below.
              </p>
              {resendOpen ? (
                <div className="space-y-2">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={license.buyer_email ?? "you@email.com"}
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background/60 px-3 py-2 text-xs font-mono outline-none focus:border-primary"
                    aria-label="Email to resend receipt to"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleResend}
                      disabled={resending || resendCooldown > 0}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground uppercase tracking-wider text-[11px] py-2.5 hover:opacity-90 disabled:opacity-50"
                    >
                      {resending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Mail className="w-3.5 h-3.5" />
                      )}
                      {resendCooldown > 0 ? `Wait ${resendCooldown}s` : "Send"}
                    </button>
                    <button
                      onClick={() => setResendOpen(false)}
                      className="rounded-full border border-border px-4 uppercase tracking-wider text-[11px] hover:bg-foreground/5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setResendOpen(true)}
                  disabled={resendCooldown > 0}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border uppercase tracking-wider text-[11px] py-2.5 hover:bg-foreground/5 disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : "Resend receipt email"}
                </button>
              )}
            </div>

            <Button onClick={handleClose} className="w-full rounded-full font-mono uppercase tracking-wider text-xs">
              Done
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-6">
            <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-mono text-sm text-muted-foreground">Your cart is empty</p>
            <Link
              to="/products"
              onClick={handleClose}
              className="mt-2 font-mono text-xs uppercase tracking-wider underline underline-offset-4"
            >
              Browse themes
            </Link>
          </div>
        ) : step === "cart" ? (
          <>
            <ul className="flex-1 overflow-y-auto py-4 space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 border border-border rounded-2xl p-3">
                  <Link to={`/products/${it.slug}`} onClick={handleClose} className="shrink-0">
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.title}
                        className="w-16 h-16 rounded-xl object-cover bg-secondary/40"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-secondary/40" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${it.slug}`}
                      onClick={handleClose}
                      className="block font-syne font-bold text-sm truncate hover:text-primary"
                    >
                      {it.title}
                    </Link>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      ${it.price.toFixed(2)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-border rounded-full">
                        <button
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="w-7 h-7 inline-flex items-center justify-center hover:bg-foreground/5 rounded-l-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs w-6 text-center">{it.qty}</span>
                        <button
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="w-7 h-7 inline-flex items-center justify-center hover:bg-foreground/5 rounded-r-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(it.id)}
                        className="text-muted-foreground hover:text-destructive p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <SheetFooter className="border-t border-border pt-4 flex-col gap-3 sm:flex-col">
              <div className="w-full font-mono text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground uppercase tracking-wider">Subtotal</span>
                  <span>${fees.subtotal.toFixed(2)}</span>
                </div>
                {PAYPAL_FEE_CONFIG.passToBuyer && fees.fee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground uppercase tracking-wider">
                      {PAYPAL_FEE_CONFIG.label}
                    </span>
                    <span>${fees.fee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1.5 border-t border-border/60">
                  <span className="text-muted-foreground uppercase tracking-wider text-sm">Total</span>
                  <span className="font-syne font-bold text-lg">${fees.gross.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={() => setStep("checkout")}
                className="w-full rounded-full font-mono uppercase tracking-wider"
              >
                <Lock className="w-3.5 h-3.5 mr-2" /> Proceed to checkout
              </Button>
              <button
                onClick={clear}
                className="w-full font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                Clear cart
              </button>
            </SheetFooter>
          </>
        ) : (
          <>
            {/* Order summary */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <ul className="space-y-2">
                {items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between text-sm font-mono border-b border-border/60 pb-2">
                    <span className="truncate pr-3">
                      <span className="text-foreground">{it.title}</span>
                      <span className="text-muted-foreground"> × {it.qty}</span>
                    </span>
                    <span className="shrink-0">${(it.price * it.qty).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-1.5 pt-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="uppercase tracking-wider text-muted-foreground">Subtotal</span>
                  <span>${fees.subtotal.toFixed(2)}</span>
                </div>
                {PAYPAL_FEE_CONFIG.passToBuyer && fees.fee > 0 && (
                  <div className="flex justify-between">
                    <span className="uppercase tracking-wider text-muted-foreground">
                      {PAYPAL_FEE_CONFIG.label}
                    </span>
                    <span>${fees.fee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-border/60">
                  <span className="uppercase tracking-wider text-muted-foreground">Total</span>
                  <span className="font-syne font-bold text-2xl">${fees.gross.toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/30 p-3">
                <div className="mb-3 space-y-1.5">
                  <label
                    htmlFor="buyer-email"
                    className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    Email for receipt & license
                  </label>
                  <input
                    id="buyer-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="you@email.com"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm font-mono outline-none focus:border-primary"
                  />
                  <p className="text-[10px] font-mono text-muted-foreground">
                    We send your license key here. Sign in later at{" "}
                    <Link to="/account" onClick={handleClose} className="underline">/account</Link>{" "}
                    to see all your receipts.
                  </p>
                </div>
                {!emailValid && (
                  <div className="rounded-lg border border-dashed border-border/60 py-6 text-center font-mono text-[11px] text-muted-foreground">
                    Enter your email above to unlock PayPal checkout.
                  </div>
                )}
                <div className={emailValid ? "" : "pointer-events-none opacity-40 select-none"} aria-hidden={!emailValid}>
                <PayPalProvider>
                  <PayPalButtons
                    style={{ layout: "vertical", color: "black", shape: "rect", label: "paypal" }}
                    forceReRender={[total, items.length, emailValid]}
                    createOrder={(_data, actions) =>
                      actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            description: items.map((i) => `${i.title} x${i.qty}`).join(", ").slice(0, 127),
                            amount: {
                              currency_code: "USD",
                              value: fees.gross.toFixed(2),
                              breakdown: {
                                item_total: { currency_code: "USD", value: fees.subtotal.toFixed(2) },
                                handling: { currency_code: "USD", value: fees.fee.toFixed(2) },
                              },
                            },
                          },
                        ],
                      })
                    }
                    onApprove={async (data, actions) => {
                      if (!actions.order) return;
                      const details = await actions.order.capture();
                      const payer = details.payer;
                      const buyer_name =
                        [payer?.name?.given_name, payer?.name?.surname].filter(Boolean).join(" ") || null;
                       const paypal_order_id = details.id ?? data.orderID;
                       try {
                         try { localStorage.setItem("buyer_email", buyerEmail.trim()); } catch {}
                         const { data: res, error } = await supabase.functions.invoke("record-order", {
                           body: {
                             paypal_order_id,
                             theme_slug: "sync",
                             subtotal: fees.subtotal,
                             processing_fee: fees.fee,
                             gross_amount: fees.gross,
                             buyer_email_override: buyerEmail.trim() || undefined,
                              addons: {
                                remove_watermark: items.some(
                                  (it) => it.id === "addon-remove-watermark" || it.slug === "sync-remove-watermark",
                                ),
                                install_setup: items.some(
                                  (it) => it.id === "addon-install-setup" || it.slug === "sync-install-setup",
                                ),
                              },
                             items: items.map((it) => ({
                                // Cart item ids are slugs (e.g. "theme-sync"), not DB uuids.
                                // Edge function requires uuid|null, so pass null and rely on theme_slug.
                                product_id: null,
                               product_title: `${it.title} x${it.qty}`,
                               amount: it.price * it.qty,
                                // addon rows use their own slug so admin can tell them apart.
                                theme_slug: it.slug || "sync",
                             })),
                           },
                         });
                         if (error) throw error;
                         if (res?.license_key && res?.download_url) {
                           const lic: LicenseResult = {
                             license_key: res.license_key,
                             download_url: res.download_url,
                             paypal_order_id,
                             buyer_email: res.buyer_email ?? buyerEmail.trim(),
                             theme_slug: res.theme_slug,
                           };
                           try {
                             localStorage.setItem(`license:${paypal_order_id}`, JSON.stringify(lic));
                           } catch {}
                           setLicense(lic);
                           setStep("success");
                           clear();
                           toast.success(`Payment successful! Thanks, ${payer?.name?.given_name || "friend"}.`);
                           return;
                         }
                         toast.warning(
                           res?.license_error
                             ? `Payment ok but license issue failed: ${res.license_error}`
                             : "Payment ok but license not issued. Check your email or contact support."
                         );
                       } catch (err) {
                         console.error("Failed to record order:", err);
                         toast.error("Payment recorded issue. Please contact support with your PayPal order ID.");
                       }
                       void buyer_name;
                    }}
                    onError={(err) => {
                      console.error("PayPal error:", err);
                      toast.error("Payment failed. Please try again.");
                    }}
                  />
                </PayPalProvider>
                </div>
              </div>

              <p className="text-[10px] text-center text-muted-foreground font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secure checkout via PayPal
              </p>
            </div>
          </>
        )}
       </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;