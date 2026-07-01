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
  subtotal?: number | null;
  processing_fee?: number | null;
};

export function computeRevenue(orders: RevenueRow[]) {
  let gross = 0;
  let fees = 0;
  let refunds = 0;
  let buyerPaidFees = 0;
  for (const o of orders) {
    const amt = Number(o.amount || 0);
    const ref = Number(o.refunded_amount || 0);
    const buyerFee = Number(o.processing_fee || 0);
    // If buyer paid the fee, `amount` is the subtotal (product price) and
    // gross received from PayPal = amount + fee. Otherwise gross = amount.
    gross += amt + buyerFee;
    refunds += ref;
    // PayPal deducts its fee off the gross regardless.
    // If we grossed-up correctly, actual fee ~= buyerFee. Fall back to estimate.
    fees += buyerFee > 0 ? buyerFee : paypalFee(amt);
    buyerPaidFees += buyerFee;
  }
  const net = +(gross - fees - refunds).toFixed(2);
  return {
    gross: +gross.toFixed(2),
    fees: +fees.toFixed(2),
    refunds: +refunds.toFixed(2),
    buyerPaidFees: +buyerPaidFees.toFixed(2),
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