import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { CertificateProvider } from "./contexts/CertificateContext";

if (!document.documentElement.classList.contains("dark")) {
  document.documentElement.classList.add("dark");
}

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={clerkPublishableKey} appearance={{ variables: { colorPrimary: "hsl(var(--primary))" } }}>
    <AuthProvider>
      <SubscriptionProvider>
        <CertificateProvider>
          <App />
        </CertificateProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </ClerkProvider>,
);
