import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getFriendlyError } from "@/lib/errors";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number;
  isBundle?: boolean;
  productId?: string;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  productName,
  price,
  isBundle = false,
  productId,
}: CheckoutModalProps) => {
  const titleId = "checkout-modal-title";
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // focus close button for keyboard users
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="w-full max-w-md glass-card p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <h2 id={titleId} className="font-display text-xl font-bold">Checkout</h2>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  aria-label="Close checkout"
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">
                        {isBundle ? "Bundle" : "Product"}
                      </p>
                      <p className="font-display font-bold">{productName}</p>
                    </div>
                    <p className="text-2xl font-bold font-mono text-primary">
                      ${price}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-border">
                  <span className="font-mono text-muted-foreground">Total</span>
                  <span className="text-2xl font-bold font-mono">${price}</span>
                </div>
              </div>

              {/* PayPal Buttons */}
              <div className="space-y-4">
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "rect",
                    label: "paypal",
                  }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          description: productName,
                          amount: {
                            currency_code: "USD",
                            value: price.toString(),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const details = await actions.order.capture();
                       const payer = details.payer;
                       const paypal_order_id = details.id ?? data.orderID;
                       try {
                         const { data: res, error } = await supabase.functions.invoke("record-order", {
                           body: {
                             paypal_order_id,
                             theme_slug: "sync",
                             items: [
                               {
                                 product_id: productId ?? null,
                                 product_title: productName,
                                 amount: price,
                                 theme_slug: "sync",
                               },
                             ],
                           },
                         });
                         if (error) throw error;
                         if (res?.license_key && res?.download_url) {
                           try {
                             localStorage.setItem(
                               `license:${paypal_order_id}`,
                               JSON.stringify({
                                 license_key: res.license_key,
                                 download_url: res.download_url,
                                 paypal_order_id,
                                 buyer_email: res.buyer_email,
                               })
                             );
                           } catch {}
                           toast.success(
                             `License issued! Key: ${res.license_key.slice(0, 12)}… Check your email for the download link.`,
                             { duration: 8000 }
                           );
                         } else {
                           toast.warning("Payment ok but license not issued yet. Check your email or contact support.");
                         }
                       } catch (err) {
                         console.error("Failed to record order:", err);
                         toast.error(
                           getFriendlyError(
                             err,
                             "Payment went through but we couldn't record it. Contact support with your PayPal order ID.",
                           ),
                         );
                       }
                       void payer;
                       onClose();
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    toast.error("Payment failed. Please try again.");
                  }}
                />

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by PayPal
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
