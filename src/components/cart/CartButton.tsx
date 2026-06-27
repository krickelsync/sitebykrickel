import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  iconClassName?: string;
  label?: string;
}

const CartButton = ({ className, iconClassName, label = "Cart" }: Props) => {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={`Open cart (${count} item${count === 1 ? "" : "s"})`}
      className={cn(
        "relative inline-flex items-center justify-center min-h-10 min-w-10 rounded-full hover:bg-foreground/5 transition-colors",
        className
      )}
    >
      <ShoppingCart className={cn("w-4 h-4", iconClassName)} aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono font-bold inline-flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default CartButton;