import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { CertificateProvider } from "./contexts/CertificateContext";

if (!document.documentElement.classList.contains("dark")) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SubscriptionProvider>
      <CertificateProvider>
        <App />
      </CertificateProvider>
    </SubscriptionProvider>
  </AuthProvider>,
);
