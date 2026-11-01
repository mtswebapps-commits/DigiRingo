import { Component, type ErrorInfo, type ReactNode } from "react";
import { monitorError } from "../services/monitor";

/** Catches a screen crash: reports it and offers a reload instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };

  static getDerivedStateFromError() { return { crashed: true }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const e = Object.assign(new Error(error.message), { stack: `${error.stack ?? ""}\n${info.componentStack ?? ""}` });
    monitorError(e, "Screen crash");
  }

  render() {
    if (!this.state.crashed) return this.props.children;
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ fontSize: 18, fontWeight: 700 }}>Something went wrong</p>
        <p style={{ fontSize: 14, opacity: 0.7, maxWidth: 320 }}>We've been told about it. Reload to carry on.</p>
        <button onClick={() => location.reload()} style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: "#7C5CFF", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Reload</button>
      </div>
    );
  }
}
