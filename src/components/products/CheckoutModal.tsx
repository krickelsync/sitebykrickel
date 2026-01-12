import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number;
  isBundle?: boolean;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  productName,
  price,
  isBundle = false,
}: CheckoutModalProps) => {
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="glass-card p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold">Checkout</h2>
                </div>
                <button
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
                      toast.success(
                        `Payment successful! Thank you, ${details.payer?.name?.given_name || "Customer"}!`
                      );
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
