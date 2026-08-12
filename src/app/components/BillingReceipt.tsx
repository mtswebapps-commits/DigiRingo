import { C, font } from "../core/theme";
import { getBundle, NUMBER_RENTAL } from "../core/plans";
import type { Subscription } from "../core/types";

/**
 * "Monthly bill" breakdown — the plan fee PLUS the per-number rental. Every number
 * is $2.99/mo (billed on its own monthly cycle), so the user sees the FULL amount
 * they're charged, not just the package price. Shared by the desktop dashboard and
 * the mobile home "Plan usage" card.
 */
export function BillingReceipt({ sub }: { sub: Subscription }) {
  const bundle = getBundle(sub.tier);
  if (!bundle) return null;
  const annual = sub.cycle === "annual";
  const planMonthly = annual ? bundle.annualMonthly : bundle.monthly;
  const perNumber = NUMBER_RENTAL.local;
  const numbersMonthly = sub.numbersUsed * perNumber;
  const total = planMonthly + numbersMonthly;

  return (
    <div style={{ border: `1px solid ${C.lineSoft}`, borderRadius: 12, padding: "11px 13px", background: "rgba(255,255,255,0.02)" }}>
      <Row label={`Plan${annual ? " (billed yearly)" : ""}`} value={`$${planMonthly.toFixed(2)}/mo`} />
      {sub.numbersUsed > 0 && (
        <Row
          label={`${sub.numbersUsed} number${sub.numbersUsed > 1 ? "s" : ""} · $${perNumber.toFixed(2)}/mo each`}
          value={`$${numbersMonthly.toFixed(2)}/mo`}
        />
      )}
      <div style={{ height: 1, background: C.lineSoft, margin: "9px 0" }} />
      <Row label="Monthly total" value={`$${total.toFixed(2)}/mo`} bold />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "3px 0" }}>
      <span style={{ color: bold ? C.text : C.muted, fontSize: 12, fontWeight: bold ? 800 : 500 }}>{label}</span>
      <span style={{ color: bold ? C.text : C.muted, fontSize: 12.5, fontWeight: bold ? 800 : 700, fontFamily: font.mono, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{value}</span>
    </div>
  );
}
