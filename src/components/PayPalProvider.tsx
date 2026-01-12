import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

interface PayPalProviderProps {
  children: ReactNode;
}

const PayPalProvider = ({ children }: PayPalProviderProps) => {
  // Use sandbox client ID for testing - replace with production client ID
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb";

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
