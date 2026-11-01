
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { initNative } from "./app/native.ts";
  import { startMonitor } from "./app/services/monitor.ts";
  import { ErrorBoundary } from "./app/components/ErrorBoundary.tsx";
  import "./styles/index.css";

  startMonitor();
  createRoot(document.getElementById("root")!).render(<ErrorBoundary><App /></ErrorBoundary>);

  // Native (Capacitor) setup — no-ops on the web build.
  initNative();
