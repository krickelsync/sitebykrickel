import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

interface PayPalProviderProps {
  children: ReactNode;
}

const PayPalProvider = ({ children }: PayPalProviderProps) => {
  // Sandbox Client ID (matches backend PAYPAL_CLIENT_ID/SECRET sandbox creds).
  const SANDBOX_CLIENT_ID =
    "AQN1lcRXZwDT5ZfBTcnrHJF9QOik9ZTPnnDx-EAc9kd0-aO7vqBWDlSkitZuBispHSfSu-uV9TSodVUO";
  const envClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
  const clientId = envClientId || SANDBOX_CLIENT_ID;

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
