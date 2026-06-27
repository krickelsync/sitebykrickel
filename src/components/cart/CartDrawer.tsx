import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const CartDrawer = () => {
  const { items, isOpen, close, setQty, remove, total, clear } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? null : close())}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-background border-l border-border">
        <SheetHeader>
          <SheetTitle className="font-syne uppercase tracking-tighter text-2xl flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" /> Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-6">
            <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-mono text-sm text-muted-foreground">Your cart is empty</p>
            <Link
              to="/products"
              onClick={close}
              className="mt-2 font-mono text-xs uppercase tracking-wider underline underline-offset-4"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto py-4 space-y-3">
              {items.map((it) => (
                <li key={it.id} className="flex gap-3 border border-border rounded-2xl p-3">
                  <Link to={`/products/${it.slug}`} onClick={close} className="shrink-0">
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.title}
                        className="w-16 h-16 rounded-xl object-cover bg-secondary/40"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-secondary/40" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${it.slug}`}
                      onClick={close}
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
              <div className="flex items-center justify-between w-full font-mono text-sm">
                <span className="text-muted-foreground uppercase tracking-wider">Total</span>
                <span className="font-syne font-bold text-lg">${total.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full rounded-full">
                <Link to={`/products/${items[0].slug}`} onClick={close}>
                  Proceed to checkout
                </Link>
              </Button>
              <button
                onClick={clear}
                className="w-full font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                Clear cart
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;