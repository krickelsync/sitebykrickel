import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

interface PayPalProviderProps {
  children: ReactNode;
}

const PayPalProvider = ({ children }: PayPalProviderProps) => {
  const envClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
  if (!envClientId && import.meta.env.PROD) {
    // Surface this loudly in production logs so a missing key isn't silently
    // turning real checkouts into sandbox "sb" test payments.
    // eslint-disable-next-line no-console
    console.error(
      "[PayPal] VITE_PAYPAL_CLIENT_ID is not set . checkout is running in PayPal sandbox mode."
    );
  }
  const clientId = envClientId || "sb";

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;
