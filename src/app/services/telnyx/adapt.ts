/**
 * Map Telnyx wire types ↔ the app's domain types, so screens stay decoupled
 * from Telnyx. Owned-number loads MERGE with existing app state by id, so the
 * rich per-number settings (label, icon, toggles) the app keeps are preserved
 * while identity/status come from Telnyx.
 */
import type {
  PhoneNumber, ISOCountry, NumberSettings, Conversation, CallLog, MessageDeliveryStatus,
} from "../../core/types";
import { NUMBER_RENTAL } from "../../core/plans";
import { retailPrice } from "../../core/pricing";
import { countryName, flagOf, isoOfE164 } from "../../core/countries";
import type {
  PhoneNumberDetailed, AvailablePhoneNumber, Balance, ConversationThread,
  DetailRecord, MessageStatus,
} from "./types";

const countryOf = (iso: string): { name: ISOCountry; flag: string } => ({ name: countryName(iso), flag: flagOf(iso) });

/** Pretty-print an E.164 number for display. */
export function formatE164(e164: string): string {
  const d = e164.replace(/[^\d+]/g, "");
  if (d.startsWith("+1") && d.length === 12) return `+1 (${d.slice(2, 5)}) ${d.slice(5, 8)}-${d.slice(8)}`;
  if (d.startsWith("+44")) return `+44 ${d.slice(3, 7)} ${d.slice(7)}`;
  if (d.startsWith("+49")) return `+49 ${d.slice(3, 5)} ${d.slice(5)}`;
  if (d.startsWith("+33")) return `+33 ${d.slice(3).replace(/(\d{1,2})(?=(\d{2})+$)/g, "$1 ")}`;
  if (d.startsWith("+81")) return `+81 ${d.slice(3)}`;
  if (d.startsWith("+61")) return `+61 ${d.slice(3)}`;
  if (d.startsWith("+55")) return `+55 ${d.slice(3, 5)} ${d.slice(5)}`;
  return e164;
}

const defaultSettings = (label: string): NumberSettings => ({
  label, icon: "📱", businessHours: false, autoRecord: false, transcripts: false,
  forwardAll: false, muted: false, showInRecent: true, ringtone: "Default",
});

/**
 * Build an app PhoneNumber from a Telnyx number. If `prev` (the existing app
 * number with the same id) is given, its app-only fields are preserved.
 */
export function toAppNumber(
  pn: PhoneNumberDetailed,
  prev?: PhoneNumber,
  extras?: { sms?: boolean; voice?: boolean; price?: number },
): PhoneNumber {
  const c = countryOf(pn.country_iso_alpha2 || isoOfE164(pn.phone_number));
  return {
    id: pn.id,
    flag: prev?.flag ?? c.flag,
    number: prev?.number ?? formatE164(pn.phone_number),
    country: prev?.country ?? c.name,
    sms: prev?.sms ?? extras?.sms ?? true,
    voice: prev?.voice ?? extras?.voice ?? true,
    price: prev?.price ?? extras?.price ?? NUMBER_RENTAL.local,
    verification: prev?.verification ?? (pn.country_iso_alpha2 === "US" ? (pn.status === "active" ? "unverified" : "pending") : "verified"),
    settings: prev?.settings ?? defaultSettings("New Number"),
  };
}

const digits = (s: string) => s.replace(/\D/g, "");

// Dial-code → ISO, most-specific first ("1" last so +44/+49/… win over +1).
/**
 * Build an app PhoneNumber from a DB-owned number (GET /api/numbers) — the
 * user's OWN numbers, not the shared Telnyx account list. Uses the Telnyx id so
 * conversation/call matching (keyed by phone_number_id) still lines up.
 */
export function ownedToAppNumber(
  n: { id: string; e164: string; kind: string; telnyxId: string; free: boolean; telnyxStatus?: string | null; numberType?: string | null; smsStatus?: string },
  prev?: PhoneNumber,
): PhoneNumber {
  const d = digits(n.e164);
  const iso = isoOfE164(n.e164);
  const c = countryOf(iso);
  // Outside the US/Canada, geographic (local/national) lines are voice-only.
  const voiceOnly = !d.startsWith("1") && (n.numberType === "local" || n.numberType === "national");
  return {
    id: n.telnyxId || n.id,
    flag: c.flag,
    number: prev?.number ?? formatE164(n.e164),
    country: c.name,
    sms: n.numberType ? !voiceOnly : prev?.sms ?? true,
    numberType: n.numberType ?? prev?.numberType,
    voice: prev?.voice ?? true,
    price: prev?.price ?? 0,
    // US/CA: the server reports the real 10DLC state (active = carriers approved).
    verification: iso === "US" || iso === "CA"
      ? n.smsStatus === "active" ? "verified" : n.smsStatus === "pending" ? "pending" : n.smsStatus ? "unverified" : prev?.verification ?? "unverified"
      : n.telnyxStatus && n.telnyxStatus !== "active" ? "pending" : "verified",
    regStatus: n.telnyxStatus ?? undefined,
    settings: prev?.settings ?? defaultSettings(n.kind === "tollfree" ? "Toll-free" : "New Number"),
  };
}

export function balanceToNumber(b: Balance): number {
  return parseFloat(b.balance) || 0;
}

const FLAG_BY_DIAL: Array<[string, string]> = [
  ["44", "🇬🇧"], ["49", "🇩🇪"], ["33", "🇫🇷"], ["81", "🇯🇵"], ["61", "🇦🇺"], ["1", "🇺🇸"],
];
function flagFromNumber(display: string): string {
  const d = digits(display);
  for (const [code, flag] of FLAG_BY_DIAL) if (d.startsWith(code)) return flag;
  return "🌐";
}

const MSG_STATUS: Record<MessageStatus, MessageDeliveryStatus> = {
  queued: "sending", sending: "sending", sent: "sent", delivered: "delivered",
  sending_failed: "failed", delivery_failed: "failed", delivery_unconfirmed: "sent", expired: "failed",
};

/** Telnyx backend thread → app Conversation. */
export function toAppConversation(t: ConversationThread): Conversation {
  const last = t.messages[t.messages.length - 1];
  return {
    id: t.id,
    numberId: t.phone_number_id,
    contactFlag: t.contact_flag,
    contact: t.contact,
    preview: last?.text ?? "",
    time: t.time,
    unread: t.unread,
    messages: t.messages.map((m) => ({
      id: m.id, text: m.text, sent: m.direction === "outbound", time: m.time,
      status: m.direction === "outbound" ? MSG_STATUS[m.status] : undefined,
      telnyxId: m.id,
    })),
  };
}

const fmtDuration = (secs?: number) => {
  if (!secs) return "";
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};
const CALL_STATUS: Record<string, string> = { completed: "Call ended", missed: "Missed call", voicemail: "Voicemail", busy: "Busy", failed: "Failed" };

/** Telnyx CDR → app CallLog (resolves which owned number from the record). */
export function toAppCall(rec: DetailRecord, numbers: PhoneNumber[]): CallLog {
  const outgoing = rec.direction === "outgoing";
  const ownedSide = (outgoing ? rec.from : rec.to) ?? "";
  const contactSide = (outgoing ? rec.to : rec.from) ?? "";
  const owned = numbers.find((n) => digits(n.number) === digits(ownedSide));
  const direction = rec.status === "missed" ? "missed" : (rec.direction ?? "outgoing");
  return {
    id: rec.id,
    numberId: owned?.id ?? numbers[0]?.id ?? "n1",
    contactFlag: flagFromNumber(contactSide),
    contact: contactSide,
    direction,
    status: CALL_STATUS[rec.status ?? ""] ?? "Call ended",
    duration: fmtDuration(rec.duration_secs),
    time: rec.started_at ?? "",
  };
}

export function availableToApp(a: AvailablePhoneNumber): { number: string; price: number; firstPrice: number; sms: boolean; voice: boolean } {
  const has = (n: string) => a.features.some((f) => f.name === n);
  const monthly = parseFloat(a.cost_information.monthly_cost ?? "0") || 0;
  const upfront = parseFloat(a.cost_information.upfront_cost ?? "0") || 0;
  return {
    number: formatE164(a.phone_number),
    price: retailPrice(monthly),
    // What the server charges today: Telnyx's first charge (upfront, when higher) + markup.
    firstPrice: retailPrice(Math.max(monthly, upfront)),
    sms: has("sms"),
    voice: has("voice"),
  };
}
