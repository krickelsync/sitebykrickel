// Consistent currency formatting used across cart, admin, and account.
interface MoneyProps {
  value: number | null | undefined;
  currency?: string;
  className?: string;
}

const formatters = new Map<string, Intl.NumberFormat>();
function fmt(currency: string) {
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    formatters.set(currency, f);
  }
  return f;
}

export function formatMoney(value: number | null | undefined, currency = "USD") {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return fmt(currency).format(n);
}

export function Money({ value, currency = "USD", className }: MoneyProps) {
  return <span className={className}>{formatMoney(value, currency)}</span>;
}