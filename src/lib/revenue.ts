// PayPal standard US rate. Adjust here if your account has a different rate.
export const PAYPAL_FEE_PCT = 0.0349;
export const PAYPAL_FEE_FIXED = 0.49;

export function paypalFee(amount: number) {
  if (!amount || amount <= 0) return 0;
  return +(amount * PAYPAL_FEE_PCT + PAYPAL_FEE_FIXED).toFixed(2);
}

export type RevenueRow = {
  amount: number;
  refunded_amount?: number | null;
  status: string;
};

export function computeRevenue(orders: RevenueRow[]) {
  let gross = 0;
  let fees = 0;
  let refunds = 0;
  for (const o of orders) {
    const amt = Number(o.amount || 0);
    const ref = Number(o.refunded_amount || 0);
    gross += amt;
    refunds += ref;
    // Fee still applies to gross even after refund (PayPal keeps fixed fee).
    fees += paypalFee(amt);
  }
  const net = +(gross - fees - refunds).toFixed(2);
  return {
    gross: +gross.toFixed(2),
    fees: +fees.toFixed(2),
    refunds: +refunds.toFixed(2),
    net,
  };
}

export function fmtMoney(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}