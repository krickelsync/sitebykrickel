// PayPal processing fee config (passed to buyer as transparent "Processing fee" line).
// Update these if your PayPal account is on a different rate table.
// Reference: https://www.paypal.com/us/webapps/mpp/merchant-fees (Digital goods / Standard checkout)
//
// 2026 default assumes cross-border digital goods:
//   percent: 4.4%
//   fixed:   $0.30 USD
// For US domestic only, use { percent: 0.0349, fixed: 0.49 }.

export const PAYPAL_FEE_CONFIG = {
  percent: 0.044,
  fixed: 0.3,
  // Toggle off if you want to absorb fees again (buyer pays only subtotal).
  passToBuyer: true,
  label: "Processing fee",
} as const;

/**
 * Gross-up so that AFTER PayPal deducts its fee, seller receives exactly `subtotal`.
 *   gross = (subtotal + fixed) / (1 - percent)
 *   fee   = gross - subtotal
 */
export function grossUp(subtotal: number) {
  if (!PAYPAL_FEE_CONFIG.passToBuyer || subtotal <= 0) {
    return { subtotal: round(subtotal), fee: 0, gross: round(subtotal) };
  }
  const { percent, fixed } = PAYPAL_FEE_CONFIG;
  const gross = (subtotal + fixed) / (1 - percent);
  const fee = gross - subtotal;
  return { subtotal: round(subtotal), fee: round(fee), gross: round(gross) };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}